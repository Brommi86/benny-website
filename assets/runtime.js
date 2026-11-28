window.__IMGV=(function(){var t={"armsuender-1.webp": [800, 1200], "armsuender-2.webp": [800, 1200], "armsuender-3.webp": [800, 1200], "armsuender-4.webp": [800, 1200], "armsuender-5.webp": [800], "armsuender-6.webp": [800], "armsuender-7.webp": [800, 1200], "armsuender-8.webp": [800, 1200], "erf-1.webp": [800, 1200], "erf-2.webp": [800, 1200], "erf-3.webp": [800, 1200], "erf-4.webp": [800, 1200], "erf-5.webp": [800, 1200], "erf-6.webp": [800, 1200], "erf-7.webp": [800, 1200], "f-armsuender.jpg": [800, 1200], "f-channoine.jpg": [800, 1200], "f-cnt.jpg": [800, 1200], "f-erf.jpg": [800, 1200], "f-muenzing.jpg": [800, 1200], "f-schweinsberg.jpg": [800, 1200], "hero-1.webp": [800, 1200], "hero-2.webp": [800, 1200], "muenzing-1.webp": [800, 1200], "muenzing-2.webp": [800, 1200], "muenzing-3.webp": [800, 1200], "muenzing-4.webp": [800, 1200], "muenzing-5.webp": [800, 1200], "muenzing-6.webp": [800, 1200], "muenzing-7.webp": [800, 1200], "muenzing-8.webp": [800, 1200], "schweinsberg-1.webp": [800, 1200], "schweinsberg-2.webp": [800, 1200], "schweinsberg-3.webp": [800, 1200], "schweinsberg-4.webp": [800], "schweinsberg-5.webp": [800, 1200], "schweinsberg-6.webp": [800], "schweinsberg-7.webp": [800, 1200], "weingut-1.webp": [800, 1200], "weingut-2.webp": [800, 1200], "weingut-3.webp": [800, 1200], "weingut-4.webp": [800, 1200], "weingut-5.webp": [800, 1200], "weingut-6.webp": [800, 1200], "weingut-7.webp": [800, 1200]},f={"armsuender-1.webp": 1600, "armsuender-2.webp": 1600, "armsuender-3.webp": 1600, "armsuender-4.webp": 1600, "armsuender-5.webp": 1000, "armsuender-6.webp": 1000, "armsuender-7.webp": 1600, "armsuender-8.webp": 1600, "erf-1.webp": 1600, "erf-2.webp": 1600, "erf-3.webp": 1600, "erf-4.webp": 1600, "erf-5.webp": 1600, "erf-6.webp": 1600, "erf-7.webp": 1600, "f-armsuender.jpg": 1400, "f-channoine.jpg": 1400, "f-cnt.jpg": 1400, "f-erf.jpg": 1400, "f-muenzing.jpg": 1400, "f-schweinsberg.jpg": 1400, "hero-1.webp": 1600, "hero-2.webp": 1600, "muenzing-1.webp": 1600, "muenzing-2.webp": 1600, "muenzing-3.webp": 1600, "muenzing-4.webp": 1600, "muenzing-5.webp": 1600, "muenzing-6.webp": 1600, "muenzing-7.webp": 1600, "muenzing-8.webp": 1600, "schweinsberg-1.webp": 1600, "schweinsberg-2.webp": 1600, "schweinsberg-3.webp": 1600, "schweinsberg-4.webp": 1000, "schweinsberg-5.webp": 1600, "schweinsberg-6.webp": 1000, "schweinsberg-7.webp": 1600, "weingut-1.webp": 1600, "weingut-2.webp": 1600, "weingut-3.webp": 1600, "weingut-4.webp": 1600, "weingut-5.webp": 1600, "weingut-6.webp": 1600, "weingut-7.webp": 1600};for(var k in t){t[k].full=f[k];}return t;})();
/* müller.architekten – kleine Laufzeit für die exportierten Seiten.
   Rendert die Vorlage im <template id="tpl"> mit den Werten der Component-Klasse
   und gleicht das DOM bei Zustandsänderungen ab (Eingaben und Animationen bleiben erhalten). */
