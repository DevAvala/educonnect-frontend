export function schoolDistribution({ total, active, inactive, archived }) {
  if (![total, active, inactive, archived].every(n => Number.isSafeInteger(n) && n >= 0) || active + inactive + archived > total)
    throw new Error('School totals changed while loading. Refresh to try again.');
  return { active, inactive, archived, deleted: total - active - inactive - archived };
}
export async function loadSchoolDistribution(api, signal) {
  const statuses = ['all', 'active', 'inactive', 'archived'];
  const responses = await Promise.all(statuses.map(status => api.request(`/schools/management?status=${status}&page=1&limit=1`, { signal })));
  return schoolDistribution(Object.fromEntries(responses.map((r, i) => [statuses[i] === 'all' ? 'total' : statuses[i], r.pagination.total])));
}
