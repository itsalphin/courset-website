'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { MoveHorizontal } from 'lucide-react';
import { useReducedMotion } from 'framer-motion';

interface ScrubVideoProps {
  src: string;
  poster?: string;
  /** Accessible description of the media. */
  label?: string;
  className?: string;
}

/**
 * Timeline-scrub video (the "Apple product page" technique).
 * The video never plays normally — horizontal drag (mouse + touch) maps to
 * video.currentTime so the user sweeps through frames by hand. Hover on
 * desktop is an optional position-based scrub nicety.
 */
export default function ScrubVideo({ src, poster, label = 'Drag to explore the piece', className = '' }: ScrubVideoProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [ready, setReady] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [interacted, setInteracted] = useState(false);

  const isDragging = useRef(false);
  const dragStartX = useRef(0);
  const dragStartTime = useRef(0);
  const rafId = useRef<number | null>(null);
  const pendingTime = useRef<number | null>(null);

  const prefersReduced = useReducedMotion();

  // Commit currentTime updates on the next animation frame (throttle seeks).
  const scheduleSeek = useCallback((time: number) => {
    const video = videoRef.current;
    if (!video || !Number.isFinite(video.duration)) return;
    pendingTime.current = Math.max(0, Math.min(video.duration, time));
    if (rafId.current == null) {
      rafId.current = requestAnimationFrame(() => {
        rafId.current = null;
        const v = videoRef.current;
        if (v && pendingTime.current != null) v.currentTime = pendingTime.current;
      });
    }
  }, []);

  // Absolute mapping: cursor x within the wrapper → time (used for hover).
  const seekToClientX = useCallback((clientX: number) => {
    const wrapper = wrapperRef.current;
    const video = videoRef.current;
    if (!wrapper || !video || !Number.isFinite(video.duration)) return;
    const rect = wrapper.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    scheduleSeek(ratio * video.duration);
  }, [scheduleSeek]);

  // Relative mapping: drag delta proportional to width → feels like spinning.
  const seekByDrag = useCallback((clientX: number) => {
    const wrapper = wrapperRef.current;
    const video = videoRef.current;
    if (!wrapper || !video || !Number.isFinite(video.duration)) return;
    const rect = wrapper.getBoundingClientRect();
    const deltaRatio = (clientX - dragStartX.current) / rect.width; // full width sweep = full clip
    // Invert so the piece follows the drag direction (drag right → rotation tracks your hand).
    scheduleSeek(dragStartTime.current - deltaRatio * video.duration);
  }, [scheduleSeek]);

  // Prime the video so frames are seekable (iOS Safari needs a muted play/pause).
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let cancelled = false;
    const markReady = () => {
      if (cancelled) return;
      if (Number.isFinite(video.duration) && video.duration > 0) setReady(true);
    };

    const prime = async () => {
      try {
        video.muted = true;
        await video.play();
        video.pause();
        video.currentTime = 0;
      } catch {
        // Autoplay/seek priming can be blocked — scrubbing still works once metadata loads.
      } finally {
        markReady();
      }
    };

    if (video.readyState >= 1) prime();
    video.addEventListener('loadedmetadata', prime);
    video.addEventListener('canplay', markReady);

    return () => {
      cancelled = true;
      video.removeEventListener('loadedmetadata', prime);
      video.removeEventListener('canplay', markReady);
      if (rafId.current != null) cancelAnimationFrame(rafId.current);
    };
  }, []);

  const handlePointerDown = (e: React.PointerEvent) => {
    if (!ready) return;
    isDragging.current = true;
    setDragging(true);
    if (!interacted) setInteracted(true);
    dragStartX.current = e.clientX;
    dragStartTime.current = videoRef.current?.currentTime ?? 0;
    wrapperRef.current?.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!ready) return;
    if (isDragging.current) {
      seekByDrag(e.clientX);
    } else if (e.pointerType === 'mouse' && !prefersReduced) {
      // Optional desktop hover-scrub.
      seekToClientX(e.clientX);
    }
  };

  const endDrag = (e: React.PointerEvent) => {
    if (!isDragging.current) return;
    isDragging.current = false;
    setDragging(false);
    if (wrapperRef.current?.hasPointerCapture(e.pointerId)) {
      wrapperRef.current.releasePointerCapture(e.pointerId);
    }
  };

  return (
    <div
      ref={wrapperRef}
      role="img"
      aria-label={label}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      className={`relative w-full overflow-hidden bg-[var(--color-bg-secondary)] select-none ${
        dragging ? 'cursor-grabbing' : 'cursor-ew-resize'
      } ${className || 'aspect-square'}`}
      style={{ touchAction: 'none' }}
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        muted
        playsInline
        preload="auto"
        disablePictureInPicture
        draggable={false}
        className={`h-full w-full object-cover transition-opacity duration-300 ${ready ? 'opacity-100' : 'opacity-0'}`}
      />

      {/* Loading shimmer until the clip is seekable */}
      {!ready && (
        <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-[var(--color-bg-secondary)] via-[var(--color-bg-tertiary)] to-[var(--color-bg-secondary)]" />
      )}

      {/* Draggable affordance — fades out after first interaction */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-[var(--color-bg-inverse)]/70 px-4 py-2 backdrop-blur-sm transition-opacity duration-500 ${
          ready && !interacted ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <MoveHorizontal size={16} strokeWidth={1.5} className="text-white" />
        <span className="font-[family-name:var(--font-body)] text-[0.65rem] uppercase tracking-[0.2em] text-white">
          Drag to explore
        </span>
      </div>
    </div>
  );
}
