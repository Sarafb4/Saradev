import re

# 1. Update index.html
with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

ghost_markup = """          <!-- Ghost Type: Headline interactivo con AI Ghost Completions (React Bits Pro) -->
          <div class="ghost-type-wrap" data-r="up" style="--d: .22s">
            <div class="ghost-type-box" id="ghostType" tabindex="0" role="region" aria-label="Headline interactivo con sugerencias AI">
              <span class="ghost-prefix">Desarrollo </span>
              <span class="ghost-typed" id="ghostTyped"></span>
              <span class="ghost-cursor" id="ghostCursor" aria-hidden="true"></span>
              <span class="ghost-completion" id="ghostCompletion" aria-hidden="true"></span>
              <button class="ghost-tab-badge" id="ghostTabBtn" aria-label="Aceptar sugerencia AI (Tab)" title="Presiona Tab o clic para autocompletar">
                <svg viewBox="0 0 24 24" width="11" height="11" fill="currentColor" class="ghost-sparkle-icon">
                  <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"/>
                </svg>
                <span>Tab ⇥</span>
              </button>
            </div>
          </div>"""

target_h1 = """            <span class="brand-row row-dev">
              <img class="hero-part-img" src="img/hero-dev.png" alt="dev">
            </span>
          </h1>"""

replacement_h1 = target_h1 + "\n\n" + ghost_markup

if target_h1 in html and "ghost-type-wrap" not in html:
    html = html.replace(target_h1, replacement_h1, 1)
    print("Inserted ghost-type-wrap into index.html!")
else:
    print("target_h1 not found or already inserted")

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)

# 2. Update css/style.css with Ghost Type component styles
with open('css/style.css', 'r', encoding='utf-8') as f:
    css = f.read()

ghost_styles = """
/* ==========================================================================
   Ghost Type Component (React Bits Pro Pattern)
   Headline que se escribe solo con autocompletados AI estilo Ghost
   ========================================================================== */
.ghost-type-wrap {
  margin-top: clamp(22px, 3.8vh, 36px);
  width: 100%;
  display: flex;
  justify-content: flex-start;
  z-index: 5;
  position: relative;
}

.ghost-type-box {
  display: inline-flex;
  align-items: center;
  flex-wrap: wrap;
  padding: 8px 16px 8px 18px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 999px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4), inset 0 1px 1px rgba(255, 255, 255, 0.15);
  font-family: var(--font-sans), system-ui, -apple-system, sans-serif;
  font-size: clamp(0.92rem, 1.4vw, 1.15rem);
  line-height: 1.4;
  color: #ffffff;
  cursor: pointer;
  user-select: none;
  transition: border-color 0.3s ease, background 0.3s ease, box-shadow 0.3s ease, transform 0.25s var(--spring);
  outline: none;
}

.ghost-type-box:hover,
.ghost-type-box:focus-visible {
  border-color: rgba(244, 63, 94, 0.5);
  background: rgba(255, 255, 255, 0.08);
  box-shadow: 0 14px 38px rgba(0, 0, 0, 0.5), 0 0 16px rgba(244, 63, 94, 0.25);
  transform: translateY(-2px);
}

.ghost-prefix {
  font-weight: 700;
  color: #fca5a5;
  letter-spacing: -0.01em;
}

.ghost-typed {
  font-weight: 600;
  color: #ffffff;
  letter-spacing: -0.01em;
}

.ghost-cursor {
  display: inline-block;
  width: 2px;
  height: 1.18em;
  background: #f43f5e;
  margin: 0 2px;
  vertical-align: middle;
  border-radius: 1px;
  animation: ghostBlink 0.9s steps(2, start) infinite;
}

@keyframes ghostBlink {
  to {
    visibility: hidden;
  }
}

.ghost-completion {
  font-weight: 400;
  color: rgba(255, 255, 255, 0.36);
  font-style: italic;
  letter-spacing: -0.01em;
  transition: opacity 0.25s ease;
  pointer-events: none;
}

.ghost-tab-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-family: var(--font-pixel), 'Courier New', monospace;
  font-size: 0.68rem;
  letter-spacing: 0.06em;
  padding: 3px 9px;
  margin-left: 10px;
  border-radius: 999px;
  background: rgba(244, 63, 94, 0.16);
  border: 1px solid rgba(244, 63, 94, 0.36);
  color: #fca5a5;
  cursor: pointer;
  outline: none;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.ghost-tab-badge:hover {
  background: rgba(244, 63, 94, 0.32);
  color: #ffffff;
  transform: scale(1.06);
}

.ghost-sparkle-icon {
  animation: ghostSparkle 2.4s ease-in-out infinite alternate;
}

@keyframes ghostSparkle {
  0% { transform: rotate(0deg) scale(0.9); opacity: 0.8; }
  100% { transform: rotate(45deg) scale(1.15); opacity: 1; }
}

@media (max-width: 768px) {
  .ghost-type-wrap {
    justify-content: center;
    margin-top: 20px;
  }
  .ghost-type-box {
    text-align: center;
    justify-content: center;
    padding: 7px 14px;
    font-size: 0.92rem;
  }
}
"""

