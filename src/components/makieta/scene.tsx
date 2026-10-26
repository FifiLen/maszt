"use client";

import * as THREE from "three";
import { useEffect, useLayoutEffect, useRef, type ReactNode } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Baked } from "./bake";
import { COLORS } from "./materials";
import { cameraAt } from "./camera-path";
import { journey } from "./journey-state";
import { Ground, Town } from "./world/ground";
import { Cables } from "./world/cables";
import { PowerPlant } from "./world/power-plant";
import { Park, Pavilion, School } from "./world/stations";
import { Boat } from "./world/boat";

const DEG = Math.PI / 180;

/** Kamera na ścieżce ujęć + słońce, które podąża za kadrem (ostre cienie także na zbliżeniach). */
function CameraRig({ shadowSize }: { shadowSize: number }) {
  const light = useRef<THREE.DirectionalLight>(null);
  const target = useRef(new THREE.Vector3());
  const lastTarget = useRef(new THREE.Vector3(Infinity, 0, 0));
  const frame = useRef(0);

  useFrame(({ camera, size, scene, gl }) => {
    const cam = camera as THREE.PerspectiveCamera;
    const shot = cameraAt(journey.progress);
    const aspect = size.width / size.height;
    // Na pionowym ekranie odsuwamy kamerę, żeby kadr nie był za ciasny.
    const portrait = aspect < 1 ? 1 + (1 - aspect) * 1.1 : 1;
    const dist = shot.dist * portrait;
    const t = target.current.set(...shot.target);
    cam.position.set(
      t.x + dist * Math.cos(shot.el * DEG) * Math.sin(shot.az * DEG),
      t.y + dist * Math.sin(shot.el * DEG),
      t.z + dist * Math.cos(shot.el * DEG) * Math.cos(shot.az * DEG),
    );
    cam.lookAt(t);

    // Panel tekstu jest po lewej (desktop) albo na dole (telefon) – przesuwamy kadr, żeby mu nie przeszkadzać.
    if (aspect >= 1) cam.setViewOffset(size.width, size.height, -shot.shift * size.width, 0, size.width, size.height);
    else cam.setViewOffset(size.width, size.height, 0, 0.16 * size.height, size.width, size.height);

    if (scene.fog instanceof THREE.Fog) {
      scene.fog.near = dist * 1.05;
      scene.fog.far = dist * 2.6 + 25;
    }

    const sun = light.current;
    if (sun) {
      const reach = Math.max(14, dist * 0.75);
      sun.position.set(t.x + 14, t.y + 26, t.z + 9);
      sun.target.position.copy(t);
      sun.target.updateMatrixWorld();
      const shadowCam = sun.shadow.camera;
      if (shadowCam.right !== reach) {
        shadowCam.left = shadowCam.bottom = -reach;
        shadowCam.right = shadowCam.top = reach;
        shadowCam.updateProjectionMatrix();
      }
    }

    // Mapa cieni jest droga: przeliczamy ją, gdy kadr się przesuwa, a w spoczynku co drugą klatkę
    // (tylko po to, żeby cienie ruchomych postaci nadążały).
    frame.current++;
    const moved = lastTarget.current.distanceToSquared(t) > 1e-6;
    if (moved || frame.current % 2 === 0) gl.shadowMap.needsUpdate = true;
    lastTarget.current.copy(t);
  });

  return (
    <directionalLight
      ref={light}
      intensity={2.1}
      color="#fff6ea"
      castShadow
      shadow-mapSize={[shadowSize, shadowSize]}
      shadow-bias={-0.0004}
      shadow-normalBias={0.03}
      shadow-camera-near={1}
      shadow-camera-far={80}
    />
  );
}

/** Włącza cienie wszystkim siatkom poza oznaczonymi `noCast` (linie, woda, efekty). */
function ShadowSetup({ children }: { children: ReactNode }) {
  const group = useRef<THREE.Group>(null);
  useLayoutEffect(() => {
    group.current?.traverse((o) => {
      if ((o as THREE.Mesh).isMesh) {
        o.castShadow = !o.userData.noCast;
        o.receiveShadow = true;
      }
    });
  });
  return <group ref={group}>{children}</group>;
}

