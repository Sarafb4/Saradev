/**
 * Mi Portafolio · Sara Fajardo
 * Lógica principal, animaciones y comportamiento interactivo
 */

// 1. Inyección de stickers e imágenes desde el diccionario S
document.querySelectorAll('[data-s]').forEach(i => i.src = S[i.dataset.s]);

/* ====== TU CONTENIDO (edita aquí) ====== */
const SKILLS = {
  lang: ['HTML', 'CSS', 'JavaScript', 'TypeScript', 'SQL'],
  tech: ['React', 'Node.js', 'Git', 'Responsive design'],
  tools: ['VS Code', 'GitHub', 'Prompt Engineering']
};

/* Cada ventana de "Mis proyectos" es una web interactiva con video y ficha técnica */
const PROJECTS = [
  {
    name: 'Sablée Pastelería',
    number: '01',
    tag: 'E-COMMERCE & REPOSTERÍA',
    type: 'E-commerce & Repostería Gourmet',
    subtitle: 'E-Commerce & Repostería Gourmet',
    desc: 'Experiencia web de pastelería artesanal gourmet con catálogo interactivo de postres, diseño de pedidos personalizados, carrito de compras dinámico y rastreo de envíos en tiempo real.',
    tech: ['HTML5', 'CSS3', 'JavaScript', 'Responsive Design'],
    year: '2024',
    accent: '#f2a7b8',
    bgMedia: '#15080e',
    img: 'img/proyecto-sablee.jpg',
    video: 'video/proyecto-demo.mp4',
    url: 'https://sarawebdev.github.io/sablee/'
  },
  {
    name: 'Amigurumis Catálogo',
    number: '02',
    tag: 'SHOWCASE & TIENDA',
    type: 'Showcase & Tienda de Tejidos',
    subtitle: 'Showcase & Tienda de Tejidos',
    desc: 'Catálogo digital y tienda interactiva de muñecos amigurumis tejidos 100% a mano. Presenta colecciones por temporada, selector dinámico de personajes y pedidos directos vía WhatsApp.',
    tech: ['HTML5', 'CSS3', 'JavaScript', 'Responsive Design'],
    year: '2024',
    accent: '#f39c6b',
    bgMedia: '#160a08',
    img: 'img/proyecto-amigurumis.jpg',
    video: 'video/proyecto-demo.mp4',
    url: 'https://sarawebdev.github.io/amigurumis/'
  },
  {
    name: 'Avélle Beauty Store',
    number: '03',
    tag: 'E-COMMERCE & BEAUTY',
    type: 'E-commerce & Cosméticos de Lujo',
    subtitle: 'E-Commerce & Cosméticos de Lujo',
    desc: 'Boutique digital de alta cosmética y skincare para marcas exclusivas como Rhode y Huda Beauty. Incluye catálogo editorial minimalista, filtros avanzados de producto y carrito de compras chic.',
    tech: ['HTML5', 'CSS3', 'JavaScript', 'Responsive Design'],
    year: '2025',
    accent: '#e5b8d0',
    bgMedia: '#140810',
    img: 'img/proyecto-avelle.jpg',
    video: 'video/proyecto-demo.mp4',
    url: 'https://sarawebdev.github.io/avelle/'
  }
];

// Si hay portadas precargadas con data URIs (para compatibilidad offline total sin restricciones CORS), usarlas
if (typeof window !== 'undefined' && window.PROJECT_COVERS && window.PROJECT_COVERS.length) {
  PROJECTS.forEach((p, idx) => {
    if (window.PROJECT_COVERS[idx]) {
      p.img = window.PROJECT_COVERS[idx].url || p.img;
    }
  });
}
/* ======================================= */

// 2. Funciones de utilidad y preferencia de movimiento reducido
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const rm = matchMedia('(prefers-reduced-motion:reduce)').matches;

// 3. Animación de letras en títulos (data-split)
$$('[data-split]').forEach(el => {
  let o = +el.dataset.o || 0;
  [...el.dataset.split].forEach((c, i) => {
    const s = document.createElement('span');
    s.className = 'ch';
    s.style.setProperty('--i', o + i);
    s.innerHTML = c === ' ' ? '&nbsp;' : c;
    el.append(s);
  });
});

