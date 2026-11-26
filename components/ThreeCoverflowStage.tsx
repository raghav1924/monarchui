'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { MonarchComponent } from '@/src/types';

interface ThreeCoverflowStageProps {
  components: MonarchComponent[];
  activeIndex: number;
  darkMode: boolean;
  autoOrbit?: boolean;
  slabSpread?: number;
  onSelectIndex: (index: number) => void;
  onInspectIndex?: (index: number) => void;
}

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  const rad = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rad, y);
  ctx.lineTo(x + w - rad, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + rad);
  ctx.lineTo(x + w, y + h - rad);
  ctx.quadraticCurveTo(x + w, y + h, x + w - rad, y + h);
  ctx.lineTo(x + rad, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - rad);
  ctx.lineTo(x, y + rad);
  ctx.quadraticCurveTo(x, y, x + rad, y);
  ctx.closePath();
}

function createSlabTexture(
  comp: MonarchComponent,
  index: number,
  dark: boolean,
  maxAnisotropy: number
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1280;
  canvas.height = 880;
  const ctx = canvas.getContext('2d')!;
  ctx.scale(2, 2); // 2x Retina crispness (logical 640x440)

  const bg = dark ? '#111113' : '#ffffff';
  const subBg = dark ? '#18181b' : '#f7f7f8';
  const border = dark ? '#27272a' : '#e4e4e7';
  const strong = dark ? '#fafafa' : '#09090b';
  const muted = dark ? '#a1a1aa' : '#71717a';

  ctx.clearRect(0, 0, 640, 440);
  ctx.save();
  drawRoundedRect(ctx, 2, 2, 636, 436, 20);
  ctx.clip();

  // Clean card background
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, 640, 440);

  // Subtle architectural header strip
  ctx.strokeStyle = border;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(0, 56);
  ctx.lineTo(640, 56);
  ctx.stroke();

  ctx.fillStyle = muted;
  ctx.font = '600 13px ui-monospace, SFMono-Regular, Menlo, monospace';
  ctx.fillText(`${String(index + 1).padStart(2, '0')} // ${comp.category.toUpperCase()}`, 26, 34);

  ctx.textAlign = 'right';
  ctx.fillText(comp.tier.toUpperCase(), 614, 34);
  ctx.textAlign = 'left';

  // Component miniature UI preview area (y: 74..324)
  const px = 28;
  const py = 74;
  const pw = 584;
  const ph = 250;

  drawRoundedRect(ctx, px, py, pw, ph, 14);
  ctx.fillStyle = subBg;
  ctx.fill();
  ctx.strokeStyle = border;
  ctx.stroke();

  ctx.strokeStyle = strong;
  ctx.fillStyle = strong;

  switch (comp.id) {
    case 'spotlight-bento': {
      const cells = [
        [px + 18, py + 18, 330, 100],
        [px + 362, py + 18, 204, 100],
        [px + 18, py + 132, 174, 100],
        [px + 206, py + 132, 174, 100],
        [px + 394, py + 132, 172, 100]
      ];
      cells.forEach(([x, y, w, h], ci) => {
        drawRoundedRect(ctx, x, y, w, h, 8);
        ctx.fillStyle = bg;
        ctx.fill();
        ctx.strokeStyle = ci === 0 ? strong : border;
        ctx.stroke();
        ctx.fillStyle = ci === 0 ? strong : muted;
        ctx.fillRect(x + 14, y + 16, w * 0.45, 8);
        ctx.fillStyle = border;
        ctx.fillRect(x + 14, y + 34, w * 0.7, 6);
      });
      break;
    }
    case 'spatial-dock': {
      const dw = 360;
      const dx = px + (pw - dw) / 2;
      const dy = py + 95;
      drawRoundedRect(ctx, dx, dy, dw, 74, 16);
      ctx.fillStyle = bg;
      ctx.fill();
      ctx.strokeStyle = strong;
      ctx.stroke();
      for (let k = 0; k < 5; k++) {
        const size = k === 2 ? 54 : k === 1 || k === 3 ? 44 : 36;
        const ix = dx + 26 + k * 66;
        const iy = dy + 58 - size;
        drawRoundedRect(ctx, ix, iy, size, size, 10);
        ctx.fillStyle = k === 2 ? strong : subBg;
        ctx.fill();
        ctx.strokeStyle = strong;
        ctx.stroke();
      }
      break;
    }
    case 'kinetic-card-3d': {
      ctx.save();
      ctx.translate(px + pw / 2, py + ph / 2);
      ctx.rotate(-0.05);
      drawRoundedRect(ctx, -170, -82, 340, 164, 14);
      ctx.fillStyle = bg;
      ctx.fill();
      ctx.strokeStyle = strong;
      ctx.stroke();
      ctx.fillStyle = strong;
      ctx.font = '700 22px -apple-system, sans-serif';
      ctx.fillText('RENDERJET 3D', -142, -32);
      ctx.fillStyle = muted;
      ctx.font = '500 14px ui-monospace, monospace';
      ctx.fillText('rotateX(12deg) rotateY(-8deg)', -142, 4);
      ctx.fillStyle = strong;
      ctx.fillRect(-142, 36, 120, 8);
      ctx.restore();
      break;
    }
    case 'command-palette': {
      const mx = px + 102;
      const my = py + 24;
      drawRoundedRect(ctx, mx, my, 380, 200, 12);
      ctx.fillStyle = bg;
      ctx.fill();
      ctx.strokeStyle = strong;
      ctx.stroke();
      ctx.fillStyle = muted;
      ctx.font = '500 14px ui-monospace, monospace';
      ctx.fillText('> Search primitives...        ⌘K', mx + 16, my + 34);
      ctx.beginPath();
      ctx.moveTo(mx, my + 50);
      ctx.lineTo(mx + 380, my + 50);
      ctx.strokeStyle = border;
      ctx.stroke();
      ['01  Spotlight Bento', '02  Spatial Dock', '03  Dynamic Island'].forEach((row, rIdx) => {
        if (rIdx === 0) {
          drawRoundedRect(ctx, mx + 8, my + 60, 364, 38, 8);
          ctx.fillStyle = subBg;
          ctx.fill();
        }
        ctx.fillStyle = rIdx === 0 ? strong : muted;
        ctx.fillText(row, mx + 20, my + 84 + rIdx * 42);
      });
      break;
    }
    case 'champagne-button': {
      drawRoundedRect(ctx, px + 162, py + 94, 260, 60, 999);
      ctx.fillStyle = strong;
      ctx.fill();
      ctx.fillStyle = bg;
      ctx.font = '600 18px -apple-system, sans-serif';
      ctx.fillText('Explore Collection  →', px + 196, py + 130);
      break;
    }
    case 'dynamic-island': {
      drawRoundedRect(ctx, px + 132, py + 86, 320, 74, 999);
      ctx.fillStyle = strong;
      ctx.fill();
      ctx.fillStyle = '#10b981';
      ctx.beginPath();
      ctx.arc(px + 166, py + 123, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = bg;
      ctx.font = '600 16px -apple-system, sans-serif';
      ctx.fillText('Deployment Live · 42ms', px + 188, py + 128);
      break;
    }
    case 'aurora-hero': {
      const g1 = ctx.createRadialGradient(px + 292, py + 90, 10, px + 292, py + 90, 190);
      g1.addColorStop(0, 'rgba(56, 189, 248, 0.28)');
      g1.addColorStop(1, 'transparent');
      ctx.fillStyle = g1;
      ctx.fillRect(px, py, pw, ph);

      ctx.fillStyle = muted;
      ctx.font = '600 12px ui-monospace, monospace';
      ctx.fillText('01 // LIQUID AURORA HERO', px + 190, py + 62);
      ctx.fillStyle = strong;
      ctx.font = '700 26px -apple-system, sans-serif';
      ctx.fillText('Crafted for the Extraordinary.', px + 106, py + 112);
      drawRoundedRect(ctx, px + 216, py + 146, 152, 36, 999);
      ctx.fillStyle = strong;
      ctx.fill();
      ctx.fillStyle = bg;
      ctx.font = '600 13px -apple-system, sans-serif';
      ctx.fillText('Get Started →', px + 244, py + 169);
      break;
    }
    case 'pricing-crown': {
      drawRoundedRect(ctx, px + 52, py + 30, 224, 190, 12);
      ctx.fillStyle = bg;
      ctx.fill();
      ctx.strokeStyle = border;
      ctx.stroke();
      ctx.fillStyle = muted;
      ctx.font = '600 11px ui-monospace, monospace';
      ctx.fillText('STARTER', px + 72, py + 58);
      ctx.fillStyle = strong;
      ctx.font = '700 34px ui-monospace, monospace';
      ctx.fillText('$15/mo', px + 72, py + 106);

      drawRoundedRect(ctx, px + 302, py + 30, 230, 190, 12);
      ctx.fillStyle = bg;
      ctx.fill();
      ctx.strokeStyle = strong;
      ctx.stroke();
      ctx.fillStyle = strong;
      ctx.font = '600 11px ui-monospace, monospace';
      ctx.fillText('CROWN TIER · POPULAR', px + 322, py + 58);
      ctx.font = '700 34px ui-monospace, monospace';
      ctx.fillText('$39/mo', px + 322, py + 106);
      ctx.fillStyle = muted;
      ctx.font = '500 13px -apple-system, sans-serif';
      ctx.fillText('✓ All 12 Royal Primitives', px + 322, py + 148);
      ctx.fillText('✓ Zero Runtime Deps', px + 322, py + 174);
      break;
    }
    case 'kinetic-marquee': {
      ['NEXT.JS', 'TAILWIND', 'THREE.JS', 'R·J UI'].forEach((lbl, li) => {
        const bx = px + 26 + li * 136;
        drawRoundedRect(ctx, bx, py + 54, 120, 48, 8);
        ctx.fillStyle = bg;
        ctx.fill();
        ctx.strokeStyle = strong;
        ctx.stroke();
        ctx.fillStyle = strong;
        ctx.font = '700 13px ui-monospace, monospace';
        ctx.fillText(lbl, bx + 22, py + 83);
      });
      ['STRIPE', 'LINEAR', 'VERCEL', 'RAYCAST'].forEach((lbl, li) => {
        const bx = px + 26 + li * 136;
        drawRoundedRect(ctx, bx, py + 132, 120, 48, 8);
        ctx.fillStyle = bg;
        ctx.fill();
        ctx.strokeStyle = border;
        ctx.setLineDash([4, 4]);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = muted;
        ctx.font = '600 13px ui-monospace, monospace';
        ctx.fillText(lbl, bx + 26, py + 161);
      });
      break;
    }
    case 'metric-sparkline': {
      ctx.fillStyle = muted;
      ctx.font = '600 13px ui-monospace, monospace';
      ctx.fillText('NET REVENUE        +24.8%', px + 44, py + 54);
      ctx.fillStyle = strong;
      ctx.font = '700 38px ui-monospace, monospace';
      ctx.fillText('$148,920', px + 44, py + 106);
      ctx.beginPath();
      ctx.moveTo(px + 44, py + 195);
      ctx.bezierCurveTo(px + 140, py + 185, px + 240, py + 120, px + 340, py + 145);
      ctx.bezierCurveTo(px + 420, py + 165, px + 480, py + 85, px + 540, py + 72);
      ctx.strokeStyle = strong;
      ctx.lineWidth = 3;
      ctx.stroke();
      ctx.lineWidth = 1.5;
      break;
    }
    case 'split-compare': {
      drawRoundedRect(ctx, px + 44, py + 45, 496, 160, 10);
      ctx.fillStyle = bg;
      ctx.fill();
      ctx.fillStyle = dark ? '#27272a' : '#e4e4e7';
      ctx.fillRect(px + 44, py + 45, 248, 160);
      ctx.strokeStyle = strong;
      drawRoundedRect(ctx, px + 44, py + 45, 496, 160, 10);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(px + 292, py + 45);
      ctx.lineTo(px + 292, py + 205);
      ctx.stroke();
      ctx.fillStyle = muted;
      ctx.font = '600 14px ui-monospace, monospace';
      ctx.fillText('RAW', px + 68, py + 130);
      ctx.fillStyle = strong;
      ctx.fillText('R·J UI', px + 440, py + 130);
      break;
    }
    default: {
      for (let c = 0; c < 3; c++) {
        const cx = px + 22 + c * 184;
        drawRoundedRect(ctx, cx, py + 32, 170, 186, 10);
        ctx.fillStyle = bg;
        ctx.fill();
        ctx.strokeStyle = c === 1 ? strong : border;
        ctx.stroke();
        ctx.fillStyle = strong;
        ctx.fillRect(cx + 16, py + 54, 120, 8);
        ctx.fillStyle = muted;
        ctx.fillRect(cx + 16, py + 74, 136, 6);
        ctx.fillRect(cx + 16, py + 90, 110, 6);
        ctx.fillStyle = strong;
        ctx.fillRect(cx + 16, py + 182, 70, 8);
      }
      break;
    }
  }

  // Title & footer strip
  ctx.fillStyle = strong;
  ctx.font = '600 22px -apple-system, BlinkMacSystemFont, sans-serif';
  ctx.fillText(comp.name, 28, 376);

  ctx.fillStyle = muted;
  ctx.font = '500 13px ui-monospace, SFMono-Regular, Menlo, monospace';
  ctx.fillText(comp.filename, 28, 406);

  ctx.textAlign = 'right';
  ctx.fillText('CLICK TO INSPECT →', 612, 406);
  ctx.textAlign = 'left';

  ctx.restore();

  // Crisp outer rounded border
  drawRoundedRect(ctx, 2, 2, 636, 436, 20);
  ctx.strokeStyle = border;
  ctx.lineWidth = 2;
  ctx.stroke();

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = maxAnisotropy;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.needsUpdate = true;
  return texture;
}

