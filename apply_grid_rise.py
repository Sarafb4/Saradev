import re

# 1. Update index.html to add canvas inside #inicio
with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

canvas_markup = """      <!-- Grid Rise: Campo interactivo de baldosas 3D con elevación y ondas reactivas al cursor (React Bits Pro - Vinotinto) -->
      <canvas id="gridRiseCanvas" class="grid-rise-canvas" aria-hidden="true"></canvas>"""

target = '<section id="inicio">\n      <!-- Glow interactivo sutil reactivo al mouse -->\n      <div class="hero-interactive-glow" id="heroGlow" aria-hidden="true"></div>'

if "gridRiseCanvas" not in html:
    if target in html:
        html = html.replace(target, target + "\n\n" + canvas_markup, 1)
        print("Inserted canvas after heroGlow!")
    else:
        pattern = r'(<section id="inicio">[^<]*<div class="hero-interactive-glow"[^>]*></div>)'
        html = re.sub(pattern, r'\1\n\n' + canvas_markup, html)
        print("Inserted canvas via regex!")

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)

# 2. Update css/style.css
with open('css/style.css', 'r', encoding='utf-8') as f:
    css = f.read()

grid_rise_css = """
/* ==========================================================================
   Grid Rise Component (React Bits Pro Pattern)
   Campo de baldosas 3D interactivas con elevación y ondas reactivas (Vinotinto)
   ========================================================================== */
.grid-rise-canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  pointer-events: none;
  display: block;
}

#inicio {
  position: relative;
  overflow: hidden;
}

.hero-editorial-wrap {
  position: relative;
  z-index: 3;
}

.hero-meta-col {
  z-index: 5;
}
"""

if "grid-rise-canvas" not in css:
    css += "\n" + grid_rise_css
    print("Added grid-rise-canvas styles!")

with open('css/style.css', 'w', encoding='utf-8') as f:
    f.write(css)

# 3. Update js/main.js
with open('js/main.js', 'r', encoding='utf-8') as f:
    js = f.read()

grid_rise_js = """
/* ==========================================================================
   Grid Rise Engine (React Bits Pro Pattern)
   Interactive 3D rising tiles and ripples in vinotinto palette
   ========================================================================== */
function initGridRise() {
  const canvas = document.getElementById('gridRiseCanvas');
  const hero = document.getElementById('inicio');
  if (!canvas || !hero) return;

  const ctx = canvas.getContext('2d');
  let width = 0, height = 0;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  // Configuración de baldosas 3D estilo Vinotinto Editorial
  const CONFIG = {
    cellSize: 46,
    gap: 7,
    lift: 24,
    liftRadius: 260,
    amplitude: 4.5,
    speed: 1.8,
    rounding: 6,
    baseColor: { r: 34, g: 7, b: 18 },          // Vinotinto profundo base
    accentColor: { r: 185, g: 42, b: 80 },       // Vinotinto radiante activo
    highlightColor: { r: 240, g: 110, b: 150 },  // Destello rosa / peak highlight
    reliefColor: { r: 18, g: 3, b: 9 }           // Sombra lateral 3D
  };

  const mouse = { x: -9999, y: -9999, active: false };
  const smoothMouse = { x: -9999, y: -9999 };
  let startTime = performance.now();

  function resize() {
    width = hero.clientWidth;
    height = hero.clientHeight;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  window.addEventListener('resize', resize);
  resize();

  // Seguimiento reactivo del cursor y eventos táctiles en #inicio
  window.addEventListener('pointermove', (e) => {
    const rect = hero.getBoundingClientRect();
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
      const driftX = width * 0.5 + Math.cos(t * 0.7) * (width * 0.22);
      const driftY = height * 0.45 + Math.sin(t * 0.9) * (height * 0.18);
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

        // Viñeta perimetral: desvanecer baldosas en los bordes de la pantalla
        const dxCenter = (cx - width * 0.5) / (width * 0.5);
        const dyCenter = (cy - height * 0.5) / (height * 0.5);
        const edgeDist = Math.sqrt(dxCenter * dxCenter + dyCenter * dyCenter);
        const alpha = Math.max(0, Math.min(1, 1.45 - edgeDist * 0.92));
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

  requestAnimationFrame(render);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initGridRise);
} else {
  initGridRise();
}
"""

if "initGridRise" not in js:
    js += "\n" + grid_rise_js
    print("Added Grid Rise engine to js/main.js!")

with open('js/main.js', 'w', encoding='utf-8') as f:
    f.write(js)

print("Finished applying Grid Rise integration!")
