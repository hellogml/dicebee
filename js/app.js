(function () {
  'use strict';

  var $ = function (id) { return document.getElementById(id); };

  var countEl = $('dice-count');
  var rangeEl = $('dice-range');
  var faces = 20; // current face count
  var rolling = false;

  function secureRandom() {
    var arr = new Uint32Array(1);
    (window.crypto || window.msCrypto).getRandomValues(arr);
    return arr[0] / 4294967296;
  }

  function rollDie(sides) {
    return Math.floor(secureRandom() * sides) + 1;
  }

  function updateCount() {
    countEl.textContent = rangeEl.value;
  }

  function buildDieHTML(value, sides, small) {
    var num = String(value);
    var face = 'd' + sides;
    return '<div class="die-num">' + num + '</div><div class="die-face">' + face + '</div>';
  }

  function renderTray(values, sides) {
    var tray = $('dice-tray');
    tray.innerHTML = '';
    $('round-label').textContent = 'd' + sides + ' \u00d7 ' + values.length;
    values.forEach(function (v, i) {
      var d = document.createElement('div');
      d.className = 'die' + (i === 0 ? ' land' : '');
      if (i > 0) d.style.transitionDelay = (i * 0.04) + 's';
      d.innerHTML = buildDieHTML(v, sides);
      d.setAttribute('aria-label', 'Die ' + (i + 1) + ' shows ' + v);
      tray.appendChild(d);
    });
    var total = values.reduce(function (a, b) { return a + b; }, 0);
    var avg = total / values.length;
    $('t-total').textContent = total;
    $('t-avg').textContent = (Math.round(avg * 100) / 100).toString();
    $('t-max').textContent = Math.max.apply(null, values);
    $('t-min').textContent = Math.min.apply(null, values);
    $('totals').hidden = false;
  }

  function roll() {
    if (rolling) return;
    rolling = true;
    var btn = $('roll-btn');
    btn.disabled = true;

    var n = parseInt(rangeEl.value, 10);
    var values = [];
    for (var i = 0; i < n; i++) values.push(rollDie(faces));

    // Tumble preview: flash plausible values briefly, then settle
    var tray = $('dice-tray');
    tray.innerHTML = '';
    var dieEls = [];
    for (var j = 0; j < n; j++) {
      var d = document.createElement('div');
      d.className = 'die rolling';
      d.innerHTML = buildDieHTML(rollDie(faces), faces);
      d.setAttribute('aria-hidden', 'true');
      tray.appendChild(d);
      dieEls.push(d);
    }
    $('round-label').textContent = 'rolling\u2026';

    var phase = 0;
    var ticker = setInterval(function () {
      dieEls.forEach(function (d) { d.querySelector('.die-num').textContent = rollDie(faces); });
      phase++;
      if (phase >= 5) {
        clearInterval(ticker);
        setTimeout(function () {
          renderTray(values, faces);
          dieEls.forEach(function (d) { d.classList.remove('rolling'); });
          addHistory(values, faces);
          rolling = false;
          btn.disabled = false;
        }, 90);
      }
    }, 120);
  }

  function nowLabel() {
    var t = new Date();
    var p = function (x) { return (x < 10 ? '0' : '') + x; };
    return p(t.getHours()) + ':' + p(t.getMinutes()) + ':' + p(t.getSeconds());
  }

  function addHistory(values, sides) {
    var wrap = $('history');
    var empty = wrap.querySelector('.page-lede');
    if (empty) wrap.innerHTML = '';

    var total = values.reduce(function (a, b) { return a + b; }, 0);
    var row = document.createElement('div');
    row.className = 'history-roll';
    var dice = values.map(function (v) {
      return '<div class="history-drop">' + buildDieHTML(v, sides) + '</div>';
    }).join('');
    row.innerHTML = '<div class="history-dice">' + dice + '</div>' +
      '<span class="history-sum">= ' + total + '</span>' +
      '<span class="history-time">' + nowLabel() + '</span>';
    wrap.insertBefore(row, wrap.firstChild);
  }

  function clearHistory() {
    var wrap = $('history');
    wrap.innerHTML = '<p class="page-lede" style="margin:0">Your recent rounds show up here.</p>';
  }

  // Events
  rangeEl.addEventListener('input', updateCount);
  $('inc-dice').addEventListener('click', function () {
    rangeEl.value = Math.min(20, parseInt(rangeEl.value, 10) + 1); updateCount();
  });
  $('dec-dice').addEventListener('click', function () {
    rangeEl.value = Math.max(1, parseInt(rangeEl.value, 10) - 1); updateCount();
  });
  $('roll-btn').addEventListener('click', roll);
  $('clear-history').addEventListener('click', clearHistory);

  Array.prototype.forEach.call(document.querySelectorAll('#face-chips button'), function (b) {
    b.addEventListener('click', function () {
      faces = parseInt(b.getAttribute('data-faces'), 10);
      Array.prototype.forEach.call(document.querySelectorAll('#face-chips button'), function (o) {
        o.classList.toggle('on', o === b);
      });
    });
  });

  $('clear-btn').addEventListener('click', function () {
    $('dice-tray').innerHTML = '<div class="placeholder">Press Roll Dice to start the round.</div>';
    $('round-label').textContent = '';
    $('totals').hidden = true;
  });

  var themeBtn = $('theme-toggle');
  var savedTheme = (function () { try { return localStorage.getItem('theme'); } catch (e) { return null; } })();
  if (savedTheme) document.documentElement.setAttribute('data-theme', savedTheme);
  themeBtn.addEventListener('click', function () {
    var cur = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', cur);
    try { localStorage.setItem('theme', cur); } catch (e) {}
  });
  var navMenu = $('nav-menu');
  var yr = $('yr');
  if (yr) yr.textContent = new Date().getFullYear();
})();
/* nav variant: accordion-details */
(function(){document.addEventListener('click',function(e){var a=e.target.closest('a');if(!a)return;var mm=a.closest('details.db-mm');if(!mm||!mm.open)return;mm.removeAttribute('open');var gs=mm.querySelectorAll('details.db-mmgrp');for(var i=0;i<gs.length;i++){gs[i].removeAttribute('open');}});})();

/* nav variant: overlay-unify-close */
(function(){var d=document.querySelector('details.db-mm');if(!d)return;var p=d.querySelector('.db-mmpanel');if(!p)return;if(p.parentNode!==document.body)document.body.appendChild(p);function sync(){if(d.open)p.removeAttribute('hidden');else p.setAttribute('hidden','');}d.addEventListener('toggle',sync);sync();p.addEventListener('click',function(e){if(e.target===p)d.removeAttribute('open');});})();