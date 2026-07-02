// Convert ml to "X l Y ml" display string
export function formatMl(totalMl) {
  if (totalMl === null || totalMl === undefined) return '— ml';
  const litres = Math.floor(totalMl / 1000);
  const ml = totalMl % 1000;
  if (litres === 0) return `${ml} ml`;
  if (ml === 0) return `${litres} l`;
  return `${litres} l ${ml} ml`;
}

// Convert compound units to ml
export function compoundToMl(litres, ml) {
  return (litres || 0) * 1000 + (ml || 0);
}

// Check if regrouping needed (ml component >= 1000)
export function needsRegroup(totalMl) {
  return totalMl >= 1000;
}

// Get litres component
export function getLitres(totalMl) {
  return Math.floor(totalMl / 1000);
}

// Get ml remainder
export function getMlRemainder(totalMl) {
  return totalMl % 1000;
}
