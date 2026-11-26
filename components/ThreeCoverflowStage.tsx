'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface ThreeCoverflowStageProps {
  totalItems: number;
  activeIndex: number;
  darkMode: boolean;
  onSelectIndex: (index: number) => void;
}

export function ThreeCoverflowStage({
  totalItems,
  activeIndex,
  darkMode,
  onSelectIndex
}: ThreeCoverflowStageProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef(activeIndex);
  activeRef.current = activeIndex;

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 640;
    const height = container.clientHeight || 240;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(0, 0.35, 6.2);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Subtle architectural floor grid
    const gridColor = darkMode ? 0x27272a : 0xd4d4d8;
    const grid = new THREE.GridHelper(18, 24, gridColor, gridColor);
    grid.position.y = -1.25;
    scene.add(grid);

    // Coverflow 3D Slabs
    const slabs: {
      group: THREE.Group;
      fillMat: THREE.MeshBasicMaterial;
      edgeMat: THREE.LineBasicMaterial;
    }[] = [];

    const planeGeo = new THREE.BoxGeometry(1.65, 1.15, 0.04);
    const edgesGeo = new THREE.EdgesGeometry(planeGeo);

    for (let i = 0; i < totalItems; i++) {
      const group = new THREE.Group();
      const fillMat = new THREE.MeshBasicMaterial({
        color: darkMode ? 0x111113 : 0xffffff,
        transparent: true,
        opacity: 0.92
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
      slabs.push({ group, fillMat, edgeMat });
    }

    let pointerX = 0;
    let pointerY = 0;
    const raycaster = new THREE.Raycaster();
    const pointerNdc = new THREE.Vector2();

    const onPointerMove = (e: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      pointerX = ((e.clientX - rect.left) / rect.width - 0.5) * 0.45;
      pointerY = ((e.clientY - rect.top) / rect.height - 0.5) * 0.25;
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
      const w = container.clientWidth || 640;
      const h = container.clientHeight || 240;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });
    resizeObserver.observe(container);

    let rafId = 0;
    const animate = () => {
      rafId = requestAnimationFrame(animate);
      const curr = activeRef.current;

      slabs.forEach((s, i) => {
        const offset = i - curr;
        const abs = Math.abs(offset);
        const targetX = offset * 1.48;
        const targetZ = offset === 0 ? 0.8 : -abs * 0.65;
        const targetRotY = offset === 0 ? pointerX * 0.45 : Math.sign(offset) * -0.48;
        const targetRotX = offset === 0 ? -pointerY * 0.35 : 0;
        const targetScale = offset === 0 ? 1.08 : Math.max(0.65, 0.9 - abs * 0.08);

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
        s.fillMat.opacity = abs > 3 ? 0 : isActive ? 0.98 : 0.72;
      });

      camera.position.x += (pointerX * 0.5 - camera.position.x) * 0.08;
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
        s.fillMat.dispose();
        s.edgeMat.dispose();
      });
      renderer.dispose();
    };
  }, [totalItems, darkMode, onSelectIndex]);

  return (
    <div
      ref={mountRef}
      className="h-[230px] w-full cursor-grab active:cursor-grabbing border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/40"
    />
  );
}