export function ThreeCoverflowStage({
  components,
  activeIndex,
  darkMode,
  autoOrbit = false,
  slabSpread = 2.15,
  onSelectIndex,
  onInspectIndex
}: ThreeCoverflowStageProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef(activeIndex);
  activeRef.current = activeIndex;
  const orbitRef = useRef(autoOrbit);
  orbitRef.current = autoOrbit;
  const spreadRef = useRef(slabSpread);
  spreadRef.current = slabSpread;
  const onSelectRef = useRef(onSelectIndex);
  onSelectRef.current = onSelectIndex;
  const onInspectRef = useRef(onInspectIndex);
  onInspectRef.current = onInspectIndex;

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 1080;
    const height = container.clientHeight || 420;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(0, 0.1, 4.9);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const gridColor = darkMode ? 0x27272a : 0xe4e4e7;
    const grid = new THREE.GridHelper(24, 30, gridColor, gridColor);
    grid.position.y = -1.35;
    scene.add(grid);

    const slabs: {
      group: THREE.Group;
      fillMat: THREE.MeshBasicMaterial;
      texture: THREE.CanvasTexture;
    }[] = [];

    const planeGeo = new THREE.PlaneGeometry(2.55, 1.75);
    const maxAnisotropy = Math.min(16, renderer.capabilities.getMaxAnisotropy() || 4);

    components.forEach((comp, i) => {
      const group = new THREE.Group();
      const texture = createSlabTexture(comp, i, darkMode, maxAnisotropy);
      const fillMat = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        opacity: 1
      });
      const mesh = new THREE.Mesh(planeGeo, fillMat);

      group.add(mesh);
      group.userData = { index: i };
      scene.add(group);
      slabs.push({ group, fillMat, texture });
    });

    let pointerX = 0;
    let pointerY = 0;
    let wheelCooldown = 0;
    const raycaster = new THREE.Raycaster();
    const pointerNdc = new THREE.Vector2();

    const onPointerMove = (e: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      pointerX = ((e.clientX - rect.left) / rect.width - 0.5) * 0.35;
      pointerY = ((e.clientY - rect.top) / rect.height - 0.5) * 0.2;
    };

    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY) && Math.abs(e.deltaX) > 12) {
        e.preventDefault();
        const now = performance.now();
        if (now - wheelCooldown < 240) return;
        wheelCooldown = now;
        const next =
          e.deltaX > 0
            ? Math.min(components.length - 1, activeRef.current + 1)
            : Math.max(0, activeRef.current - 1);
        if (next !== activeRef.current) onSelectRef.current(next);
      }
    };

    const onClick = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      pointerNdc.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointerNdc.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointerNdc, camera);
      const hits = raycaster.intersectObjects(
        slabs.map((s) => s.group.children[0]),
        false
      );
      if (hits.length > 0 && hits[0].object.parent) {
        const idx = hits[0].object.parent.userData.index;
        if (typeof idx === 'number') {
          if (idx === activeRef.current) {
            onInspectRef.current?.(idx);
          } else {
            onSelectRef.current(idx);
          }
        }
      }
    };

    renderer.domElement.addEventListener('pointermove', onPointerMove);
    renderer.domElement.addEventListener('wheel', onWheel, { passive: false });
    renderer.domElement.addEventListener('click', onClick);

    const resizeObserver = new ResizeObserver(() => {
      if (!container) return;
      const w = container.clientWidth || 1080;
      const h = container.clientHeight || 420;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });
    resizeObserver.observe(container);

    let rafId = 0;
    let tickTime = 0;
    const animate = () => {
      rafId = requestAnimationFrame(animate);
      tickTime += 0.02;
      const curr = activeRef.current;
      const spread = spreadRef.current;

      slabs.forEach((s, i) => {
        const offset = i - curr;
        const abs = Math.abs(offset);
        const targetX = offset * spread;
        const targetZ = offset === 0 ? 0.95 : -abs * 0.65;
        const orbitYaw = orbitRef.current && offset === 0 ? Math.sin(tickTime) * 0.25 : 0;
        const targetRotY = offset === 0 ? pointerX * 0.28 + orbitYaw : Math.sign(offset) * -0.46;
        const targetRotX = offset === 0 ? -pointerY * 0.18 : 0;
        const targetScale = offset === 0 ? 1.15 : Math.max(0.68, 0.88 - abs * 0.08);

        s.group.position.x += (targetX - s.group.position.x) * 0.14;
        s.group.position.z += (targetZ - s.group.position.z) * 0.14;
        s.group.rotation.y += (targetRotY - s.group.rotation.y) * 0.14;
        s.group.rotation.x += (targetRotX - s.group.rotation.x) * 0.14;
        s.group.scale.x += (targetScale - s.group.scale.x) * 0.14;
        s.group.scale.y += (targetScale - s.group.scale.y) * 0.14;

        const targetOpacity = offset === 0 ? 1 : Math.max(0.58, 0.94 - abs * 0.12);
        s.fillMat.opacity += (targetOpacity - s.fillMat.opacity) * 0.14;
        s.group.visible = abs <= 3;
      });

      camera.position.x += (pointerX * 0.35 - camera.position.x) * 0.08;
      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
      renderer.domElement.removeEventListener('pointermove', onPointerMove);
      renderer.domElement.removeEventListener('wheel', onWheel);
      renderer.domElement.removeEventListener('click', onClick);
      planeGeo.dispose();
      slabs.forEach((s) => {
        s.texture.dispose();
        s.fillMat.dispose();
      });
      renderer.dispose();
    };
  }, [components, darkMode]);

  return (
    <div
      ref={mountRef}
      className="h-[270px] w-full cursor-pointer overflow-hidden rounded-xl border border-neutral-200/80 bg-neutral-50/70 select-none sm:h-[310px] dark:border-neutral-800 dark:bg-neutral-950/60"
    />
  );
}
