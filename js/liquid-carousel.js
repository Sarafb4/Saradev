/**
 * Liquid-Glass Refraction Portfolio Carousel
 * Two-pass Three.js renderer with postprocessing elliptical refraction lens & spectral dispersion
 */
(function () {
  'use strict';
  try {

    // Verificación de disponibilidad de WebGL
    function isWebGLAvailable() {
      try {
        const canvas = document.createElement('canvas');
        return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
      } catch (e) {
        return false;
      }
    }

    // Lista de portadas de proyectos (usando los datos precargados si están disponibles)
    const COVERS = (typeof window !== 'undefined' && window.PROJECT_COVERS && window.PROJECT_COVERS.length)
      ? window.PROJECT_COVERS
      : [
        { name: 'Sablée Pastelería', url: 'img/proyecto-sablee.jpg' },
        { name: 'Avélle Beauty Store', url: 'img/proyecto-avelle.jpg' },
        { name: 'Amigurumis Web Store', url: 'img/proyecto-amigurumis.jpg' },
        { name: 'Creative Brand Studio', url: 'img/proyecto-brand.jpg' },
        { name: 'Mobile & Web UI Design', url: 'img/proyecto-app.jpg' },
        { name: 'Motion & Visual Arts', url: 'img/proyecto-motion.jpg' },
        { name: 'The Radar / Tech Showcase', url: 'img/proyecto-radar.jpg' },
        { name: 'Amigurumis Catálogo', url: 'img/proyecto-amigurumis-card.jpg' }
      ];

    const container = document.getElementById('liquidStageContainer');
    const canvas = document.getElementById('liquidCanvas');
    const fallback = document.getElementById('liquidFallback');
    if (!container || !canvas) return;

    // Si WebGL falla, usar la tira estática horizontal
    if (!isWebGLAvailable() || typeof THREE === 'undefined') {
      if (fallback) {
        fallback.style.display = 'flex';
        fallback.innerHTML = COVERS.map(c => `
        <div class="liquid-fallback-card">
          <img src="${c.url}" alt="${c.name}">
        </div>
      `).join('');
      }
      if (canvas) canvas.style.display = 'none';
      return;
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Parámetros y constantes
    const PAD_FACTOR = 0.44;
    const ASPECT_CARD = 1.509;

    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || 420;
    let dpr = Math.min(window.devicePixelRatio || 1, 2.0);

    // 1. Renderer Three.js con el Lente de Refracción Líquida original
    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance'
    });
    renderer.setPixelRatio(dpr);
    renderer.setSize(width, height);
    renderer.setClearColor(0x28070e, 1.0); // Vinotinto idéntico a la sección (sin recuadro gris)
    renderer.outputEncoding = THREE.LinearEncoding; // Color 100% fiel sin doble gamma

    // 2. Render Target acolchado (Padded Render Target)
    let paddedW = width * (1.0 + 2.0 * PAD_FACTOR);
    let paddedH = height * (1.0 + 2.0 * PAD_FACTOR);
    let padX = width * PAD_FACTOR;
    let padY = height * PAD_FACTOR;

    let renderTarget = new THREE.WebGLRenderTarget(
      Math.round(paddedW * dpr),
      Math.round(paddedH * dpr),
      {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        format: THREE.RGBAFormat
      }
    );

    // 3. Escena 1: Flat strip de tarjetas
    const stripScene = new THREE.Scene();
    stripScene.background = new THREE.Color(0x28070e);

    const stripCamera = new THREE.OrthographicCamera(
      -paddedW / 2, paddedW / 2,
      paddedH / 2, -paddedH / 2,
      0.1, 1000
    );
    stripCamera.position.z = 10;

    // Carga de texturas
    const textureLoader = new THREE.TextureLoader();
    const textures = COVERS.map(c => {
      const tex = textureLoader.load(c.url, () => {
        tex.encoding = THREE.LinearEncoding;
        tex.generateMipmaps = true;
        tex.minFilter = THREE.LinearMipmapLinearFilter;
        tex.needsUpdate = true;
      });
      return tex;
    });

    // Generación de 3 copias repetidas para llenar el campo acolchado
    const cardGroup = new THREE.Group();
    stripScene.add(cardGroup);

    const M = COVERS.length;
    const COPIES = 3; // Copias repetidas: -1, 0, 1
    const cardMeshes = [];

    function getDimensions() {
      const isPhone = width < 640;
      const cardW = isPhone ? width * 0.64 : Math.min(470, width * 0.205);
      const cardH = cardW / ASPECT_CARD;
      const gap = isPhone ? 10 : 14;
      const stride = cardW + gap;
      return { cardW, cardH, gap, stride };
    }

    let dims = getDimensions();

    // Shader para tarjeta plana con bordes sutiles
    const cardGeom = new THREE.PlaneGeometry(1, 1);

    // Textura para tarjetas: recuadros vino profundo con borde burdeos elegante
    const cardCanvas = document.createElement('canvas');
    cardCanvas.width = 600;
    cardCanvas.height = Math.round(600 / ASPECT_CARD);
    const cctx = cardCanvas.getContext('2d');
    cctx.fillStyle = '#140508';
    cctx.fillRect(0, 0, cardCanvas.width, cardCanvas.height);
    cctx.strokeStyle = '#721b35';
    cctx.lineWidth = 4;
    cctx.strokeRect(2, 2, cardCanvas.width - 4, cardCanvas.height - 4);

    for (let c = -1; c <= 1; c++) {
      for (let i = 0; i < M; i++) {
        const mat = new THREE.MeshBasicMaterial({
          map: textures[i] || textures[0]
        });
        const mesh = new THREE.Mesh(cardGeom, mat);
        mesh.userData = { copy: c, index: i };
        cardGroup.add(mesh);
        cardMeshes.push(mesh);
      }
    }

    // 4. Escena 2: Postprocessing Quad con Lente de Refracción
    const postScene = new THREE.Scene();
    const postCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const vertexShader = `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = vec4(position, 1.0);
    }
  `;

    const fragmentShader = `
    precision highp float;
    varying vec2 vUv;

    uniform sampler2D tDiffuse;
    uniform vec2 uViewportResolution;
    uniform vec2 uPadding;
    uniform float uLensEntrance;

    void main() {
      vec2 uv = vUv;
      float viewportAspect = uViewportResolution.x / uViewportResolution.y;

      // 1. Centro en (0.5, 0.5)
      vec2 p = uv - vec2(0.5, 0.5);

      // 2. Corregir x por el aspect ratio del viewport
      p.x *= viewportAspect;

      // 3. Rotar coordenadas de lente 65 grados en sentido horario (-65 deg)
      float angle = radians(-65.0);
      float cosA = cos(angle);
      float sinA = sin(angle);
      vec2 rotatedP = vec2(p.x * cosA - p.y * sinA, p.x * sinA + p.y * cosA);

      // 4. Normalizar por semieje (.565, 1) y en pantallas anchas multiplicar por max(1, aspect / (1440/1028))
      float wideFactor = max(1.0, viewportAspect / (1440.0 / 1028.0));
      vec2 halfSize = vec2(0.565, 1.0) * wideFactor;
      vec2 normalizedP = rotatedP / halfSize;

      // 5. Distancia radial normalizada
      float dist = length(normalizedP);

      // 6. La influencia del lente decae suavemente en distancia .93 a 1 (el centro queda sin distorsión)
      float lensInfluence = 1.0 - smoothstep(0.93, 1.0, dist);

      // 7. Fuerza del borde (rim strength) crece desde distancia normalizada .578 a 1
      float rimStrength = smoothstep(0.578, 1.0, dist);

      // 8. Dirección radial corregida por aspecto y su tangente perpendicular
      float rLen = length(p);
      vec2 radialDir = rLen > 0.0001 ? p / rLen : vec2(0.0, 1.0);
      vec2 tangentDir = vec2(-radialDir.y, radialDir.x);

      // 9. Desplazamiento tangencial ponderado por .55*sin(2*azimuth) + .25*sin(azimuth), amplitud .6 y tope de radio .7825
      float azimuth = atan(rotatedP.y, rotatedP.x);
      float azimuthWeight = 0.55 * sin(2.0 * azimuth) + 0.25 * sin(azimuth);
      float cappedRadius = min(dist, 0.7825);
      float disp = cappedRadius * rimStrength * azimuthWeight * 0.6 * lensInfluence * uLensEntrance;

      vec2 uvOffset = vec2(tangentDir.x / viewportAspect, tangentDir.y) * disp;

      // 10. Muestreo de 12 puntos espectrales a lo largo de offset*(11*.004)*smoothstep(.55, 1, dist)
      float dispersionScale = 11.0 * 0.004 * smoothstep(0.55, 1.0, dist);
      vec2 spreadVector = uvOffset * dispersionScale;

      vec3 accumColor = vec3(0.0);
      float totalWR = 0.0;
      float totalWG = 0.0;
      float totalWB = 0.0;

      for (int i = 0; i < 12; i++) {
        float k = float(i) / 11.0;
        vec2 tapUV = uv + uvOffset + spreadVector * (k - 0.5) * 2.0;

        // Muestreo con corrección exacta de padding:
        // (uv * viewportResolution + padding) / (viewportResolution + 2 * padding)
        vec2 targetCoord = (tapUV * uViewportResolution + uPadding) / (uViewportResolution + 2.0 * uPadding);
        targetCoord = clamp(targetCoord, vec2(0.0001), vec2(0.9999));

        vec4 sampleCol = texture2D(tDiffuse, targetCoord);

        // Pesos gaussianos centrados en 0, 0.5, 1 con ancho 0.38
        float wR = exp(-0.5 * pow((k - 0.0) / 0.38, 2.0));
        float wG = exp(-0.5 * pow((k - 0.5) / 0.38, 2.0));
        float wB = exp(-0.5 * pow((k - 1.0) / 0.38, 2.0));

        accumColor.r += sampleCol.r * wR; totalWR += wR;
        accumColor.g += sampleCol.g * wG; totalWG += wG;
        accumColor.b += sampleCol.b * wB; totalWB += wB;
      }

      vec3 col = vec3(
        accumColor.r / totalWR,
        accumColor.g / totalWG,
        accumColor.b / totalWB
      );

      gl_FragColor = vec4(col, 1.0);
    }
  `;

    const postMaterial = new THREE.ShaderMaterial({
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      uniforms: {
        tDiffuse: { value: renderTarget.texture },
        uViewportResolution: { value: new THREE.Vector2(width, height) },
        uPadding: { value: new THREE.Vector2(padX, padY) },
        uLensEntrance: { value: prefersReducedMotion ? 1.0 : 0.0 }
      },
      depthTest: false,
      depthWrite: false
    });

    const postQuad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), postMaterial);
    postScene.add(postQuad);

    // 5. Estado de Entrada, Dinámica y Posicionamiento
    let currentPos = 0;
    let targetPos = 0;
    let velocity = 0;
    let prevPos = 0;
    let currentShrink = 0;

    let isDragging = false;
    let dragStartX = 0;
    let dragStartY = 0;
    let lastDragX = 0;
    let dragVelocity = 0;
    let dragHistory = [];
    const raycaster = new THREE.Raycaster();
    const mouseCoords = new THREE.Vector2();
    let isHovered = false;
    let isFocused = false;

    let lastInteractionTime = performance.now();
    let entranceStartTime = performance.now();
    let entryCompleted = prefersReducedMotion;

    // Ciclo de vida y visibilidad
    let isVisible = true;
    let isDocVisible = !document.hidden;
    let isParentActive = true;
    let rafId = null;
    let lastTime = performance.now();

    // Resize handler
    function onResize() {
      width = container.clientWidth || window.innerWidth;
      height = container.clientHeight || 420;
      dpr = Math.min(window.devicePixelRatio || 1, 2.0);

      renderer.setPixelRatio(dpr);
      renderer.setSize(width, height);

      paddedW = width * (1.0 + 2.0 * PAD_FACTOR);
      paddedH = height * (1.0 + 2.0 * PAD_FACTOR);
      padX = width * PAD_FACTOR;
      padY = height * PAD_FACTOR;

      stripCamera.left = -paddedW / 2;
      stripCamera.right = paddedW / 2;
      stripCamera.top = paddedH / 2;
      stripCamera.bottom = -paddedH / 2;
      stripCamera.updateProjectionMatrix();

      renderTarget.setSize(Math.round(paddedW * dpr), Math.round(paddedH * dpr));

      postMaterial.uniforms.uViewportResolution.value.set(width, height);
      postMaterial.uniforms.uPadding.value.set(padX, padY);

      dims = getDimensions();
    }

    window.addEventListener('resize', onResize);

    // Input Handlers con Inercia (Momentum) y Apertura de Proyectos al Clic
    canvas.addEventListener('pointerdown', e => {
      isDragging = true;
      dragStartX = e.clientX;
      dragStartY = e.clientY;
      lastDragX = e.clientX;
      dragVelocity = 0;
      velocity = 0;
      dragHistory = [{ x: e.clientX, t: performance.now() }];
      lastInteractionTime = performance.now();
      try { canvas.setPointerCapture(e.pointerId); } catch (err) { }
    });

    window.addEventListener('pointermove', e => {
      if (!isDragging) return;
      const now = performance.now();
      const deltaX = e.clientX - lastDragX;
      targetPos -= deltaX;
      lastDragX = e.clientX;
      dragHistory.push({ x: e.clientX, t: now });
      while (dragHistory.length > 1 && now - dragHistory[0].t > 90) {
        dragHistory.shift();
      }
      lastInteractionTime = now;
    });

    const onPointerEnd = e => {
      if (!isDragging) return;
      isDragging = false;
      const now = performance.now();
      const moved = Math.hypot(e.clientX - dragStartX, e.clientY - dragStartY);

      if (moved >= 7) {
        // Lanzamiento con inercia continua estilo smartphone/iOS
        if (dragHistory.length >= 2) {
          const oldest = dragHistory[0];
          const newest = dragHistory[dragHistory.length - 1];
          const dt = (newest.t - oldest.t) / 1000;
          if (dt > 0.012) {
            const vx = (newest.x - oldest.x) / dt;
            velocity = -vx * 0.024; // Velocidad con inercia suave
          }
        }
      }
      lastInteractionTime = now;
      try { canvas.releasePointerCapture(e.pointerId); } catch (err) { }
    };

    window.addEventListener('pointerup', onPointerEnd);
    window.addEventListener('pointercancel', onPointerEnd);

    canvas.addEventListener('wheel', e => {
      e.preventDefault();
      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      velocity += delta * 0.08;
      lastInteractionTime = performance.now();
    }, { passive: false });

    canvas.addEventListener('mouseenter', () => isHovered = true);
    canvas.addEventListener('mouseleave', () => isHovered = false);
    canvas.addEventListener('focus', () => isFocused = true);
    canvas.addEventListener('blur', () => isFocused = false);

    window.addEventListener('keydown', e => {
      if (document.activeElement !== canvas && !isHovered) return;
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        targetPos += dims.stride;
        lastInteractionTime = performance.now();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        targetPos -= dims.stride;
        lastInteractionTime = performance.now();
      } else if (e.key === 'Home') {
        e.preventDefault();
        targetPos = 0;
        velocity = 0;
        lastInteractionTime = performance.now();
      }
    });

    // Pausa del ciclo RAF si está oculto o fuera de pantalla
    const intersectionObs = new IntersectionObserver(entries => {
      isVisible = entries[0].isIntersecting;
      if (isVisible) resumeLoop();
    }, { threshold: 0.05 });
    intersectionObs.observe(container);

    document.addEventListener('visibilitychange', () => {
      isDocVisible = !document.hidden;
      if (isDocVisible) resumeLoop();
    });

    window.addEventListener('message', e => {
      if (e.data && e.data.type === 'still-active') {
        isParentActive = !!e.data.active;
        if (isParentActive) resumeLoop();
      }
    });

    function resumeLoop() {
      if (!rafId && isVisible && isDocVisible && isParentActive) {
        lastTime = performance.now();
        rafId = requestAnimationFrame(animate);
      }
    }

    // Animación principal
    function animate(now) {
      if (!isVisible || !isDocVisible || !isParentActive) {
        rafId = null;
        return;
      }

      const dt = Math.min(0.05, (now - lastTime) / 1000);
      lastTime = now;
      const frameFactor = Math.min(3.0, dt / (1 / 60));

      // 1. Entrance animation (subida escalonada, crecimiento y entrada de lente)
      let entranceT = 1.0;
      if (!entryCompleted) {
        const elapsed = (now - entranceStartTime) / 1000;
        entranceT = Math.min(1.0, elapsed / 0.95);
        entranceT = 1.0 - Math.pow(1.0 - entranceT, 3.0); // cubic ease out
        postMaterial.uniforms.uLensEntrance.value = entranceT;
        if (entranceT >= 1.0) entryCompleted = true;
      }

      // 2. Movimiento continuo automático (Autoplay continuo sin pausas ni necesidad de scroll)
      if (!prefersReducedMotion && !isDragging) {
        const autoSpeed = isHovered ? 0.6 : 1.4; // píxeles por frame continuo
        targetPos += autoSpeed * frameFactor;
      }

      // 3. Física de inercia si el usuario arrastra y suelta manualmente (desaceleración suave tipo iOS)
      if (!isDragging && !prefersReducedMotion && Math.abs(velocity) > 0.01) {
        targetPos += velocity * frameFactor;
        velocity *= Math.pow(0.962, frameFactor);
      }

      // 4. Posición amortiguada con easing normalizado .09
      if (prefersReducedMotion) {
        currentPos = targetPos;
      } else {
        currentPos += (targetPos - currentPos) * (1.0 - Math.pow(1.0 - 0.09, frameFactor));
      }

      // 5. Encogimiento sutil hasta 7% según velocidad (ataque .25, liberación .06)
      const speedPxPerFrame = Math.abs(currentPos - prevPos) / Math.max(0.001, frameFactor);
      prevPos = currentPos;

      if (!prefersReducedMotion) {
        const targetShrink = Math.min(0.07, (speedPxPerFrame / 60.0) * 0.07);
        if (targetShrink > currentShrink) {
          currentShrink += (targetShrink - currentShrink) * (1.0 - Math.pow(1.0 - 0.25, frameFactor));
        } else {
          currentShrink += (targetShrink - currentShrink) * (1.0 - Math.pow(1.0 - 0.06, frameFactor));
        }
      } else {
        currentShrink = 0;
      }

      const cardScale = (1.0 - currentShrink);
      const totalListWidth = M * dims.stride;

      // Centered modular wrapping
      let modPos = currentPos % totalListWidth;
      if (modPos > totalListWidth / 2) modPos -= totalListWidth;
      if (modPos < -totalListWidth / 2) modPos += totalListWidth;

      // 6. Posicionar las tarjetas planas en la escena 1
      cardMeshes.forEach(mesh => {
        const { copy, index } = mesh.userData;
        const x = (copy * totalListWidth) + (index * dims.stride) - modPos;

        // Animación de entrada escalonada
        let staggerY = 0;
        let heightGrowth = 1.0;
        if (!entryCompleted) {
          const stagger = (index * 0.08);
          const cardEntryT = Math.min(1.0, Math.max(0.0, ((now - entranceStartTime) / 1000 - stagger) / 0.75));
          const easeCard = 1.0 - Math.pow(1.0 - cardEntryT, 3.0);
          staggerY = (1.0 - easeCard) * -70.0;
          heightGrowth = 0.7 + 0.3 * easeCard;
        }

        mesh.position.set(x, staggerY, 0);
        mesh.scale.set(dims.cardW * cardScale, dims.cardH * cardScale * heightGrowth, 1);
      });

      // 7. Primer Render Pass: Dibujar tira plana al WebGLRenderTarget acolchado
      renderer.setRenderTarget(renderTarget);
      renderer.clear();
      renderer.render(stripScene, stripCamera);

      // 8. Segundo Render Pass: Dibujar quad con el Lente de Refracción Líquida original
      renderer.setRenderTarget(null);
      renderer.clear();
      renderer.render(postScene, postCamera);

      rafId = requestAnimationFrame(animate);
    }

    // Iniciar el loop
    resumeLoop();

    // Función Teardown / Cleanup
    window.__destroyLiquidCarousel = function () {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('pointerup', onPointerEnd);
      window.removeEventListener('pointercancel', onPointerEnd);
      intersectionObs.disconnect();

      renderer.dispose();
      renderTarget.dispose();
      postMaterial.dispose();
      postQuad.geometry.dispose();
      cardGeom.dispose();
      textures.forEach(t => t.dispose());
    };

  } catch (err) {
    console.warn('Liquid carousel init failed, falling back:', err);
    const fallback = document.getElementById('liquidFallback');
    const canvas = document.getElementById('liquidCanvas');
    if (fallback) fallback.style.display = 'flex';
    if (canvas) canvas.style.display = 'none';
  }
})();