// 4. Iconos oficiales y generación dinámica de chips de habilidades
const SKILL_ICONS = {
  'HTML': '<svg viewBox="0 0 24 24"><path fill="#E34F26" d="M1.5 0h21l-1.9 21.2L12 24l-8.6-2.8L1.5 0z"/><path fill="#EF652A" d="M12 22l7.1-2.3 1.6-17.7H12V22z"/><path fill="#EBEBEB" d="M12 9.4H8.4l-.2-2.7H12V4H5.2l.8 8.1H12V9.4zm0 6.6l-.1.1-3.2-.9-.2-2.3H5.8l.4 4.5 5.8 1.6V16z"/><path fill="#FFF" d="M12 9.4v2.7h3.3l-.3 3.6-3 .8v2.8l5.8-1.6.8-8.3H12zm0-5.4v2.7h6.5l.2-2.7H12z"/></svg>',
  'CSS': '<svg viewBox="0 0 24 24"><path fill="#1572B6" d="M1.5 0h21l-1.9 21.2L12 24l-8.6-2.8L1.5 0z"/><path fill="#33A9DC" d="M12 22l7.1-2.3 1.6-17.7H12V22z"/><path fill="#EBEBEB" d="M12 4H5.2l.2 2.7H12V4zm0 5.4H8.4l-.2-2.7H5.4l.7 8.1H12v-2.7H8.8l-.2-2.7H12V9.4z"/><path fill="#FFF" d="M12 4v2.7h6.6l-.2 2.7H12v2.7h3.3l-.3 3.6-3 .8v2.8l5.8-1.6.8-8.3.2-2.7.2-2.7H12zm-3.2 12.1l-.1.1 3.3.9V22l-5.8-1.6-.4-4.5h2.8l.2 2.3z"/></svg>',
  'JavaScript': '<svg viewBox="0 0 24 24"><rect width="24" height="24" rx="4" fill="#F7DF1E"/><path fill="#000" d="M12.5 17.5c.6.9 1.4 1.5 2.6 1.5 1.1 0 1.9-.6 1.9-1.4 0-1-.8-1.4-2.1-1.9l-.7-.3c-2.1-.9-3.5-2-3.5-4.3 0-2.2 1.7-3.8 4.3-3.8 1.9 0 3.2.7 4.1 2.3l-2.1 1.3c-.5-.8-1-1.2-2-1.2-.9 0-1.5.6-1.5 1.2 0 .8.6 1.2 1.8 1.7l.7.3c2.4 1 3.9 2.1 3.9 4.5 0 2.6-2 4.1-4.7 4.1-2.6 0-4.3-1.2-5.1-2.9l2.4-1.4zm-7.6-.2c.5.8 1 1.4 2 1.4.9 0 1.5-.4 1.5-1.8V7.5h2.7v9.4c0 2.8-1.7 4.1-4.1 4.1-2.2 0-3.6-1.1-4.3-2.6l2.2-1.1z"/></svg>',
  'TypeScript': '<svg viewBox="0 0 24 24"><rect width="24" height="24" rx="4" fill="#3178C6"/><path fill="#FFF" d="M11.7 10.9v2.2H9.2v7.7H6.6v-7.7H4.1v-2.2h7.6zm1.9 6.8c.4.6 1.1 1 1.9 1 .8 0 1.3-.4 1.3-1 0-.6-.5-.9-1.5-1.3l-.6-.2c-1.6-.6-2.6-1.4-2.6-2.9 0-1.6 1.3-2.7 3.2-2.7 1.4 0 2.4.5 3 1.5l-1.5 1.1c-.4-.5-.8-.8-1.5-.8-.7 0-1.1.4-1.1.9 0 .5.4.8 1.4 1.2l.6.2c1.8.7 2.8 1.5 2.8 3.1 0 1.8-1.4 2.8-3.5 2.8-1.8 0-3-.8-3.6-1.9l1.4-1.2z"/></svg>',
  'SQL': '<svg viewBox="0 0 24 24" fill="none"><ellipse cx="12" cy="5" rx="9" ry="3" fill="#E0F2FE" stroke="#0284C7" stroke-width="2"/><path d="M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5" stroke="#0284C7" stroke-width="2"/><path d="M3 12c0 1.66 4.03 3 9 3s9-1.34 9-3" stroke="#0284C7" stroke-width="2"/></svg>',
  'Python': '<svg viewBox="0 0 24 24"><path fill="#3776AB" d="M11.9 1.5c-4.8 0-4.5 2.1-4.5 2.1l.1 2.2h4.5v.6H5.7s-3 .3-3 4.5 2.6 4.3 2.6 4.3l1.5-.1v-2.2s-.1-2.6 2.6-2.6h4.4s2.5.1 2.5-2.5V4.1s.4-2.6-4.4-2.6zm-2.4 1.4a.9.9 0 1 1 0 1.8.9.9 0 0 1 0-1.8z"/><path fill="#FFD437" d="M12.1 22.5c4.8 0 4.5-2.1 4.5-2.1l-.1-2.2h-4.5v-.6h6.3s3-.3 3-4.5-2.6-4.3-2.6-4.3l-1.5.1v2.2s.1 2.6-2.6 2.6H10.2s-2.5-.1-2.5 2.5v3.7s-.4 2.6 4.4 2.6zm2.4-1.4a.9.9 0 1 1 0-1.8.9.9 0 0 1 0 1.8z"/></svg>',
  'React': '<svg viewBox="0 0 24 24" fill="none"><ellipse cx="12" cy="12" rx="4.2" ry="10.5" stroke="#61DAFB" stroke-width="1.6" transform="rotate(30 12 12)"/><ellipse cx="12" cy="12" rx="4.2" ry="10.5" stroke="#61DAFB" stroke-width="1.6" transform="rotate(90 12 12)"/><ellipse cx="12" cy="12" rx="4.2" ry="10.5" stroke="#61DAFB" stroke-width="1.6" transform="rotate(150 12 12)"/><circle cx="12" cy="12" r="1.8" fill="#61DAFB"/></svg>',
  'Node.js': '<svg viewBox="0 0 24 24"><path fill="#539E43" d="M12 2l9.5 5.5v11L12 24l-9.5-5.5v-11L12 2zm0 2.4L4.5 8.7v8.6l7.5 4.3 7.5-4.3V8.7L12 4.4z"/><circle cx="12" cy="13" r="3.5" fill="#539E43"/></svg>',
  'Git': '<svg viewBox="0 0 24 24"><path fill="#F05032" d="M23.5 10.9L13.1.5c-.7-.7-1.8-.7-2.4 0L8.3 2.9l3.1 3.1c.8-.3 1.7-.1 2.3.5.6.6.8 1.5.5 2.3l3 3c.8-.3 1.7-.1 2.3.5.9.9.9 2.3 0 3.2-.9.9-2.3.9-3.2 0-.7-.7-.9-1.7-.5-2.5L13 9.6v6.8c.2.1.4.3.5.5.9.9.9 2.3 0 3.2-.9.9-2.3.9-3.2 0-.9-.9-.9-2.3 0-3.2.3-.3.8-.5 1.2-.5V9.3c-.5-.1-.9-.3-1.2-.6-.7-.7-.8-1.7-.5-2.5L6.9 3.2.5 9.6c-.7.7-.7 1.8 0 2.4l10.4 10.4c.7.7 1.8.7 2.4 0l10.2-10.2c.7-.6.7-1.7 0-2.3z"/></svg>',
  'Responsive design': '<svg viewBox="0 0 24 24" fill="none" stroke="#721B35" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="13" rx="2"/><path d="M8 21h8m-4-5v5"/><rect x="15" y="9" width="7" height="12" rx="1.5" fill="#fff" stroke="#721B35" stroke-width="1.8"/><circle cx="18.5" cy="18.5" r=".6" fill="#721B35"/></svg>',
  'Figma': '<svg viewBox="0 0 24 24"><path fill="#EA4C1D" d="M8 12a4 4 0 1 1 0-8h4v8H8z"/><path fill="#F24E1E" d="M12 4h4a4 4 0 1 1 0 8h-4V4z"/><path fill="#A259FF" d="M12 12h4a4 4 0 1 1-4 4v-4z"/><path fill="#1ABCFE" d="M8 12h4v4H8a4 4 0 1 1 0-4z"/><path fill="#0ACF83" d="M8 16h4v4a4 4 0 1 1-4-4z"/></svg>',
  'VS Code': '<svg viewBox="0 0 24 24"><path fill="#007ACC" d="M17.6 1.1c-.5-.3-1.1-.3-1.6 0L8.2 7.7 4.5 4.9c-.5-.4-1.2-.4-1.7 0l-1.9 1.5c-.5.4-.7 1-.4 1.6L3.4 12l-2.9 4c-.3.6-.1 1.2.4 1.6l1.9 1.5c.5.4 1.2.4 1.7 0l3.7-2.8 7.8 6.6c.5.3 1.1.3 1.6 0l5.8-3.3c.6-.3 1-.9 1-1.6V4c0-.7-.4-1.3-1-1.6l-5.8-1.3zM18 17.7l-7.2-5.7L18 6.3v11.4z"/></svg>',
  'GitHub': '<svg viewBox="0 0 24 24" fill="#181717"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>',
  'Prompt Engineering': '<svg viewBox="0 0 24 24" fill="none"><path d="M12 2L14.4 8.6L21 11L14.4 13.4L12 20L9.6 13.4L3 11L9.6 8.6L12 2Z" fill="#8B5CF6"/><path d="M19 16l1.2 3.3L23.5 20.5l-3.3 1.2L19 25l-1.2-3.3-3.3-1.2 3.3-1.2L19 16z" fill="#C084FC" transform="scale(0.7) translate(8, 2)"/><circle cx="5" cy="5" r="1.5" fill="#A855F7"/></svg>'
};

$$('[data-chips]').forEach(w => {
  SKILLS[w.dataset.chips].forEach((t, i) => {
    const c = document.createElement('span');
    c.className = 'chip';
    c.dataset.a = 'pop';
    c.setAttribute('tabindex', '0');
    c.setAttribute('role', 'img');
    c.setAttribute('aria-label', t);
    c.style.setProperty('--d', (.3 + i * .09) + 's');
    const icon = SKILL_ICONS[t];
    c.innerHTML = `
      <span class="chip-icon">${icon || ''}</span>
      <span class="chip-tooltip">${t}</span>
    `;
    w.append(c);
  });
});

// 4.1 Navegación horizontal en pista de Álbumes (Habilidades a la Izquierda | Álbumes Centro | Sobre mí a la Derecha)
const albumsTrack = $('#albumsTrack');
const secAlbumes = $('#albumes');
const secSobreMi = $('#sobre-mi');
const secHabilidades = $('#habilidades');

function centerAlbumsTrack(smooth = false) {
  if (albumsTrack && secAlbumes) {
    if (smooth) {
      albumsTrack.scrollTo({ left: secAlbumes.offsetLeft, behavior: 'smooth' });
    } else {
      albumsTrack.scrollLeft = secAlbumes.offsetLeft;
    }
  }
}

// Centrar inicialmente en Álbumes al cargar el sitio
window.addEventListener('load', () => {
  setTimeout(() => centerAlbumsTrack(false), 50);
});

// Enlaces de navegación horizontal interna: Sobre mí (derecha), Habilidades (izquierda) y retorno
$$('.album, .album-nav-link').forEach(link => {
  link.addEventListener('click', e => {
    const href = link.getAttribute('href') || '';
    if (!href.startsWith('#')) return;
    const targetId = href.replace('#', '');
    const targetEl = document.getElementById(targetId);
    if (targetEl && albumsTrack && albumsTrack.contains(targetEl)) {
      e.preventDefault();
      albumsTrack.scrollTo({
        left: targetEl.offsetLeft,
        behavior: 'smooth'
      });
    }
  });
});

// 5. Proyectos: cada ventana es una web clicable y animación de cinta horizontal
const stage = $('#stage'), pc = $('#pcard'), pw = $('#pw'), pin = $('#pin');
let pi = 0, lastW = null;

