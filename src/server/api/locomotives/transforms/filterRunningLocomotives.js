exports.filterRunningLocomotives = (locomotives, isOperationalQuery) => {
  if (!locomotives) {
    return [];
  }

  const results = locomotives.filter(loco => {
    return loco.is_operational === (isOperationalQuery === 'true');
  });

  return results || [];
};
