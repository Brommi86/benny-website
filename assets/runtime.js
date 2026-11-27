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
      var kids = [];
      build(n.childNodes, scope, kids);
      for (var c = 0; c < kids.length; c++) el.appendChild(kids[c]);
      out.push(el);
    }
    return out;
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
    if (location.hash) {
      var t = document.getElementById(decodeURIComponent(location.hash.slice(1)));
      if (t) setTimeout(function () { t.scrollIntoView(); }, 50);
    }
  };
})();
