import { TOTAL, equalWeights, distribute, changeWeight, midranks, calculate, restoreModel } from './core.js';
import { SCHOOLS, MODELS, SNAPSHOT, SOURCES, defaultRanks } from './data.js';
import { PHOTOS } from './photos.js';
import { EVIDENCE, SCHOOL_REFS, CRITERION_TOPICS } from './evidence.js';
import { directRefs, photoCredit, schoolCardHTML, filteredEvidence, sourceCardHTML, photoCreditsHTML } from './source-ui.js';
import { encodeShare, decodeShare } from './share.js';

const STORAGE_KEY = 'masters-choice-lab:2027:v1';
const $ = id => document.getElementById(id);
const escape = value => String(value).replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));
const percent = value => (value / 10).toFixed(1);
const fmt = value => Number.isInteger(value) ? String(value) : value.toFixed(1);
const lockSvg = locked => '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><rect x="4.5" y="9" width="11" height="8" rx="2"/><path d="' + (locked ? 'M6.5 9V6a3.5 3.5 0 0 1 7 0v3' : 'M6.5 9V6a3.5 3.5 0 0 1 6.7-1.4') + '"/><path d="M10 12v2"/></svg>';
const fallback = mode => ({ weights: equalWeights(MODELS[mode].criteria.map(c => c.id)), locked: {}, ranks: defaultRanks(mode), edited: false });
let storageAvailable = true;
let state = { version:1, mode:'ten', models:{ ten:fallback('ten'), eight:fallback('eight') } };
try {
  const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
  if (saved && saved.version === 1) {
    if (MODELS[saved.mode]) state.mode = saved.mode;
    for (const mode of Object.keys(MODELS)) state.models[mode] = restoreModel(saved.models?.[mode], fallback(mode), MODELS[mode].criteria, SCHOOLS);
  }
} catch { storageAvailable = false; }
const incomingShare = decodeShare(location.hash, MODELS, SCHOOLS);
if (incomingShare) {
  state = incomingShare;
  history.replaceState(null, '', location.pathname + location.search);
}
let currentView = 'dashboard';
let results = [];
let toastTimer;
let scheduled = false;
let mobileOpener;
let sourceFilters = { query:'', school:'all', kind:'all', topic:'全部' };
const model = () => MODELS[state.mode];
const settings = () => state.models[state.mode];

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    storageAvailable = true;
    $('saveStatus').textContent = '已自动保存到此浏览器';
    $('storageFootnote').textContent = '设置仅存于此浏览器；不会自动上传。';
  } catch {
    storageAvailable = false;
    $('saveStatus').textContent = '当前浏览器无法保存';
    $('storageFootnote').textContent = '当前更改仅本次有效，请导出方案留存。';
  }
}
function toast(message) {
  $('toast').textContent = message;
  $('toast').classList.add('visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => $('toast').classList.remove('visible'), 3000);
}
function scheduleResults() {
  if (scheduled) return;
  scheduled = true;
  requestAnimationFrame(() => {
    scheduled = false;
    renderResults();
    if (currentView === 'matrix') renderMatrix();
    persist();
  });
}
function renderControls() {
  $('weightControls').innerHTML = model().criteria.map(c =>
    '<div class="weight-row" id="weight-row-' + c.id + '" style="--criterion-color:' + c.color + '">' +
    '<div class="weight-label"><label class="weight-name" for="range-' + c.id + '"><i></i>' + escape(c.label) +
    '<button class="question" type="button" data-view="sources" data-source-topic="' + (CRITERION_TOPICS[c.id]?.[0] || '全部') + '" title="' + escape(c.note) + '" aria-label="查看' + escape(c.label) + '的资料与依据">?</button></label>' +
    '<div class="weight-value"><input type="number" min="0" max="100" step="0.1" inputmode="decimal" data-weight="' + c.id + '" id="number-' + c.id + '" aria-label="' + escape(c.label) + '权重百分比"><span>%</span>' +
    '<button type="button" class="lock-button" data-lock="' + c.id + '" aria-pressed="false" aria-label="锁定' + escape(c.label) + '"></button></div></div>' +
    '<input class="weight-slider" type="range" min="0" max="1000" step="1" data-weight="' + c.id + '" id="range-' + c.id + '" aria-label="' + escape(c.label) + '权重"></div>'
  ).join('');
  refreshControlValues();
}
function refreshControlValues() {
  const { weights, locked } = settings();
  let total = 0;
  for (const c of model().criteria) {
    const weight = weights[c.id];
    total += weight;
    const fixedOthers = Object.entries(weights).filter(([id]) => id !== c.id && locked[id]).reduce((sum, [, v]) => sum + v, 0);
    const hasOtherFree = Object.keys(weights).some(id => id !== c.id && !locked[id]);
    const disabled = !!locked[c.id] || !hasOtherFree;
    const range = $('range-' + c.id), number = $('number-' + c.id), lock = document.querySelector('[data-lock="' + c.id + '"]');
    range.max = String(TOTAL - fixedOthers);
    range.value = String(weight);
    range.disabled = disabled;
    range.style.setProperty('--fill', (weight / Math.max(1, TOTAL - fixedOthers) * 100) + '%');
    range.setAttribute('aria-valuetext', percent(weight) + '%');
    if (document.activeElement !== number) number.value = percent(weight);
    number.max = percent(TOTAL - fixedOthers);
    number.disabled = disabled;
    lock.innerHTML = lockSvg(!!locked[c.id]);
    lock.setAttribute('aria-pressed', String(!!locked[c.id]));
    lock.setAttribute('aria-label', (locked[c.id] ? '解锁' : '锁定') + c.label);
    lock.title = locked[c.id] ? '此项已固定，点此解锁' : '固定这项比例';
    $('weight-row-' + c.id).classList.toggle('is-locked', !!locked[c.id]);
  }
  $('weightTotal').innerHTML = percent(total) + '<span>%</span>';
  $('allocationBar').innerHTML = model().criteria.filter(c => weights[c.id] > 0).map(c => '<span style="width:' + percent(weights[c.id]) + '%;background:' + c.color + '"></span>').join('');
}
function markStyle(school) {
  return '--school-color:' + school.color + ';--school-bg:' + school.color + '0d;--school-border:' + school.color + '25';
}
function schoolMark(school) {
  return '<span class="school-mark photo-mark" style="' + markStyle(school) + '" aria-hidden="true"><img src="./' + PHOTOS[school.id].local + '" alt="" style="object-position:' + PHOTOS[school.id].position + '" loading="lazy"></span>';
}
function renderResults() {
  const m = model(), s = settings();
  results = calculate(SCHOOLS, m.criteria, s.weights, s.ranks, m.uncertain);
  const equalResults = calculate(SCHOOLS, m.criteria, equalWeights(m.criteria.map(c => c.id)), s.ranks);
  const baseline = Object.fromEntries(equalResults.map(r => [r.id, r.position]));
  const leader = results[0], leaders = results.filter(r => Math.abs(r.score - leader.score) < 1e-9);
  const runner = results.find(r => r.score > leader.score + 1e-9);
  const leadingTitle = leaders.length > 1 ? '共同领先' : leader.name;
  const leadingSubtitle = leaders.length > 1 ? leaders.map(r => r.name).join(' / ') : leader.course;
  const advantage = runner ? leader.contributions.map(c => ({ ...c, benefit:(s.ranks[c.id][runner.id] - c.rank) * c.weight })).filter(c => c.benefit > 1e-8).sort((a, b) => b.benefit - a.benefit).slice(0, 2).map(c => c.label).join('、') : '';
  const gap = runner ? runner.score - leader.score : 0;
  const gapText = leaders.length > 1 ? '目前同分，保留并列；不强行分出先后。' : '与下一名相差 ' + gap.toFixed(2) + '；' + (gap < .2 ? '差距很小，建议一起比较。' : '可继续测试你的取舍。');
  $('winnerCard').innerHTML =
    '<img class="winner-campus-image" src="./' + PHOTOS[leader.id].local + '" alt="" style="object-position:' + PHOTOS[leader.id].position + '">' +
    '<div class="winner-eyebrow"><span></span>当前权重下' + (leaders.length > 1 ? '共同领先' : '领先的路线') + '</div>' +
    '<div class="winner-main"><div><h2>' + escape(leadingTitle) + '</h2><p>' + escape(leadingSubtitle) + '</p></div>' +
    '<div class="winner-score"><strong>' + leader.score.toFixed(2) + '</strong><small>加权平均名次</small></div></div>' +
    '<div class="winner-bottom"><p>' + escape(gapText) + '</p><button type="button" data-school="' + leader.id + '">为什么领先 <span>↗</span></button></div>';
  $('winnerCard').title = advantage ? '相比下一名，主要受益于：' + advantage : '当前权重与名次下的计算结果';
  $('rankingList').innerHTML = results.map((r, i) => {
    const delta = baseline[r.id] - r.position;
    const changeText = Math.abs(delta) < 1e-9 ? '—' : (delta > 0 ? '↑ ' : '↓ ') + fmt(Math.abs(delta));
    const place = 1 + results.filter(x => x.score < r.score - 1e-9).length;
    return '<button type="button" class="ranking-row' + (i === 0 || Math.abs(r.score - leader.score) < 1e-9 ? ' is-leader' : '') + '" data-school="' + r.id + '" aria-label="' + escape(r.name) + '，加权平均名次' + r.score.toFixed(2) + '，查看详情">' +
      '<span class="ranking-position">' + (r.tied ? '=' : '') + place + '</span>' + schoolMark(r) +
      '<span class="ranking-name"><strong>' + escape(r.name) + (r.tied ? '<span class="rank-chip">并列</span>' : '') + '</strong><small>' + escape(r.city) + ' · ' + escape(r.course.replace('MSc ', '').replace('WMG ', '')) + '</small></span>' +
      '<span class="ranking-number">' + r.score.toFixed(2) + '</span><span class="ranking-change' + (delta > 0 ? ' up' : delta < 0 ? ' down' : '') + '" title="相对当前名次矩阵下的均分方案">' + changeText + '</span></button>';
  }).join('');
  const groups = {};
  for (const c of m.criteria) groups[c.group] = (groups[c.group] || 0) + s.weights[c.id];
  $('groupSummary').innerHTML = Object.entries(groups).map(([group, w]) => '<div class="group-row"><span>' + group + '</span><span class="group-bar"><span style="width:' + percent(w) + '%"></span></span><strong>' + percent(w) + '%</strong></div>').join('');
  const unknownWeight = m.criteria.reduce((sum, c) => sum + (m.uncertain[c.id]?.length ? s.weights[c.id] : 0), 0);
  $('uncertaintyNote').textContent = unknownWeight ? '考核资料待核的维度占 ' + percent(unknownWeight) + '%。初始难度名次只是情景判断，不能当作毕业或就业保证。' : '当前没有给考核待核维度分配权重。其余名次仍包含主观判断，实际就业和政策结果需另外确认。';
  $('mobileLeader').textContent = leaders.length > 1 ? leaders.map(r => r.name).join(' / ') : leader.name;
}
function renderMatrix() {
  const m = model(), s = settings();
  $('applyRanksButton').disabled = true;
  const scoreMap = Object.fromEntries(results.map(r => [r.id, r.score]));
  $('matrixSource').textContent = '初始来源：' + m.source + '。' + (s.edited ? '你已修改部分名次；当前使用你的判断。' : '这是历史讨论判断，并非官方测量结果。');
  $('rankMatrix').innerHTML = '<thead><tr><th scope="col">比较维度<small>权重随当前方案</small></th>' +
    SCHOOLS.map(school => '<th scope="col">' + escape(school.name) + '<small>' + escape(school.city) + '</small></th>').join('') + '</tr></thead><tbody>' +
    m.criteria.map(c => '<tr><td><strong>' + escape(c.label) + '</strong><small>' + percent(s.weights[c.id]) + '% 权重</small><button type="button" class="matrix-evidence" data-view="sources" data-source-topic="' + (CRITERION_TOPICS[c.id]?.[0] || '全部') + '">查资料依据 ↗</button></td>' +
      SCHOOLS.map(school => {
        const unknown = !!m.uncertain[c.id]?.includes(school.id);
        return '<td' + (unknown ? ' class="is-uncertain"' : '') + '><input type="number" inputmode="decimal" class="rank-input" min="1" max="6" step="0.5" value="' + s.ranks[c.id][school.id] + '" data-rank="' + c.id + '" data-rank-school="' + school.id + '" aria-label="' + escape(school.name + '的' + c.label + '名次') + '">' + (unknown ? '<span class="uncertain-label">待核 · 情景值</span>' : '') + '</td>';
      }).join('') + '</tr>').join('') + '</tbody><tfoot><tr><td>加权平均名次 ↓</td>' +
    SCHOOLS.map(school => '<td>' + scoreMap[school.id].toFixed(2) + '</td>').join('') + '</tr></tfoot>';
}
function renderInfo() {
  $('schoolInfo').innerHTML = SCHOOLS.map(school => schoolCardHTML(school)).join('');
  $('sourceLinks').innerHTML = SOURCES.map(([name, url]) => '<a href="' + url + '" target="_blank" rel="noopener noreferrer">' + escape(name) + ' ↗</a>').join('');
  $('evidenceCount').textContent = String(new Set(EVIDENCE.filter(e => e.kind === 'official').map(e => e.url)).size);
  $('sourceTotalCount').textContent = String(EVIDENCE.length);
  $('sourceSchool').innerHTML += SCHOOLS.map(school => '<option value="' + school.id + '">' + escape(school.name) + '</option>').join('');
  $('photoCreditGrid').innerHTML = photoCreditsHTML();
  renderSources();
}
function renderSources() {
  const photosOnly = sourceFilters.topic === '图片';
  const filtered = photosOnly ? [] : filteredEvidence(sourceFilters);
  const topics = ['全部','课程','考核','语言','费用','生活','政策','品牌','方法','图片'];
  $('sourceTopics').innerHTML = topics.map(topic => '<button type="button" data-source-topic-button="' + topic + '" aria-pressed="' + String(sourceFilters.topic === topic) + '">' + topic + '</button>').join('');
  $('sourceLibrary').hidden = photosOnly;
  $('sourceLibrary').innerHTML = filtered.length ? filtered.map(sourceCardHTML).join('') : '<div class="source-empty"><strong>没有匹配的资料</strong><p>试试其他关键词，或点击「清除筛选」。</p></div>';
  $('photoCredits').hidden = !(photosOnly || (sourceFilters.topic === '全部' && sourceFilters.school === 'all' && sourceFilters.kind === 'all' && !sourceFilters.query));
  $('sourceResultCount').textContent = photosOnly ? '6组校园影像 · 原图、摄影者与许可均可点击核对' : '显示 ' + filtered.length + ' / ' + EVIDENCE.length + ' 条资料 · 名次不属于官方数据';
  $('sourceSearch').value = sourceFilters.query;
  $('sourceSchool').value = sourceFilters.school;
  $('sourceKind').value = sourceFilters.kind;
}
function renderMode() {
  document.querySelectorAll('[data-mode]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.mode === state.mode)));
  $('dimensionCount').textContent = String(model().criteria.length).padStart(2, '0');
  $('modelDescription').textContent = model().description;
  renderControls();
  renderResults();
  if (currentView === 'matrix') renderMatrix();
}
function switchView(view) {
  if (!['dashboard', 'matrix', 'info', 'sources'].includes(view)) return;
  currentView = view;
  $('modelDescription').hidden = view === 'info' || view === 'sources';
  for (const id of ['dashboard','matrix','info','sources']) $(id + 'View').hidden = id !== view;
  document.querySelectorAll('.view-switch [data-view]').forEach(button => button.classList.toggle('active', button.dataset.view === view));
  if (view === 'matrix') renderMatrix();
  if (view === 'sources') renderSources();
}
function openSchool(id) {
  const r = results.find(school => school.id === id);
  if (!r) return;
  const unknowns = r.contributions.filter(c => c.unknown && c.weight > 0);
  const hasRange = unknowns.length > 0;
  const pct = value => (value - 1) / 5 * 100;
  $('schoolDialogContent').innerHTML = '<figure class="dialog-campus-photo"><img src="./' + PHOTOS[r.id].local + '" alt="' + escape(PHOTOS[r.id].caption) + '" style="object-position:' + PHOTOS[r.id].position + '"><figcaption>' + escape(PHOTOS[r.id].caption) + '</figcaption></figure>' + photoCredit(r.id,true) + '<div class="dialog-school-title">' + schoolMark(r) + '<div><h2>' + escape(r.name) + '</h2><p>' + escape(r.city) + ' · 当前平均名次 ' + r.score.toFixed(2) + '</p></div></div><p class="dialog-course">' + escape(r.course) + '</p>' +
    '<h3 class="contribution-title">每一项，怎样影响结果</h3>' +
    r.contributions.filter(c => c.weight > 0).sort((a, b) => b.weight - a.weight).map(c => {
      const definition = model().criteria.find(x => x.id === c.id);
      return '<div class="contribution-row" style="--criterion-color:' + definition.color + '"><span title="' + escape(c.label) + '">' + escape(c.label) + (c.unknown ? ' *' : '') + '</span><span class="contribution-track"><span style="width:' + (c.rank / 6 * 100) + '%"></span></span><strong>' + fmt(c.rank) + ' × ' + (c.weight * 100).toFixed(1) + '%</strong></div>';
    }).join('') +
    '<p class="dialog-note">每行是「单项名次 × 权重」，相加得到 ' + r.score.toFixed(2) + '。名次和条形越小，该项越有利；不是能力分或就业概率。</p>' +
    (hasRange ? '<h3 class="contribution-title">待核资料会带来多大变化？</h3><div class="range-line"><span style="left:' + pct(r.low) + '%;width:' + (pct(r.high) - pct(r.low)) + '%"></span><i style="left:' + pct(r.score) + '%"></i></div><p class="range-caption">单校情景范围 ' + r.low.toFixed(2) + '–' + r.high.toFixed(2) + '：把标星待核项分别设为第1至第6，其他项不动。这不是概率区间，也不保证各校极端情况能同时出现。</p>' : '') +
    '<div class="dialog-details"><div><small>一年总额估算 · 不含语言班</small><strong>' + r.budget + '</strong></div><div><small>雅思总分 / 最低单项</small><strong>' + r.english + '</strong></div></div>' +
    '<div class="school-description"><h4>为什么可能适合</h4><p>' + escape(r.fit) + '</p><h4>决定前需要核对</h4><p class="concern">' + escape(r.concern) + '</p></div>' +
    '<div class="dialog-originals"><h3>直接核对官方原文</h3>' + directRefs(SCHOOL_REFS[r.id].course,'课程原文') + directRefs(SCHOOL_REFS[r.id].fee,'学费原文') + directRefs(SCHOOL_REFS[r.id].english,'语言要求') + directRefs(SCHOOL_REFS[r.id].assessment) + '</div>';
  $('schoolDialog').showModal();
}
function openWeights(opener) {
  mobileOpener = opener || $('openWeights');
  switchView('dashboard');
  $('weightsPanel').classList.add('mobile-open');
  $('weightsBackdrop').hidden = false;
  document.body.style.overflow = 'hidden';
  $('closeWeights').focus();
}
function closeWeights() {
  $('weightsPanel').classList.remove('mobile-open');
  $('weightsBackdrop').hidden = true;
  document.body.style.overflow = '';
  if (mobileOpener?.isConnected) mobileOpener.focus();
}
function applyPreset(preset) {
  const ids = model().criteria.map(c => c.id);
  const reference = Object.fromEntries(ids.map(id => [id, 1]));
  const emphasize = {
    career: ['career','uk','fit'],
    learning: ['course','graduation','difficulty'],
    life: ['city','housing','commute','social','life'],
    cost: ['cost','language']
  }[preset] || [];
  for (const id of emphasize) if (ids.includes(id)) reference[id] = preset === 'life' && state.mode === 'ten' ? 2 : 4;
  settings().weights = distribute(TOTAL, ids, reference);
  settings().locked = {};
  refreshControlValues();
  renderResults();
  persist();
  toast('已应用预设；你可以继续微调');
}

$('weightControls').addEventListener('input', event => {
  const input = event.target;
  const id = input.dataset.weight;
  if (!id || input.value.trim() === '') return;
  const value = Number(input.value) * (input.type === 'range' ? 1 : 10);
  if (!Number.isFinite(value)) return;
  settings().weights = changeWeight(settings().weights, id, value, settings().locked);
  refreshControlValues();
  scheduleResults();
});
$('weightControls').addEventListener('change', event => {
  const input = event.target;
  if (input.type === 'number' && input.dataset.weight) input.value = percent(settings().weights[input.dataset.weight]);
});
$('weightControls').addEventListener('click', event => {
  const button = event.target.closest('[data-lock]');
  if (!button) return;
  const id = button.dataset.lock;
  settings().locked[id] = !settings().locked[id];
  refreshControlValues();
  persist();
});
document.addEventListener('click', event => {
  const modeButton = event.target.closest('[data-mode]');
  if (modeButton && modeButton.dataset.mode !== state.mode) {
    state.mode = modeButton.dataset.mode;
    renderMode();
    persist();
  }
  const viewButton = event.target.closest('[data-view]');
  if (viewButton) {
    if (viewButton.dataset.view === 'sources' && (viewButton.dataset.sourceTopic || viewButton.dataset.sourceKind)) sourceFilters = { query:'',school:'all',kind:viewButton.dataset.sourceKind || 'all',topic:viewButton.dataset.sourceTopic || '全部' };
    if ($('schoolDialog').open) $('schoolDialog').close();
    if ($('weightsPanel').classList.contains('mobile-open')) closeWeights();
    switchView(viewButton.dataset.view);
  }
  const schoolButton = event.target.closest('[data-school]');
  if (schoolButton) openSchool(schoolButton.dataset.school);
  const presetButton = event.target.closest('[data-preset]');
  if (presetButton) applyPreset(presetButton.dataset.preset);
  const topicButton = event.target.closest('[data-source-topic-button]');
  if (topicButton) { sourceFilters.topic = topicButton.dataset.sourceTopicButton; renderSources(); }
});
$('sourceSearch').addEventListener('input', event => { sourceFilters.query = event.target.value; renderSources(); });
$('sourceSchool').addEventListener('change', event => { sourceFilters.school = event.target.value; renderSources(); });
$('sourceKind').addEventListener('change', event => { sourceFilters.kind = event.target.value; renderSources(); });
$('clearSourceFilters').addEventListener('click', () => { sourceFilters = { query:'',school:'all',kind:'all',topic:'全部' }; renderSources(); });
$('presentationButton').addEventListener('click', () => {
  const enabled = document.body.classList.toggle('presentation');
  $('presentationButton').setAttribute('aria-pressed', String(enabled));
  $('presentationButton').querySelector('.action-label').textContent = enabled ? '退出展示' : '展示模式';
  toast(enabled ? '已开启展示排版；权重与数据保持不变' : '已恢复常规排版');
});
$('equalButton').addEventListener('click', () => {
  settings().weights = equalWeights(model().criteria.map(c => c.id));
  settings().locked = {};
  refreshControlValues();
  renderResults();
  persist();
  toast('已恢复' + model().criteria.length + '项均分，保留你修改的名次');
});
$('unlockButton').addEventListener('click', () => { settings().locked = {}; refreshControlValues(); persist(); toast('已解锁全部权重'); });
$('rankMatrix').addEventListener('input', event => {
  const input = event.target;
  if (!input.dataset.rank || !input.dataset.rankSchool) return;
  $('applyRanksButton').disabled = false;
  $('matrixSource').textContent = '有未应用的名次修改。点击「应用名次修改」后，按相对顺序保存并重新计算。';
});
$('applyRanksButton').addEventListener('click', () => {
  const draft = {};
  for (const criterion of model().criteria) {
    const inputs = SCHOOLS.map(school => document.querySelector('[data-rank="' + criterion.id + '"][data-rank-school="' + school.id + '"]'));
    const invalid = inputs.find(input => !input.value.trim() || !Number.isFinite(Number(input.value)) || Number(input.value) < 1 || Number(input.value) > 6);
    if (invalid) {
      invalid.focus();
      toast('请输入1到6之间的相对名次');
      return;
    }
    const normalized = midranks(inputs.map(input => Number(input.value)));
    draft[criterion.id] = Object.fromEntries(SCHOOLS.map((school, i) => [school.id, normalized[i]]));
  }
  settings().ranks = draft;
  settings().edited = true;
  renderResults();
  renderMatrix();
  persist();
  toast('已应用名次，按相对顺序整理，并列取平均');
});
$('resetRanksButton').addEventListener('click', () => {
  settings().ranks = defaultRanks(state.mode);
  settings().edited = false;
  renderResults();
  renderMatrix();
  persist();
  toast('已恢复本模式初始名次，保留当前权重');
});
$('exportButton').addEventListener('click', () => {
  const payload = { ...state, exportedAt:new Date().toISOString(), dataSnapshot:SNAPSHOT };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type:'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = '英国硕士择校方案-' + new Date().toISOString().slice(0,10) + '.json';
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  toast('已导出权重与名次，可通过「导入方案」恢复');
});
$('importButton').addEventListener('click', () => $('importFile').click());
$('shareButton').addEventListener('click', () => {
  if (location.protocol === 'file:') {
    $('exportButton').click();
    toast('请将此HTML与导出的JSON文件一起发给家人');
    return;
  }
  $('shareUrl').value = location.origin + location.pathname + location.search + '#' + encodeShare(state, MODELS, SCHOOLS);
  $('shareDialog').showModal();
  $('shareUrl').focus();
  $('shareUrl').select();
});
$('copyShareUrl').addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText($('shareUrl').value);
    toast('已复制方案链接；家人打开后可继续自行调整');
    $('shareDialog').close();
  } catch {
    $('shareUrl').focus();
    $('shareUrl').select();
    toast('浏览器未允许自动复制，请长按或手动复制选中的链接');
  }
});
$('closeShareDialog').addEventListener('click', () => $('shareDialog').close());
$('importFile').addEventListener('change', async event => {
  const file = event.target.files[0];
  if (!file) return;
  try {
    if (file.size > 1024 * 1024) throw new Error('文件过大');
    const data = JSON.parse(await file.text());
    if (data.version !== 1 || !data.models || !MODELS[data.mode]) throw new Error('不是受支持的方案文件');
    const models = {};
    for (const mode of Object.keys(MODELS)) {
      if (!data.models[mode]) throw new Error('方案内容不完整');
      models[mode] = restoreModel(data.models[mode], fallback(mode), MODELS[mode].criteria, SCHOOLS);
    }
    state = { version:1, mode:data.mode, models };
    renderMode();
    persist();
    toast('已导入方案');
  } catch { toast('无法导入，请选择本网站导出的JSON方案文件'); }
  event.target.value = '';
});
$('openWeights').addEventListener('click', event => openWeights(event.currentTarget));
$('closeWeights').addEventListener('click', closeWeights);
$('weightsBackdrop').addEventListener('click', closeWeights);
$('closeSchoolDialog').addEventListener('click', () => $('schoolDialog').close());
$('schoolDialog').addEventListener('click', event => {
  if (event.target !== $('schoolDialog')) return;
  const rect = $('schoolDialog').getBoundingClientRect();
  if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) $('schoolDialog').close();
});
document.addEventListener('keydown', event => {
  if (!$('weightsPanel').classList.contains('mobile-open')) return;
  if (event.key === 'Escape') { event.preventDefault(); closeWeights(); }
  if (event.key === 'Tab') {
    const nodes = [...$('weightsPanel').querySelectorAll('button:not(:disabled),input:not(:disabled),[tabindex="0"]')].filter(el => el.getClientRects().length);
    const first = nodes[0], last = nodes[nodes.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  }
});
window.matchMedia('(max-width:900px)').addEventListener('change', event => {
  if (!event.matches && $('weightsPanel').classList.contains('mobile-open')) closeWeights();
});
renderInfo();
renderMode();
if (location.protocol === 'file:') {
  $('shareButton').textContent = '导出方案给家人';
  document.querySelector('.family-share p').textContent = '离线文件可直接发送给家人打开；每个人独立调整。如需传递当前权重和名次，同时发送导出的 JSON 方案。';
}
if (incomingShare) { persist(); toast('已载入分享的方案，可继续自行调整'); }
if (!storageAvailable) $('saveStatus').textContent = '当前浏览器无法保存';
