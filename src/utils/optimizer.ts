/**
 * Represents a Single Item in a basket.
 */
export interface BasketItem {
    name: string;
    quantity: number;
}

/**
 * Represents a record of a single store based on the given items.
 */
export interface SingleStoreResult {
    storeID: string;
    storeName: string;
    totalCost: number;
    ifFullyFulfilled: boolean;
    missingItems: string[];
}

/**
 * Represents a record of a combination between two stores on given items.
 */
export interface SplitStoreResult {
    storeA: string;
    storeB: string;
    itemsFromA: {
        name: string;
        quantity: number;
        unitPrice: number;
        total: number
    } [];
    itemsFromB: {
        name: string;
        quantity: number;
        unitPrice: number;
        total: number
    } [];
    rawItemsCost: number;
    tripPenalty: number;
    effectiveTotalCost: number;
    grossSavings: number;
    netSavings: number;
    isFullyFulfilled: boolean;
    missingItems: string[];
}

/**
 * Represents a summary of the optimization process
 */
export interface OptimizationSummary {
    bestSingleStore: SingleStoreResult | null;
    bestSplit: SplitStoreResult | null;
    recommendation: 'SINGLE' | 'SPLIT' | 'UNFULFILLABLE';
    summaryReason: string;
}