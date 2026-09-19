const PATHS = {
    'crosshair': '<i class="ti ti-focus-2"></i>',
    'search': '<i class="ti ti-search"></i>',
    'menu': '<i class="ti ti-menu-2"></i>',
    'sun': '<i class="ti ti-sun"></i>',
    'moon': '<i class="ti ti-moon"></i>',
    'copy': '<i class="ti ti-copy"></i>',
    'check': '<i class="ti ti-check"></i>',
    'terminal': '<i class="ti ti-terminal-2"></i>',
    'book': '<i class="ti ti-book"></i>',
    'rocket': '<i class="ti ti-rocket"></i>',
    'link': '<i class="ti ti-link"></i>',
    'unlink': '<i class="ti ti-link-off"></i>',
    'trophy': '<i class="ti ti-trophy"></i>',
    'chart': '<i class="ti ti-chart-bar"></i>',
    'swords': '<i class="ti ti-swords"></i>',
    'user': '<i class="ti ti-user"></i>',
    'map': '<i class="ti ti-map"></i>',
    'shopping': '<i class="ti ti-shopping-bag"></i>',
    'bell': '<i class="ti ti-bell"></i>',
    'clock': '<i class="ti ti-clock"></i>',
    'shield': '<i class="ti ti-shield"></i>',
    'alert': '<i class="ti ti-alert-circle"></i>',
    'info': '<i class="ti ti-info-circle"></i>',
    'bolt': '<i class="ti ti-bolt"></i>',
    'left': '<i class="ti ti-chevron-left"></i>',
    'right': '<i class="ti ti-chevron-right"></i>',
    'settings': '<i class="ti ti-settings-2"></i>',
    'sparkles': '<i class="ti ti-sparkles"></i>'
};

function icon(name) {
    return PATHS[name] || PATHS['book'];
}

