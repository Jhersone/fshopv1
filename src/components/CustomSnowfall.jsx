// src/components/CustomSnowfall.jsx
import { useEffect, useRef } from 'react';

export default function CustomSnowfall() {
  const canvasRef = useRef(null);

  useEffect(() => {
    // Aquí inicia la lógica del script que me pasaste, encapsulada para React
    const Snowfall = (function() {
        const config = {
            baseParticleCount: 150, // Bajé un poco la cantidad para asegurar rendimiento
            flakeRatio: 0.3,       // 30% serán copos detallados, el resto puntitos
            minDotSize: 0.5,
            maxDotSize: 2.5,
            minFlakeSize: 3,
            maxFlakeSize: 15,      // Copos un poco más grandes para que se luzca el diseño
            minSpeedY: 18,
            maxSpeedY: 70,
            minFlakeSpeedY: 25,
            maxFlakeSpeedY: 55,
            minWind: -18,
            maxWind: 18,
            minSwayAmplitude: 5,
            maxSwayAmplitude: 26,
            minSwayFrequency: 0.001,
            maxSwayFrequency: 0.003,
            minOpacity: 0.18,
            maxOpacity: 0.9,
        };
        // Ese string gigante es el dibujo del copo de nieve real
        const SNOWFLAKE_PATH_DATA = "M3193 11948 c-22 -28 -326 -552 -326 -562 0 -6 165 -292 366 -635 202 -343 367 -625 367 -627 0 -2 -291 -5 -647 -6 l-648 -3 -167 -285 -167 -284 32 -57 c18 -31 93 -160 167 -287 l135 -231 989 -3 989 -3 548 -934 c302 -513 549 -935 549 -937 0 -2 -496 -3 -1102 -2 l-1102 3 -39 65 c-21 36 -242 412 -491 835 l-452 770 -339 3 -340 2 -168 -286 -168 -286 318 -540 c175 -298 319 -547 321 -554 3 -12 -121 -14 -740 -14 l-743 -1 -167 -285 -166 -285 166 -284 167 -285 743 0 c473 0 742 -4 742 -10 0 -5 -144 -255 -320 -555 l-321 -545 167 -285 167 -285 341 0 341 1 491 837 491 837 1102 3 c882 2 1102 0 1098 -10 -3 -7 -250 -429 -549 -938 l-544 -925 -989 -5 -990 -5 -168 -286 -167 -286 167 -286 168 -286 648 -1 c356 0 647 -2 647 -5 0 -3 -166 -288 -370 -634 l-369 -629 167 -286 167 -285 340 0 340 0 369 629 c203 346 372 628 375 625 4 -2 151 -249 327 -549 l319 -546 339 3 339 2 168 285 c149 254 166 287 155 305 -66 104 -969 1651 -969 1659 0 6 246 431 548 944 470 800 550 930 560 915 35 -53 1090 -1858 1088 -1862 -1 -4 -210 -362 -465 -796 -255 -435 -476 -810 -491 -835 l-26 -46 167 -284 167 -285 340 0 339 0 321 547 c176 301 322 547 325 548 3 0 171 -284 375 -630 l370 -630 339 2 339 3 163 275 c97 163 162 283 161 295 -2 11 -164 293 -360 627 -197 334 -360 615 -363 623 -5 13 70 15 642 17 l647 3 168 285 c123 208 165 288 159 300 -5 8 -81 137 -168 285 l-160 270 -988 3 -989 2 -547 934 c-302 513 -548 936 -548 940 0 3 495 5 1101 4 l1100 -3 492 -837 492 -838 340 0 340 0 167 285 167 285 -296 502 c-162 277 -308 525 -324 551 -21 34 -26 49 -17 52 7 3 344 6 748 8 l734 2 163 275 c89 151 162 280 163 287 0 6 -74 137 -163 290 l-164 278 -746 5 -747 5 256 435 c141 239 287 487 324 552 l68 116 -166 286 -167 285 -340 0 -340 1 -491 -838 -492 -837 -1102 -3 c-731 -1 -1101 1 -1098 8 1 5 248 428 548 939 l545 930 989 3 990 3 167 285 c121 206 165 289 159 300 -5 8 -81 137 -168 285 l-159 270 -647 3 c-355 1 -646 5 -646 8 0 3 109 191 242 417 133 227 299 509 368 628 l127 216 -167 284 -168 284 -338 2 -339 3 -369 -630 c-204 -347 -372 -630 -375 -630 -4 0 -151 247 -327 548 l-322 547 -338 0 -338 0 -167 -285 c-144 -244 -166 -287 -157 -305 6 -11 200 -342 431 -735 231 -393 448 -762 482 -820 l62 -106 -551 -937 c-302 -515 -553 -934 -557 -929 -16 17 -1092 1857 -1092 1866 0 6 219 384 487 840 268 457 488 833 489 836 1 4 -74 136 -166 293 l-169 287 -334 0 -335 0 -22 -37 c-12 -20 -157 -266 -322 -547 -165 -281 -304 -510 -309 -509 -5 1 -174 282 -375 625 l-366 623 -336 3 c-262 2 -339 -1 -346 -10z";
        
        const SNOWFLAKE_PATH = typeof Path2D !== "undefined" ? new Path2D(SNOWFLAKE_PATH_DATA) : null;
        const SNOWFLAKE_BASE_EXTENT = 12800;
        let canvas = null;
        let ctx = null;
        let width = 0;
        let height = 0;
        let dpr = 1;
        let particles = [];
        let frameId = null;
        let lastTimestamp = 0;
        let reducedMotion = false;
        let running = false;

        function rand(min, max) { return Math.random() * (max - min) + min; }

        function resizeCanvas() {
            if (!canvas) return;
            const rect = canvas.getBoundingClientRect();
            dpr = window.devicePixelRatio || 1;
            width = rect.width || window.innerWidth;
            height = rect.height || window.innerHeight;
            canvas.width = width * dpr;
            canvas.height = height * dpr;
            if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        }

        function computeParticleCount() {
            const baseArea = 1280 * 720;
            const area = width * height || baseArea;
            const scale = Math.min(1.6, Math.max(0.6, area / baseArea));
            return Math.round(config.baseParticleCount * scale);
        }

        function createParticle(type) {
            const isFlake = type === 'flake';
            const size = isFlake ? rand(config.minFlakeSize, config.maxFlakeSize) : rand(config.minDotSize, config.maxDotSize);
            const speedY = isFlake ? rand(config.minFlakeSpeedY, config.maxFlakeSpeedY) : rand(config.minSpeedY, config.maxSpeedY);
            const opacity = isFlake ? rand(0.45, 0.95) : rand(config.minOpacity, config.maxOpacity);
            const swayAmplitude = rand(config.minSwayAmplitude, config.maxSwayAmplitude);
            const swayFrequency = rand(config.minSwayFrequency, config.maxSwayFrequency);
            const swayPhase = Math.random() * Math.PI * 2;
            const baseWind = rand(config.minWind, config.maxWind);
            let color = null;
            if (isFlake) {
                const h = rand(195, 215);
                const s = rand(50, 70);
                const l = rand(80, 95);
                color = `hsl(${h}, ${s}%, ${l}%)`;
            }
            return {
                x: Math.random() * width,
                y: Math.random() * height,
                size, speedY, opacity, swayAmplitude, swayFrequency, swayPhase, baseWind, color,
                rotation: isFlake ? rand(0, Math.PI * 2) : 0,
                rotationSpeed: isFlake ? rand(-0.45, 0.45) : 0,
                type: isFlake ? 'flake' : 'dot',
            };
        }

        function resetParticle(particle, fromTop) {
            const isFlake = particle.type === 'flake';
            particle.x = Math.random() * width;
            particle.y = fromTop ? -particle.size : Math.random() * height;
            // ... (resto de lógica de reset simplificada para brevedad) ...
            particle.size = isFlake ? rand(config.minFlakeSize, config.maxFlakeSize) : rand(config.minDotSize, config.maxDotSize);
            particle.speedY = isFlake ? rand(config.minFlakeSpeedY, config.maxFlakeSpeedY) : rand(config.minSpeedY, config.maxSpeedY);
            // Re-asignamos valores aleatorios
            particle.swayPhase = Math.random() * Math.PI * 2;
            if(isFlake) {
                 const h = rand(195, 215);
                 const s = rand(50, 70);
                 const l = rand(80, 95);
                 particle.color = `hsl(${h}, ${s}%, ${l}%)`;
            }
        }

        function initParticles() {
            particles = [];
            const total = computeParticleCount();
            const flakeCount = Math.round(total * config.flakeRatio);
            for (let i = 0; i < total; i++) {
                const type = i < flakeCount ? 'flake' : 'dot';
                particles.push(createParticle(type));
            }
        }

        function drawDot(p) {
            ctx.globalAlpha = p.opacity;
            const radius = p.size;
            const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, radius);
            gradient.addColorStop(0, 'rgba(255,255,255,1)');
            gradient.addColorStop(1, 'rgba(255,255,255,0)');
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
            ctx.fill();
        }

        function drawFlake(p) {
            if (!SNOWFLAKE_PATH) return;
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rotation);
            ctx.globalAlpha = p.opacity;
            const extent = SNOWFLAKE_BASE_EXTENT;
            const scale = (2 * p.size) / extent;
            ctx.scale(scale, scale);
            ctx.translate(-extent / 2, -extent / 2);
            ctx.fillStyle = p.color || 'hsl(205, 60%, 90%)';
            ctx.fill(SNOWFLAKE_PATH);
            ctx.restore();
        }

        function step(timestamp) {
            if (!ctx || !running) return;
            const dt = lastTimestamp ? (timestamp - lastTimestamp) / 1000 : 0.016;
            lastTimestamp = timestamp;
            ctx.clearRect(0, 0, width, height);
            
            for (const p of particles) {
                const swayOffset = Math.sin(timestamp * p.swayFrequency + p.swayPhase) * p.swayAmplitude;
                const wind = p.baseWind + swayOffset * 0.15;
                p.x += wind * dt;
                p.y += p.speedY * dt;
                if (p.type === 'flake') p.rotation += p.rotationSpeed * dt;
                
                if (p.y - p.size > height || p.x + p.size < 0 || p.x - p.size > width) {
                    resetParticle(p, true);
                }
                
                if (p.type === 'flake') drawFlake(p);
                else drawDot(p);
            }
            frameId = window.requestAnimationFrame(step);
        }

        function start(canvasEl) {
            canvas = canvasEl;
            ctx = canvas.getContext('2d');
            resizeCanvas();
            initParticles();
            running = true;
            frameId = window.requestAnimationFrame(step);
            
            window.addEventListener('resize', resizeCanvas);
        }

        function stop() {
            running = false;
            if (frameId) cancelAnimationFrame(frameId);
            window.removeEventListener('resize', resizeCanvas);
        }

        return { start, stop };
    })();

    // Iniciar efecto
    if (canvasRef.current) {
        Snowfall.start(canvasRef.current);
    }

    // Limpiar al desmontar
    return () => {
        Snowfall.stop();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  );
}