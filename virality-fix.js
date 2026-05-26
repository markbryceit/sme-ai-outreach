/* virality-fix.js — loaded by outreach-tool.html */
(function() {

function calcViralityScore(p) {
  var s = 0, c = p.content || "", f = (c.split("\n")[0]) || "";
  var hs = { contrarian:35, pain:32, claim:30, list:25, question:20 };
  s += hs[p.hook_type] || 15;
  if (p.format === "short punchy") s += 8;
  else if (p.format === "story") s += 5;
  else if (p.format === "list") s += 3;
  if (p.estimated_engagement === "very high") s += 10;
  else if (p.estimated_engagement === "high") s += 5;
  if (/[0-9]/.test(f)) s += 10;
  if (/\b(I |my |me )/.test(c.substring(0, 120))) s += 8;
  var l = c.substring(c.length - 100);
  if (l.indexOf("?") !== -1) s += 5;
  if (/AI|ChatGPT|OpenAI|GPT/i.test(f)) s += 8;
  return Math.min(100, s);
}

window.buildFollowupSection = function(id, isInt) {
  return '<div class="followup-section"><div class="followup-label">Follow-up sequence</div>' +
    '<div class="followup-msg"><strong>Message 2 (3 days later):</strong>Just checking this landed okay. ' +
    'Happy to share the last AI Readiness Assessment report, might give you a sense of what to expect.</div>' +
    '<div class="followup-msg"><strong>Message 3 (7 days later):</strong>Last one from me. ' +
    'If the timing is off, no worries. The offer stays open whenever you are ready.</div></div>';
};

var styleEl = document.createElement('style');
styleEl.textContent = [
  '.virality-badge{display:inline-block;padding:2px 8px;border-radius:10px;font-size:11px;font-weight:700;letter-spacing:.3px;margin-left:8px;vertical-align:middle}',
  '.virality-high{background:#1a3a1a;color:#66bb6a;border:1px solid #2e7d32}',
  '.virality-mid{background:#2a2000;color:#f9a825;border:1px solid #f9a825}',
  '.virality-low{background:#2a1a1a;color:#ef5350;border:1px solid #c62828}',
  '.followup-section{margin-top:14px;padding:12px;background:#1a1f2e;border:1px solid #252a3d;border-radius:6px}',
  '.followup-label{font-size:11px;color:#7a8098;text-transform:uppercase;letter-spacing:.5px;margin-bottom:10px}',
  '.followup-msg{margin-bottom:10px;font-size:13px;color:#cdd0dc;line-height:1.5}',
  '.followup-msg strong{color:#a0a6bc;font-size:12px;display:block;margin-bottom:4px}'
].join('');
document.head.appendChild(styleEl);

function addViralityScores() {
  var cards = document.querySelectorAll('.post-card');
  for (var i = 0; i < cards.length; i++) {
    if (cards[i].querySelector('.virality-badge')) continue;
    var p = window.socialPosts && window.socialPosts.posts && window.socialPosts.posts[i];
    if (!p) continue;
    var sc = calcViralityScore(p);
    var cl = sc >= 70 ? 'virality-high' : sc >= 50 ? 'virality-mid' : 'virality-low';
    var lb = sc >= 70 ? 'High virality' : sc >= 50 ? 'Medium virality' : 'Lower virality';
    var badge = document.createElement('span');
    badge.className = 'virality-badge ' + cl;
    badge.textContent = sc + '/100 - ' + lb;
    var meta = cards[i].querySelector('.post-meta');
    if (meta) meta.appendChild(badge);
  }
}

var _origRS = typeof renderSocial === 'function' ? renderSocial : null;
if (_origRS) {
  window.renderSocial = function() {
    _origRS.apply(this, arguments);
    setTimeout(addViralityScores, 50);
  };
}

document.addEventListener('DOMContentLoaded', function() { setTimeout(addViralityScores, 200); });
setTimeout(addViralityScores, 500);

window._viralityFixLoaded = true;
})();
