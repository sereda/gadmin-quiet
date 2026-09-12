// Paste into the DevTools console on admin.google.com, let it run 10 seconds,
// then copy the printed result. It reports what is actually animating, so the
// extension can be pinned to the real element instead of detecting it.

(() => {
  const hits = new Map();
  const path = (el) => {
    const parts = [];
    for (let n = el; n && n.nodeType === 1 && parts.length < 6; n = n.parentElement) {
      let s = n.tagName.toLowerCase();
      if (n.id) s += '#' + n.id;
      if (n.className && typeof n.className === 'string') {
        s += '.' + n.className.trim().split(/\s+/).slice(0, 3).join('.');
      }
      parts.unshift(s);
    }
    return parts.join(' > ');
  };

  const bump = (el, kind) => {
    if (!el || el.nodeType !== 1) return;
    const key = el;
    const rec = hits.get(key) || { count: 0, kind, samples: [] };
    rec.count++;
    if (rec.samples.length < 5) rec.samples.push((el.textContent || el.placeholder || '').slice(0, 60));
    hits.set(key, rec);
  };

  const obs = new MutationObserver((rs) => {
    for (const r of rs) {
      if (r.type === 'characterData') bump(r.target.parentElement, 'text');
      else if (r.type === 'attributes' && r.attributeName === 'placeholder') bump(r.target, 'placeholder');
      else if (r.type === 'childList') bump(r.target, 'childList');
    }
  });
  obs.observe(document, {
    subtree: true, childList: true, characterData: true,
    attributes: true, attributeFilter: ['placeholder']
  });

  console.log('gadmin-quiet probe: watching for 10s...');
  setTimeout(() => {
    obs.disconnect();
    const rows = [...hits.entries()]
      .filter(([, r]) => r.count >= 5)
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, 10)
      .map(([el, r]) => ({
        changes: r.count,
        kind: r.kind,
        selector: path(el),
        samples: r.samples.join(' | '),
        html: el.outerHTML.slice(0, 200)
      }));
    console.log('gadmin-quiet probe result:');
    console.log(JSON.stringify(rows, null, 2));
  }, 10000);
})();
