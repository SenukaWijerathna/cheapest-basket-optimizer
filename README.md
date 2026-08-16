# Cheapest Basket Optimizer

**Live Demo:** [cheapest-basket-optimizer.vercel.app](https://cheapest-basket-optimizer.vercel.app/)

A smart multi-store grocery planning application that evaluates the exact combinatorial savings of splitting a grocery list across multiple stores, weighed against a user-defined "Trip Penalty" (accounting for petrol, transit, and time).

## Features
* **Combinatorial Optimization:** Calculates the absolute cheapest combination of stores for a given grocery list.
* **Friction Threshold (Trip Penalty):** Allows users to define the real-world cost of traveling to a second store.
* **Dynamic Breakdown:** Displays a mathematical breakdown comparing the best single-store option against the best split-store option.
* **Searchable Inventory:** Custom autocomplete input for fast basket building.

## Tech Stack
* **Frontend:** Vue 3 (Composition API)+Vite
* **Language:** TypeScript
* **Styling:** Tailwind CSS
* **Testing:** Vitest

## Local Setup
1. **Clone the repository:**
    ```bash
    git clone https://github.com/SenukaWijerathna/cheapest-basket-optimizer
    cd cheapest-basket-optimizer
    ```
2. **Install Dependencies:**
    ```bash
    npm install
    ```
3. **Run the Develpment server:**
    ```bash
    npm run dev
    ```

    Open `http://localhost:5173/` in your browser

## Testing

To run the optimization engine unit tests:
```bash
npm test
```
## Documentation
Detailed explanations of the architecture, algorithmic logic, and AI usage can be found in the `docs/` folder.
[`docs/Architecture.md`](docs/Architecture.md) contains the system design, algorithmic flowcharts, and technical decisions.