const FLAT = DOCS.flatMap(g => g.items.map(it => ({...it, group: g.group})));
const byId = id => FLAT.find(i => i.id === id);
const esc = s => String(s).replace(/[&<>"]/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;'}[c]));

function hlCommand(str) {
    return esc(str)
        .replace(/^(\/[\w-]+)/, '<span class="cmd">$1</span>')
        .replace(/(&lt;[^&]+&gt;|\[[^\]]+\])/g, '<span class="arg">$1</span>');
}

function codeBlock(code, caption, highlight) {
    const body = highlight ? hlCommand(code) : esc(code);
    return `<div class="code">
    ${caption ? `<div class="code-cap">${icon('terminal')}${esc(caption)}</div>` : ''}
    <button class="code-copy" data-copy="${esc(code)}" title="Copier" aria-label="Copier">${icon('copy')}</button>
    <pre>${body}</pre>
  </div>`;
}

function renderNav(filter = '') {
    const q = filter.trim().toLowerCase();
    const nav = document.getElementById('nav');
    let html = '', hits = 0;

    DOCS.forEach(group => {
        const items = group.items.filter(it =>
            !q ||
            it.title.toLowerCase().includes(q) ||
            (it.summary || '').toLowerCase().includes(q) ||
            (it.usage || '').toLowerCase().includes(q)
        );
        if (!items.length) return;
        hits += items.length;
        html += `<div class="nav-group"><h4>${esc(group.group)}</h4>` +
            items.map(it => `<a class="nav-item" href="#${it.id}" data-id="${it.id}">
        ${icon(it.icon)}<span>${esc(it.title)}</span></a>`).join('') +
            `</div>`;
    });

    nav.innerHTML = hits ? html : `<p class="nav-empty">Aucune commande ne correspond à « ${esc(filter)} ».</p>`;
    markActive();
}

function markActive() {
    const id = location.hash.slice(1) || FLAT[0].id;
    document.querySelectorAll('.nav-item').forEach(a =>
        a.classList.toggle('active', a.dataset.id === id));
}

/**
 * script de rendu de la page de documentation
 */
function renderPage() {
    const id = location.hash.slice(1) || FLAT[0].id;
    const d = byId(id) || FLAT[0];
    const i = FLAT.indexOf(d);
    const prev = FLAT[i - 1], next = FLAT[i + 1];
    let h = '';

    h += `<p class="eyebrow">${esc(d.group)}</p>`;
    h += `<div class="page-head"><h1>${d.title.startsWith('/')
        ? '<span class="slash">/</span>' + esc(d.title.slice(1))
        : esc(d.title)}</h1>
        <button class="copy-page" data-copy="${esc(d.usage || d.title)}">${icon('copy')}Copier</button></div>`;

    if (d.summary) h += `<p class="summary">${d.summary}</p>`;

    const chips = [];
    if (d.cooldown) chips.push(`<span class="chip">${icon('clock')}${esc(d.cooldown)}</span>`);
    if (d.scope) chips.push(`<span class="chip">${icon('book')}${esc(d.scope)}</span>`);
    if (d.permission) chips.push(`<span class="chip accent">${icon('shield')}${esc(d.permission)}</span>`);
    if (chips.length) h += `<div class="meta-row">${chips.join('')}</div>`;

    h += `<div class="prose">`;

    if (d.usage) {
        h += `<h2>Syntaxe</h2>` + codeBlock(d.usage, null, true);
    }

    if (d.params && d.params.length) {
        h += `<h2>Paramètres</h2><div class="params">` + d.params.map(p => `
      <div class="param">
        <div class="param-head">
          <span class="param-name">${esc(p.name)}</span>
          <span class="param-type">${esc(p.type)}</span>
          <span class="tag ${p.required ? 'req' : 'opt'}">${p.required ? 'requis' : 'optionnel'}</span>
        </div>
        <p>${p.description}</p>
        ${p.default ? `<p class="def">Par défaut : <code>${esc(p.default)}</code></p>` : ''}
      </div>`).join('') + `</div>`;
    }

    if (d.examples && d.examples.length) {
        h += `<h2>Exemples</h2>` + d.examples.map(ex => codeBlock(ex.code, ex.caption, true)).join('');
    }

    if (d.returns) h += `<h2>Réponse du bot</h2>${d.returns}`;
    if (d.body) h += d.body;

    if (d.notes && d.notes.length) {
        h += d.notes.map(n => {
            const kind = n.type === 'warn' ? 'warn' : n.type === 'ok' ? 'ok' : '';
            const ico = n.type === 'warn' ? 'alert' : n.type === 'ok' ? 'check' : 'info';
            return `<div class="callout ${kind}">${icon(ico)}<div>${n.text}</div></div>`;
        }).join('');
    }

    h += `</div>`;

    h += `<nav class="pager">`;
    h += prev ? `<a href="#${prev.id}"><span class="lbl">${icon('left')}Précédent</span>
               <span class="ttl">${esc(prev.title)}</span></a>` : `<span style="flex:1"></span>`;
    h += next ? `<a class="next" href="#${next.id}"><span class="lbl">Suivant${icon('right')}</span>
               <span class="ttl">${esc(next.title)}</span></a>` : `<span style="flex:1"></span>`;
    h += `</nav>`;

    h += `<div class="page-foot"><span>ValoBot - documentation des commandes</span>`;

    const page = document.getElementById('page');
    page.innerHTML = h;
    document.title = d.title + ' - ValoBot';
    window.scrollTo(0, 0);
    document.body.classList.remove('nav-open');
    markActive();
}

/* copie */
document.addEventListener('click', e => {
    const btn = e.target.closest('[data-copy]');
    if (!btn) return;
    navigator.clipboard.writeText(btn.dataset.copy).then(() => {
        const old = btn.innerHTML;
        const label = btn.classList.contains('copy-page');
        btn.innerHTML = icon('check') + (label ? 'Copié' : '');
        setTimeout(() => btn.innerHTML = old, 1600);
    }).catch(() => {
    });
});

/* recherche */
const search = document.getElementById('search');
search.addEventListener('input', e => renderNav(e.target.value));
document.addEventListener('keydown', e => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        search.focus();
        document.body.classList.add('nav-open');
    }
    if (e.key === 'Escape') {
        search.blur();
        document.body.classList.remove('nav-open');
    }
});

/* thème */
function setTheme(t) {
    document.documentElement.dataset.theme = t;
    document.getElementById('themeDark').classList.toggle('on', t === 'dark');
    document.getElementById('themeLight').classList.toggle('on', t === 'light');
    try {
        localStorage.setItem('valobot-theme', t);
    } catch (_) {
    }
}

document.getElementById('themeDark').onclick = () => setTheme('dark');
document.getElementById('themeLight').onclick = () => setTheme('light');

/* nav mobile */
document.getElementById('burger').onclick = () => document.body.classList.toggle('nav-open');
document.getElementById('scrim').onclick = () => document.body.classList.remove('nav-open');

/* init */
document.getElementById('brandMark').innerHTML = icon('crosshair');
document.getElementById('searchIcon').innerHTML = icon('search');
document.getElementById('burger').innerHTML = icon('menu');
document.getElementById('themeDark').innerHTML = icon('moon');
document.getElementById('themeLight').innerHTML = icon('sun');

let saved = 'dark';
try {
    saved = localStorage.getItem('valobot-theme') || 'dark';
} catch (_) {
}
setTheme(saved);

renderNav();
renderPage();
window.addEventListener('hashchange', renderPage);