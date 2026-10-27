"use client";

import * as THREE from "three";
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { clay, clayDouble, clayShade, green, wire } from "../materials";
import { merge, strut, v3 } from "../geo";
import { STOPS, journey, stopWeight } from "../journey-state";

const PLANT = new THREE.Vector3(-17, 0, -13);

/** Słup wysokiego napięcia z kratownicy. Poprzeczniki biegną wzdłuż osi Z. */
function pylonGeometry(h: number) {
  const parts: THREE.BufferGeometry[] = [];
  const base = h * 0.12;
  const waistY = h * 0.68;
  const waist = h * 0.035;
  const r = h * 0.009;
  const halfAt = (y: number) => base + (waist - base) * (y / waistY);
  const corners = [
    [-1, -1],
    [1, -1],
    [1, 1],
    [-1, 1],
  ];
  corners.forEach(([sx, sz]) => {
    parts.push(strut(v3(sx * base, 0, sz * base), v3(sx * waist, waistY, sz * waist), r));
    parts.push(strut(v3(sx * waist, waistY, sz * waist), v3(sx * waist * 0.4, h, sz * waist * 0.4), r));
  });
  const levels = 4;
  for (let l = 0; l < levels; l++) {
    const y0 = (l / levels) * waistY;
    const y1 = ((l + 1) / levels) * waistY;
    const a = halfAt(y0);
    const b = halfAt(y1);
    for (let c = 0; c < 4; c++) {
      const [x0, z0] = corners[c];
      const [x1, z1] = corners[(c + 1) % 4];
      parts.push(strut(v3(x0 * a, y0, z0 * a), v3(x1 * b, y1, z1 * b), r * 0.7));
      parts.push(strut(v3(x1 * a, y0, z1 * a), v3(x0 * b, y1, z0 * b), r * 0.7));
      parts.push(strut(v3(x0 * b, y1, z0 * b), v3(x1 * b, y1, z1 * b), r * 0.7));
    }
  }
  const anchors: THREE.Vector3[] = [];
  [
    { y: waistY, span: h * 0.3 },
    { y: h * 0.85, span: h * 0.2 },
  ].forEach(({ y, span }) => {
    [-waist, waist].forEach((x) => parts.push(strut(v3(x, y, -span), v3(x, y, span), r)));
    [-1, 1].forEach((s) => {
      parts.push(strut(v3(0, y + h * 0.06, 0), v3(0, y, s * span), r * 0.8));
      parts.push(strut(v3(0, y, s * span), v3(0, y - h * 0.05, s * span), r * 1.6));
      anchors.push(v3(0, y - h * 0.05, s * span));
    });
  });
  return { geometry: merge(parts), anchors };
}

const PYLONS = [
  { x: -11, z: -19.5, h: 8 },
  { x: -1, z: -19.5, h: 8 },
  { x: 9, z: -19.5, h: 8 },
  { x: 19, z: -19.5, h: 8 },
  { x: 29, z: -19.5, h: 8 },
];

function coolingTower(radius: number, height: number) {
  const points: THREE.Vector2[] = [];
  const throat = height * 0.72;
  for (let i = 0; i <= 20; i++) {
    const y = (i / 20) * height;
    const r = radius * 0.62 * Math.sqrt(1 + ((y - throat) / (height * 0.38)) ** 2);
    points.push(new THREE.Vector2(r, y));
  }
  return new THREE.LatheGeometry(points, 40);
}

