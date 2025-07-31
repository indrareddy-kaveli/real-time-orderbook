import { useState } from 'react';
import { SimulationResult } from '../types/orderbook';

export function useSimulation() {
  const [result, setResult] = useState<SimulationResult | null>(null);
  function simulateOrder(order: any) {
    // Simulate order logic
    setResult({ fill: 100, slippage: 0.01 });
  }
  return { result, simulateOrder };
}