if "ghost-type-wrap" not in css:
    css += "\n" + ghost_styles
    print("Added ghost-type styles to css/style.css!")

with open('css/style.css', 'w', encoding='utf-8') as f:
    f.write(css)

# 3. Update js/main.js with Ghost Type engine
with open('js/main.js', 'r', encoding='utf-8') as f:
    js = f.read()

ghost_engine = """
/* ==========================================================================
   Ghost Type Engine (React Bits Pro Pattern)
   Headline que se escribe solo con autocompletados AI estilo Ghost
   ========================================================================== */
function initGhostType() {
  const box = document.getElementById('ghostType');
  const typedEl = document.getElementById('ghostTyped');
  const completionEl = document.getElementById('ghostCompletion');
  const tabBtn = document.getElementById('ghostTabBtn');
  if (!box || !typedEl || !completionEl) return;

  const COMPLETIONS = [
    'experiencias web de alto impacto',
    'código limpio, reactivo y moderno',
    'interfaces con estética editorial',
    'plataformas interactivas memorables',
    'soluciones creativas e intuitivas'
  ];

  let phraseIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  let isGhostVisible = false;
  let currentTarget = COMPLETIONS[0];
  let timer = null;

  function tick() {
    currentTarget = COMPLETIONS[phraseIdx];

    if (!isDeleting) {
      // Escribiendo caracteres
      charIdx++;
      typedEl.textContent = currentTarget.slice(0, charIdx);

      // Cuando lleva escrito un tercio o mitad, mostrar el autocompletado fantasma (Ghost)
      const ghostThreshold = Math.max(3, Math.floor(currentTarget.length * 0.35));
      if (charIdx >= ghostThreshold && charIdx < currentTarget.length) {
        completionEl.textContent = currentTarget.slice(charIdx);
        isGhostVisible = true;
      } else if (charIdx >= currentTarget.length) {
        // Completado total
        completionEl.textContent = '';
        isGhostVisible = false;
        // Pausa para que el usuario lea la frase completa
        timer = setTimeout(() => {
          isDeleting = true;
          tick();
        }, 2500);
        return;
      }

      // Velocidad de escritura con leve variación orgánica
      const speed = 45 + Math.random() * 25;
      timer = setTimeout(tick, speed);
    } else {
      // Borrando para pasar a la siguiente frase
      charIdx--;
      typedEl.textContent = currentTarget.slice(0, charIdx);
      completionEl.textContent = '';

      if (charIdx <= 0) {
        isDeleting = false;
        phraseIdx = (phraseIdx + 1) % COMPLETIONS.length;
        timer = setTimeout(tick, 350);
        return;
      }

      // Borrado rápido
      timer = setTimeout(tick, 22);
    }
  }

  // Aceptación instantánea con Tab o Clic (como GitHub Copilot / Cursor)
  function acceptGhost(e) {
    if (e) e.preventDefault();
    if (isGhostVisible || !isDeleting) {
      clearTimeout(timer);
      typedEl.textContent = currentTarget;
      completionEl.textContent = '';
      charIdx = currentTarget.length;
      isGhostVisible = false;

      // Efecto visual de aceptación
      box.style.transform = 'scale(1.03)';
      box.style.borderColor = 'rgba(244, 63, 94, 0.8)';
      setTimeout(() => {
        box.style.transform = '';
        box.style.borderColor = '';
      }, 260);

      timer = setTimeout(() => {
        isDeleting = true;
        tick();
      }, 3000);
    }
  }

  box.addEventListener('click', acceptGhost);
  if (tabBtn) tabBtn.addEventListener('click', (e) => { e.stopPropagation(); acceptGhost(e); });
  
  box.addEventListener('keydown', (e) => {
    if (e.key === 'Tab' || e.key === 'Enter') {
      acceptGhost(e);
    }
  });

  // Iniciar después de la carga inicial
  setTimeout(tick, 800);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initGhostType);
} else {
  initGhostType();
}
"""

if "initGhostType" not in js:
    js += "\n" + ghost_engine
    print("Added Ghost Type engine to js/main.js!")

with open('js/main.js', 'w', encoding='utf-8') as f:
    f.write(js)

print("Finished integrating Ghost Type component!")