if (stage) {
  // Configuración de las ventanas flotantes con colores pastel retro
  const DEF = [
    ['pk', 230, 155],
    ['gr', 205, 140],
    ['lv', 240, 160],
    ['pk', 250, 165],
    ['gr', 215, 145],
    ['lv', 235, 155]
  ];
  const N = DEF.length;

  const wins = DEF.map(([t, baseW, baseH], i) => {
    const p = PROJECTS[i % PROJECTS.length];
    const e = document.createElement('button');
    const o = { e, baseW, baseH, hv: 0, over: false };
    e.type = 'button';
    e.className = 'w ' + t + (p && p.img ? ' has-img' : '');
    e.style.setProperty('--d', (i * .12) + 's');
    e.setAttribute('aria-label', 'Abrir ' + p.name);
    e.innerHTML = p && p.img ? `<img class="shot" src="${p.img}" alt="${p.name}">` : (t === 'pk' ? '<i></i>' : '');
    e.onclick = () => openP(i % PROJECTS.length, e);
    ['pointerenter', 'focus'].forEach(v => e.addEventListener(v, () => o.over = true));
    ['pointerleave', 'blur'].forEach(v => e.addEventListener(v, () => o.over = false));
    stage.append(e);
    return o;
  });

  // Cinta horizontal de proyectos: física, ola y movimiento continuo
  let tt = 0, u = 0, spd = 1, tIn = 0, last = 0, vis = true;
  let isDragging = false, dragStartX = 0, dragStartU = 0;

  new IntersectionObserver(es => vis = es[0].isIntersecting).observe($('#proyectos'));

  function wheel(now) {
    const dt = Math.min(.05, (now - last) / 1000) || 0;
    last = now;
    if (!vis && !rm) {
      requestAnimationFrame(wheel);
      return;
    }
    const W = stage.clientWidth || window.innerWidth;
    const H = stage.clientHeight || 340;
    const open = pw.classList.contains('open');

    spd += ((open || isDragging || wins.some(o => o.over) ? 0 : 1) - spd) * Math.min(1, dt * 5);
    if (!rm) {
      tt += dt * spd;
      u = (u + dt * spd * .038) % 1;
    }
    if (!rm && !tIn && stage.classList.contains('in')) tIn = now;

    const isMobile = window.innerWidth < 640;
    const sizeMult = isMobile ? 0.75 : 1;
    const maxW = 250 * sizeMult;
    const span = W + maxW * 2.2;

    wins.forEach((o, i) => {
      const w = o.baseW * sizeMult;
      const h = o.baseH * sizeMult;

      // Desplazamiento horizontal continuo en bucle
      const prog = (((i / N + u) % 1) + 1) % 1;
      const x = prog * span - maxW;

      // Curva ondulante (ola senoidal continua + oscilación orgánica)
      const normX = (x + maxW) / span;
      const waveAmp = Math.min(46, H * 0.17);
      const baseY = (H * 0.46) + Math.sin(normX * Math.PI * 2) * waveAmp;
      const ph = i * 1.8;
      const swayY = Math.sin(tt * 0.9 + ph) * (isMobile ? 6 : 12);
      const y = baseY + swayY - (h / 2);

      // Inclinación suave tangente a la ola
      const waveAngle = Math.cos(normX * Math.PI * 2) * 7;
      const swayAngle = Math.sin(tt * 0.65 + ph * 1.2) * 4.5;
      const rot = waveAngle + swayAngle;

      o.hv += ((o.over ? 1 : 0) - o.hv) * Math.min(1, dt * 10);
      const s = o.e.style;
      s.width = w + 'px';
      s.height = h + 'px';
      s.translate = `${x}px ${y}px`;
      s.scale = 1 + .08 * o.hv;
      s.rotate = rot + 'deg';
      s.zIndex = 10 + Math.round((y / H) * 20) + (o.over ? 60 : 0);
    });

    if (!rm) requestAnimationFrame(wheel);
  }

  // Soporte para arrastre táctil / ratón sobre la cinta horizontal
  stage.addEventListener('pointerdown', e => {
    if (e.target.closest('.w')) return; // Permite clic directo en tarjetas
    isDragging = true;
    dragStartX = e.clientX;
    dragStartU = u;
    stage.setPointerCapture(e.pointerId);
  });

  stage.addEventListener('pointermove', e => {
    if (!isDragging) return;
    const dx = e.clientX - dragStartX;
    const W = stage.clientWidth || 800;
    u = (dragStartU + dx / (W * 1.4)) % 1;
  });

  const stopDrag = () => isDragging = false;
  stage.addEventListener('pointerup', stopDrag);
  stage.addEventListener('pointercancel', stopDrag);

  rm ? (wheel(0), addEventListener('resize', () => wheel(0))) : requestAnimationFrame(wheel);
}

// 6. Vista Editorial de Proyecto a Pantalla Completa (Clip-Path Iris)
function renderP(anim) {
  const p = PROJECTS[pi];
  if (!p) return;

  // Actualizar variables de acento y fondo en la vista
  if (pw) {
    pw.style.setProperty('--p-accent', p.accent || '#f2a7b8');
    pw.style.setProperty('--p-bg-media', p.bgMedia || '#140810');
  }

  // 1. Renderizar Columna Izquierda: Video o Imagen sin marcos ni textos encima
  const mediaInner = $('#pviewMediaInner');
  const playerBar = $('#pviewPlayerBar');
  const hasVideo = Boolean(p.video);

  if (mediaInner) {
    if (hasVideo) {
      mediaInner.innerHTML = `
        <video class="pview-video" id="pviewVideo" src="${p.video}" poster="${p.img || ''}" autoplay loop muted playsinline webkit-playsinline="true" preload="auto"></video>
      `;
      if (playerBar) playerBar.style.display = 'flex';
      setupVideoControls();
      const vidEl = mediaInner.querySelector('video');
      if (vidEl) {
        vidEl.play().catch(() => {});
      }
    } else {
      mediaInner.innerHTML = `
        <img class="pview-img" src="${p.img}" alt="${p.name}">
      `;
      if (playerBar) playerBar.style.display = 'none';
    }
  }

  // 2. Renderizar Columna Derecha: Información Editorial
  const infoContent = $('#pviewInfoContent');
  if (infoContent) {
    const prevIdx = (pi + PROJECTS.length - 1) % PROJECTS.length;
    const nextIdx = (pi + 1) % PROJECTS.length;
    const prevP = PROJECTS[prevIdx];
    const nextP = PROJECTS[nextIdx];
    const totalCount = String(PROJECTS.length).padStart(2, '0');
    const currentNum = String(pi + 1).padStart(2, '0');

    infoContent.className = 'pview-info-content' + (anim ? ' pview-content-swapping' : '');
    infoContent.innerHTML = `
      <div class="pview-index">PROYECTO ${currentNum} / ${totalCount}</div>
      <div class="pview-title-wrap">
        <span class="pview-num-ghost" aria-hidden="true">${currentNum}</span>
        <h2 class="pview-title">${p.name}</h2>
      </div>
      <p class="pview-desc">${p.desc || p.subtitle || ''}</p>
      <div class="pview-specs">
        <div class="pview-spec-row">
          <span class="pview-spec-label">Tipo</span>
          <span class="pview-spec-value">${p.type || p.tag || 'Desarrollo Web'}</span>
        </div>
        <div class="pview-spec-row">
          <span class="pview-spec-label">Stack</span>
          <span class="pview-spec-value">${Array.isArray(p.tech) ? p.tech.join(' · ') : p.tech}</span>
        </div>
        <div class="pview-spec-row">
          <span class="pview-spec-label">Año</span>
          <span class="pview-spec-value">${p.year || '2024'}</span>
        </div>
      </div>
      ${p.url ? `
        <a href="${p.url}" target="_blank" rel="noopener" class="pview-live-link">
          <span>Ver web en vivo</span>
          <span class="pview-arrow">↗</span>
        </a>
      ` : ''}
      <div class="pview-nav">
        <button type="button" class="pview-nav-btn prev" id="pviewPrevBtn" aria-label="Ir a ${prevP.name}">
          <span class="pview-nav-arrow">←</span>
          <span class="pview-nav-meta">
            <span class="pview-nav-kicker">Proyecto anterior</span>
            <span class="pview-nav-name">${prevP.name}</span>
          </span>
        </button>
        <button type="button" class="pview-nav-btn next" id="pviewNextBtn" aria-label="Ir a ${nextP.name}">
          <span class="pview-nav-meta">
            <span class="pview-nav-kicker">Proyecto siguiente</span>
            <span class="pview-nav-name">${nextP.name}</span>
          </span>
          <span class="pview-nav-arrow">→</span>
        </button>
      </div>
    `;

    // Conectar botones de navegación anterior y siguiente
    const prevBtn = $('#pviewPrevBtn');
    const nextBtn = $('#pviewNextBtn');
    if (prevBtn) prevBtn.onclick = () => {
      pi = prevIdx;
      renderP(true);
    };
    if (nextBtn) nextBtn.onclick = () => {
      pi = nextIdx;
      renderP(true);
    };
  }
}

// Configuración de controles propios de video (mínimos, sin controles nativos)
function setupVideoControls() {
  const video = $('#pviewVideo');
  const playPauseBtn = $('#pviewPlayPause');
  const muteBtn = $('#pviewMute');
  const track = $('#pviewProgressTrack');
  const fill = $('#pviewProgressFill');
  if (!video) return;

  const updatePlayPauseIcon = () => {
    if (!playPauseBtn) return;
    if (video.paused) {
      playPauseBtn.classList.add('is-paused');
      playPauseBtn.classList.remove('is-playing');
    } else {
      playPauseBtn.classList.add('is-playing');
      playPauseBtn.classList.remove('is-paused');
    }
  };

  const updateMuteIcon = () => {
    if (!muteBtn) return;
    if (video.muted) {
      muteBtn.classList.add('is-muted');
      muteBtn.classList.remove('is-audible');
    } else {
      muteBtn.classList.add('is-audible');
      muteBtn.classList.remove('is-muted');
    }
  };

  updatePlayPauseIcon();
  updateMuteIcon();

  if (playPauseBtn) {
    playPauseBtn.onclick = () => {
      if (video.paused) {
        video.play().catch(() => {});
      } else {
        video.pause();
      }
      updatePlayPauseIcon();
    };
  }

  if (muteBtn) {
    muteBtn.onclick = () => {
      video.muted = !video.muted;
      updateMuteIcon();
    };
  }

  video.addEventListener('play', updatePlayPauseIcon);
  video.addEventListener('pause', updatePlayPauseIcon);

  video.addEventListener('timeupdate', () => {
    if (video.duration && fill) {
      const pct = (video.currentTime / video.duration) * 100;
      fill.style.width = pct + '%';
      if (track) track.setAttribute('aria-valuenow', Math.round(pct));
    }
  });

  if (track) {
    track.onclick = (e) => {
      const rect = track.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const pct = Math.max(0, Math.min(1, clickX / rect.width));
      if (video.duration) {
        video.currentTime = pct * video.duration;
      }
    };
  }
}

