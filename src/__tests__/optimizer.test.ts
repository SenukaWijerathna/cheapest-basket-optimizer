import { describe, it, expect } from 'vitest';
import { optimizeBasket } from '../utils/optimizer';
import { MOCK_STORES } from '../data/mockStores';

describe('optimizeBasket', () => {
  it('should recommend a single store when trip penalty exceeds gross savings', () => {
    // Basket with only Milk & Eggs (difference between Lotus's and Jaya Grocer is ~RM 2.80)
    const basket = [
      { name: 'Full Cream Milk 1L', quantity: 1 },
      { name: 'Grade A Eggs (10s)', quantity: 1 },
    ];

    const result = optimizeBasket(basket, MOCK_STORES, 5.0); // RM 5.00 penalty
    expect(result.recommendation).toBe('SINGLE');
    expect(result.bestSingleStore?.storeName).toBe("Lotus's");
  });

  it('should recommend splitting when gross savings exceed trip penalty', () => {
    // Basket with Milk (cheap at Lotus's) and Coffee + Olive Oil (cheap at Jaya Grocer)
    const basket = [
      { name: 'Full Cream Milk 1L', quantity: 2 },
      { name: 'Extra Virgin Olive Oil 500ml', quantity: 1 },
      { name: 'Ground Arabica Coffee 200g', quantity: 1 },
    ];

    // Lotus total: (6.80*2) + 34.50 + 28.00 = RM 76.10
    // Jaya total: (8.20*2) + 26.00 + 19.50 = RM 61.90
    // Split total (Lotus milk + Jaya others): (6.80*2) + 26.00 + 19.50 = RM 59.10
    // Gross savings vs Jaya: RM 2.80
    // If penalty is RM 1.00, net savings = RM 1.80 -> SPLIT
    const result = optimizeBasket(basket, MOCK_STORES, 1.0);
    expect(result.recommendation).toBe('SPLIT');
    expect(result.bestSplit?.netSavings).toBeGreaterThan(0);
  });

  it('should handle unfulfillable items properly', () => {
    const basket = [{ name: 'Nonexistent Item', quantity: 1 }];
    const result = optimizeBasket(basket, MOCK_STORES, 5.0);
    expect(result.recommendation).toBe('UNFULFILLABLE');
  });
});