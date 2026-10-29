'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Sparkles, Compass } from 'lucide-react';

interface FirstMotionCoreProps {
  height?: number | string;
  theme?: 'gold' | 'cyber';
  showTelemetry?: boolean;
}

export const FirstMotionCore: React.FC<FirstMotionCoreProps> = ({
  height = 180,
  theme = 'gold',
  showTelemetry = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isInteracting, setIsInteracting] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const container = containerRef.current;
    if (!container || typeof window === 'undefined') return;

    let animId: number;
    let cleanupFn: (() => void) | undefined;

    // Load Three.js strictly on the client
    import('three').then((THREE) => {
      if (!container) return;

      const width = container.clientWidth || 360;
      const h = typeof height === 'number' ? height : container.clientHeight || 180;

      // 1. Scene, Camera, Renderer
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(44, width / h, 0.1, 100);
      camera.position.z = 6.2;

      const renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance',
      });
      renderer.setSize(width, h);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      container.appendChild(renderer.domElement);

      // 2. Lighting (Luxury Champagne Gold & Titanium)
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
      scene.add(ambientLight);

      const dirLight1 = new THREE.DirectionalLight(0xfff4d6, 2.8);
      dirLight1.position.set(5, 5, 5);
      scene.add(dirLight1);

      const dirLight2 = new THREE.DirectionalLight(0x38bdf8, 1.8);
      dirLight2.position.set(-5, -4, -3);
      scene.add(dirLight2);

      const pointLight = new THREE.PointLight(0xd4af37, 8, 20);
      pointLight.position.set(0, 0, 3);
      scene.add(pointLight);

      // 3. Central 3D Group
      const coreGroup = new THREE.Group();
      scene.add(coreGroup);

      // Inner Icosahedron Core
      const coreColor = theme === 'gold' ? 0xb8860b : 0x2563eb;
      const coreGeo = new THREE.IcosahedronGeometry(1.2, 0);
      const coreMat = new THREE.MeshStandardMaterial({
        color: coreColor,
        metalness: 0.85,
        roughness: 0.15,
        flatShading: true,
      });
      const coreMesh = new THREE.Mesh(coreGeo, coreMat);
      coreGroup.add(coreMesh);

      // Outer Wireframe Cage
      const cageColor = theme === 'gold' ? 0xdfb76c : 0x60a5fa;
      const cageGeo = new THREE.IcosahedronGeometry(1.55, 1);
      const cageMat = new THREE.MeshStandardMaterial({
        color: cageColor,
        metalness: 1.0,
        roughness: 0.1,
        wireframe: true,
      });
      const cageMesh = new THREE.Mesh(cageGeo, cageMat);
      coreGroup.add(cageMesh);

      // Orbital Ring 1 (Tilted Gold Torus)
      const ring1Geo = new THREE.TorusGeometry(2.0, 0.025, 16, 100);
      const ring1Mat = new THREE.MeshBasicMaterial({ color: 0xd4af37 });
      const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
      ring1.rotation.x = Math.PI / 3;
      coreGroup.add(ring1);

      // Orbital Ring 2 (Tilted Cyan/Gold Torus)
      const ring2Geo = new THREE.TorusGeometry(2.25, 0.02, 16, 100);
      const ring2Mat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
      const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
      ring2.rotation.x = -Math.PI / 4;
      coreGroup.add(ring2);

      // Orbiting Quantum Particles
      const particleCount = 24;
      const particleGeo = new THREE.BufferGeometry();
      const particlePositions = new Float32Array(particleCount * 3);
      for (let i = 0; i < particleCount; i++) {
        const radius = 2.4 + Math.random() * 0.7;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(Math.random() * 2 - 1);
        particlePositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
        particlePositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        particlePositions[i * 3 + 2] = radius * Math.cos(phi);
      }
      particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
      const particleMat = new THREE.PointsMaterial({
        color: 0xfde047,
        size: 0.06,
        transparent: true,
        opacity: 0.85,
      });
      const particles = new THREE.Points(particleGeo, particleMat);
      coreGroup.add(particles);

      // 4. Mouse Tracking & Damped Lerp
      let targetRotX = 0;
      let targetRotY = 0;
      let currentRotX = 0;
      let currentRotY = 0;

      const onPointerMove = (e: MouseEvent | TouchEvent) => {
        const rect = container.getBoundingClientRect();
        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
        const x = ((clientX - rect.left) / rect.width) * 2 - 1;
        const y = -(((clientY - rect.top) / rect.height) * 2 - 1);
        targetRotY = x * 1.2;
        targetRotX = -y * 1.0;
        setIsInteracting(true);
      };

      const onPointerLeave = () => {
        targetRotX = 0;
        targetRotY = 0;
        setIsInteracting(false);
      };

      container.addEventListener('mousemove', onPointerMove);
      container.addEventListener('mouseleave', onPointerLeave);
      container.addEventListener('touchmove', onPointerMove, { passive: true });
      container.addEventListener('touchend', onPointerLeave);

      // 5. Animation Loop
      let clock = new THREE.Clock();

      const animate = () => {
        animId = requestAnimationFrame(animate);
        const elapsedTime = clock.getElapsedTime();

        currentRotX += (targetRotX - currentRotX) * 0.06;
        currentRotY += (targetRotY - currentRotY) * 0.06;

        coreGroup.rotation.x = currentRotX + Math.sin(elapsedTime * 0.5) * 0.15;
        coreGroup.rotation.y = currentRotY + elapsedTime * 0.4;

        cageMesh.rotation.y = -elapsedTime * 0.3;
        ring1.rotation.z = elapsedTime * 0.5;
        ring2.rotation.z = -elapsedTime * 0.4;
        particles.rotation.y = elapsedTime * 0.15;

        renderer.render(scene, camera);
      };

      animate();

      // 6. Resize Observer
      const ro = new ResizeObserver(() => {
        if (!container) return;
        const newW = container.clientWidth;
        const newH = typeof height === 'number' ? height : container.clientHeight;
        camera.aspect = newW / newH;
        camera.updateProjectionMatrix();
        renderer.setSize(newW, newH);
      });
      ro.observe(container);

      cleanupFn = () => {
        cancelAnimationFrame(animId);
        ro.disconnect();
        container.removeEventListener('mousemove', onPointerMove);
        container.removeEventListener('mouseleave', onPointerLeave);
        container.removeEventListener('touchmove', onPointerMove);
        container.removeEventListener('touchend', onPointerLeave);

        if (container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
        }
        renderer.dispose();
        coreGeo.dispose();
        coreMat.dispose();
        cageGeo.dispose();
        cageMat.dispose();
        ring1Geo.dispose();
        ring1Mat.dispose();
        ring2Geo.dispose();
        ring2Mat.dispose();
        particleGeo.dispose();
        particleMat.dispose();
      };
    });

    return () => {
      cleanupFn?.();
    };
  }, [height, theme]);

  return (
    <div
      ref={containerRef}
      className="relative w-full rounded-2xl overflow-hidden cursor-grab active:cursor-grabbing select-none"
      style={{
        height: typeof height === 'number' ? `${height}px` : height,
        background: 'radial-gradient(ellipse at center, rgba(15,23,42,0.92) 0%, rgba(3,6,17,0.98) 100%)',
      }}
    >
      {/* Top HUD Badge */}
      {showTelemetry && (
        <div className="absolute top-3 inset-x-3.5 z-10 flex items-center justify-between pointer-events-none">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900/80 border border-amber-500/40 text-[10px] font-bold text-amber-300 backdrop-blur-md shadow-sm">
            <Sparkles className="w-3 h-3 text-amber-400 animate-pulse" />
            <span>FIRSTMOVE™ 3D CORE</span>
          </div>
          <div className="inline-flex items-center gap-1 text-[10px] text-slate-400 font-mono bg-slate-950/70 border border-white/10 px-2 py-0.5 rounded">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span>WEBGL 60FPS</span>
          </div>
        </div>
      )}

      {/* Bottom Subtle Interaction Prompt */}
      {showTelemetry && (
        <div className="absolute bottom-2.5 inset-x-3.5 z-10 flex items-center justify-between text-[10px] text-slate-400 pointer-events-none">
          <span className="flex items-center gap-1 text-slate-400">
            <Compass className="w-3 h-3 text-amber-400" />
            {isInteracting ? '마우스 각도 반응 중' : '마우스로 3D 코어 회전 인터랙션'}
          </span>
          <span className="text-amber-300 font-mono font-medium">HWACHEON FIRST</span>
        </div>
      )}
    </div>
  );
};