export function PowerPlant() {
  const pylon = useMemo(() => pylonGeometry(8), []);
  const tower = useMemo(() => coolingTower(2.6, 6.4), []);
  const roofRibs = useMemo(() => Array.from({ length: 11 }, (_, i) => -3.2 + i * 0.64), []);

  const wires = useMemo(() => {
    const out: THREE.TubeGeometry[] = [];
    for (let i = 0; i < PYLONS.length - 1; i++) {
      const a = PYLONS[i];
      const b = PYLONS[i + 1];
      pylon.anchors.forEach((anchor) => {
        const start = anchor.clone().add(v3(a.x, 0, a.z));
        const end = anchor.clone().add(v3(b.x, 0, b.z));
        const mid = start.clone().lerp(end, 0.5).add(v3(0, -0.9, 0));
        out.push(new THREE.TubeGeometry(new THREE.QuadraticBezierCurve3(start, mid, end), 30, 0.018, 4));
      });
    }
    // Linie z rozdzielni elektrowni do pierwszego słupa.
    pylon.anchors.forEach((anchor) => {
      const end = anchor.clone().add(v3(PYLONS[0].x, 0, PYLONS[0].z));
      const start = v3(PLANT.x + 4, 2.6, PLANT.z - 4 + anchor.z * 0.3);
      out.push(new THREE.TubeGeometry(new THREE.QuadraticBezierCurve3(start, start.clone().lerp(end, 0.5).add(v3(0, -0.5, 0)), end), 24, 0.018, 4));
    });
    return out;
  }, [pylon]);

  // Zielony puls energii płynie liniami, gdy kamera stoi przy elektrowni.
  const glow = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    const w = stopWeight(STOPS[1], journey.progress);
    if (glow.current) {
      glow.current.scale.setScalar(0.6 + w * 0.4 + Math.sin(state.clock.elapsedTime * 3) * 0.04 * w);
      (glow.current.material as THREE.MeshLambertMaterial).opacity = 0.25 + w * 0.6;
    }
  });

  return (
    <group>
      <group position={PLANT.toArray()}>
        {/* Hala główna z żebrowanym dachem */}
        <mesh material={clay} position={[0, 1.8, 0]}>
          <boxGeometry args={[7.2, 3.6, 5]} />
        </mesh>
        {roofRibs.map((x) => (
          <mesh key={x} material={clayShade} position={[x, 3.75, 0]}>
            <boxGeometry args={[0.32, 0.3, 4.6]} />
          </mesh>
        ))}
        <mesh material={clay} position={[5.2, 1.1, 0.6]}>
          <boxGeometry args={[3.2, 2.2, 3.4]} />
        </mesh>
        {/* Rozdzielnia z izolatorami */}
        {Array.from({ length: 6 }, (_, i) => (
          <mesh key={i} material={clayShade} position={[4.4 + (i % 3) * 0.8, 0.5, -3.4 - Math.floor(i / 3) * 0.9]}>
            <cylinderGeometry args={[0.12, 0.16, 1, 8]} />
          </mesh>
        ))}
        <mesh material={clayShade} position={[5.2, 0.12, -3.8]}>
          <boxGeometry args={[3, 0.24, 2.2]} />
        </mesh>
        {/* Komin i chłodnie kominowe */}
        <mesh material={clay} position={[-2.2, 5.5, -3.6]}>
          <cylinderGeometry args={[0.42, 0.72, 11, 20]} />
        </mesh>
        <mesh material={clayShade} position={[-2.2, 10.6, -3.6]}>
          <cylinderGeometry args={[0.45, 0.45, 0.35, 20]} />
        </mesh>
        <mesh geometry={tower} material={clayDouble} position={[-5.4, 0, -4.8]} />
        <mesh geometry={tower} material={clayDouble} position={[-0.6, 0, -8.2]} scale={0.85} />
        <Steam origin={[-5.4, 6.4, -4.8]} />
        <Steam origin={[-0.6, 5.5, -8.2]} />
        {/* Źródło energii u wylotu wiązki */}
        <mesh ref={glow} material={green.clone()} position={[3.2, 0.06, 4.3]} rotation-x={-Math.PI / 2} userData={{ noCast: true, dynamic: true }}>
          <ringGeometry args={[0.8, 1.05, 40]} />
        </mesh>
      </group>

      {PYLONS.map((p) => (
        <mesh key={p.x} geometry={pylon.geometry} material={clay} position={[p.x, 0, p.z]} />
      ))}
      {wires.map((g, i) => (
        <mesh key={i} geometry={g} material={wire} userData={{ noCast: true }} />
      ))}
    </group>
  );
}

function Steam({ origin }: { origin: [number, number, number] }) {
  const puffs = useRef<THREE.Group>(null);
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    puffs.current?.children.forEach((puff, i) => {
      const life = (t * 0.12 + i / 5) % 1;
      puff.position.set(life * 1.4, life * 4.5, life * 0.6);
      puff.scale.setScalar(0.9 + life * 1.8);
      ((puff as THREE.Mesh).material as THREE.MeshLambertMaterial).opacity = 0.75 * (1 - life) * Math.min(1, life * 6);
    });
  });
  return (
    <group ref={puffs} position={origin} userData={{ dynamic: true }}>
      {Array.from({ length: 5 }, (_, i) => (
        <mesh key={i} userData={{ noCast: true }}>
          <icosahedronGeometry args={[0.9, 1]} />
          <meshLambertMaterial color="#f7f4f0" transparent depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
}