/** Sonda wydajności (tylko z ?perf w adresie): czasy klatek, draw calle i trójkąty dla skryptów pomiarowych. */
type PerfStats = { frames: number[]; calls: number; triangles: number };
function PerfProbe() {
  useFrame(({ gl }) => {
    const w = window as unknown as { __makietaPerf?: PerfStats };
    w.__makietaPerf ??= { frames: [], calls: 0, triangles: 0 };
    gl.info.autoReset = false;
    w.__makietaPerf.frames.push(performance.now());
    w.__makietaPerf.calls = gl.info.render.calls;
    w.__makietaPerf.triangles = gl.info.render.triangles;
    gl.info.reset();
  }, -1000);
  return null;
}

/**
 * Renderowanie na żądanie: przy ruchu kamery do 60 kl./s (także na ekranach 120 Hz),
 * w spoczynku 30 kl./s dla drobnych animacji. Gdy przeglądarka nie nadąża, obniżamy DPR.
 */
function FrameDriver({ minDpr, maxDpr }: { minDpr: number; maxDpr: number }) {
  const invalidate = useThree((s) => s.invalidate);
  const setDpr = useThree((s) => s.setDpr);

  useEffect(() => {
    let raf = 0;
    let lastRender = 0;
    let lastTick = performance.now();
    let lastProgress = -1;
    let dpr = Math.min(window.devicePixelRatio, maxDpr);
    let slow = 0;
    let fast = 0;

    const loop = (now: number) => {
      const progress = journey.progress;
      const moving = Math.abs(progress - lastProgress) > 1e-5;
      if (now - lastRender >= (moving ? 15.5 : 32)) {
        lastRender = now;
        lastProgress = progress;
        invalidate();
      }
      // Odstęp między rAF rośnie, gdy GPU nie nadąża – wtedy zmniejszamy rozdzielczość renderu.
      const dt = now - lastTick;
      lastTick = now;
      if (moving) {
        slow = dt > 25 ? slow + 1 : Math.max(0, slow - 1);
        fast = dt < 18 ? fast + 1 : 0;
        if (slow > 15 && dpr > minDpr) {
          dpr = Math.max(minDpr, dpr - 0.25);
          setDpr(dpr);
          slow = 0;
        } else if (fast > 300 && dpr < Math.min(window.devicePixelRatio, maxDpr)) {
          dpr = Math.min(maxDpr, dpr + 0.25);
          setDpr(dpr);
          fast = 0;
        }
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [invalidate, setDpr, minDpr, maxDpr]);

  return null;
}

function World({ shadowSize }: { shadowSize: number }) {
  return (
    <>
      <hemisphereLight args={["#ffffff", "#bdb3a3", 1.75]} />
      <CameraRig shadowSize={shadowSize} />
      <ShadowSetup>
        <Baked>
        <Ground />
        <Town />
        <Cables />
        <PowerPlant />
        <School />
        <Park />
        <Pavilion />
        <Boat />
        </Baked>
      </ShadowSetup>
    </>
  );
}

export default function MakietaScene({ active, quality }: { active: boolean; quality: "high" | "low" }) {
  const high = quality === "high";
  const minDpr = high ? 1 : 0.75;
  const maxDpr = high ? 1.5 : 1.25;
  const perf = typeof window !== "undefined" && window.location.search.includes("perf");
  return (
    <Canvas
      frameloop={active ? "demand" : "never"}
      dpr={[minDpr, maxDpr]}
      shadows={{ type: THREE.PCFShadowMap }}
      flat
      camera={{ fov: 30, near: 0.5, far: 400, position: [40, 50, 60] }}
      gl={{ antialias: true, powerPreference: "high-performance", stencil: false }}
      onCreated={({ scene, gl }) => {
        scene.background = new THREE.Color(COLORS.bg);
        scene.fog = new THREE.Fog(COLORS.bg, 60, 160);
        gl.shadowMap.autoUpdate = false;
      }}
    >
      <World shadowSize={high ? 2048 : 1024} />
      {active && <FrameDriver minDpr={minDpr} maxDpr={maxDpr} />}
      {perf && <PerfProbe />}
    </Canvas>
  );
}