function openP(i, el) {
  pi = (i + PROJECTS.length) % PROJECTS.length;
  lastW = el;
  renderP(false);
  if (pw) {
    pw.classList.add('open');
  }
  document.body.classList.add('lock');

  // Accesibilidad: mover el foco al botón de cerrar al abrir
  setTimeout(() => {
    const closeBtn = $('#pviewClose');
    if (closeBtn) closeBtn.focus();
  }, 250);
}

window.openProjectModal = openP;

function closeP() {
  const video = $('#pviewVideo');
  if (video) {
    try { video.pause(); } catch (_) {}
  }
  if (pw) {
    pw.classList.remove('open');
  }
  document.body.classList.remove('lock');
  if (lastW && typeof lastW.focus === 'function') {
    try { lastW.focus(); } catch (_) {}
  }
}

if (pw) {
  const closeBtn = $('#pviewClose');
  if (closeBtn) closeBtn.onclick = closeP;

  addEventListener('keydown', e => {
    if (!pw.classList.contains('open')) return;
    if (e.key === 'Escape') {
      closeP();
    } else if (e.key === 'ArrowLeft') {
      pi = (pi + PROJECTS.length - 1) % PROJECTS.length;
      renderP(true);
    } else if (e.key === 'ArrowRight') {
      pi = (pi + 1) % PROJECTS.length;
      renderP(true);
    }
  });

  // Soporte para abrir modal directamente por parámetro de URL (?modal=0, ?modal=1, ?modal=2)
  try {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('modal')) {
      const mIdx = parseInt(urlParams.get('modal'), 10);
      if (!isNaN(mIdx) && mIdx >= 0 && mIdx < PROJECTS.length) {
        setTimeout(() => openP(mIdx), 350);
      }
    }
  } catch (_) {}

  if (!rm) {
    setInterval(() => {
      if (pw.classList.contains('open')) return;
      const ws = $$('.stage .w');
      if (!ws.length) return;
      const w = ws[Math.floor(Math.random() * ws.length)];
      if (w) {
        w.classList.add('ping');
        setTimeout(() => w.classList.remove('ping'), 900);
      }
    }, 2600);
  }
}

// 7. Pantalla de carga pixelada (Boot Screen)
const boot = $('#boot'), px = $('#px'), body = document.body;
function start() {
  body.classList.remove('boot');
  body.classList.add('ready');
  const dock = $('#dock');
  if (dock) dock.classList.add('show');
}

if (!boot || !px) {
  start();
} else if (rm) {
  boot.remove();
  start();
} else {
  const cols = innerWidth < 700 ? 8 : 16, rows = Math.ceil(cols * innerHeight / innerWidth);
  px.style.setProperty('--c', cols);
  px.style.setProperty('--r', rows);
  const pinkTiles = [];
  for (let i = 0; i < cols * rows; i++) {
    const e = document.createElement('i');
    const cx = (i % cols) / (cols - 1) - .5, cy = Math.floor(i / cols) / Math.max(1, rows - 1) - .5;
    e.style.setProperty('--d', (Math.hypot(cx, cy) * .9 + Math.random() * .3).toFixed(2) + 's');
    if (Math.random() < .16) {
      pinkTiles.push({ el: e, threshold: Math.floor(Math.random() * 92) + 5, on: false });
    }
    px.append(e);
  }
  const brandChars = $$('#bootBrand .b-ch'), bi = $('#bi');
  const thresholds = [10, 24, 38, 52, 66, 80, 95];
  let shown = 0, ok = false;
  const t0 = performance.now();

  Promise.all([
    document.fonts ? document.fonts.ready : 0,
    new Promise(r => document.readyState === 'complete' ? r() : addEventListener('load', r, { once: true })),
    new Promise(r => setTimeout(r, 2200))
  ]).then(() => ok = true);
  setTimeout(() => ok = true, 6000);

  (function frame(now) {
    const t = (now - t0) / 1000, target = ok ? 100 : Math.min(88, t / 2.2 * 88);
    shown += (target - shown) * .1;
    if (ok && shown > 99.3) shown = 100;

    // Revelar letras de 'saradev' poco a poco conforme sube la carga
    brandChars.forEach((ch, idx) => {
      if (shown >= thresholds[idx]) {
        ch.classList.add('on');
      } else {
        ch.classList.remove('on');
      }
    });

    if (bi) bi.style.width = shown + '%';

    // Cuadritos vinotinto van apareciendo progresivamente conforme sube el número de carga
    pinkTiles.forEach(tile => {
      if (!tile.on && shown >= tile.threshold) {
        tile.on = true;
        tile.el.classList.add('k');
      }
    });

    if (shown < 100) return requestAnimationFrame(frame);

    setTimeout(() => {
      boot.classList.add('out');
      setTimeout(() => {
        boot.classList.add('done');
        body.classList.remove('boot');
        setTimeout(start, 450);
        setTimeout(() => boot.remove(), 2400);
      }, 400);
    }, 300);
  })(t0);
}

