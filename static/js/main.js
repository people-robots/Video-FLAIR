const RESULTS = {
  image: {
    columns: ['EMMA', 'MMMU', 'MathVista', 'HallusionBench', 'AI2D', 'MM-Vet v2'],
    qwen25: [
      { name: 'Qwen2.5-VL-7B', type: 'base', tok: null, v: [25.8, 52.0, 68.4, 71.0, 82.7, 56.6] },
      { name: '+ SFT', type: 'sft', tok: null, v: [26.1, 52.9, 68.6, 70.5, 82.1, 56.7] },
      { group: 'Always Thinking' },
      { name: 'Video-R1', tok: 342, v: [19.2, 52.5, 69.4, 64.4, 82.0, 55.8] },
      { name: 'Video-R2', tok: 411, v: [19.0, 49.6, 69.2, 63.6, 80.7, 56.0] },
      { name: 'VideoRFT', tok: 367, v: [19.5, 50.5, 69.1, 65.1, 81.3, 57.0] },
      { group: 'Auto Thinking' },
      { name: 'Video-Auto-R1', tok: 55, v: [23.7, 52.0, 72.2, 66.2, 83.0, 55.4] },
      { name: 'Video-FLAIR', type: 'ours', tok: 74, v: [27.3, 54.5, 73.8, 71.8, 83.2, 57.9], ci: [0.5, 0.7, 0.6, 0.9, 0.3, 0.8], ns: [3] }
    ],
    qwen3: [
      { name: 'Qwen3-VL-8B', type: 'base', tok: null, v: [22.4, 56.2, 74.1, 71.8, 80.3, 63.9] },
      { name: '+ SFT', type: 'sft', tok: null, v: [26.9, 56.2, 73.4, 71.4, 81.3, 64.1] },
      { group: 'Always Thinking' },
      { name: 'OneThinker', tok: 539, v: [10.9, 61.2, 75.0, 54.3, 82.8, 64.7] },
      { group: 'Auto Thinking' },
      { name: 'Video-Auto-R1', tok: 259, v: [24.3, 61.7, 72.7, 65.0, 83.9, 64.4] },
      { name: 'Video-FLAIR', type: 'ours', tok: 108, v: [30.8, 61.5, 76.3, 72.8, 85.5, 66.9], ci: [0.5, 0.6, 0.4, 1.1, 0.3, 0.7], ns: [3] }
    ]
  },
  video: {
    columns: ['Video-Holmes', 'Video-TT', 'VSI-Bench', 'SciVideoBench', 'Video-MMMU'],
    qwen25: [
      { name: 'Qwen2.5-VL-7B', type: 'base', tok: null, v: [43.2, 39.3, 31.8, 23.8, 52.1] },
      { name: '+ SFT', type: 'sft', tok: null, v: [44.7, 39.3, 33.0, 26.2, 53.3] },
      { group: 'Always Thinking' },
      { name: 'Video-R1', tok: 360, v: [41.8, 40.1, 34.9, 27.0, 50.3] },
      { name: 'Video-R2', tok: 525, v: [40.7, 39.3, 31.9, 27.8, 48.3] },
      { name: 'VideoRFT', tok: 374, v: [42.9, 39.0, 36.0, 28.0, 48.2] },
      { group: 'Auto Thinking' },
      { name: 'Video-Auto-R1', tok: 94, v: [47.7, 39.1, 35.2, 31.6, 54.2] },
      { name: 'Video-FLAIR', type: 'ours', tok: 59, v: [48.0, 41.0, 35.8, 29.4, 56.9], ci: [0.6, 0.4, 0.3, 0.7, 0.8], ns: [] }
    ],
    qwen3: [
      { name: 'Qwen3-VL-8B', type: 'base', tok: null, v: [46.8, 39.7, 56.8, 29.4, 58.1] },
      { name: '+ SFT', type: 'sft', tok: null, v: [47.9, 40.8, 56.8, 31.0, 58.5] },
      { group: 'Always Thinking' },
      { name: 'OneThinker', tok: 421, v: [48.2, 40.0, 49.9, 32.6, 61.0] },
      { group: 'Auto Thinking' },
      { name: 'Video-Auto-R1', tok: 284, v: [49.2, 40.2, 57.2, 32.0, 60.7] },
      { name: 'Video-FLAIR', type: 'ours', tok: 137, v: [49.9, 41.2, 58.2, 33.1, 60.5], ci: [0.5, 0.3, 0.2, 0.6, 0.7], ns: [] }
    ]
  }
};

const MODE_DIST = [
  ['AI2D', 78, 20, 2],
  ['HallusionBench', 74, 24, 2],
  ['MM-Vet v2', 62, 34, 4],
  ['Video-TT', 55, 42, 3],
  ['MathVista', 55, 40, 5],
  ['VSI-Bench', 50, 46, 4],
  ['MMMU', 48, 46, 6],
  ['EMMA', 44, 50, 6],
  ['Video-MMMU', 38, 56, 6],
  ['SciVideoBench', 30, 64, 6],
  ['Video-Holmes', 25, 69, 6]
];

function fmt(x) {
  return x.toFixed(1);
}

