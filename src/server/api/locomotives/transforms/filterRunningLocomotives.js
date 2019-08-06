exports.filterRunningLocomotives = (locomotives, isOperationalQuery) => {
  if (!locomotives) {
    return [];
  }

  let query = isOperationalQuery;

  if (!isOperationalQuery) {
    query = 'true';
  }

  const results = locomotives.filter(loco => {
    return loco.is_operational === (query === 'true');
  });

  return results || [];
};
