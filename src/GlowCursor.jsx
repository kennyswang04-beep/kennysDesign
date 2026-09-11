import { useEffect, useRef } from "react";

export default function GlowCursor({
  children,
  color = "#67E8F9",
  secondaryColor = "#A78BFA",
  trailLength = 48,
  trailWidth = 10,
  trailTaper = 0.8,
  followSpeed = 0.22,
  glowIntensity = 2.2,
  glowSpread = 1.35,
  hotspot = 0.65,
  brightness = 1.25,
  opacity = 1,
  pulseSpeed = 1.1,
  noiseStrength = 0,
  idleFade = false,
  idleTimeout = 700,
  fadeDuration = 900,
  blendMode = "screen"
}) {
  const hostRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;
    if (!host || !canvas) return undefined;

    const context = canvas.getContext("2d", { alpha: true });
    const shouldDisable = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      || window.matchMedia("(pointer: coarse)").matches;

    if (shouldDisable) {
      return undefined;
    }

    const state = {
      pointer: { x: 0, y: 0 },
      current: { x: 0, y: 0 },
      trail: [],
      active: false,
      lastMove: 0,
      alpha: 0,
      raf: 0
    };

    const resize = () => {
      const rect = host.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const move = (event) => {
      const rect = host.getBoundingClientRect();
      state.pointer.x = event.clientX - rect.left;
      state.pointer.y = event.clientY - rect.top;
      if (!state.active) {
        state.current.x = state.pointer.x;
        state.current.y = state.pointer.y;
        state.trail = Array.from({ length: trailLength }, () => ({ ...state.pointer }));
      }
      state.active = true;
      state.lastMove = performance.now();
    };

    const draw = (time) => {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      context.clearRect(0, 0, width, height);

      if (state.active) {
        state.current.x += (state.pointer.x - state.current.x) * followSpeed;
        state.current.y += (state.pointer.y - state.current.y) * followSpeed;
        state.trail.unshift({ x: state.current.x, y: state.current.y });
        state.trail.length = trailLength;
      }

      const idleElapsed = time - state.lastMove;
      const targetAlpha = state.active && (!idleFade || idleElapsed < idleTimeout) ? opacity : 0;
      const fadeStep = Math.max(0.018, 16 / Math.max(fadeDuration, 1));
      state.alpha += (targetAlpha - state.alpha) * fadeStep;

      if (state.alpha > 0.01 && state.trail.length > 1) {
        context.globalCompositeOperation = blendMode;
        const pulse = 1 + Math.sin((time / 1000) * pulseSpeed * Math.PI * 2) * 0.08;
        const smoothTrail = state.trail.filter((_, index) => index % 2 === 0);
        const cyanOffset = Math.max(2, Math.floor(smoothTrail.length * (1 - hotspot)));

        drawTrailPath(context, smoothTrail, {
          alpha: state.alpha * 0.18,
          blur: trailWidth * glowIntensity * glowSpread * 3.2,
          color,
          width: trailWidth * 3.2 * pulse
        });
        drawTrailPath(context, smoothTrail, {
          alpha: state.alpha * 0.24,
          blur: trailWidth * glowIntensity * glowSpread * 2,
          color: secondaryColor,
          offset: cyanOffset,
          width: trailWidth * 2.1 * pulse
        });
        drawTrailPath(context, smoothTrail, {
          alpha: state.alpha * 0.52 * brightness,
          blur: trailWidth * glowIntensity * glowSpread,
          color,
          width: trailWidth * pulse
        });
        drawTrailPath(context, smoothTrail, {
          alpha: state.alpha * 0.72,
          blur: trailWidth * 0.8,
          color: "#FFFFFF",
          width: Math.max(1.4, trailWidth * 0.34 * pulse)
        });

        const head = state.trail[0];
        const gradient = context.createRadialGradient(
          head.x,
          head.y,
          0,
          head.x,
          head.y,
          trailWidth * glowIntensity * 8
        );
        gradient.addColorStop(0, hexToRgba(color, state.alpha * 0.42 * brightness));
        gradient.addColorStop(0.45, hexToRgba(secondaryColor, state.alpha * 0.16));
        gradient.addColorStop(1, "rgba(255,255,255,0)");
        context.shadowBlur = 0;
        context.fillStyle = gradient;
        context.beginPath();
        context.arc(head.x, head.y, trailWidth * glowIntensity * 8, 0, Math.PI * 2);
        context.fill();

        if (noiseStrength > 0) {
          context.globalCompositeOperation = "source-over";
          context.fillStyle = `rgba(255,255,255,${noiseStrength * state.alpha})`;
          for (let index = 0; index < 18; index += 1) {
            const sparkle = state.trail[Math.floor(Math.random() * state.trail.length)] || head;
            context.fillRect(
              sparkle.x + (Math.random() - 0.5) * 44,
              sparkle.y + (Math.random() - 0.5) * 44,
              1,
              1
            );
          }
        }
      }

      state.raf = requestAnimationFrame(draw);
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(host);
    const leave = () => {
      state.lastMove = performance.now() - idleTimeout;
    };
    window.addEventListener("pointermove", move);
    host.addEventListener("pointerleave", leave);
    state.raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(state.raf);
      observer.disconnect();
      window.removeEventListener("pointermove", move);
      host.removeEventListener("pointerleave", leave);
    };
  }, [
    color,
    secondaryColor,
    trailLength,
    trailWidth,
    trailTaper,
    followSpeed,
    glowIntensity,
    glowSpread,
    hotspot,
    brightness,
    opacity,
    pulseSpeed,
    noiseStrength,
    idleFade,
    idleTimeout,
    fadeDuration,
    blendMode
  ]);

  return (
    <div className="glow-cursor" ref={hostRef}>
      <canvas aria-hidden="true" className="glow-cursor-canvas" ref={canvasRef} />
      {children}
    </div>
  );
}

function drawTrailPath(context, points, { alpha, blur, color, offset = 0, width }) {
  const visiblePoints = offset > 0 ? points.slice(0, Math.max(2, points.length - offset)) : points;
  if (visiblePoints.length < 2) return;

  context.save();
  context.beginPath();
  context.moveTo(visiblePoints[visiblePoints.length - 1].x, visiblePoints[visiblePoints.length - 1].y);

  for (let index = visiblePoints.length - 2; index > 0; index -= 1) {
    const point = visiblePoints[index];
    const next = visiblePoints[index - 1];
    const midX = (point.x + next.x) / 2;
    const midY = (point.y + next.y) / 2;
    context.quadraticCurveTo(point.x, point.y, midX, midY);
  }

  const head = visiblePoints[0];
  context.lineTo(head.x, head.y);
  context.lineWidth = width;
  context.lineCap = "round";
  context.lineJoin = "round";
  context.shadowBlur = blur;
  context.shadowColor = color;
  context.strokeStyle = hexToRgba(color, alpha);
  context.stroke();
  context.restore();
}

function hexToRgba(hex, alpha) {
  const normalized = hex.replace("#", "");
  const value = normalized.length === 3
    ? normalized.split("").map((char) => char + char).join("")
    : normalized;
  const number = Number.parseInt(value, 16);
  const red = (number >> 16) & 255;
  const green = (number >> 8) & 255;
  const blue = number & 255;

  return `rgba(${red}, ${green}, ${blue}, ${Math.max(0, Math.min(alpha, 1))})`;
}
