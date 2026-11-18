import re

# 1. Update js/main.js
with open('js/main.js', 'r', encoding='utf-8') as f:
    js = f.read()

# Update PROJECTS array
old_projects_block = """/* Cada ventana de "Mis proyectos" es una web interactiva */
const PROJECTS = [
  {
    name: 'Sablée Pastelería',
    tech: ['HTML', 'CSS', 'JavaScript', 'Responsive design'],
    media: 'E-commerce & Catálogo de repostería artesanal:',
    slots: 3,
    img: 'img/proyecto-sablee.jpg'
  },
  {
    name: 'Amigurumis Catálogo',
    tech: ['HTML', 'CSS', 'JavaScript', 'Responsive design'],
    media: 'Catálogo de amigurumis tejidos a mano y tienda online:',
    slots: 3,
    img: 'img/proyecto-amigurumis.jpg'
  },
  {
    name: 'Avélle Beauty Store',
    tech: ['HTML', 'CSS', 'JavaScript', 'Responsive design'],
    media: 'E-commerce & Tienda de cosméticos de alta gama:',
    slots: 3,
    img: 'img/proyecto-avelle.jpg'
  }
];"""

new_projects_block = """/* Cada ventana de "Mis proyectos" es una web interactiva con video y ficha técnica */
const PROJECTS = [
  {
    name: 'Sablée Pastelería',
    subtitle: 'E-Commerce & Repostería Gourmet',
    desc: 'Experiencia web de pastelería artesanal gourmet con catálogo interactivo de postres, diseño de pedidos personalizados, carrito de compras dinámico y rastreo de envíos en tiempo real.',
    tech: ['HTML5', 'CSS3', 'JavaScript', 'Responsive design'],
    img: 'img/proyecto-sablee.jpg',
    video: 'video/proyecto-demo.mp4',
    url: 'https://sarawebdev.github.io/sablee/'
  },
  {
    name: 'Amigurumis Catálogo',
    subtitle: 'Showcase & Tienda de Tejidos',
    desc: 'Catálogo digital y tienda interactiva de muñecos amigurumis tejidos 100% a mano. Presenta colecciones por temporada, selector dinámico de personajes y pedidos directos vía WhatsApp.',
    tech: ['HTML5', 'CSS3', 'JavaScript', 'Responsive design'],
    img: 'img/proyecto-amigurumis.jpg',
    video: 'video/proyecto-demo.mp4',
    url: 'https://sarawebdev.github.io/amigurumis/'
  },
  {
    name: 'Avélle Beauty Store',
    subtitle: 'E-Commerce & Cosméticos de Lujo',
    desc: 'Boutique digital de alta cosmética y skincare para marcas exclusivas como Rhode y Huda Beauty. Incluye catálogo editorial minimalista, filtros avanzados de producto y carrito de compras chic.',
    tech: ['HTML5', 'CSS3', 'JavaScript', 'Responsive design'],
    img: 'img/proyecto-avelle.jpg',
    video: 'video/proyecto-demo.mp4',
    url: 'https://sarawebdev.github.io/avelle/'
  }
];"""

if old_projects_block in js:
    js = js.replace(old_projects_block, new_projects_block, 1)
    print("Replaced PROJECTS successfully!")
else:
    print("Could not find exact old_projects_block, using regex...")
    pattern = r"const PROJECTS = \[\s*\{[^;]+\];"
    js = re.sub(pattern, new_projects_block, js)
    print("Replaced PROJECTS via regex!")

# Remove the blind covers overwrite that swaps images
covers_old = """// Si hay portadas precargadas con data URIs (para compatibilidad offline total sin restricciones CORS), usarlas
if (typeof window !== 'undefined' && window.PROJECT_COVERS && window.PROJECT_COVERS.length) {
  PROJECTS.forEach((p, idx) => {
    if (window.PROJECT_COVERS[idx]) {
      p.img = window.PROJECT_COVERS[idx].url || p.img;
    }
  });
}"""