// 8. Animación Reveal al hacer scroll (Intersection Observer optimizado)
const io = new IntersectionObserver(es => {
  es.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
$$('[data-r],[data-a],.fan-card,.workflow-gear-float,.group,.album,#stage,#contacto').forEach(e => io.observe(e));

// 9. Sticker interactivo del hero (si existe en el DOM)
const heroSt = $('#heroSt');
if (heroSt) {
  const faces = ['peace', 'wave', 'love', 'shock', 'tongue', 'smile', 'think', 'wink'];
  let fi = 0;
  heroSt.onclick = () => {
    fi = (fi + 1) % faces.length;
    const im = $('img', heroSt);
    im.src = S[faces[fi]];
    heroSt.classList.remove('swap');
    void heroSt.offsetWidth;
    heroSt.classList.add('swap');
  };
}

// 10. Efecto Parallax en el Hero
const hero = $('#inicio');
if (hero) {
  hero.addEventListener('pointermove', e => {
    if (rm) return;
    const x = (e.clientX / innerWidth - .5), y = (e.clientY / innerHeight - .5);
    const target = $('.hero-brand') || $('.title');
    if (target) target.style.translate = `${x * -14}px ${y * -10}px`;
  });
}

// 11. Rotación de engranajes con scroll y navegación del dock activo (Compatible con Card Stacking)
const links = $$('.dock a');
addEventListener('scroll', () => {
  document.documentElement.style.setProperty('--sy', scrollY);
}, { passive: true });

// Función para obtener la posición exacta de scroll vertical de cada sección (Card Stacking Universal)
function getSectionScrollTop(targetId) {
  if (targetId === 'inicio') return 0;
  
  const sections = [
    { ids: ['inicio'], el: document.getElementById('inicio') },
    { ids: ['albumes', 'sobre-mi', 'habilidades'], el: document.getElementById('albumsTrack') },
    { ids: ['proyectos'], el: document.getElementById('proyectos') },
    { ids: ['como-trabajo'], el: document.getElementById('como-trabajo') },
    { ids: ['contacto'], el: document.getElementById('contacto') }
  ];

  let accumulatedTop = 0;
  for (const sec of sections) {
    if (sec.ids.includes(targetId)) {
      return accumulatedTop;
    }
    if (sec.el) {
      accumulatedTop += sec.el.offsetHeight;
    }
  }

  const targetEl = document.getElementById(targetId);
  return targetEl ? targetEl.offsetTop : 0;
}

// Desplazamiento suave universal para todos los enlaces del Dock
links.forEach(link => {
  link.addEventListener('click', e => {
    const href = link.getAttribute('href') || '';
    if (!href.startsWith('#')) return;
    const targetId = href.replace('#', '');
    const targetEl = document.getElementById(targetId);
    if (!targetEl && targetId !== 'inicio') return;

    e.preventDefault();

    const targetTop = getSectionScrollTop(targetId);
    if (targetTop !== null) {
      window.scrollTo({
        top: targetTop,
        behavior: 'smooth'
      });
    }

    const track = document.getElementById('albumsTrack');
    if (track && (targetId === 'albumes' || targetId === 'sobre-mi' || targetId === 'habilidades' || (targetEl && track.contains(targetEl)))) {
      const slide = (targetId === 'sobre-mi' || targetId === 'habilidades') ? targetEl : (document.getElementById('albumes') || targetEl);
      if (slide) {
        track.scrollTo({
          left: slide.offsetLeft,
          behavior: 'smooth'
        });
      }
    }

    if (history.pushState) {
      history.pushState(null, null, '#' + targetId);
    }
  });
});

// Resaltado dinámico del icono activo en el Dock según la sección visible (Card Stacking)
function updateActiveDock() {
  const currentScroll = window.scrollY;
  const vh = window.innerHeight;
  const sections = [
    { id: 'inicio', el: document.getElementById('inicio') },
    { id: 'albumes', el: document.getElementById('albumsTrack') },
    { id: 'proyectos', el: document.getElementById('proyectos') },
    { id: 'como-trabajo', el: document.getElementById('como-trabajo') },
    { id: 'contacto', el: document.getElementById('contacto') }
  ];

  let accumulated = 0;
  const sectionPositions = [];
  sections.forEach(sec => {
    sectionPositions.push({ id: sec.id, top: accumulated });
    if (sec.el) accumulated += sec.el.offsetHeight;
  });

  let currentId = 'inicio';
  for (let i = sectionPositions.length - 1; i >= 0; i--) {
    if (currentScroll >= sectionPositions[i].top - vh * 0.35) {
      currentId = sectionPositions[i].id;
      break;
    }
  }

  links.forEach(a => {
    const secList = (a.dataset.sec || a.getAttribute('href')?.replace('#', '') || '').split(' ');
    a.classList.toggle('on', secList.includes(currentId));
  });
}

window.addEventListener('scroll', updateActiveDock, { passive: true });
updateActiveDock();

// 12. Efecto de onda (Ripple) en botones y botón de copiar contacto
function toast(m) {
  const t = $('#toast');
  t.textContent = m;
  t.classList.add('on');
  clearTimeout(toast.t);
  toast.t = setTimeout(() => t.classList.remove('on'), 2000);
}

$$('.btn').forEach(b => {
  b.addEventListener('pointerdown', e => {
    const r = b.getBoundingClientRect(), s = Math.max(r.width, r.height);
    const d = document.createElement('span');
    d.className = 'rip';
    d.style.cssText = `width:${s}px;height:${s}px;left:${e.clientX - r.left - s / 2}px;top:${e.clientY - r.top - s / 2}px`;
    b.append(d);
    setTimeout(() => d.remove(), 700);
  });
});

const copyBtn = $('#copy');
if (copyBtn) {
  copyBtn.onclick = async e => {
    try {
      await navigator.clipboard.writeText(e.currentTarget.dataset.copy);
      toast('Usuario copiado');
    } catch (_) {
      toast('@Sarawebdev');
    }
  };
}

// 13. Inclinación 3D (Tilt) suave en tarjetas al mover el mouse
$$('.album,.panel,.bubble').forEach(c => {
  if (rm) return;
  c.addEventListener('pointermove', e => {
    if (e.pointerType !== 'mouse') return;
    const r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
    if (c.matches('.album')) return;
    c.style.transform = `perspective(900px) rotateY(${x * 4}deg) rotateX(${-y * 4}deg)`;
  });
  c.addEventListener('pointerleave', () => {
    if (!c.matches('.album')) c.style.transform = '';
  });
});

// 14. Dock Magnético Estilo macOS (Efecto Mac fluido con onda armónica)
const dockEl = $('#dock');
if (dockEl) {
  const dockLinks = Array.from(dockEl.querySelectorAll('a'));
  const MAG_RADIUS = 120; // Radio de influencia magnética en px
  const MAX_SCALE = 1.6;  // Agrandamiento máximo del icono apuntado
  const MAX_LIFT = 16;    // Elevación suave hacia arriba en px

  dockEl.addEventListener('pointermove', e => {
    const mouseX = e.clientX;
    dockLinks.forEach(link => {
      const rect = link.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const dist = Math.abs(mouseX - centerX);

      if (dist < MAG_RADIUS) {
        // Curva coseno de caída suave
        const factor = Math.cos((dist / MAG_RADIUS) * (Math.PI / 2));
        const scale = 1 + (MAX_SCALE - 1) * factor;
        const lift = -MAX_LIFT * factor;
        link.style.transform = `translate3d(0, ${lift}px, 0) scale(${scale.toFixed(3)})`;
      } else {
        link.style.transform = 'translate3d(0, 0, 0) scale(1)';
      }
    });
  });

  dockEl.addEventListener('pointerleave', () => {
    dockLinks.forEach(link => {
      link.style.transform = '';
    });
  });
}

// 15. Ventanas Interactivas Arrastrables (Draggable OS Windows)
function makeDraggable(el, handleSelector) {
  if (!el) return;
  const handle = handleSelector ? (el.querySelector(handleSelector) || el) : el;
  let isDragging = false;
  let startX = 0, startY = 0;
  let currentX = 0, currentY = 0;
  let dragDist = 0;

  handle.style.cursor = 'grab';
  handle.style.userSelect = 'none';

  handle.addEventListener('pointerdown', e => {
    if (e.button !== 0) return; // Sólo botón primario
    if (e.target.closest('button, a, input')) return;
    isDragging = true;
    dragDist = 0;
    startX = e.clientX - currentX;
    startY = e.clientY - currentY;
    handle.style.cursor = 'grabbing';
    el.classList.add('is-dragging');
    try { handle.setPointerCapture(e.pointerId); } catch (_) { }
  });

  window.addEventListener('pointermove', e => {
    if (!isDragging) return;
    dragDist += Math.abs(e.movementX || 0) + Math.abs(e.movementY || 0);
    currentX = e.clientX - startX;
    currentY = e.clientY - startY;
    el.style.translate = `${currentX}px ${currentY}px`;
  });

  const endDrag = e => {
    if (!isDragging) return;
    isDragging = false;
    handle.style.cursor = 'grab';
    el.classList.remove('is-dragging');
    if (dragDist > 6) {
      el.classList.add('was-dragged');
      setTimeout(() => el.classList.remove('was-dragged'), 120);
    }
    try { handle.releasePointerCapture(e.pointerId); } catch (_) { }
  };

  window.addEventListener('pointerup', endDrag);
  window.addEventListener('pointercancel', endDrag);

  // Doble clic para devolver a la posición original suavemente
  handle.addEventListener('dblclick', () => {
    currentX = 0;
    currentY = 0;
    el.style.transition = 'translate 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.15)';
    el.style.translate = '0px 0px';
    setTimeout(() => { el.style.transition = ''; }, 420);
  });
}

// Inicializar elementos arrastrables
const bubbleCard = $('.bubble');
if (bubbleCard) makeDraggable(bubbleCard);

const polaroidCard = $('.polaroid');
if (polaroidCard) makeDraggable(polaroidCard);

const panelSkills = $('.panel');
if (panelSkills) makeDraggable(panelSkills);

// 16. Cursor Personalizado Elegante
const cursorDot = $('#cursorDot');
const cursorRing = $('#cursorRing');

if (cursorDot && cursorRing && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
  let mouseX = -100, mouseY = -100;
  let ringX = -100, ringY = -100;

  window.addEventListener('pointermove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
    document.body.classList.remove('cursor-hidden');
  });

  window.addEventListener('pointerdown', () => cursorRing.classList.add('cursor-grabbing'));
  window.addEventListener('pointerup', () => cursorRing.classList.remove('cursor-grabbing'));

  document.addEventListener('mouseleave', () => document.body.classList.add('cursor-hidden'));
  document.addEventListener('mouseenter', () => document.body.classList.remove('cursor-hidden'));

  const interactiveSelector = 'a, button, input, [role="button"], .album, .chip, canvas, .tl-dot, .x, .polaroid, .bubble, .panel, .mac-widget-bar, .vinyl-disc, .hero-scroll-hint, .hero-status-pill';
  document.addEventListener('pointerover', e => {
    if (e.target.closest(interactiveSelector)) {
      cursorRing.classList.add('cursor-hover');
    }
  });
  document.addEventListener('pointerout', e => {
    if (e.target.closest(interactiveSelector)) {
      cursorRing.classList.remove('cursor-hover');
    }
  });

  function updateCursor() {
    ringX += (mouseX - ringX) * 0.18;
    ringY += (mouseY - ringY) * 0.18;
    cursorRing.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
    requestAnimationFrame(updateCursor);
  }
  requestAnimationFrame(updateCursor);
}

// 17. Fondo de Luz Reactivo al Mouse en el Hero (Glow Interactivo Sutil)
const heroSection = $('#inicio');
if (heroSection) {
  let targetX = innerWidth / 2, targetY = innerHeight / 2;
  let currX = targetX, currY = targetY;
  let hasMoved = false;

  window.addEventListener('pointermove', e => {
    const rect = heroSection.getBoundingClientRect();
    if (e.clientY >= rect.top && e.clientY <= rect.bottom) {
      targetX = e.clientX - rect.left;
      targetY = e.clientY - rect.top;
      if (!hasMoved) {
        heroSection.classList.add('has-glow');
        hasMoved = true;
      }
    }
  });

  (function renderGlow() {
    currX += (targetX - currX) * 0.08;
    currY += (targetY - currY) * 0.08;
    heroSection.style.setProperty('--gx', `${currX.toFixed(1)}px`);
    heroSection.style.setProperty('--gy', `${currY.toFixed(1)}px`);
    requestAnimationFrame(renderGlow);
  })();
}

// 18. Tipografía Cinética Interactiva: letras reactivas al cursor
const kChars = $$('.k-char');
if (kChars.length) {
  kChars.forEach(ch => {
    ch.addEventListener('pointerenter', () => {
      const randRot = (Math.random() * 8 - 4).toFixed(1);
      ch.style.transform = `translateY(-14px) rotate(${randRot}deg) scale(1.1)`;
    });
    ch.addEventListener('pointerleave', () => {
      ch.style.transform = '';
    });
  });
}





// 15. Concave Carousel Engine (React Bits Pro Pattern)
// Galería inmersiva que se curva cóncavamente alrededor del espectador con reflejos en el suelo
function setupConcaveCarousel() {
  const section = document.getElementById('proyectos');
  const viewport = document.getElementById('concaveViewport');
  const track = document.getElementById('concaveTrack');
  if (!section || !viewport || !track) return;

  const cards = Array.from(track.querySelectorAll('.concave-card'));
  const prevBtn = document.getElementById('concavePrevBtn');
  const nextBtn = document.getElementById('concaveNextBtn');

  const N = cards.length || 6;
  let stepAngle = 18; // Grados calibrados para que se vean 5 tarjetas cóncavas en pantalla (igual a la foto de referencia)

  let currentAngle = 0;
  let targetAngle = 0;
  let velocity = 0;
  let isDragging = false;
  let dragStartX = 0;
  let lastX = 0;
  let lastTime = 0;
  let dragDist = 0;
  let activeProjIdx = -1;
  let activeSlot = 0;
  let isHovered = false;
  let isCullingVisible = true;
  let radius = 1100; // Radio del cilindro cóncavo

  // Viewport visibility culling (60fps)
  const observer = new IntersectionObserver((entries) => {
    isCullingVisible = entries[0].isIntersecting;
  }, { threshold: 0.05 });
  observer.observe(section);

  function updateRadius() {
    const cardEl = cards[0];
    const cardW = cardEl ? (cardEl.offsetWidth || 340) : 340;
    const gap = window.innerWidth < 640 ? 12 : 20;
    const stride = cardW + gap;
    // Calibrar stepAngle según el ancho de la tarjeta para encaje perfecto
    stepAngle = window.innerWidth < 640 ? 22 : 18;
    const rad = stepAngle * (Math.PI / 180);
    radius = Math.round(stride / Math.sin(rad));
  }

  window.addEventListener('resize', updateRadius);
  updateRadius();

  // Actualizar metadatos del proyecto activo
  function updateActiveMeta(projIdx) {
    if (activeProjIdx === projIdx) return;
    activeProjIdx = projIdx;
  }

  // Bucle de renderizado 60fps
  function render() {
    requestAnimationFrame(render);
    if (!isCullingVisible && !isDragging) return;

    // Física de arrastre, inercia y Magnetic Snap
    if (isDragging) {
      // Direct drag
    } else {
      // Inercia con fricción suave
      if (Math.abs(velocity) > 0.04) {
        currentAngle += velocity;
        velocity *= 0.92;
        targetAngle = Math.round(currentAngle / stepAngle) * stepAngle;
      } else {
        velocity = 0;
        // Magnetic Snap ("clicks into place" exacto al centro)
        const snapDiff = targetAngle - currentAngle;
        if (Math.abs(snapDiff) > 0.03) {
          currentAngle += snapDiff * 0.12;
        } else {
          currentAngle = targetAngle;

          // Auto-drift suave estilo exposición cuando no se interactúa
          if (!isHovered && !rm) {
            targetAngle -= 0.03;
            currentAngle -= 0.03;
          }
        }
      }
    }

    // Calcular posición cóncava de cada tarjeta
    // En una superficie cóncava, las tarjetas laterales se curvan HACIA el espectador (Z > 0)
    // y giran mirando hacia el centro (-theta)
    const cycle = N * stepAngle;
    const normalizedAngle = ((-currentAngle % cycle) + cycle) % cycle;
    let closestSlot = Math.round(normalizedAngle / stepAngle) % N;
    activeSlot = closestSlot;
    const projIdx = closestSlot % 3;
    updateActiveMeta(projIdx);

    cards.forEach((card, i) => {
      // Distancia angular de la tarjeta i respecto al centro de visión
      let diffDeg = (i * stepAngle + currentAngle);
      diffDeg = ((diffDeg % cycle) + cycle) % cycle;
      if (diffDeg > cycle / 2) diffDeg -= cycle;

      const diffRad = diffDeg * (Math.PI / 180);

      // Posicionamiento cóncavo 3D:
      // X = R * sin(diffRad)
      // Z = R * (1 - cos(diffRad)) * 0.55 (curvatura cóncava envolvente hacia el espectador)
      const x = Math.sin(diffRad) * radius;
      const z = (1 - Math.cos(diffRad)) * (radius * 0.52);

      // Rotación angular hacia el centro (cóncava: el borde exterior mira hacia adentro)
      const rotY = -diffDeg * 0.95;

      // Escala con ligera atenuación de distancia
      const distRatio = Math.abs(diffDeg) / 90;
      const scale = Math.max(0.78, 1 - distRatio * 0.15);

      // Opacidad y centro
      const isCenter = Math.abs(diffDeg) < (stepAngle * 0.45);
      card.classList.toggle('is-center', isCenter);

      const opacity = Math.max(0.35, Math.cos(Math.min(Math.PI * 0.48, Math.abs(diffRad) * 0.95)));
      card.style.opacity = opacity.toFixed(2);

      // Aplicar transformación 3D cóncava
      card.style.transform = `translate3d(${x.toFixed(1)}px, 0, ${z.toFixed(1)}px) rotateY(${rotY.toFixed(1)}deg) scale(${scale.toFixed(3)})`;
      card.style.zIndex = Math.round(100 - Math.abs(diffDeg));
    });
  }

  requestAnimationFrame(render);

  // Control de apertura de modal seguro
  let lastModalOpenTime = 0;
  function triggerProjectModal(proj, cardEl) {
    const now = performance.now();
    if (now - lastModalOpenTime < 450) return;
    lastModalOpenTime = now;
    openProjectModal(proj, cardEl);
  }

  let downCard = null;
  let startPointerX = 0;
  let startPointerY = 0;
  let hasPointerCaptured = false;

  // Arrastre e interacción táctil / mouse
  viewport.addEventListener('pointerdown', (e) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    downCard = e.target.closest('.concave-card');
    isDragging = true;
    hasPointerCaptured = false;
    dragDist = 0;
    startPointerX = e.clientX;
    startPointerY = e.clientY;
    lastX = e.clientX;
    lastTime = performance.now();
    velocity = 0;
  });

  window.addEventListener('pointermove', (e) => {
    if (!isDragging) return;
    const now = performance.now();
    const dt = Math.max(8, now - lastTime);
    const dx = e.clientX - lastX;
    const totalDist = Math.hypot(e.clientX - startPointerX, e.clientY - startPointerY);
    dragDist = totalDist;

    // Solo iniciar arrastre del carrusel si el movimiento supera 6px
    if (totalDist > 6) {
      if (!hasPointerCaptured) {
        hasPointerCaptured = true;
        viewport.classList.add('is-dragging');
        try { viewport.setPointerCapture(e.pointerId); } catch (_) {}
      }

      // Sensibilidad al arrastre cóncavo
      const angleDelta = dx * 0.18;
      currentAngle += angleDelta;
      velocity = (angleDelta / dt) * 16;
    }

    lastX = e.clientX;
    lastTime = now;
  });

  const onPointerEnd = (e) => {
    if (!isDragging) return;
    isDragging = false;
    viewport.classList.remove('is-dragging');
    if (hasPointerCaptured) {
      try { viewport.releasePointerCapture(e.pointerId); } catch (_) {}
      hasPointerCaptured = false;
    }

    const totalDist = Math.hypot(e.clientX - startPointerX, e.clientY - startPointerY);

    // Si fue un clic o toque con poco movimiento (< 8px), abrir la ventana de inmediato
    if (totalDist < 8) {
      velocity = 0;
      const targetCard = downCard || e.target.closest('.concave-card') || document.elementFromPoint(e.clientX, e.clientY)?.closest('.concave-card');
      if (targetCard) {
        const slot = parseInt(targetCard.dataset.slot, 10);
        const proj = parseInt(targetCard.dataset.proj, 10);

        // Centrar suavemente la tarjeta seleccionada
        const cycle = N * stepAngle;
        let diff = -slot * stepAngle - currentAngle;
        diff = ((diff % cycle) + cycle) % cycle;
        if (diff > cycle / 2) diff -= cycle;
        targetAngle = currentAngle + diff;

        // Abrir la ventana modal con video, web y detalles
        triggerProjectModal(proj, targetCard);
      }
      return;
    }

    targetAngle = Math.round((currentAngle + velocity * 10) / stepAngle) * stepAngle;
  };

  window.addEventListener('pointerup', onPointerEnd);
  window.addEventListener('pointercancel', onPointerEnd);

  // Escucha de clic nativo en tarjetas (soporte universal teclado y ratón)
  cards.forEach(card => {
    card.addEventListener('click', (e) => {
      if (dragDist > 8) return;
      const slot = parseInt(card.dataset.slot, 10);
      const proj = parseInt(card.dataset.proj, 10);

      // Centrar el slot seleccionado en el carrusel
      const cycle = N * stepAngle;
      let diff = -slot * stepAngle - currentAngle;
      diff = ((diff % cycle) + cycle) % cycle;
      if (diff > cycle / 2) diff -= cycle;
      targetAngle = currentAngle + diff;

      // Abrir inmediatamente la ventana con video, detalles y enlace a la web
      triggerProjectModal(proj, card);
    });

    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const slot = parseInt(card.dataset.slot, 10);
        const proj = parseInt(card.dataset.proj, 10);
        triggerProjectModal(proj, card);
      }
    });
  });

  // Flechas de navegación
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      targetAngle += stepAngle;
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      targetAngle -= stepAngle;
    });
  }

  // Pausar drift en hover
  viewport.addEventListener('pointerenter', () => { isHovered = true; });
  viewport.addEventListener('pointerleave', () => { isHovered = false; });
}

