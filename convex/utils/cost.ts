export function calculateDeliveryCost(distanceMeters: number): number {
    const base = 200;
    const firstKmExtra = 500;
    const additionalKmCost = 200;
    const fixedTopUp = 200;
    const serviceFee = 200;
  
    const distanceKm = distanceMeters / 1000;
  
    let cost = base + firstKmExtra;
  
    if (distanceKm > 1) {
      const extraKm = Math.ceil(distanceKm - 1);
      cost += extraKm * additionalKmCost;
    }
  
    cost += fixedTopUp + serviceFee;
  
    return cost;
  }