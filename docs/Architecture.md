# Architecture & Logic

## Tech Stack
* **Vue 3 + Vite:** Chosen due to fast compilation and reactivity
* **TypeScript:** To ensure type safety for basket items, store inventory and calculations.
* **Tailwind CSS:** Used for responsive UI styling
* **Vitest:** Used for unit testing the core optimization algorithm.

## Core Algorithm Logic
The algorithm evaluates the basket in three phases:
1. **Single Store:** Calculates the total cost if all items are bought at a single store.
2. **2-Store-Split:** Evaluates every possible 2-store combination which assigns each item to whichever store has the lower price to calculate the raw goods cost excluding trip penalties.
3. **Trade-off Evaluation:** Adds the user defined `Trip Penalty`to the raw goods cost. If this total is lower than the Single Store baseline, a Split is recommended.