// Inicializar Concave Carousel
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', setupConcaveCarousel);
} else {
  setupConcaveCarousel();
}

// 16. Proceso / Cómo trabajo (Acordeón editorial con barras de progreso y preview animado)
function setupWorkflowAccordion() {
  const list = document.getElementById("list");
  const grid = document.getElementById("grid");
  const vs = [...document.querySelectorAll("#como-trabajo .v")];
  if (!list || !grid) return;

  const steps = [
    { t: "Descubrimiento", g: "Conversación", p: "Nos sentamos a entender tu negocio, tu público y lo que quieres lograr. Defino el alcance, los tiempos y qué debe hacer la página para que funcione.", tags: ["Briefing", "Objetivos", "Referencias", "Alcance"] },
    { t: "Diseño", g: "Propuesta", p: "Dibujo la estructura y el diseño visual con tu paleta y tu voz. Ves cómo se verá la página antes de que se escriba una sola línea de código.", tags: ["Wireframes", "Sistema visual", "Prototipo", "Ajustes"] },
    { t: "Desarrollo", g: "Construcción", p: "Convierto el diseño en una página real, rápida y responsiva, con interacción y animación donde aporten algo, no por decorar.", tags: ["HTML y CSS", "JavaScript", "Three.js / WebGL", "Responsive"] },
    { t: "Optimización & Lanzamiento", g: "Entrega", p: "Pruebas minuciosas en múltiples navegadores y dispositivos móviles, optimización de velocidad de carga, animación fluida a 60fps y puesta en producción lista para conectar con los usuarios.", tags: ["QA Cross-Browser", "Performance 60fps", "SEO básico", "Despliegue"] }
  ];

  list.innerHTML = "";
  steps.forEach((s, i) => {
    const r = document.createElement("div");
    r.className = "row";
    r.setAttribute("role", "listitem");
    r.innerHTML = `<button class="head" aria-expanded="false"><span class="num">0${i + 1}</span><span class="ttl">${s.t}</span><span class="tg">${s.g}</span></button><div class="body"><div><p>${s.p}</p><ul class="tags">${s.tags.map(x => `<li>${x}</li>`).join("")}</ul></div></div><i class="bar"></i>`;
    r.querySelector(".head").addEventListener("click", () => {
      grid.classList.add("manual");
      go(i);
    });
    r.querySelector(".bar").addEventListener("animationend", () => go((i + 1) % steps.length));
    list.appendChild(r);
  });

  const rows = [...list.children];
  const cap = document.getElementById("cap");

  function go(i) {
    rows.forEach((r, j) => {
      r.classList.toggle("on", j === i);
      const h = r.querySelector(".head");
      if (h) h.setAttribute("aria-expanded", j === i);
    });
    vs.forEach((v, j) => v.classList.toggle("on", j === i));
    if (cap) cap.textContent = `Paso 0${i + 1} / 04`;
  }

  if (matchMedia("(prefers-reduced-motion:reduce)").matches) grid.classList.add("manual");
  ["mouseenter", "focusin"].forEach(e => grid.addEventListener(e, () => grid.classList.add("hold")));
  ["mouseleave", "focusout"].forEach(e => grid.addEventListener(e, () => grid.classList.remove("hold")));

  go(0);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', setupWorkflowAccordion);
} else {
  setupWorkflowAccordion();
}



