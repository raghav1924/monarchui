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

const CARD_PALETTES: Array<{
  base: string;
  glowA: string;
  glowB: string;
  text: string;
  muted: string;
}> = [
  // Coral / Violet (Signature Cover Flow hero card look)
  {
    base: '#3b2640',
    glowA: 'rgba(249, 115, 92, 0.92)',
    glowB: 'rgba(139, 149, 246, 0.85)',
    text: '#ffffff',
    muted: 'rgba(255,255,255,0.72)'
  },
  // Deep Emerald
  {
    base: '#063325',
    glowA: 'rgba(16, 185, 129, 0.55)',
    glowB: 'rgba(6, 78, 59, 0.85)',
    text: '#ffffff',
    muted: 'rgba(255,255,255,0.68)'
  },
  // Obsidian Slate
  {
    base: '#17191d',
    glowA: 'rgba(99, 102, 241, 0.25)',
    glowB: 'rgba(148, 163, 184, 0.2)',
    text: '#ffffff',
    muted: 'rgba(255,255,255,0.65)'
  },
  // Crimson Velvet
  {
    base: '#3d0c11',
    glowA: 'rgba(225, 29, 72, 0.55)',
    glowB: 'rgba(127, 29, 29, 0.7)',
    text: '#ffffff',
    muted: 'rgba(255,255,255,0.68)'
  },
  // Warm Amber
  {
    base: '#452205',
    glowA: 'rgba(245, 158, 11, 0.58)',
    glowB: 'rgba(180, 83, 9, 0.72)',
    text: '#ffffff',
    muted: 'rgba(255,255,255,0.72)'
  },
  // Midnight Indigo
  {
    base: '#111642',
    glowA: 'rgba(79, 70, 229, 0.58)',
    glowB: 'rgba(30, 58, 138, 0.75)',
    text: '#ffffff',
    muted: 'rgba(255,255,255,0.68)'
  },
  // Plum Neon
  {
    base: '#2e0836',
    glowA: 'rgba(217, 70, 239, 0.5)',
    glowB: 'rgba(88, 28, 135, 0.75)',
    text: '#ffffff',
    muted: 'rgba(255,255,255,0.68)'
  },
  // Ocean Cyan
  {
    base: '#082838',
    glowA: 'rgba(14, 165, 233, 0.52)',
    glowB: 'rgba(15, 118, 110, 0.72)',
    text: '#ffffff',
    muted: 'rgba(255,255,255,0.7)'
  }
];

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function createSlabTexture(
  comp: MonarchComponent,
  index: number,
  maxAnisotropy: number
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;
  ctx.scale(2, 2); // 512x512 logical canvas

  const palette = CARD_PALETTES[index % CARD_PALETTES.length];
  const size = 512;
  const radius = 32;

  ctx.clearRect(0, 0, size, size);

  ctx.save();
  drawRoundedRect(ctx, 2, 2, size - 4, size - 4, radius);
  ctx.clip();

  // Base fill
  ctx.fillStyle = palette.base;
  ctx.fillRect(0, 0, size, size);

  // Soft mesh gradient blobs
  const g1 = ctx.createRadialGradient(130, 140, 20, 130, 140, 340);
  g1.addColorStop(0, palette.glowA);
  g1.addColorStop(1, 'transparent');
  ctx.fillStyle = g1;
  ctx.fillRect(0, 0, size, size);

  const g2 = ctx.createRadialGradient(410, 390, 20, 410, 390, 320);
  g2.addColorStop(0, palette.glowB);
  g2.addColorStop(1, 'transparent');
  ctx.fillStyle = g2;
  ctx.fillRect(0, 0, size, size);

  // Subtle top glass sheen
  const sheen = ctx.createLinearGradient(0, 0, 0, size);
  sheen.addColorStop(0, 'rgba(255,255,255,0.14)');
  sheen.addColorStop(0.45, 'rgba(255,255,255,0.02)');
  sheen.addColorStop(1, 'rgba(0,0,0,0.18)');
  ctx.fillStyle = sheen;
  ctx.fillRect(0, 0, size, size);

  // Top eyebrow
  ctx.fillStyle = palette.muted;
  ctx.font = '500 17px -apple-system, BlinkMacSystemFont, Inter, sans-serif';
  ctx.fillText(`Monarch UI · ${comp.category}`, 38, 62);

  // Wrapped bold title (up to 3 lines)
  ctx.fillStyle = palette.text;
  ctx.font = '700 44px -apple-system, BlinkMacSystemFont, Inter, sans-serif';
  const words = comp.name.split(' ');
  const lines: string[] = [];
  let current = '';
  for (const word of words) {
    const test = current ? `${current} ${word}` : word;
    if (ctx.measureText(test).width > 390 && current) {
      lines.push(current);
      current = word;
    } else {
      current = test;
    }
  }
  if (current) lines.push(current);

  lines.slice(0, 3).forEach((line, li) => {
    ctx.fillText(line, 38, 122 + li * 52);
  });

  // Bottom-left filename & inspect cue
  ctx.fillStyle = palette.muted;
  ctx.font = '500 15px ui-monospace, SFMono-Regular, Menlo, monospace';
  ctx.fillText(comp.filename, 38, 464);

  // Bottom-right concentric circle badge (like reference Cover Flow cards)
  ctx.fillStyle = 'rgba(255,255,255,0.14)';
  ctx.beginPath();
  ctx.arc(442, 444, 34, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = 'rgba(255,255,255,0.28)';
  ctx.beginPath();
  ctx.arc(442, 444, 15, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();

  // Crisp inner border
  drawRoundedRect(ctx, 2, 2, size - 4, size - 4, radius);
  ctx.strokeStyle = 'rgba(255,255,255,0.22)';
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
  slabSpread = 1.45,
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

    const width = container.clientWidth || 1000;
    const height = container.clientHeight || 400;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 100);
    camera.position.set(0, 0.05, 5.1);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const slabs: {
      group: THREE.Group;
      fillMat: THREE.MeshBasicMaterial;
      texture: THREE.CanvasTexture;
    }[] = [];

    const planeGeo = new THREE.PlaneGeometry(2.15, 2.15);
    const maxAnisotropy = Math.min(16, renderer.capabilities.getMaxAnisotropy() || 4);

    components.forEach((comp, i) => {
      const group = new THREE.Group();
      const texture = createSlabTexture(comp, i, maxAnisotropy);
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
      pointerX = ((e.clientX - rect.left) / rect.width - 0.5) * 0.28;
      pointerY = ((e.clientY - rect.top) / rect.height - 0.5) * 0.16;
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
      const w = container.clientWidth || 1000;
      const h = container.clientHeight || 400;
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

        // Tighter, Apple Cover Flow style overlapping fan
        const sideOffset = offset === 0 ? 0 : Math.sign(offset) * (0.85 + abs * (spread * 0.42));
        const targetZ = offset === 0 ? 1.15 : -abs * 0.48;
        const orbitYaw = orbitRef.current && offset === 0 ? Math.sin(tickTime) * 0.22 : 0;
        const targetRotY =
          offset === 0 ? pointerX * 0.25 + orbitYaw : Math.sign(offset) * -0.58;
        const targetRotX = offset === 0 ? -pointerY * 0.16 : 0;
        const targetScale = offset === 0 ? 1.08 : Math.max(0.72, 0.86 - abs * 0.04);

        s.group.position.x += (sideOffset - s.group.position.x) * 0.15;
        s.group.position.z += (targetZ - s.group.position.z) * 0.15;
        s.group.rotation.y += (targetRotY - s.group.rotation.y) * 0.15;
        s.group.rotation.x += (targetRotX - s.group.rotation.x) * 0.15;
        s.group.scale.x += (targetScale - s.group.scale.x) * 0.15;
        s.group.scale.y += (targetScale - s.group.scale.y) * 0.15;

        const targetOpacity = offset === 0 ? 1 : Math.max(0.55, 0.96 - abs * 0.12);
        s.fillMat.opacity += (targetOpacity - s.fillMat.opacity) * 0.15;
        s.group.visible = abs <= 4;
      });

      camera.position.x += (pointerX * 0.25 - camera.position.x) * 0.08;
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
      className="h-[360px] w-full cursor-pointer overflow-hidden select-none sm:h-[420px]"
    />
  );
}