covers_new = """// Si hay portadas precargadas con data URIs, vincularlas únicamente por nombre exacto si hiciera falta
if (typeof window !== 'undefined' && window.PROJECT_COVERS && window.PROJECT_COVERS.length) {
  PROJECTS.forEach((p) => {
    if (!p.img) {
      const match = window.PROJECT_COVERS.find(c => c.name && c.name.toLowerCase().includes(p.name.slice(0, 5).toLowerCase()));
      if (match && match.url) p.img = match.url;
    }
  });
}"""

if covers_old in js:
    js = js.replace(covers_old, covers_new, 1)
    print("Fixed covers overwrite!")

# Replace renderP and closeP
old_renderP_pattern = r"// 6\. Modal de detalle de proyecto\s*function renderP\(anim\)\s*\{[\s\S]*?function closeP\(\)\s*\{[\s\S]*?if \(lastW\) lastW\.focus\(\);\s*\}"

new_renderP_code = """// 6. Modal de detalle de proyecto con reproductor de video panorámico (Estilo Referencia)
function renderP(anim) {
  const p = PROJECTS[pi];
  if (!p) return;
  pc.className = 'project-video-modal' + (anim ? ' swap' : '');
  
  const hasVideo = Boolean(p.video);
  pc.innerHTML = `
    <div class="pmodal-media-wrap">
      ${hasVideo ? `
        <video class="pmodal-video" src="${p.video}" poster="${p.img}" controls autoplay loop muted playsinline></video>
      ` : `
        <img class="pmodal-img" src="${p.img}" alt="${p.name}">
      `}
      <div class="pmodal-media-overlay">
        <h3 class="pmodal-title">${p.name}</h3>
        <button class="pmodal-close-btn" aria-label="Cerrar modal" title="Cerrar">
          <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
    </div>
    <div class="pmodal-body">
      <p class="pmodal-desc">${p.desc || ''}</p>
      <div class="pmodal-footer">
        <div class="chips">
          ${p.tech.map(t => {
            const icon = SKILL_ICONS[t] || SKILL_ICONS[t.replace('5', '').replace('3', '')];
            return `<span class="chip">${icon ? `<span class="chip-icon">${icon}</span>` : ''}<span>${t}</span></span>`;
          }).join('')}
        </div>
        ${p.url ? `<a href="${p.url}" target="_blank" rel="noopener" class="pmodal-live-link">Ver web en vivo ↗</a>` : ''}
      </div>
    </div>
  `;
  
  const closeBtn = $('.pmodal-close-btn', pc);
  if (closeBtn) closeBtn.onclick = closeP;
}

function openP(i, el) {
  pi = i;
  lastW = el;
  renderP(false);
  pw.classList.add('open');
  document.body.classList.add('lock');
  if (el && el.getBoundingClientRect) {
    const r = el.getBoundingClientRect();
    pin.style.transformOrigin = `${r.left + r.width / 2 - pin.offsetLeft}px ${r.top + r.height / 2 - pin.offsetTop}px`;
  }
  setTimeout(() => $('.pmodal-close-btn', pc)?.focus(), 350);
}

window.openProjectModal = openP;

function closeP() {
  const video = $('video', pc);
  if (video) {
    try { video.pause(); } catch(_) {}
  }
  pw.classList.remove('open');
  document.body.classList.remove('lock');
  if (lastW) lastW.focus();
}"""

js = re.sub(old_renderP_pattern, new_renderP_code, js)
print("Updated renderP and closeP in js/main.js")

with open('js/main.js', 'w', encoding='utf-8') as f:
    f.write(js)

# 2. Update css/style.css
with open('css/style.css', 'r', encoding='utf-8') as f:
    css = f.read()

# Make pin wider for cinematic video modal
css = re.sub(
    r"\.pin\s*\{\s*width:\s*min\([^)]+\);",
    ".pin {\n  width: min(780px, 94vw);",
    css
)

