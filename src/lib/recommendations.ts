import type { QuizAnswers, Recommendation } from './types';
import { products } from './products';

export function getQuizRecommendations(answers: QuizAnswers): Recommendation[] {
  const filtered = products.filter((p) => {
    // Budget filter
    if (answers.budget === 'under-1k' && p.price > 1000) return false;
    if (answers.budget === '1k-3k' && (p.price < 1000 || p.price > 3000)) return false;
    if (answers.budget === '3k-7k' && (p.price < 3000 || p.price > 7000)) return false;
    if (answers.budget === '7k-plus' && p.price < 7000) return false;

    // Diamond filter
    if (answers.diamond === 'not-for-me' && p.diamondSpec) return false;
    if (answers.diamond === 'essential' && !p.diamondSpec && p.collection === 'legacy') return false;

    return true;
  });

  // Score and sort
  const scored = filtered.map((p) => {
    let score = 0;

    // Occasion matching
    if (answers.occasion === 'self-reward' && p.occasions.includes('self-gift')) score += 3;
    if (answers.occasion === 'gift' && p.occasions.includes('gift')) score += 3;
    if (answers.occasion === 'milestone' && p.occasions.includes('milestone')) score += 3;
    if (answers.occasion === 'everyday' && p.occasions.includes('everyday')) score += 3;

    // Style matching
    if (answers.style === 'minimalist' && p.collection === 'victory') score += 2;
    if (answers.style === 'bold' && (p.collection === 'signature' || p.collection === 'legacy')) score += 2;
    if (answers.style === 'classic' && p.collection === 'signature') score += 2;
    if (answers.style === 'artistic' && p.badges.includes('Custom Motif')) score += 2;

    // Diamond preference
    if (answers.diamond === 'essential' && p.diamondSpec) score += 2;

    return { product: p, score };
  });

  scored.sort((a, b) => b.score - a.score);

  return scored.slice(0, 4).map(({ product }) => ({
    productId: product.id,
    reason: generateReason(product, answers),
  }));
}

function generateReason(product: typeof products[number], answers: QuizAnswers): string {
  const reasons: string[] = [];

  if (answers.style === 'minimalist' && product.collection === 'victory') {
    reasons.push('Its clean lines match your minimalist sensibility.');
  }
  if (answers.style === 'bold' && product.collection !== 'victory') {
    reasons.push('A statement piece that matches your bold aesthetic.');
  }
  if (answers.occasion === 'gift') {
    reasons.push('An unforgettable gift that celebrates the game.');
  }
  if (answers.occasion === 'milestone') {
    reasons.push('The perfect way to mark your milestone on and off the court.');
  }
  if (product.diamondSpec && answers.diamond === 'essential') {
    reasons.push(`Features a ${product.diamondSpec} for the brilliance you love.`);
  }
  if (product.customizable && answers.style === 'artistic') {
    reasons.push('Fully customizable to express your personal style.');
  }

  return reasons[0] || 'Crafted to complement your unique style and love of the game.';
}
