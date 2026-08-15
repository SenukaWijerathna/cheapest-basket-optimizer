<script setup lang="ts">
import { ref, computed } from 'vue';
import { optimizeBasket, type BasketItem } from './utils/optimizer';
import { MOCK_STORES, AVAILABLE_ITEMS } from './data/mockStores';

// --- STATE ---
const basket = ref<BasketItem[]>([]);
const tripPenalty = ref<number>(2.50);
const searchQuery = ref('');
const isSearchFocused = ref(false);

// --- COMPUTED ---
const optimizationResult = computed(() => {
  return optimizeBasket(basket.value, MOCK_STORES, tripPenalty.value);
});

const isBasketEmpty = computed(() => basket.value.length === 0);

const filteredItems = computed(() => {
  if (!searchQuery.value) return AVAILABLE_ITEMS;
  return AVAILABLE_ITEMS.filter(item => 
    item.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

// --- METHODS ---
const addItem = (itemName: string) => {
  const existing = basket.value.find(i => i.name === itemName);
  if (existing) {
    existing.quantity += 1;
  } else {
    basket.value.push({ name: itemName, quantity: 1 });
  }
  searchQuery.value = '';
  isSearchFocused.value = false;
};

const increaseQty = (item: BasketItem) => item.quantity++;
const decreaseQty = (item: BasketItem, index: number) => {
  if (item.quantity > 1) item.quantity--;
  else removeItem(index);
};
const removeItem = (index: number) => basket.value.splice(index, 1);
const clearSearch = () => { searchQuery.value = ''; };

const handleSearchBlur = () => {
  setTimeout(() => {
    isSearchFocused.value = false;
  }, 200);
};

const getSingleStoreItemPrice = (storeId: string, itemName: string, qty: number) => {
  const store = MOCK_STORES.find(s => s.id === storeId);
  const price = store?.inventory[itemName] || 0;
  return (price * qty).toFixed(2);
};
</script>

<template>
  <div class="min-h-screen bg-[#F4F5F7] p-4 md:p-8 font-sans text-slate-800">
    <div class="max-w-[1200px] mx-auto">
      
      <!-- Header -->
      <header class="mb-8 flex items-center gap-3">
        <div class="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center text-white shadow-sm">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
        </div>
        <div>
          <h1 class="text-xl font-bold text-slate-900 leading-tight">Cheapest Basket Optimizer</h1>
          <p class="text-sm text-slate-500">Smart Multi-Store Grocery Planner</p>
        </div>
      </header>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        <!-- LEFT COLUMN: Basket Builder -->
        <div class="lg:col-span-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-200 h-fit">
          <h2 class="text-lg font-bold text-slate-900 mb-4">Build Your Basket</h2>
          
          <!-- Search Item Autocomplete -->
          <div class="mb-5 relative">
            <label class="block text-xs font-medium text-slate-500 mb-1">Add Grocery Item</label>
            <div class="relative">
              <svg class="w-4 h-4 absolute left-3 top-3 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              <input 
                type="text" 
                v-model="searchQuery"
                @focus="isSearchFocused = true"
                @blur="handleSearchBlur"
                placeholder="Search items..."
                class="w-full pl-9 pr-8 py-2 border-2 border-emerald-400 rounded-lg focus:outline-none focus:ring-4 focus:ring-emerald-50 text-sm placeholder-slate-400"
              />
              <button v-if="searchQuery" @click="clearSearch" class="absolute right-3 top-3 text-slate-400 hover:text-slate-600">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>
            
            <div v-if="isSearchFocused && filteredItems.length > 0" class="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
              <div 
                v-for="(item, index) in filteredItems" 
                :key="item"
                @click="addItem(item)"
                class="px-4 py-2 text-sm cursor-pointer hover:bg-emerald-50 text-slate-700 flex items-center gap-2"
                :class="{'bg-emerald-100 text-emerald-900 font-medium': index === 0 && searchQuery}"
              >
                <svg v-if="index === 0 && searchQuery" class="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                {{ item }}
              </div>
            </div>
          </div>

          <!-- Trip Penalty -->
          <div class="mb-6">
            <label class="block text-xs font-medium text-slate-500 mb-1">Trip Penalty (RM)</label>
            <div class="relative">
              <span class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-medium text-sm">RM</span>
              <input 
                type="number" 
                v-model.number="tripPenalty" 
                min="0" step="0.5" 
                class="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-50 focus:border-emerald-400 text-sm font-bold text-slate-800"
              />
            </div>
            <p class="text-[11px] text-slate-400 mt-2">Cost added per additional store visit (accounts for petrol, transit & time)</p>
          </div>

          <!-- Basket List -->
          <div>
            <div class="flex items-center gap-2 mb-3">
              <h3 class="font-bold text-slate-900 text-sm">Your Basket</h3>
              <span class="bg-slate-100 text-slate-500 text-xs px-2 py-0.5 rounded-full font-medium">{{ basket.length }}</span>
            </div>
            
            <div v-if="isBasketEmpty" class="text-slate-400 text-sm italic text-center py-6 border border-dashed border-slate-200 rounded-lg bg-slate-50">
              No items added yet.
            </div>
           <ul v-else class="space-y-2">
              <li v-for="(item, index) in basket" :key="item.name" class="flex items-center justify-between p-2 pl-3 border border-slate-200 rounded-lg bg-white shadow-sm gap-2">
                
                <!-- Item Name Container (Shopping bag removed) -->
                <div class="flex-1 min-w-0">
                  <span class="text-sm font-medium text-slate-700 truncate block" :title="item.name">{{ item.name }}</span>
                </div>
                
                <!-- Controls Container (Native number input + Trash) -->
                <div class="flex items-center gap-2 shrink-0">
                  <input 
                    type="number" 
                    v-model.number="item.quantity" 
                    min="1" 
                    class="w-16 p-1 border border-slate-300 rounded-md text-center outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-50 text-sm font-semibold text-slate-800"
                  />
                  <button @click="removeItem(index)" class="w-8 h-8 flex items-center justify-center border border-red-100 bg-red-50 text-red-500 rounded-md hover:bg-red-100 transition-colors">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                  </button>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <!-- RIGHT COLUMN: Results -->
        <div class="lg:col-span-8 flex flex-col gap-4">
          
          <div v-if="isBasketEmpty" class="h-full flex flex-col items-center justify-center text-slate-400 bg-white border border-slate-200 rounded-2xl min-h-[300px] shadow-sm">
            <svg class="w-12 h-12 mb-3 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
            <p>Add items to see the optimized strategy.</p>
          </div>
          
          <template v-else>
            <!-- Verdict Banner with Detailed Explanation -->
            <div :class="[ 
              'p-5 rounded-xl border',
              optimizationResult.recommendation === 'SPLIT' ? 'bg-[#EAFBF3] border-[#AEEAD3] text-emerald-900' : 
              optimizationResult.recommendation === 'SINGLE' ? 'bg-blue-50 border-blue-200 text-blue-900' : 'bg-red-50 border-red-200 text-red-900'
            ]">
              <div class="flex items-center gap-2 mb-2">
                <svg v-if="optimizationResult.recommendation === 'SPLIT'" class="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <svg v-if="optimizationResult.recommendation === 'SINGLE'" class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <h3 class="font-bold text-sm uppercase tracking-wide">
                  {{ optimizationResult.recommendation === 'SPLIT' ? 'Optimized Strategy Found' : 
                     optimizationResult.recommendation === 'SINGLE' ? 'Single Store Recommended' : 'Action Required' }}
                </h3>
              </div>
              <p class="text-sm leading-relaxed" v-html="optimizationResult.summaryReason"></p>
            </div>

            <!-- Dynamic Layout: Show the Winner First -->
            <div class="flex flex-col gap-4" :class="{'flex-col-reverse': optimizationResult.recommendation === 'SINGLE'}">
              
              <!-- Split Store Card -->
              <div v-if="optimizationResult.bestSplit" class="bg-white rounded-2xl shadow-sm p-6 relative overflow-hidden" 
                   :class="optimizationResult.recommendation === 'SPLIT' ? 'border-2 border-emerald-500' : 'border border-slate-200 opacity-60 grayscale-[30%] hover:grayscale-0 hover:opacity-100 transition-all'">
                
                <div class="flex justify-between items-center mb-6">
                  <div class="flex items-center gap-2 text-slate-800 font-bold text-lg">
                    <svg class="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                    Split Basket Option
                  </div>
                  <span v-if="optimizationResult.recommendation === 'SPLIT'" class="bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">Best Value</span>
                </div>

                <!-- Detailed Math Breakdown -->
                <div class="flex flex-wrap items-center justify-between bg-slate-50 p-4 rounded-xl mb-6 text-sm border border-slate-100">
                  <div>
                    <div class="text-slate-500 text-xs mb-0.5 uppercase tracking-wide font-medium">Items Subtotal</div>
                    <div class="font-bold text-slate-800">RM {{ optimizationResult.bestSplit.rawItemsCost.toFixed(2) }}</div>
                  </div>
                  <div class="text-slate-300 font-light text-lg">+</div>
                  <div>
                    <div class="text-slate-500 text-xs mb-0.5 uppercase tracking-wide font-medium">Extra Visit Penalty</div>
                    <div class="font-bold text-red-500">RM {{ optimizationResult.bestSplit.tripPenalty.toFixed(2) }}</div>
                  </div>
                  <div class="text-slate-300 font-light text-lg">=</div>
                  <div class="text-right">
                    <div class="text-slate-500 text-xs mb-0.5 uppercase tracking-wide font-medium">Total Cost</div>
                    <div class="font-bold text-slate-900 text-lg">RM {{ optimizationResult.bestSplit.effectiveTotalCost.toFixed(2) }}</div>
                  </div>
                </div>

                <!-- Split Lists -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
                  <div class="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-slate-100 -translate-x-1/2"></div>
                  
                  <!-- Store A -->
                  <div>
                    <div class="flex justify-between items-center mb-4">
                      <h4 class="font-bold text-slate-800 text-sm">Store 1: {{ optimizationResult.bestSplit.storeA }}</h4>
                      <span class="text-slate-600 font-bold text-sm">RM {{ optimizationResult.bestSplit.itemsFromA.reduce((sum, item) => sum + item.total, 0).toFixed(2) }}</span>
                    </div>
                    <ul class="space-y-3">
                      <li v-for="item in optimizationResult.bestSplit.itemsFromA" :key="item.name" class="flex justify-between items-center text-sm">
                        <span class="text-slate-600 truncate mr-2">{{ item.name }} <span class="text-xs text-slate-400 font-medium ml-1">x{{ item.quantity }}</span></span>
                        <div class="flex items-center gap-2 shrink-0">
                          <span class="font-medium text-slate-800">RM {{ item.total.toFixed(2) }}</span>
                          <span class="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-1.5 py-0.5 rounded uppercase">Saved</span>
                        </div>
                      </li>
                    </ul>
                  </div>

                  <!-- Store B -->
                  <div>
                    <div class="flex justify-between items-center mb-4">
                      <h4 class="font-bold text-slate-800 text-sm">Store 2: {{ optimizationResult.bestSplit.storeB }}</h4>
                      <span class="text-slate-600 font-bold text-sm">RM {{ optimizationResult.bestSplit.itemsFromB.reduce((sum, item) => sum + item.total, 0).toFixed(2) }}</span>
                    </div>
                    <ul class="space-y-3">
                      <li v-for="item in optimizationResult.bestSplit.itemsFromB" :key="item.name" class="flex justify-between items-center text-sm">
                        <span class="text-slate-600 truncate mr-2">{{ item.name }} <span class="text-xs text-slate-400 font-medium ml-1">x{{ item.quantity }}</span></span>
                        <div class="flex items-center gap-2 shrink-0">
                          <span class="font-medium text-slate-800">RM {{ item.total.toFixed(2) }}</span>
                          <span class="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-1.5 py-0.5 rounded uppercase">Saved</span>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <!-- Single Store Card -->
              <div v-if="optimizationResult.bestSingleStore" class="bg-white rounded-2xl shadow-sm p-6 relative overflow-hidden"
                   :class="optimizationResult.recommendation === 'SINGLE' ? 'border-2 border-blue-500' : 'border border-slate-200 opacity-60 grayscale-[30%] hover:grayscale-0 hover:opacity-100 transition-all'">
                
                <div class="flex justify-between items-center mb-4">
                  <div class="flex items-center gap-2 text-slate-800 font-bold text-lg">
                    <svg class="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
                    Best Single Store Option
                  </div>
                  <div class="flex items-center gap-2">
                    <span class="bg-slate-100 text-slate-600 text-xs font-bold px-3 py-1 rounded-full border border-slate-200">{{ optimizationResult.bestSingleStore.storeName }}</span>
                    <span v-if="optimizationResult.recommendation === 'SINGLE'" class="bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">Best Value</span>
                  </div>
                </div>

                <div class="flex items-center justify-between bg-slate-50 p-4 rounded-xl mb-6 text-sm border border-slate-100">
                  <div class="font-bold text-slate-500 uppercase tracking-wide text-xs">Total Estimated Price</div>
                  <div class="font-bold text-slate-900 text-xl">RM {{ optimizationResult.bestSingleStore.totalCost.toFixed(2) }}</div>
                </div>

                <ul class="space-y-3">
                  <li v-for="item in basket" :key="item.name" class="flex justify-between items-center text-sm border-b border-slate-50 pb-2 last:border-0">
                    <span class="text-slate-600 truncate mr-2">{{ item.name }} <span class="text-xs text-slate-400 font-medium ml-1">x{{ item.quantity }}</span></span>
                    <span class="font-medium text-slate-400">
                      RM {{ getSingleStoreItemPrice(optimizationResult.bestSingleStore!.storeId, item.name, item.quantity) }}
                    </span>
                  </li>
                </ul>
              </div>

            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>