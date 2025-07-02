export const formatDistance = (distance: number): string => {
  if (distance < 1000) {
    return `${Math.round(distance)} m`;
  } else {
    const km = (distance / 1000).toFixed(1);
    return `${km} km`;
  }
};