(function () {
  'use strict';
  var HOLE = /\{\{\s*([^}]+?)\s*\}\}/g;

  function lookup(path, scope) {
    path = path.trim();
    if (path === 'true') return true;
    if (path === 'false') return false;
    if (path === 'null') return null;
    if (/^-?\d+(\.\d+)?$/.test(path)) return Number(path);
    if (/^'.*'$|^".*"$/.test(path)) return path.slice(1, -1);
    var parts = path.split('.');
    var v = scope;
    for (var i = 0; i < parts.length; i++) {
      if (v == null) return undefined;
      v = v[parts[i]];
    }
    return v;
  }

  function whole(str) {
    var m = /^\s*\{\{\s*([^}]+?)\s*\}\}\s*$/.exec(str);
    return m ? m[1] : null;
  }

  function interp(str, scope) {
    return str.replace(HOLE, function (_, p) {
      var v = lookup(p, scope);
      return v == null ? '' : String(v);
    });
  }

  function build(tplNodes, scope, out) {
    for (var i = 0; i < tplNodes.length; i++) {
      var n = tplNodes[i];
      if (n.nodeType === 3) {
        out.push(document.createTextNode(n.nodeValue.indexOf('{{') > -1 ? interp(n.nodeValue, scope) : n.nodeValue));
        continue;
      }
      if (n.nodeType !== 1) continue;
      var tag = n.localName;
      if (tag === 'sc-for') {
        var list = lookup(whole(n.getAttribute('list')) || '', scope) || [];
        var as = n.getAttribute('as') || 'item';
        for (var k = 0; k < list.length; k++) {
          var s2 = Object.create(scope);
          s2[as] = list[k];
          s2.$index = k;
          build(n.childNodes, s2, out);
        }
        continue;
      }
      if (tag === 'sc-if') {
        var cond = lookup(whole(n.getAttribute('value')) || '', scope);
        if (cond) build(n.childNodes, scope, out);
        continue;
      }
      var el = n.cloneNode(false);
      el.__ev = null;
      el.__ref = null;
      var attrs = Array.prototype.slice.call(n.attributes);
      for (var a = 0; a < attrs.length; a++) {
        var name = attrs[a].name, val = attrs[a].value;
        if (name.indexOf('hint-') === 0) { el.removeAttribute(name); continue; }
        if (val.indexOf('{{') === -1) continue;
        var w = whole(val);
        if (w !== null) {
          var raw = lookup(w, scope);
          if (name === 'ref') { el.removeAttribute(name); el.__ref = raw; continue; }
          if (/^on[a-z]+$/i.test(name)) {
            el.removeAttribute(name);
            if (typeof raw === 'function') { (el.__ev = el.__ev || {})[name.slice(2).toLowerCase()] = raw; }
            continue;
          }
          if (raw === false || raw == null) { el.removeAttribute(name); continue; }
          el.setAttribute(name, String(raw));
        } else {
          el.setAttribute(name, interp(val, scope));
        }
      }
      if (el.tagName === 'IMG') enhanceImg(el);
      var kids = [];
      build(n.childNodes, scope, kids);
      for (var c = 0; c < kids.length; c++) el.appendChild(kids[c]);
      out.push(el);
    }
    return out;
  }


  /* Bildgrößen je Gerät + weiche Einblendung */
  var IMGV = window.__IMGV || {};
  var LOADED = {};
  var LIVE = !/jsdom/i.test(navigator.userAgent || '');
  function enhanceImg(el) {
    var src = el.getAttribute('src') || '';
    var m = /^bilder\/([^\/?#]+)$/.exec(src);
    if (m && IMGV[m[1]]) {
      var set = IMGV[m[1]].map(function (w) { return 'bilder/' + w + '/' + m[1] + ' ' + w + 'w'; });
      set.push(src + ' ' + IMGV[m[1]].full + 'w');
      el.setAttribute('srcset', set.join(', '));
      if (!el.hasAttribute('sizes')) el.setAttribute('sizes', '100vw');
    }
    if (el.getAttribute('loading') === 'lazy') {
      el.setAttribute('data-lz', '');
      if (LIVE && !LOADED[src]) el.setAttribute('data-l', '0');
    }
  }
  function markLoaded(img) {
    var s = img.getAttribute('src');
    LOADED[s] = true;
    var all = document.querySelectorAll('img[data-l]');
    for (var i = 0; i < all.length; i++) if (all[i].getAttribute('src') === s) all[i].removeAttribute('data-l');
  }
  if (LIVE) {
    var st = document.createElement('style');
    st.textContent = 'img[data-lz]{transition:opacity .9s cubic-bezier(.16,1,.3,1),filter 1.2s cubic-bezier(.16,1,.3,1),transform 1.2s cubic-bezier(.16,1,.3,1)}img[data-l]{opacity:0!important;filter:blur(18px)!important}' +
      'html.heroOff #top,html.heroOff #top *{animation-play-state:paused!important}html.heroOff #top{--ps:paused!important}' +
      '@media (prefers-reduced-motion:reduce){img[data-lz]{transition:none}img[data-l]{opacity:1!important;filter:none!important}}';
    document.head.appendChild(st);
    document.addEventListener('load', function (e) { if (e.target && e.target.tagName === 'IMG') markLoaded(e.target); }, true);
    document.addEventListener('error', function (e) { if (e.target && e.target.tagName === 'IMG') markLoaded(e.target); }, true);
  }
  function scanLoaded() {
    var all = document.querySelectorAll('img[data-l]');
    for (var i = 0; i < all.length; i++) if (all[i].complete && all[i].naturalWidth) markLoaded(all[i]);
  }
  function watchHero() {
    var hero = document.getElementById('top');
    if (!hero || !('IntersectionObserver' in window)) return;
    new IntersectionObserver(function (es) {
      document.documentElement.classList.toggle('heroOff', !es[0].isIntersecting);
    }, { threshold: 0 }).observe(hero);
  }

  var EVENTS = ['click', 'mouseenter', 'mouseleave', 'mousemove', 'input', 'change', 'focus', 'touchstart', 'touchend'];

  function applyBindings(live, fresh) {
    for (var i = 0; i < EVENTS.length; i++) {
      var t = EVENTS[i];
      var fn = fresh.__ev && fresh.__ev[t];
      live['on' + t] = fn || null;
    }
    if (fresh.__ref && typeof fresh.__ref === 'object') fresh.__ref.current = live;
  }

  function bindTree(node) {
    if (node.nodeType !== 1) return;
    applyBindings(node, node);
    for (var c = node.firstChild; c; c = c.nextSibling) bindTree(c);
  }

  function morphAttrs(a, b) {
    var i, at;
    for (i = a.attributes.length - 1; i >= 0; i--) {
      at = a.attributes[i];
      if (!b.hasAttribute(at.name)) a.removeAttribute(at.name);
    }
    for (i = 0; i < b.attributes.length; i++) {
      at = b.attributes[i];
      if (a.getAttribute(at.name) !== at.value) a.setAttribute(at.name, at.value);
    }
  }

  function morphChildren(liveParent, freshNodes) {
    var live = Array.prototype.slice.call(liveParent.childNodes);
    for (var i = 0; i < freshNodes.length; i++) {
      var f = freshNodes[i], l = live[i];
      if (!l) { liveParent.appendChild(f); bindTree(f); continue; }
      if (l.nodeType !== f.nodeType || (l.nodeType === 1 && l.localName !== f.localName)) {
        liveParent.replaceChild(f, l); bindTree(f); continue;
      }
      if (l.nodeType === 3) { if (l.nodeValue !== f.nodeValue) l.nodeValue = f.nodeValue; continue; }
      if (l.nodeType === 1) {
        morphAttrs(l, f);
        applyBindings(l, f);
        morphChildren(l, Array.prototype.slice.call(f.childNodes));
      }
    }
    for (var j = live.length - 1; j >= freshNodes.length; j--) liveParent.removeChild(live[j]);
  }

  window.DCLogic = function DCLogic(props) {
    this.props = props || {};
    this.state = {};
  };
  window.DCLogic.prototype.setState = function (patch) {
    var p = typeof patch === 'function' ? patch(this.state, this.props) : patch;
    if (p) for (var k in p) this.state[k] = p[k];
    schedule();
  };
  window.DCLogic.prototype.forceUpdate = function () { schedule(); };

  var inst, root, tpl, pending = false;
  function render() {
    pending = false;
    var vals = inst.renderVals ? inst.renderVals() : {};
    var fresh = build(tpl.content.childNodes, vals, []);
    morphChildren(root, fresh);
  }
  function schedule() {
    if (!inst || pending) return;
    pending = true;
    Promise.resolve().then(render);
  }

  window.__mountDC = function (Component) {
    tpl = document.getElementById('tpl');
    root = document.getElementById('app');
    inst = new Component({});
    if (!inst.state) inst.state = {};
    render();
    if (typeof inst.componentDidMount === 'function') inst.componentDidMount();
    if (LIVE) { scanLoaded(); watchHero(); }
    if (location.hash) {
      var t = document.getElementById(decodeURIComponent(location.hash.slice(1)));
      if (t) setTimeout(function () { t.scrollIntoView(); }, 50);
    }
  };
})();