video_modal_styles = """
/* ==========================================================================
   Modal de Proyectos con Video & Vista Panorámica (Estilo Referencia)
   ========================================================================== */
.project-video-modal {
  background: #0d090c !important;
  border: 1px solid rgba(255, 255, 255, 0.16) !important;
  border-radius: clamp(20px, 3vw, 28px) !important;
  box-shadow: 0 35px 95px rgba(0, 0, 0, 0.95), 0 0 0 1px rgba(255, 255, 255, 0.08) !important;
  overflow: hidden !important;
  position: relative !important;
  color: #ffffff !important;
  padding: 0 !important;
  min-height: auto !important;
}

/* Área Multimedia (Video o Imagen) */
.pmodal-media-wrap {
  position: relative;
  width: 100%;
  height: clamp(260px, 46vh, 430px);
  background: #000000;
  overflow: hidden;
}

.pmodal-video,
.pmodal-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* Overlay inferior con degradado, título y botón cerrar circular */
.pmodal-media-overlay {
  position: absolute;
  inset: auto 0 0 0;
  height: clamp(90px, 36%, 140px);
  background: linear-gradient(to top, rgba(0, 0, 0, 0.94) 0%, rgba(0, 0, 0, 0.5) 60%, transparent 100%);
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  padding: clamp(16px, 2.8vw, 24px) clamp(20px, 3.2vw, 28px);
  z-index: 5;
  pointer-events: none;
}

.pmodal-title {
  font-family: var(--font-sans), system-ui, -apple-system, sans-serif;
  font-size: clamp(1.5rem, 2.6vw, 2.1rem);
  font-weight: 700;
  color: #ffffff;
  margin: 0;
  line-height: 1.2;
  letter-spacing: -0.015em;
  text-shadow: 0 2px 12px rgba(0, 0, 0, 0.8);
  pointer-events: auto;
}

/* Botón cerrar circular translúcido tipo iOS / Minimalista */
.pmodal-close-btn {
  width: clamp(38px, 4.4vw, 44px);
  height: clamp(38px, 4.4vw, 44px);
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.28);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.35);
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  pointer-events: auto;
  flex-shrink: 0;
  margin-left: 14px;
  outline: none;
  transition: background 0.25s ease, transform 0.25s var(--spring);
}

.pmodal-close-btn:hover {
  background: rgba(255, 255, 255, 0.5);
  transform: scale(1.08);
}

.pmodal-close-btn:active {
  transform: scale(0.94);
}

/* Cuerpo inferior con descripción elegante y chips */
.pmodal-body {
  padding: clamp(20px, 3vw, 28px) clamp(22px, 3.5vw, 30px) clamp(24px, 3.5vw, 32px);
  background: #0d090c;
}

.pmodal-desc {
  font-family: var(--font-sans), system-ui, -apple-system, sans-serif;
  font-size: clamp(0.96rem, 1.25vw, 1.08rem);
  line-height: 1.65;
  color: rgba(255, 255, 255, 0.88);
  margin: 0 0 clamp(16px, 2.5vh, 22px);
}

.pmodal-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
}

.pmodal-footer .chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 0;
}

.pmodal-footer .chip {
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.16);
  color: rgba(255, 255, 255, 0.9);
  padding: 5px 12px;
  font-size: 0.84rem;
  border-radius: 999px;
}

.pmodal-live-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: var(--font-sans), system-ui, sans-serif;
  font-size: 0.88rem;
  font-weight: 600;
  color: #ff9fb4;
  text-decoration: none;
  padding: 6px 14px;
  border-radius: 999px;
  background: rgba(244, 63, 94, 0.15);
  border: 1px solid rgba(244, 63, 94, 0.35);
  transition: all 0.25s ease;
}

.pmodal-live-link:hover {
  background: rgba(244, 63, 94, 0.3);
  color: #ffffff;
  transform: translateY(-2px);
}
"""

if "project-video-modal" not in css:
    css += "\n" + video_modal_styles
    print("Added project-video-modal styles!")

with open('css/style.css', 'w', encoding='utf-8') as f:
    f.write(css)

print("Finished applying video modal changes!")
