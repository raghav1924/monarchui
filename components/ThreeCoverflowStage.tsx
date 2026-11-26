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
}

function createSlabTexture(comp: MonarchComponent, index: number, dark: boolean): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 640;
  canvas.height = 440;
  const ctx = canvas.getContext('2d')!;

  const bg = dark ? '#111113' : '#ffffff';
  const subBg = dark ? '#18181b' : '#f4f4f5';
  const border = dark ? '#27272a' : '#e4e4e7';
  const strong = dark ? '#fafafa' : '#09090b';
  const muted = dark ? '#a1a1aa' : '#71717a';

  // Card background
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, 640, 440);

  // Header strip
  ctx.strokeStyle = border;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, 56);
  ctx.lineTo(640, 56);
  ctx.stroke();

  ctx.fillStyle = muted;
  ctx.font = '600 15px ui-monospace, SFMono-Regular, Menlo, monospace';
  ctx.fillText(`${String(index + 1).padStart(2, '0')} // ${comp.category.toUpperCase()}`, 24, 34);

  ctx.textAlign = 'right';
  ctx.fillText(comp.tier.toUpperCase(), 616, 34);
  ctx.textAlign = 'left';

  // Component miniature UI wireframe preview area (y: 74..340)
  const px = 28;
  const py = 74;
  const pw = 584;
  const ph = 250;

  ctx.fillStyle = subBg;
  ctx.fillRect(px, py, pw, ph);
  ctx.strokeStyle = border;
  ctx.strokeRect(px, py, pw, ph);

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
        ctx.fillStyle = bg;
        ctx.fillRect(x, y, w, h);
        ctx.strokeStyle = ci === 0 ? strong : border;
        ctx.strokeRect(x, y, w, h);
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
      ctx.fillStyle = bg;
      ctx.fillRect(dx, dy, dw, 74);
      ctx.strokeStyle = strong;
      ctx.strokeRect(dx, dy, dw, 74);
      for (let k = 0; k < 5; k++) {
        const size = k === 2 ? 56 : k === 1 || k === 3 ? 44 : 36;
        const ix = dx + 26 + k * 66;
        const iy = dy + 58 - size;
        ctx.fillStyle = k === 2 ? strong : subBg;
        ctx.fillRect(ix, iy, size, size);
        ctx.strokeStyle = strong;
        ctx.strokeRect(ix, iy, size, size);
      }
      break;
    }
    case 'kinetic-card-3d': {
      ctx.save();
      ctx.translate(px + pw / 2, py + ph / 2);
      ctx.rotate(-0.06);
      ctx.fillStyle = bg;
      ctx.fillRect(-170, -82, 340, 164);
      ctx.strokeStyle = strong;
      ctx.strokeRect(-170, -82, 340, 164);
      ctx.fillStyle = strong;
      ctx.font = '700 22px -apple-system, sans-serif';
      ctx.fillText('MONARCH 3D CARD', -142, -32);
      ctx.fillStyle = muted;
      ctx.font = '500 15px ui-monospace, monospace';
      ctx.fillText('rotateX(12deg) rotateY(-8deg)', -142, 4);
      ctx.fillStyle = strong;
      ctx.fillRect(-142, 36, 120, 10);
      ctx.restore();
      break;
    }
    case 'command-palette': {
      const mx = px + 102;
      const my = py + 24;
      ctx.fillStyle = bg;
      ctx.fillRect(mx, my, 380, 200);
      ctx.strokeStyle = strong;
      ctx.strokeRect(mx, my, 380, 200);
      ctx.fillStyle = muted;
      ctx.font = '500 15px ui-monospace, monospace';
      ctx.fillText('> Search primitives...        ⌘K', mx + 16, my + 34);
      ctx.beginPath();
      ctx.moveTo(mx, my + 50);
      ctx.lineTo(mx + 380, my + 50);
      ctx.strokeStyle = border;
      ctx.stroke();
      ['01  Spotlight Bento', '02  Spatial Dock', '03  Dynamic Island'].forEach((row, rIdx) => {
        if (rIdx === 0) {
          ctx.fillStyle = subBg;
          ctx.fillRect(mx + 8, my + 60, 364, 38);
        }
        ctx.fillStyle = rIdx === 0 ? strong : muted;
        ctx.fillText(row, mx + 20, my + 84 + rIdx * 42);
      });
      break;
    }
    case 'champagne-button': {
      ctx.fillStyle = strong;
      ctx.fillRect(px + 162, py + 94, 260, 60);
      ctx.fillStyle = bg;
      ctx.font = '600 18px -apple-system, sans-serif';
      ctx.fillText('Explore Collection  →', px + 196, py + 130);
      break;
    }
    case 'dynamic-island': {
      ctx.fillStyle = strong;
      ctx.fillRect(px + 132, py + 86, 320, 74);
      ctx.fillStyle = '#10b981';
      ctx.beginPath();
      ctx.arc(px + 164, py + 123, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = bg;
      ctx.font = '600 16px -apple-system, sans-serif';
      ctx.fillText('Deployment Live · 42ms', px + 186, py + 128);
      break;
    }
    case 'aurora-hero': {
      ctx.fillStyle = muted;
      ctx.font = '600 13px ui-monospace, monospace';
      ctx.fillText('01 // EDITORIAL HERO', px + 195, py + 62);
      ctx.fillStyle = strong;
      ctx.font = '700 30px -apple-system, sans-serif';
      ctx.fillText('Crafted with Precision.', px + 128, py + 114);
      ctx.fillStyle = muted;
      ctx.fillRect(px + 152, py + 140, 280, 10);
      ctx.fillRect(px + 192, py + 160, 200, 10);
      break;
    }
    case 'pricing-crown': {
      ctx.fillStyle = bg;
      ctx.fillRect(px + 162, py + 24, 260, 202);
      ctx.strokeStyle = strong;
      ctx.strokeRect(px + 162, py + 24, 260, 202);
      ctx.fillStyle = muted;
      ctx.font = '600 12px ui-monospace, monospace';
      ctx.fillText('CROWN TIER // ANNUAL', px + 184, py + 56);
      ctx.fillStyle = strong;
      ctx.font = '700 42px ui-monospace, monospace';
      ctx.fillText('$39/mo', px + 184, py + 112);
      ctx.fillStyle = muted;
      ctx.font = '500 14px -apple-system, sans-serif';
      ctx.fillText('✓ All 12 UI Primitives', px + 184, py + 154);
      ctx.fillText('✓ Zero Runtime Deps', px + 184, py + 180);
      break;
    }
    case 'kinetic-marquee': {
      ['NEXT.JS', 'TAILWIND', 'THREE.JS', 'MONARCH'].forEach((lbl, li) => {
        const bx = px + 26 + li * 136;
        ctx.fillStyle = bg;
        ctx.fillRect(bx, py + 98, 120, 48);
        ctx.strokeStyle = strong;
        ctx.strokeRect(bx, py + 98, 120, 48);
        ctx.fillStyle = strong;
        ctx.font = '700 13px ui-monospace, monospace';
        ctx.fillText(lbl, bx + 24, py + 127);
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
      ctx.lineWidth = 2;
      break;
    }
    case 'split-compare': {
      ctx.fillStyle = bg;
      ctx.fillRect(px + 44, py + 45, 496, 160);
      ctx.fillStyle = dark ? '#27272a' : '#e4e4e7';
      ctx.fillRect(px + 44, py + 45, 248, 160);
      ctx.strokeStyle = strong;
      ctx.strokeRect(px + 44, py + 45, 496, 160);
      ctx.beginPath();
      ctx.moveTo(px + 292, py + 45);
      ctx.lineTo(px + 292, py + 205);
      ctx.stroke();
      ctx.fillStyle = muted;
      ctx.font = '600 14px ui-monospace, monospace';
      ctx.fillText('RAW', px + 68, py + 130);
      ctx.fillStyle = strong;
      ctx.fillText('MONARCH', px + 440, py + 130);
      break;
    }
    default: {
      // founder-wall
      for (let c = 0; c < 3; c++) {
        const cx = px + 22 + c * 184;
        ctx.fillStyle = bg;
        ctx.fillRect(cx, py + 32, 170, 186);
        ctx.strokeStyle = c === 1 ? strong : border;
        ctx.strokeRect(cx, py + 32, 170, 186);
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
  ctx.font = '500 14px ui-monospace, SFMono-Regular, Menlo, monospace';
  ctx.fillText(comp.filename, 28, 408);

  ctx.textAlign = 'right';
  ctx.fillText('CLICK TO INSPECT →', 612, 408);
  ctx.textAlign = 'left';

  const texture = new THREE.CanvasTexture(canvas);
  texture.anisotropy = 4;
  texture.needsUpdate = true;
  return texture;
}

export function ThreeCoverflowStage({
  components,
  activeIndex,
  darkMode,
  autoOrbit = false,
  slabSpread = 2.25,
  onSelectIndex
}: ThreeCoverflowStageProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef(activeIndex);
  activeRef.current = activeIndex;
  const orbitRef = useRef(autoOrbit);
  orbitRef.current = autoOrbit;
  const spreadRef = useRef(slabSpread);
  spreadRef.current = slabSpread;

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 1080;
    const height = container.clientHeight || 460;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0.12, 4.4);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const gridColor = darkMode ? 0x27272a : 0xd4d4d8;
    const grid = new THREE.GridHelper(24, 30, gridColor, gridColor);
    grid.position.y = -1.35;
    scene.add(grid);

    const slabs: {
      group: THREE.Group;
      fillMat: THREE.MeshBasicMaterial;
      edgeMat: THREE.LineBasicMaterial;
      texture: THREE.CanvasTexture;
    }[] = [];

    const planeGeo = new THREE.BoxGeometry(2.55, 1.75, 0.05);
    const edgesGeo = new THREE.EdgesGeometry(planeGeo);

    components.forEach((comp, i) => {
      const group = new THREE.Group();
      const texture = createSlabTexture(comp, i, darkMode);
      const fillMat = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        opacity: 0.96
      });
      const mesh = new THREE.Mesh(planeGeo, fillMat);

      const edgeMat = new THREE.LineBasicMaterial({
        color: darkMode ? 0x52525b : 0xa1a1aa
      });
      const wireframe = new THREE.LineSegments(edgesGeo, edgeMat);

      group.add(mesh);
      group.add(wireframe);
      group.userData = { index: i };
      scene.add(group);
      slabs.push({ group, fillMat, edgeMat, texture });
    });

    let pointerX = 0;
    let pointerY = 0;
    const raycaster = new THREE.Raycaster();
    const pointerNdc = new THREE.Vector2();

    const onPointerMove = (e: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      pointerX = ((e.clientX - rect.left) / rect.width - 0.5) * 0.4;
      pointerY = ((e.clientY - rect.top) / rect.height - 0.5) * 0.22;
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
        if (typeof idx === 'number') onSelectIndex(idx);
      }
    };

    renderer.domElement.addEventListener('pointermove', onPointerMove);
    renderer.domElement.addEventListener('click', onClick);

    const resizeObserver = new ResizeObserver(() => {
      if (!container) return;
      const w = container.clientWidth || 1080;
      const h = container.clientHeight || 460;
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
        const targetZ = offset === 0 ? 0.9 : -abs * 0.7;
        const orbitYaw = orbitRef.current && offset === 0 ? Math.sin(tickTime) * 0.28 : 0;
        const targetRotY = offset === 0 ? pointerX * 0.3 + orbitYaw : Math.sign(offset) * -0.45;
        const targetRotX = offset === 0 ? -pointerY * 0.2 : 0;
        const targetScale = offset === 0 ? 1.18 : Math.max(0.66, 0.88 - abs * 0.08);

        s.group.position.x += (targetX - s.group.position.x) * 0.14;
        s.group.position.z += (targetZ - s.group.position.z) * 0.14;
        s.group.rotation.y += (targetRotY - s.group.rotation.y) * 0.14;
        s.group.rotation.x += (targetRotX - s.group.rotation.x) * 0.14;
        s.group.scale.x += (targetScale - s.group.scale.x) * 0.14;
        s.group.scale.y += (targetScale - s.group.scale.y) * 0.14;

        const isActive = offset === 0;
        s.edgeMat.color.setHex(
          isActive
            ? darkMode
              ? 0xfafafa
              : 0x09090b
            : darkMode
              ? 0x3f3f46
              : 0xd4d4d8
        );
        s.fillMat.opacity = abs > 3 ? 0 : isActive ? 1 : 0.72;
      });

      camera.position.x += (pointerX * 0.45 - camera.position.x) * 0.08;
      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
      renderer.domElement.removeEventListener('pointermove', onPointerMove);
      renderer.domElement.removeEventListener('click', onClick);
      planeGeo.dispose();
      edgesGeo.dispose();
      slabs.forEach((s) => {
        s.texture.dispose();
        s.fillMat.dispose();
        s.edgeMat.dispose();
      });
      renderer.dispose();
    };
  }, [components, darkMode, onSelectIndex]);

  return (
    <div
      ref={mountRef}
      className="h-[440px] md:h-[500px] w-full cursor-grab active:cursor-grabbing border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/40"
    />
  );
}