/* ==========================================================================
   Grid Rise Engine (React Bits Pro Pattern)
   Interactive 3D rising tiles and ripples in vinotinto palette
   Runs on both #inicio and #contacto ("debe salir en ambas")
   ========================================================================== */
function setupGridRise(canvasId, sectionId) {
  const canvas = document.getElementById(canvasId);
  const section = document.getElementById(sectionId);
  if (!canvas || !section) return;

  const ctx = canvas.getContext('2d');
  let width = 0, height = 0;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  // Configuración de baldosas 3D estilo Vinotinto Editorial (calibrado a la captura)
  const CONFIG = {
    cellSize: 52,
    gap: 8,
    lift: 24,
    liftRadius: 300,
    amplitude: 4.8,
    speed: 1.8,
    rounding: 8,
    baseColor: { r: 65, g: 22, b: 35 },           // Vinotinto profundo base
    accentColor: { r: 125, g: 46, b: 68 },        // Vinotinto activo radiante
    highlightColor: { r: 185, g: 75, b: 105 },    // Destello rosa suave
    reliefColor: { r: 35, g: 10, b: 18 }          // Sombra lateral 3D
  };

  const mouse = { x: -9999, y: -9999, active: false };
  const smoothMouse = { x: -9999, y: -9999 };
  let startTime = performance.now();

  function resize() {
    width = section.clientWidth;
    height = section.clientHeight;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (smoothMouse.x < -1000 && width > 0) {
      smoothMouse.x = width * 0.5;
      smoothMouse.y = height * 0.5;
    }
  }

  window.addEventListener('resize', resize);
  resize();

  // Seguimiento reactivo del cursor y eventos táctiles en la sección correspondiente
  window.addEventListener('pointermove', (e) => {
    const rect = section.getBoundingClientRect();
    if (e.clientY >= rect.top && e.clientY <= rect.bottom && e.clientX >= rect.left && e.clientX <= rect.right) {
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;
    } else {
      mouse.active = false;
    }
  });

  document.addEventListener('pointerleave', () => {
    mouse.active = false;
  });

  // Bucle de renderizado continuo 60fps
  function render(now) {
    requestAnimationFrame(render);
    if (!width || !height) return;

    // Solo dibujar si la sección está cerca del viewport para máximo rendimiento
    const rect = section.getBoundingClientRect();
    if (rect.bottom < -80 || rect.top > window.innerHeight + 80) return;

    const t = (now - startTime) * 0.001;

    // Suavizado e interpolación de la posición del cursor
    if (mouse.active) {
      if (smoothMouse.x < -1000) {
        smoothMouse.x = mouse.x;
        smoothMouse.y = mouse.y;
      } else {
        smoothMouse.x += (mouse.x - smoothMouse.x) * 0.12;
        smoothMouse.y += (mouse.y - smoothMouse.y) * 0.12;
      }
    } else {
      // Onda flotante continua cuando el mouse está inactivo o en móvil
      const driftX = width * 0.5 + Math.cos(t * 0.7) * (width * 0.28);
      const driftY = height * 0.5 + Math.sin(t * 0.9) * (height * 0.22);
      if (smoothMouse.x < -1000) {
        smoothMouse.x = driftX;
        smoothMouse.y = driftY;
      } else {
        smoothMouse.x += (driftX - smoothMouse.x) * 0.04;
        smoothMouse.y += (driftY - smoothMouse.y) * 0.04;
      }
    }

    ctx.clearRect(0, 0, width, height);

    const stride = CONFIG.cellSize + CONFIG.gap;
    const cols = Math.ceil(width / stride) + 2;
    const rows = Math.ceil(height / stride) + 2;
    const offsetX = ((width - (cols - 1) * stride) * 0.5) % stride;
    const offsetY = ((height - (rows - 1) * stride) * 0.5) % stride;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const cx = c * stride + offsetX;
        const cy = r * stride + offsetY;

        // Viñeta perimetral suave
        const dxCenter = (cx - width * 0.5) / (width * 0.5);
        const dyCenter = (cy - height * 0.5) / (height * 0.5);
        const edgeDist = Math.sqrt(dxCenter * dxCenter + dyCenter * dyCenter);
        const alpha = Math.max(0, Math.min(1, 1.5 - edgeDist * 0.88));
        if (alpha <= 0.03) continue;

        // Distancia e influencia del cursor interactivo
        const dist = Math.hypot(cx - smoothMouse.x, cy - smoothMouse.y);
        let influence = 0;
        if (dist < CONFIG.liftRadius) {
          const normDist = 1 - dist / CONFIG.liftRadius;
          influence = Math.cos((1 - normDist) * Math.PI * 0.5);
        }

        // Ondulación orgánica y elevación (Rise)
        const idleWave = Math.sin(t * CONFIG.speed + c * 0.28 + r * 0.22) * CONFIG.amplitude;
        const ripple = Math.sin(dist * 0.035 - t * 3.5) * 4 * influence;
        const liftDy = -(idleWave + CONFIG.lift * influence + ripple);

        const topY = cy + liftDy;
        const bottomY = cy;

        // Mezcla de colores vinotinto según elevación
        const base = CONFIG.baseColor;
        const acc = CONFIG.accentColor;
        const hi = CONFIG.highlightColor;
        let red, green, blue;
        if (influence < 0.6) {
          const factor = influence / 0.6;
          red = Math.floor((base.r + (acc.r - base.r) * factor) * alpha);
          green = Math.floor((base.g + (acc.g - base.g) * factor) * alpha);
          blue = Math.floor((base.b + (acc.b - base.b) * factor) * alpha);
        } else {
          const factor = (influence - 0.6) / 0.4;
          red = Math.floor((acc.r + (hi.r - acc.r) * factor) * alpha);
          green = Math.floor((acc.g + (hi.g - acc.g) * factor) * alpha);
          blue = Math.floor((acc.b + (hi.b - acc.b) * factor) * alpha);
        }

        // Relieve 3D de las caras laterales de la baldosa levantada
        if (liftDy < -1.5) {
          const sideR = Math.max(0, Math.floor((CONFIG.reliefColor.r + (acc.r * 0.4 - CONFIG.reliefColor.r) * influence) * alpha));
          const sideG = Math.max(0, Math.floor((CONFIG.reliefColor.g + (acc.g * 0.4 - CONFIG.reliefColor.g) * influence) * alpha));
          const sideB = Math.max(0, Math.floor((CONFIG.reliefColor.b + (acc.b * 0.4 - CONFIG.reliefColor.b) * influence) * alpha));

          ctx.fillStyle = `rgb(${sideR},${sideG},${sideB})`;
          ctx.beginPath();
          if (ctx.roundRect) {
            ctx.roundRect(cx, topY + 4, CONFIG.cellSize, bottomY - topY + CONFIG.cellSize - 4, CONFIG.rounding);
          } else {
            ctx.rect(cx, topY + 4, CONFIG.cellSize, bottomY - topY + CONFIG.cellSize - 4);
          }
          ctx.fill();
        }

        // Cara superior de la baldosa con borde fino luminoso
        ctx.fillStyle = `rgb(${red},${green},${blue})`;
        ctx.strokeStyle = `rgba(${Math.min(255, red + 50)}, ${Math.min(255, green + 30)}, ${Math.min(255, blue + 45)}, ${(0.15 + 0.55 * influence) * alpha})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        if (ctx.roundRect) {
          ctx.roundRect(cx, topY, CONFIG.cellSize, CONFIG.cellSize, CONFIG.rounding);
        } else {
          ctx.rect(cx, topY, CONFIG.cellSize, CONFIG.cellSize);
        }
        ctx.fill();
        ctx.stroke();
      }
    }
  }

  // Dibujar inmediatamente el primer frame
  render(performance.now());
}

function initAllGridRise() {
  setupGridRise('gridRiseCanvasHero', 'inicio');
  setupGridRise('gridRiseCanvasContact', 'contacto');
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAllGridRise);
} else {
  initAllGridRise();
}

/* ==========================================================================
   Ghost Type Engine on SARADEV (React Bits Pro Pattern)
   Headline que se escribe solo con autocompletados AI estilo Ghost
   utilizando la tipografía de píxeles original del abecedario
   ========================================================================== */
function initHeroGhostType() {
  const brand = document.getElementById('heroGhostBrand');
  const typedWrap = document.getElementById('heroDevTyped');
  const ghostWrap = document.getElementById('heroDevGhost');
  const tabBtn = document.getElementById('heroGhostTabBtn');
  const rowDev = document.getElementById('heroRowDev');
  if (!brand || !typedWrap || !ghostWrap) return;

  const COMPLETIONS = [
    'eloper',     // developer
    ' creative',  // dev creative
    'elopment',   // development
    ' web',       // dev web
    ' frontend'   // dev frontend
  ];

  function renderChars(text) {
    let html = '';
    for (const ch of text) {
      if (ch === ' ') {
        html += '<span class="pg-space"></span>';
      } else {
        const isUpper = ch >= 'A' && ch <= 'Z';
        const code = isUpper ? 'upper_' + ch.toLowerCase() : 'lower_' + ch;
        html += `<img class="pg-char" src="img/abecedario/pink_glyphs/${code}.png" alt="${ch}">`;
      }
    }
    return html;
  }

  let completionIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  let timer = null;
  let isGhostVisible = false;

  function tick() {
    const currentCompletion = COMPLETIONS[completionIdx];

    if (!isDeleting) {
      charIdx++;
      const typedPart = 'dev' + currentCompletion.slice(0, charIdx);
      typedWrap.innerHTML = renderChars(typedPart);

      // Sugerencia Ghost: mostrar el resto de la palabra en translúcido con el abecedario
      if (charIdx < currentCompletion.length) {
        const ghostPart = currentCompletion.slice(charIdx);
        ghostWrap.innerHTML = renderChars(ghostPart);
        isGhostVisible = true;
        if (tabBtn) tabBtn.classList.add('is-visible');
        brand.setAttribute('aria-label', `saradev: sugerencia AI '${typedPart}${ghostPart}'`);
      } else {
        ghostWrap.innerHTML = '';
        isGhostVisible = false;
        if (tabBtn) tabBtn.classList.remove('is-visible');
        brand.setAttribute('aria-label', `sara ${typedPart}`);
        // Pausa tras completar la palabra entera para apreciarla
        timer = setTimeout(() => {
          isDeleting = true;
          tick();
        }, 2600);
        return;
      }

      // Velocidad orgánica de tipeo
      const speed = 70 + Math.random() * 35;
      timer = setTimeout(tick, speed);
    } else {
      // Borrando hacia atrás hasta dejar solo el prefijo base 'dev'
      charIdx--;
      const typedPart = 'dev' + currentCompletion.slice(0, Math.max(0, charIdx));
      typedWrap.innerHTML = renderChars(typedPart);
      ghostWrap.innerHTML = '';
      if (tabBtn) tabBtn.classList.remove('is-visible');
      isGhostVisible = false;
      brand.setAttribute('aria-label', `sara ${typedPart}`);

      if (charIdx <= 0) {
        isDeleting = false;
        completionIdx = (completionIdx + 1) % COMPLETIONS.length;
        // Pausa breve antes de sugerir el siguiente término
        timer = setTimeout(tick, 500);
        return;
      }

      timer = setTimeout(tick, 32);
    }
  }

  // Aceptación instantánea con Tab o Clic
  function acceptGhost(e) {
    if (e && e.type === 'keydown' && e.key === 'Tab') {
      e.preventDefault();
    }
    if (isGhostVisible || !isDeleting) {
      clearTimeout(timer);
      const currentCompletion = COMPLETIONS[completionIdx];
      const fullText = 'dev' + currentCompletion;
      typedWrap.innerHTML = renderChars(fullText);
      ghostWrap.innerHTML = '';
      if (tabBtn) tabBtn.classList.remove('is-visible');
      isGhostVisible = false;
      charIdx = currentCompletion.length;
      brand.setAttribute('aria-label', `sara ${fullText}`);

      // Efecto háptico visual de aceptación
      if (rowDev) {
        rowDev.classList.add('ghost-accepted');
        setTimeout(() => rowDev.classList.remove('ghost-accepted'), 400);
      }

      // Pausa más prolongada para que se aprecie la palabra aceptada
      timer = setTimeout(() => {
        isDeleting = true;
        tick();
      }, 3400);
    }
  }

  brand.addEventListener('click', acceptGhost);
  if (tabBtn) tabBtn.addEventListener('click', (e) => { e.stopPropagation(); acceptGhost(e); });

  window.addEventListener('keydown', (e) => {
    if ((e.key === 'Tab' || e.key === 'Enter') && isGhostVisible) {
      if (document.activeElement === brand || document.activeElement === tabBtn || window.scrollY < window.innerHeight * 0.7) {
        acceptGhost(e);
      }
    }
  });

  // Estado inicial listo con las letras del abecedario
  typedWrap.innerHTML = renderChars('dev');
  ghostWrap.innerHTML = renderChars('eloper');
  isGhostVisible = true;
  if (tabBtn) tabBtn.classList.add('is-visible');

  // Iniciar el ciclo de Ghost Type
  timer = setTimeout(tick, 1400);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initHeroGhostType);
} else {
  initHeroGhostType();
}
