import { SCHOOLS } from './data.js';
import { EVIDENCE, SCHOOL_REFS, REVIEW_DATE } from './evidence.js';
import { PHOTOS } from './photos.js';
import { SOURCE_AUDIT } from './source-audit.js';

const safeText = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const evidenceById = Object.fromEntries(EVIDENCE.map(source => [source.id, source]));
const sourceSchoolName = id => SCHOOLS.find(s => s.id === id)?.name || '跨学校';

export function directRefs(ids, label = '') {
  return '<span class="inline-refs">' + ids.map((id, i) => {
    const e = evidenceById[id];
    if (!e?.url) return '';
    return '<a href="' + safeText(e.url) + '" target="_blank" rel="noopener noreferrer" title="' + safeText(e.title + ' · ' + e.year) + '">' + safeText(label && i === 0 ? label : e.title.replace(/^[^·]+· /,'')) + ' <span>↗</span></a>';
  }).join('') + '</span>';
}

export function photoCredit(id, compact = false) {
  const photo = PHOTOS[id];
  if (!photo) return '';
  return '<div class="photo-credit' + (compact ? ' compact' : '') + '"><a href="' + safeText(photo.page) + '" target="_blank" rel="noopener noreferrer" title="' + safeText(photo.title) + '">图片原始出处 ↗</a><span>摄影 / ' + safeText(photo.artist) + '</span><a href="' + safeText(photo.licenseUrl) + '" target="_blank" rel="noopener noreferrer">' + safeText(photo.license) + '</a></div>';
}

export function schoolCardHTML(school) {
  const photo = PHOTOS[school.id], refs = SCHOOL_REFS[school.id];
  return '<article class="school-card school-card-v2"><figure class="school-photo"><img src="./' + photo.local + '" alt="' + safeText(photo.caption) + '" style="object-position:' + photo.position + '" loading="lazy" width="1200" height="800"><figcaption><span>' + safeText(school.city) + '</span><strong>' + safeText(school.name) + '</strong></figcaption></figure><div class="school-card-content">' +
    '<div class="school-card-head"><span class="school-mark" style="--school-color:' + school.color + '">' + school.mark + '</span><div><h3>' + safeText(school.name) + '</h3><p>' + safeText(school.en) + '</p></div><span class="data-badge official">官方项目</span></div>' +
    '<p class="school-course">' + safeText(school.course) + '</p><div class="school-tags">' + school.tags.map(t => '<span>' + safeText(t) + '</span>').join('') + '</div>' +
    '<div class="school-facts"><div><small>2027 国际学费 <span class="mini-fact">官方</span></small><strong class="currency">' + school.fee + '</strong>' + directRefs(refs.fee,'学费原文') + '<p>一年总额估算 ' + school.budget + '</p><button class="estimate-link" type="button" data-view="sources" data-source-kind="estimate">查看估算口径 ↗</button></div>' +
    '<div><small>雅思总分 / 最低单项 <span class="mini-fact">官方</span></small><strong>' + school.english + '</strong>' + directRefs(refs.english,'语言要求原文') + '<p>' + safeText(school.languageCost) + '</p>' + directRefs(refs.pre,'语言班官方入口') + '</div></div>' +
    '<div class="school-description"><h4>课程与职业 <span class="mini-judgement">匹配为判断</span></h4><p>' + safeText(school.fit) + '</p>' + directRefs(refs.course,'核对课程与项目') +
    '<h4>课程与毕业 <span class="mini-pending">资料有边界</span></h4><p class="concern">' + safeText(school.concern) + '</p>' + directRefs(refs.assessment) +
    '<h4>生活与实际校区</h4><p>' + safeText(school.life) + '</p>' + directRefs(refs.life,'核对实际校区') + '</div>' +
    '<p class="photo-caption">' + safeText(photo.caption) + '</p>' + photoCredit(school.id,true) + '</div></article>';
}

export function filteredEvidence(filters = {}) {
  const query = (filters.query || '').trim().toLocaleLowerCase();
  return EVIDENCE.filter(e => {
    const schoolMatches = !filters.school || filters.school === 'all' || e.school === filters.school || e.school === 'all';
    const topicMatches = !filters.topic || filters.topic === '全部' || filters.topic === e.topic;
    const kindMatches = !filters.kind || filters.kind === 'all' || filters.kind === e.kind;
    const text = [e.title,e.supports,e.limit,e.year,e.topic,sourceSchoolName(e.school)].join(' ').toLocaleLowerCase();
    return schoolMatches && topicMatches && kindMatches && (!query || text.includes(query));
  });
}

export function sourceCardHTML(e) {
  const kindText = {official:'官方资料',estimate:'预算估算',judgement:'主观名次',pending:'待核政策入口'}[e.kind];
  const audit = SOURCE_AUDIT[e.id];
  const checked = audit && ['reachable','web-verified'].includes(audit.state);
  const dateText = e.kind === 'official' ? (checked ? '本次已访问' : '原文访问待复核') : e.kind === 'pending' ? '资格及适用年度待核' : '本工具的比较口径';
  const domain = e.url ? new URL(e.url).hostname.replace(/^www\./,'') : '本次择校讨论';
  return '<article class="source-card" data-source-id="' + e.id + '"><div class="source-card-meta"><span class="data-badge ' + e.kind + '">' + kindText + '</span><span>' + safeText(e.topic) + ' · ' + safeText(sourceSchoolName(e.school)) + '</span></div><h3>' + (e.url ? '<a href="' + safeText(e.url) + '" target="_blank" rel="noopener noreferrer">' + safeText(e.title) + ' <span>↗</span></a>' : safeText(e.title)) + '</h3><div class="source-year"><span>适用：' + safeText(e.year) + '</span><span>' + safeText(dateText) + '</span></div>' +
    '<p class="source-support"><span>可支持什么</span>' + safeText(e.supports) + '</p><p class="source-limit"><span>资料边界</span>' + safeText(e.limit) + '</p>' +
    '<div class="source-card-footer"><span>' + safeText(domain) + '<small>记录 / ' + REVIEW_DATE + '</small></span>' +
    (e.url ? '<a href="' + safeText(e.url) + '" target="_blank" rel="noopener noreferrer">' + (e.kind === 'pending' ? '打开主管部门入口' : '打开官方原文') + ' ↗</a>' : '<button class="text-button" type="button" data-view="' + (e.kind === 'judgement' ? 'matrix' : 'info') + '">' + (e.kind === 'judgement' ? '查看名次矩阵' : '查看项目费用') + ' ↗</button>') + '</div></article>';
}

export function photoCreditsHTML() {
  return SCHOOLS.map(school => {
    const p = PHOTOS[school.id];
    return '<article class="photo-credit-card"><a href="' + safeText(p.page) + '" target="_blank" rel="noopener noreferrer"><img src="./' + p.local + '" alt="' + safeText(p.caption) + '" loading="lazy" style="object-position:' + p.position + '"></a><div><strong>' + safeText(school.name) + '</strong><p>' + safeText(p.caption) + '</p><span>摄影 / ' + safeText(p.artist) + '</span><div class="photo-credit-actions"><a href="' + safeText(p.page) + '" target="_blank" rel="noopener noreferrer">原图页面 ↗</a><a href="' + safeText(p.licenseUrl) + '" target="_blank" rel="noopener noreferrer">' + safeText(p.license) + ' ↗</a></div></div></article>';
  }).join('');
}
