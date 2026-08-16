export interface Store {
    id: string;
    name: string;
    inventory: Record<string,number>; //Item name: Price in MYR
}

export const MOCK_STORES: Store[] = [
  {
    id: 'Sams',
    name: "Sam's",
    inventory: {
      'Full Cream Milk 1L': 6.80,
      'Grade A Eggs (10s)': 5.50,
      'White Bread 400g': 3.20,
      'Jasmine Rice 5kg': 26.00,
      'Extra Virgin Olive Oil 500ml': 34.50,
      'Ground Arabica Coffee 200g': 28.00,
      'Rolled Oats 1kg': 11.50,
    },
  },
  {
    id: 'james-grocer',
    name: 'James Grocer',
    inventory: {
      'Full Cream Milk 1L': 8.20,
      'Grade A Eggs (10s)': 6.90,
      'White Bread 400g': 4.00,
      'Jasmine Rice 5kg': 29.50,
      'Extra Virgin Olive Oil 500ml': 26.00, // Cheaper here
      'Ground Arabica Coffee 200g': 19.50,  // Cheaper here
      'Rolled Oats 1kg': 9.80,              // Cheaper here
    },
  },
  {
    id: 'uptown-grocer',
    name: 'Uptown Grocer',
    inventory: {
      'Full Cream Milk 1L': 8.50,
      'Grade A Eggs (10s)': 7.20,
      'White Bread 400g': 4.20,
      'Jasmine Rice 5kg': 31.00,
      'Extra Virgin Olive Oil 500ml': 25.50,
      'Ground Arabica Coffee 200g': 21.00,
      // Missing Rolled Oats on purpose to test out-of-stock handling
    },
  },
];

export const AVAILABLE_ITEMS = [
  'Full Cream Milk 1L',
  'Grade A Eggs (10s)',
  'White Bread 400g',
  'Jasmine Rice 5kg',
  'Extra Virgin Olive Oil 500ml',
  'Ground Arabica Coffee 200g',
  'Rolled Oats 1kg',
];