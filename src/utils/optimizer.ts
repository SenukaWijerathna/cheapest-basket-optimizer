import type { Store } from "../data/mockStores";

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
    storeId: string;
    storeName: string;
    totalCost: number;
    isFullyFulfilled: boolean;
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

export function optimizeBasket(basket: BasketItem[], stores: Store[],tripPenalty:number=5.0): OptimizationSummary {
    //In case the user doesn't add any items or no stores are available.
    if (basket.length===0 || stores.length===0) {
        return {
            bestSingleStore: null,
            bestSplit: null,
            recommendation: 'UNFULFILLABLE',
            summaryReason: 'Basket is empty or no stores available.',
        };
    }

    // First option: Single store totals
    const singleStoreResults:SingleStoreResult[]=stores.map((store)=> {
        let totalCost=0;
        const missingItems: string[]=[];

        //Go through all the items in basket adds the price of it, else add the item to the missing list.
        for (const item of basket) {
            const price = store.inventory[item.name];
            if (price!==undefined) {
                totalCost+=price*item.quantity;
            } else {
                missingItems.push(item.name);
            }
        }

        return {
            storeId: store.id,
            storeName: store.name,
            totalCost: parseFloat(totalCost.toFixed(2)),
            isFullyFulfilled: missingItems.length ===0,
            missingItems,
        };
    });

    //Filters out the fully fulfilled stores and sorted them based on their total costs.
    const validSingleStores=singleStoreResults.filter((s)=>s.isFullyFulfilled).sort((a,b)=>a.totalCost-b.totalCost);
    const bestSingle=validSingleStores.length>0?validSingleStores[0]:null;

    // Second option: Check all 2 store pairs.
    const splitResults: SplitStoreResult[]=[];

    for (let i=0; i< stores.length;i++) {
        for (let j =i+1; j<stores.length;j++) {
            const storeA=stores[i];
            const storeB =stores[j];

            let rawItemsCost=0;
            const itemsFromA: SplitStoreResult['itemsFromA']=[]
            const itemsFromB: SplitStoreResult['itemsFromB']=[]
            const missingItems: string[]=[];

            for (const item of basket) {
                const priceA=storeA.inventory[item.name];
                const priceB=storeB.inventory[item.name];

                if (priceA!==undefined && priceB !== undefined) {
                    if (priceA<=priceB){
                        itemsFromA.push({
                            name: item.name,
                            quantity: item.quantity,
                            unitPrice: priceA,
                            total: priceA * item.quantity
                        });
                        rawItemsCost+=priceA*item.quantity;
                    } else {
                        itemsFromB.push({
                            name: item.name,
                            quantity: item.quantity,
                            unitPrice: priceB,
                            total: priceB * item.quantity
                        });
                        rawItemsCost+=priceB*item.quantity;
                    }
                } else if (priceA!==undefined) {
                    itemsFromA.push({
                            name: item.name,
                            quantity: item.quantity,
                            unitPrice: priceA,
                            total: priceA * item.quantity
                        });
                        rawItemsCost+=priceA*item.quantity;
                } else if (priceB!==undefined) {
                    itemsFromB.push({
                            name: item.name,
                            quantity: item.quantity,
                            unitPrice: priceB,
                            total: priceB * item.quantity
                        });
                        rawItemsCost+=priceB*item.quantity;
                } else {
                    missingItems.push(item.name);
                }
            }

            const isActualSplit=itemsFromA.length>0 && itemsFromB.length>0;
            const actualPenalty=isActualSplit? tripPenalty:0;
            const effectiveTotalCost=rawItemsCost+actualPenalty;

            const singleBaseline=bestSingle?bestSingle.totalCost:rawItemsCost;
            const grossSavings=singleBaseline-rawItemsCost;
            const netSavings=singleBaseline-effectiveTotalCost;

            splitResults.push({
                storeA: storeA.name,
                storeB: storeB.name,
                itemsFromA,
                itemsFromB,
                rawItemsCost: parseFloat(rawItemsCost.toFixed(2)),
                tripPenalty: actualPenalty,
                effectiveTotalCost: parseFloat(effectiveTotalCost.toFixed(2)),
                grossSavings: parseFloat(grossSavings.toFixed(2)),
                netSavings: parseFloat(netSavings.toFixed(2)),
                isFullyFulfilled: missingItems.length===0,
                missingItems,
            });
        }
    }

    const validSplits=splitResults.filter((s)=>s.isFullyFulfilled && s.itemsFromA.length > 0 && s.itemsFromB.length > 0)
                                .sort((a,b)=>a.effectiveTotalCost-b.effectiveTotalCost);
    const bestSplit=validSplits.length>0? validSplits[0]:null;

    // Create the Recommendation Summary
    if(!bestSingle && !bestSplit) {
        return {
            bestSingleStore: null,
            bestSplit: null,
            recommendation: 'UNFULFILLABLE',
            summaryReason: 'No single store or 2-store split carries every item in your basket.'
        };
    }

    if (bestSplit && bestSingle) {
        if (bestSplit.netSavings>0) {
            return {
                bestSingleStore: bestSingle,
                bestSplit,
                recommendation: 'SPLIT',
                summaryReason: 'Split between ${bestSplit.storeA} and ${bestSplit.storeB}. Gross savings of RM ${bestSplit.grossSavings.toFixed(2)} exceeds the RM ${tripPenalty.toFixed(2)} trip penalty, saving RM ${bestSplit.netSavings.toFixed(2)} net.'
            };
        } else {
            return {
                bestSingleStore: bestSingle,
                bestSplit,
                recommendation: 'SINGLE',
                summaryReason: 'Stick to ${bestSingle.storeName} (RM ${bestSingle.totalCost.toFixed(2)}). Splitting saves RM ${bestSplit.grossSavings.toFixed(2)} on items, which does not overcome the RM ${tripPenalty.toFixed(2)} second-trip penalty.'
            };
        }
    }
    if (bestSplit && !bestSingle) {
        return {
            bestSingleStore: null,
            bestSplit,
            recommendation: 'SPLIT',
            summaryReason: 'No single store has all items. Split between ${bestSplit.storeA} and ${bestSplit.storeB} to fulfill the basket for RM ${bestSplit.effectiveTotalCost.toFixed(2)} total.'
        };
    }
    return {
        bestSingleStore: bestSingle,
        bestSplit: null,
        recommendation: 'SINGLE',
        summaryReason: 'Best single store is ${bestSingle!.storeName} at RM ${bestSingle!.totalCost.toFixed(2)}.'
    }


}