function renderResults(target, suite, model) {
  const data = RESULTS[suite];
  const rows = data[model];
  const base = rows.find(r => r.type === 'base');
  const scored = rows.filter(r => r.v);
  const best = data.columns.map((_, i) => Math.max(...scored.map(r => r.v[i])));
  const toks = scored.filter(r => r.tok !== null).map(r => r.tok);
  const minTok = Math.min(...toks);

  let html = '<table class="results-table"><thead><tr><th>Model</th><th>Avg Tokens &darr;</th>';
  data.columns.forEach(c => { html += `<th>${c}</th>`; });
  html += '</tr></thead><tbody>';

  rows.forEach(r => {
    if (r.group) {
      html += `<tr class="group-row"><td colspan="${data.columns.length + 2}">${r.group}</td></tr>`;
      return;
    }
    const cls = r.type === 'base' || r.type === 'sft' ? 'base-row' : (r.type === 'ours' ? 'ours' : '');
    const label = r.type === 'ours'
      ? '<img src="static/images/sparkle.png" alt="" style="height:1em;vertical-align:-2px;margin-right:4px;">Video-FLAIR'
      : r.name;
    html += `<tr class="${cls}"><td>${label}</td>`;
    html += `<td class="${r.tok === minTok ? 'best' : ''}">${r.tok === null ? '&ndash;' : r.tok}</td>`;
    r.v.forEach((val, i) => {
      let cell = `<span class="${val === best[i] ? 'best' : ''}">${fmt(val)}</span>`;
      if (r.type !== 'base') {
        const d = +(val - base.v[i]).toFixed(1);
        if (r.type === 'ours') {
          const mark = r.ns.includes(i) ? '<sup>&Dagger;</sup>' : '';
          cell += `<span class="delta up">+${fmt(d)} &plusmn; ${fmt(r.ci[i])}${mark}</span>`;
        } else if (d > 0) {
          cell += `<span class="delta up">+${fmt(d)}</span>`;
        } else if (d < 0) {
          cell += `<span class="delta down">&minus;${fmt(-d)}</span>`;
        } else {
          cell += '<span class="delta flat">0.0</span>';
        }
      }
      html += `<td>${cell}</td>`;
    });
    html += '</tr>';
  });
  html += '</tbody></table>';
  target.innerHTML = html;
}

function renderModeDist(target) {
  let html = '';
  MODE_DIST.forEach(([name, d, c, p]) => {
    html += `<div class="mode-dist-row"><div class="mode-dist-label">${name}</div>`;
    html += `<div class="mode-dist-bar" role="img" aria-label="${name}: DIRECT ${d}%, CONCISE ${c}%, DEEP ${p}%">`;
    html += `<span class="d" data-w="${d}" title="DIRECT ${d}%">${d}%</span>`;
    html += `<span class="c" data-w="${c}" title="CONCISE ${c}%">${c}%</span>`;
    html += `<span class="p" data-w="${p}" title="DEEP ${p}%">${p >= 5 ? p + '%' : ''}</span>`;
    html += '</div></div>';
  });
  target.innerHTML = html;
}

function growBars(root) {
  root.querySelectorAll('.mode-dist-bar span').forEach(s => { s.style.width = s.dataset.w + '%'; });
}

function wireTabs(group, onSelect) {
  const tabs = document.querySelectorAll(`[data-tab-group="${group}"] li`);
  tabs.forEach(li => {
    li.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('is-active'));
      li.classList.add('is-active');
      onSelect(li.dataset.value);
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const burger = document.querySelector('.navbar-burger');
  if (burger) {
    burger.addEventListener('click', () => {
      burger.classList.toggle('is-active');
      document.getElementById(burger.dataset.target).classList.toggle('is-active');
    });
  }

  const navbar = document.querySelector('.navbar');
  const onScroll = () => navbar.classList.toggle('is-scrolled', window.scrollY > 8);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const state = { suite: 'image', model: 'qwen25' };
  const resultsTarget = document.getElementById('results-table');
  const draw = () => renderResults(resultsTarget, state.suite, state.model);
  wireTabs('suite', v => { state.suite = v; draw(); });
  wireTabs('model', v => { state.model = v; draw(); });
  draw();

  const qualImgs = document.querySelectorAll('[data-qual]');
  wireTabs('qual', v => {
    qualImgs.forEach(el => { el.hidden = el.dataset.qual !== v; });
  });

  const dist = document.getElementById('mode-dist');
  renderModeDist(dist);

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      if (entry.target.contains(dist)) growBars(dist);
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

  const links = document.querySelectorAll('.section-link');
  const sections = [...links].map(a => document.querySelector(a.getAttribute('href')));
  const spy = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      links.forEach(a => a.classList.toggle('is-current', a.getAttribute('href') === '#' + entry.target.id));
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  sections.forEach(s => s && spy.observe(s));

  const lightbox = document.getElementById('lightbox');
  const lightboxImg = lightbox.querySelector('img');
  document.querySelectorAll('.figure-box img').forEach(img => {
    img.addEventListener('click', () => {
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      lightbox.classList.add('is-open');
    });
  });
  lightbox.addEventListener('click', () => lightbox.classList.remove('is-open'));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') lightbox.classList.remove('is-open'); });

  const copyBtn = document.getElementById('copy-bibtex');
  copyBtn.addEventListener('click', () => {
    const text = document.getElementById('bibtex').innerText;
    navigator.clipboard.writeText(text).then(() => {
      copyBtn.querySelector('span:last-child').textContent = 'Copied';
      setTimeout(() => { copyBtn.querySelector('span:last-child').textContent = 'Copy'; }, 1500);
    });
  });
});
