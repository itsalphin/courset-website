'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';

const footerLinks = {
  Collections: [
    { label: 'Victory', href: '#victory' },
    { label: 'Signature', href: '#signature' },
    { label: 'Legacy', href: '#legacy' },
    { label: 'All Collections', href: '#collections' },
  ],
  Services: [
    { label: 'Virtual Consultation', href: '#concierge' },
    { label: 'Complimentary Sizing', href: '#concierge' },
    { label: 'Custom Commissions', href: '#concierge' },
    { label: 'Gift Cards', href: '#' },
  ],
  About: [
    { label: 'Our Story', href: '#story' },
    { label: 'Craftsmanship', href: '#craftsmanship' },
    { label: 'Sustainability', href: '#' },
    { label: 'Press', href: '#' },
  ],
  Contact: [
    { label: 'hello@courset.com', href: 'mailto:hello@courset.com' },
    { label: 'Instagram', href: '#' },
    { label: 'Pinterest', href: '#' },
    { label: 'FAQ', href: '#' },
  ],
};

export default function Footer() {
  const [email, setEmail] = useState('');

  return (
    <footer className="bg-[var(--color-bg-inverse)] text-[var(--color-text-inverse)]">
      {/* Newsletter */}
      <div className="mx-auto px-[var(--gutter)] pt-[var(--space-section)] pb-16" style={{ maxWidth: 'var(--content-width)' }}>
        <div className="flex flex-col md:flex-row items-start md:items-end gap-6 md:gap-10 mb-20">
          <div className="flex-1">
            <h3 className="font-[family-name:var(--font-display)] text-2xl font-light mb-2">
              Stay in the Game
            </h3>
            <p className="font-[family-name:var(--font-body)] text-sm text-[var(--color-text-tertiary)]">
              New collections, limited editions, and concierge invitations — delivered.
            </p>
          </div>
          <div className="flex items-stretch gap-0 w-full md:w-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email"
              className="flex-1 md:w-72 px-5 py-3.5 bg-transparent border border-[#333] text-white placeholder:text-[#666] font-[family-name:var(--font-body)] text-sm focus:outline-none focus:border-[var(--color-accent)]"
              aria-label="Email for newsletter"
            />
            <Button variant="primary" size="md" className="!px-6" onClick={() => setEmail('')}>
              Subscribe
            </Button>
          </div>
        </div>

        {/* Link columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-20">
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-[family-name:var(--font-body)] text-[var(--text-label)] uppercase tracking-[0.2em] text-[var(--color-text-tertiary)] mb-5">
                {title}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="font-[family-name:var(--font-body)] text-sm text-[#999] hover:text-white transition-colors cursor-pointer"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-[#333] pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-[family-name:var(--font-body)] text-xs text-[#666] text-center md:text-left">
            &copy; 2025 COURSET&trade; &middot; Handcrafted with Purpose &middot; Ethically Sourced &middot; Insured Delivery
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="font-[family-name:var(--font-body)] text-xs text-[#666] hover:text-[#999] cursor-pointer transition-colors">Privacy</a>
            <a href="#" className="font-[family-name:var(--font-body)] text-xs text-[#666] hover:text-[#999] cursor-pointer transition-colors">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
