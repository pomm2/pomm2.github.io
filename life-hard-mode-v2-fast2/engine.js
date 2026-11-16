/* 아직 안 망했다 v2.0-fast2 — 사건 D 문체·분기 개연성 개선판 엔진
   저장 키는 lhm_v2_fast2 하나만 쓴다. v1.0(v095)·v2.0(lhm_v2_demo)·v2-fast(lhm_v2_fast) 키는 읽지도 쓰지도 않는다. */

(function (global, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory(globalThis);
  else global.LHM = factory(global);
})(typeof globalThis !== 'undefined' ? globalThis : this, function (global) {
  'use strict';

  var VERSION = '2.0-fast2';
  var STORE_KEY = 'lhm_v2_fast2';
  var START = 'D1_01';

  var OPS = {
    '=': function (a, b) { return a === b; },
    '!=': function (a, b) { return a !== b; },
    '>=': function (a, b) { return a >= b; },
    '<=': function (a, b) { return a <= b; },
    '>': function (a, b) { return a > b; },
    '<': function (a, b) { return a < b; }
  };

  function defaultState() {
    return {
      cash: 310000,
      tookMoney: false,
      minjaeHostile: false,
      hasWomanInfo: false,
      evidenceLevel: 0,
      subinTrust: 'normal',
      flags: {}
    };
  }

  function clone(s) { return JSON.parse(JSON.stringify(s)); }

  function readField(st, f) {
    return f.indexOf('flags.') === 0 ? st.flags[f.slice(6)] : st[f];
  }

  function test(when, st) {
    if (!when || !when.length) return true;
    for (var i = 0; i < when.length; i++) {
      var c = when[i];
      var op = OPS[c[1]];
      if (!op || !op(readField(st, c[0]), c[2])) return false;
    }
    return true;
  }

  function applyEffects(st, eff) {
    if (!eff) return st;
    var n = clone(st);
    Object.keys(eff).forEach(function (k) {
      var v = eff[k];
      if (k === 'flags') { Object.keys(v).forEach(function (f) { n.flags[f] = v[f]; }); return; }
      if (k === 'cash') { n.cash += v; return; }
      n[k] = v;
    });
    return n;
  }

  function firstRoute(route, st) {
    for (var i = 0; i < route.length; i++) {
      if (test(route[i].when, st)) return route[i];
    }
    return null;
  }

  /* 한 선택지에서 나가는 모든 간선 [{to, state, p}] */
  function destinations(scene, choice, st) {
    var base = applyEffects(st, choice ? choice.effects : (scene && scene.effects) || null);
    if (choice && choice.outcomes) {
      return choice.outcomes.map(function (o) {
        return { to: o.next, state: applyEffects(base, o.effects), p: o.p == null ? 1 : o.p };
      });
    }
    if (choice && choice.route) {
      var r = firstRoute(choice.route, base);
      return r ? [{ to: r.to, state: base, p: 1 }] : [];
    }
    if (choice && choice.next) return [{ to: choice.next, state: base, p: 1 }];
    /* 선택지 없는 화면: 화면 자체의 route/next */
    if (scene && scene.route) {
      var r2 = firstRoute(scene.route, base);
      return r2 ? [{ to: r2.to, state: base, p: 1 }] : [];
    }
    if (scene && scene.next) return [{ to: scene.next, state: base, p: 1 }];
    return [];
  }

  function visibleChoices(scene, st) {
    if (!scene || !scene.choices) return [];
    return scene.choices.filter(function (c) { return test(c.when, st); });
  }

  function isEnding(scene) { return scene && scene.type === 'ending'; }

  var api = {
    VERSION: VERSION,
    STORE_KEY: STORE_KEY,
    START: START,
    defaultState: defaultState,
    clone: clone,
    test: test,
    applyEffects: applyEffects,
    destinations: destinations,
    visibleChoices: visibleChoices,
    isEnding: isEnding
  };

  /* ───────────────────────── 브라우저 UI ───────────────────────── */
  if (typeof document === 'undefined') return api;

  var scenes = null, state = null, cur = null, log = [], el = {}, advanceLock = false;

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function won(n) { return n.toLocaleString('ko-KR'); }

  function plate(src, cls) {
    if (!src) return '';
    var packed = global.LHM_ASSETS && global.LHM_ASSETS[src];
    var url = packed || ('assets/' + src + '.webp');
    return '<figure class="plate ' + (cls || '') + '"><img src="' + url + '" alt=""></figure>';
  }

  function captionHTML(lines, cls) {
    if (!lines || !lines.length) return '';
    return '<div class="caption ' + (cls || '') + '">' +
      lines.map(function (t) { return '<p>' + esc(t) + '</p>'; }).join('') + '</div>';
  }

  function dialogueHTML(speaker, lines) {
    if (!lines || !lines.length) return '';
    return '<div class="dlg"><span class="who">' + esc(speaker || '') + '</span>' +
      lines.map(function (t) { return '<p>' + esc(t) + '</p>'; }).join('') + '</div>';
  }

  function stampHTML(text) {
    return text ? '<div class="stamp">' + esc(text) + '</div>' : '';
  }

  function alertHTML(a) {
    var icon = '<span class="app-icon ' + (a.kind === 'card' ? 'card' : 'bank') + '">' +
      (a.kind === 'card' ? '신' : '토') + '</span>';
    return '<div class="push">' +
      '<div class="push-top">' + icon +
        '<span class="app-name">' + esc(a.app) + '</span>' +
        '<span class="push-kicker">' + esc(a.kicker) + '</span>' +
      '</div>' +
      '<div class="push-amount">' + esc(a.amount) + '</div>' +
      '<div class="push-meta">' + esc(a.meta) + '</div>' +
      '</div>';
  }

  function avatar(who) {
    var ch = (who || '?').slice(0, 1);
    var cls = who === '민재' ? 'av minjae' : (who === '수빈' ? 'av subin' : 'av other');
    return '<span class="' + cls + '">' + esc(ch) + '</span>';
  }

  function roomHTML(room) {
    return '<div class="room">' +
      '<div class="room-head">' + avatar(room.name) +
        '<div><b>' + esc(room.name) + '</b><span>' + esc(room.note || '') + '</span></div>' +
      '</div>' +
      '<div class="bubbles">' +
      room.msgs.map(function (m) {
        return '<div class="msg' + (m.who === '나' ? ' me' : '') + '">' +
          (m.who === '나' ? '' : avatar(m.who)) +
          '<div class="bubble-wrap">' +
            (m.who === '나' ? '' : '<span class="msg-who">' + esc(m.who) + '</span>') +
            '<div class="bubble">' + esc(m.text) + '</div>' +
          '</div>' +
        '</div>';
      }).join('') +
      '</div></div>';
  }

  function chatHTML(sc) {
    /* 방 하나(room + 화면 단위 msgs) 또는 겹치는 방 여러 개(rooms, 각 방이 msgs 보유) */
    var rooms = sc.rooms || (sc.room ? [{ name: sc.room.name, note: sc.room.note, msgs: sc.msgs }] : []);
    return rooms.map(roomHTML).join('');
  }

  function choiceListHTML(list, sc) {
    return '<div class="choices">' + list.map(function (c) {
      var idx = sc.choices.indexOf(c);
      return '<button class="choice" data-i="' + idx + '" type="button">' +
        '<span class="num">' + (idx + 1) + '</span>' +
        '<span class="body">' +
          (c.badge ? '<span class="badge">' + esc(c.badge) + '</span>' : '') +
          '<span class="txt">' + esc(c.text) + '</span>' +
        '</span>' +
      '</button>';
    }).join('') + '</div>';
  }

  function bodyHTML(id) {
    var sc = scenes[id];
    var out = '';
    if (sc.type === 'ending') {
      var trustLabel = { normal: '평범함', high: '두터움', shaken: '흔들림', broken: '끊김' }[state.subinTrust];
      var picks = log.filter(function (e) { return e.k === '선택'; }).slice(-4);
      out += '<article class="sheet ending">' +
        '<div class="end-no">' + esc(sc.no) + ' / 08</div>' +
        plate(sc.img) +
        '<h2>' + esc(sc.title) + '</h2>' +
        '<div class="end-body">' + sc.body.map(function (t) { return '<p>' + esc(t) + '</p>'; }).join('') + '</div>' +
        '<div class="stats">' +
          '<div><span>남은 돈</span><b>' + won(state.cash) + '원</b></div>' +
          '<div><span>수빈이와의 사이</span><b>' + esc(trustLabel) + '</b></div>' +
          '<div><span>쥔 증거</span><b>' + (state.evidenceLevel >= 2 ? '확실함' : state.evidenceLevel === 1 ? '약함' : '없음') + '</b></div>' +
        '</div>' +
        '<p class="end-note">' + esc(sc.note) + '</p>' +
        (picks.length ? '<div class="picks"><h3>이번 판의 선택</h3><ol>' +
          picks.map(function (p) { return '<li>' + esc(p.t) + '</li>'; }).join('') + '</ol></div>' : '') +
        '<button class="cta" id="btn-again" type="button">다른 선택 해보기</button>' +
        '<button class="cta ghost" id="btn-top" type="button">처음 화면으로</button>' +
        '</article>';
      return out;
    }

    out += '<article class="sheet">';
    out += stampHTML(sc.stamp);
    if (sc.type === 'alert') {
      out += plate(sc.img);
      out += '<div class="alerts">' + sc.alerts.map(alertHTML).join('') + '</div>';
      out += captionHTML(sc.caption);
    } else if (sc.type === 'kakao') {
      out += plate(sc.img, 'thin');
      out += chatHTML(sc);
      out += captionHTML(sc.caption);
    } else if (sc.type === 'scene') {
      out += plate(sc.img);
      out += captionHTML(sc.caption);
      out += dialogueHTML(sc.speaker, sc.lines);
      out += captionHTML(sc.after, 'quiet');
      out += captionHTML(sc.caption2);
    } else if (sc.type === 'choice') {
      out += plate(sc.img);
      if (sc.alerts) out += '<div class="alerts">' + sc.alerts.map(alertHTML).join('') + '</div>';
      out += captionHTML(sc.caption);
      if (sc.narration) out += '<p class="narration">' + esc(sc.narration) + '</p>';
      out += dialogueHTML(sc.speaker, sc.lines);
    }
    var list = visibleChoices(sc, state);
    if (list.length) out += choiceListHTML(list, sc);
    out += '</article>';
    return out;
  }

  function logScreen(id) {
    var sc = scenes[id];
    if (!sc || sc.type === 'ending') return;
    if (sc.type === 'kakao') {
      var rooms = sc.rooms || (sc.room ? [{ msgs: sc.msgs }] : []);
      rooms.forEach(function (r) {
        if (r && r.msgs) r.msgs.forEach(function (m) { push('대사', m.who, m.text); });
      });
    }
    (sc.caption || []).forEach(function (t) { push('나레이션', '', t); });
    if (sc.speaker && sc.lines) sc.lines.forEach(function (t) { push('대사', sc.speaker, t); });
    (sc.after || []).forEach(function (t) { push('나레이션', '', t); });
    (sc.caption2 || []).forEach(function (t) { push('나레이션', '', t); });
    if (sc.type === 'alert') sc.alerts.forEach(function (a) { push('알림', a.app, a.amount + ' · ' + a.meta); });
  }

  function push(k, who, t) {
    log.push({ k: k, w: who || '', t: t });
    if (log.length > 200) log.shift();
  }

  function save() {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify({ v: 2, screen: cur, state: state, log: log }));
    } catch (e) { /* 저장 공간이 없으면 조용히 넘어간다 */ }
  }

  function load() {
    try {
      var raw = localStorage.getItem(STORE_KEY);
      if (!raw) return false;
      var d = JSON.parse(raw);
      if (!d || d.v !== 2 || !d.screen || !scenes[d.screen] || !d.state) return false;
      cur = d.screen; state = d.state; log = Array.isArray(d.log) ? d.log : [];
      if (!state.flags) state.flags = {};
      return true;
    } catch (e) { return false; }
  }

  function clearSave() { try { localStorage.removeItem(STORE_KEY); } catch (e) {} }

  function render() {
    var sc = scenes[cur];
    el.stage.setAttribute('data-screen', cur);
    el.stage.innerHTML = bodyHTML(cur);
    el.stage.scrollTop = 0;
    window.scrollTo(0, 0);
    var adv = sc.type !== 'ending' && !sc.choices;
    el.hint.hidden = !adv;
    el.hint.textContent = sc.type === 'ending' ? '' : '화면을 눌러 계속';
    logScreen(cur);
    save();
  }

  function go(id) {
    if (!scenes[id]) throw new Error('없는 화면: ' + id);
    cur = id;
    render();
  }

  function advance() {
    var sc = scenes[cur];
    if (!sc || sc.type === 'ending' || sc.choices) return;
    var d = destinations(sc, null, state);
    if (!d.length) return;
    state = d[0].state;
    go(d[0].to);
  }

  function pick(index) {
    var sc = scenes[cur];
    if (!sc || !sc.choices) return;
    var choice = sc.choices[index];
    if (!choice || !test(choice.when, state)) return;
    var list = visibleChoices(sc, state);
    push('선택', '', choice.text);
    _lastChoice = choice.text;
    var d = destinations(sc, choice, state);
    if (!d.length) return;
    var chosen;
    if (d.length === 1) chosen = d[0];
    else {
      var r = Math.random(), acc = 0;
      chosen = d[d.length - 1];
      for (var i = 0; i < d.length; i++) { acc += d[i].p; if (r <= acc) { chosen = d[i]; break; } }
    }
    state = chosen.state;
    go(chosen.to);
  }

  var _lastChoice = '';

  function restart() {
    state = defaultState();
    log = [];
    clearSave();
    cur = START;
    render();
  }

  function openBacklog() {
    el.logList.innerHTML = log.length
      ? log.map(function (e) {
          return '<li class="log-' + esc(e.k) + '">' +
            '<span class="tag">' + esc(e.k) + '</span>' +
            '<span class="log-text">' + (e.w ? '<b>' + esc(e.w) + '</b> ' : '') + esc(e.t) + '</span>' +
            '</li>';
        }).join('')
      : '<li class="empty">아직 기록이 없어요.</li>';
    el.backlog.hidden = false;
    el.backlog.classList.add('open');
    el.logList.scrollTop = el.logList.scrollHeight;
    el.backlogClose.focus();
  }

  function closeBacklog() {
    el.backlog.classList.remove('open');
    el.backlog.hidden = true;
  }

  function boot(SCENES) {
    scenes = SCENES;
    state = defaultState();
    el.stage = document.getElementById('stage');
    el.hint = document.getElementById('hint');
    el.backlog = document.getElementById('backlog');
    el.logList = document.getElementById('log-list');
    el.backlogClose = document.getElementById('backlog-close');
    el.toast = document.getElementById('toast');

    if (!load()) cur = START;

    document.getElementById('btn-restart').addEventListener('click', function (e) {
      e.stopPropagation();
      restart();
      toast('처음부터 다시 시작합니다.');
    });
    document.getElementById('btn-log').addEventListener('click', function (e) {
      e.stopPropagation();
      openBacklog();
    });
    el.backlogClose.addEventListener('click', function (e) { e.stopPropagation(); closeBacklog(); });
    el.backlog.addEventListener('click', function (e) { if (e.target === el.backlog) closeBacklog(); });

    el.stage.addEventListener('click', function (e) {
      var b = e.target.closest('button');
      if (b) {
        if (b.id === 'btn-again' || b.id === 'btn-top') { restart(); return; }
        if (b.classList.contains('choice')) { pick(Number(b.getAttribute('data-i'))); return; }
        return;
      }
      if (e.target.closest('.plate, .room, .bubbles')) { /* 그냥 계속 */ }
      advance();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !el.backlog.hidden) { closeBacklog(); return; }
      if (e.key === 'Enter' || e.key === ' ') {
        if (!el.backlog.hidden) return;
        var t = document.activeElement;
        if (t && t.tagName === 'BUTTON') return;
        e.preventDefault();
        advance();
      }
    });

    render();
    document.body.setAttribute('data-ready', '1');
  }

  var toastTimer = null;
  function toast(msg) {
    if (!el.toast) return;
    el.toast.textContent = msg;
    el.toast.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.toast.hidden = true; }, 1800);
  }

  api.boot = boot;
  api.__test = {
    getState: function () { return state; },
    getScreen: function () { return cur; },
    getLog: function () { return log; },
    setState: function (s) { state = s; },
    go: go,
    pick: pick
  };
  return api;
});
