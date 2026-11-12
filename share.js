const alphabet = /^[A-Za-z0-9_-]+$/;

export function encodeShare(state, models, schools) {
  const payload = { v:1, m:state.mode, d:{} };
  for (const [mode, model] of Object.entries(models)) {
    const current = state.models[mode];
    const ids = model.criteria.map(criterion => criterion.id);
    payload.d[mode] = {
      w:ids.map(id => current.weights[id]),
      l:ids.map(id => current.locked[id] ? 1 : 0),
      r:ids.map(id => schools.map(school => current.ranks[id][school.id])),
      e:current.edited ? 1 : 0
    };
  }
  return 's=' + btoa(JSON.stringify(payload)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export function decodeShare(hash, models, schools) {
  const fragment = hash.replace(/^#/, '');
  const token = fragment.replace(/^s=/, '');
  if (!fragment.startsWith('s=') || !token || token.length > 8192 || !alphabet.test(token)) return null;
  try {
    const payload = JSON.parse(atob(token.replace(/-/g, '+').replace(/_/g, '/') + '='.repeat((4 - token.length % 4) % 4)));
    if (payload.v !== 1 || !models[payload.m]) return null;
    const restored = { version:1, mode:payload.m, models:{} };
    for (const [mode, model] of Object.entries(models)) {
      const row = payload.d?.[mode];
      const ids = model.criteria.map(criterion => criterion.id);
      if (!Array.isArray(row?.w) || row.w.length !== ids.length ||
          !row.w.every(value => Number.isInteger(value) && value >= 0 && value <= 1000) ||
          row.w.reduce((sum, value) => sum + value, 0) !== 1000 ||
          !Array.isArray(row.l) || row.l.length !== ids.length || !row.l.every(value => value === 0 || value === 1) ||
          !Array.isArray(row.r) || row.r.length !== ids.length ||
          !row.r.every(values => Array.isArray(values) && values.length === schools.length && values.every(value => typeof value === 'number' && Number.isFinite(value) && value >= 1 && value <= 6))) return null;
      restored.models[mode] = {
        weights:Object.fromEntries(ids.map((id, i) => [id, row.w[i]])),
        locked:Object.fromEntries(ids.map((id, i) => [id, !!row.l[i]])),
        ranks:Object.fromEntries(ids.map((id, i) => [id, Object.fromEntries(schools.map((school, j) => [school.id, row.r[i][j]]))])),
        edited:!!row.e
      };
    }
    return restored;
  } catch { return null; }
}
