export const TOTAL = 1000;

export function distribute(total, ids, reference = {}) {
  const result = {};
  if (!ids.length) return result;
  const sum = ids.reduce((n, id) => n + Math.max(0, reference[id] || 0), 0);
  const portions = ids.map((id, index) => {
    const exact = sum ? total * Math.max(0, reference[id] || 0) / sum : total / ids.length;
    result[id] = Math.floor(exact);
    return { id, remainder: exact - Math.floor(exact), index };
  });
  let left = total - Object.values(result).reduce((a, b) => a + b, 0);
  portions.sort((a, b) => b.remainder - a.remainder || a.index - b.index);
  for (let i = 0; i < left; i++) result[portions[i % portions.length].id]++;
  return result;
}

export function equalWeights(ids) {
  return distribute(TOTAL, ids);
}

export function changeWeight(weights, target, requested, locked = {}) {
  const ids = Object.keys(weights);
  if (!ids.includes(target) || locked[target] || !Number.isFinite(requested)) return { ...weights };
  const fixed = ids.filter(id => id !== target && locked[id]);
  const free = ids.filter(id => id !== target && !locked[id]);
  const reserved = fixed.reduce((n, id) => n + weights[id], 0);
  const available = TOTAL - reserved;
  if (!free.length) return { ...weights, [target]: available };
  const value = Math.min(available, Math.max(0, Math.round(requested)));
  return { ...weights, [target]: value, ...distribute(available - value, free, weights) };
}

export function midranks(values) {
  return values.map(value => 1 + values.filter(x => x < value - 1e-9).length
    + (values.filter(x => Math.abs(x - value) < 1e-9).length - 1) / 2);
}

export function calculate(schools, criteria, weights, ranks, uncertain = {}) {
  const total = criteria.reduce((n, c) => n + (weights[c.id] || 0), 0);
  if (!total) throw new Error('至少需要一项非零权重');
  const results = schools.map((school, index) => {
    let score = 0, low = 0, high = 0;
    const contributions = criteria.map(c => {
      const weight = (weights[c.id] || 0) / total;
      const rank = ranks[c.id][school.id];
      const unknown = !!uncertain[c.id]?.includes(school.id);
      score += rank * weight;
      low += (unknown ? 1 : rank) * weight;
      high += (unknown ? 6 : rank) * weight;
      return { id: c.id, label: c.label, weight, rank, value: rank * weight, unknown };
    });
    return { ...school, index, score, low, high, contributions };
  });
  results.sort((a, b) => a.score - b.score || a.index - b.index);
  const positions = midranks(results.map(x => x.score));
  return results.map((r, i) => ({ ...r, position: positions[i], tied: results.some((x, j) => i !== j && Math.abs(x.score - r.score) < 1e-9) }));
}

export function restoreModel(candidate, fallback, criteria, schools) {
  if (!candidate || typeof candidate !== 'object') return structuredClone(fallback);
  const ids = criteria.map(c => c.id);
  const validWeights = ids.every(id => Number.isInteger(candidate.weights?.[id]) && candidate.weights[id] >= 0 && candidate.weights[id] <= TOTAL)
    && ids.reduce((n, id) => n + candidate.weights[id], 0) === TOTAL;
  const ranks = {};
  for (const c of criteria) {
    const row = schools.map(s => candidate.ranks?.[c.id]?.[s.id]);
    const valid = row.every(x => typeof x === 'number' && Number.isFinite(x) && x >= 1 && x <= 6);
    const normalized = valid ? midranks(row) : null;
    ranks[c.id] = Object.fromEntries(schools.map((s, i) => [s.id, normalized ? normalized[i] : fallback.ranks[c.id][s.id]]));
  }
  return {
    weights: validWeights ? Object.fromEntries(ids.map(id => [id, candidate.weights[id]])) : { ...fallback.weights },
    locked: Object.fromEntries(ids.map(id => [id, !!candidate.locked?.[id]])),
    ranks,
    edited: !!candidate.edited
  };
}
