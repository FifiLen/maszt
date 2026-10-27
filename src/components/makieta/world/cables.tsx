"use client";

import * as THREE from "three";
import { useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { COLORS, clayShade, wire } from "../materials";
import { journey } from "../journey-state";

// Trasa wiązki: od elektrowni, obok szkoły, parku i pawilonu – aż do pomostu nad Zalewem.
const ROUTE = [
  [-14, -8.5],
  [-11.5, -5.5],
  [-7, -2],
  [-5.6, 3.5],
  [-3, 9],
  [2, 10.2],
  [8, 9.8],
  [11.6, 12.2],
  [10.6, 15.2],
  [10, 16.4],
].map(([x, z]) => new THREE.Vector3(x, 0, z));

export const routeCurve = new THREE.CatmullRomCurve3(ROUTE, false, "centripetal");

const LINES = 9;
const SPACING = 0.15;
const ENERGY = new Set([2, 6]);

function offsetCurve(offset: number, y: number) {
  const points = routeCurve.getSpacedPoints(240).map((p, i, all) => {
    const next = all[Math.min(i + 1, all.length - 1)];
    const prev = all[Math.max(i - 1, 0)];
    const tangent = next.clone().sub(prev).normalize();
    const normal = new THREE.Vector3(-tangent.z, 0, tangent.x);
    return p.clone().addScaledVector(normal, offset).setY(y);
  });
  return new THREE.CatmullRomCurve3(points);
}

function ribbon(width: number, y: number) {
  const samples = routeCurve.getSpacedPoints(240);
  const positions: number[] = [];
  const indices: number[] = [];
  samples.forEach((p, i) => {
    const next = samples[Math.min(i + 1, samples.length - 1)];
    const prev = samples[Math.max(i - 1, 0)];
    const t = next.clone().sub(prev).normalize();
    const n = new THREE.Vector3(-t.z, 0, t.x).multiplyScalar(width / 2);
    positions.push(p.x - n.x, y, p.z - n.z, p.x + n.x, y, p.z + n.z);
    if (i > 0) {
      const a = (i - 1) * 2;
      indices.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
    }
  });
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  g.setIndex(indices);
  g.computeVertexNormals();
  // Skierowanie normalnych do góry niezależnie od kolejności wierzchołków.
  const normals = g.attributes.normal as THREE.BufferAttribute;
  for (let i = 0; i < normals.count; i++) normals.setXYZ(i, 0, 1, 0);
  return g;
}

const energyUniforms = {
  uTime: { value: 0 },
  uReveal: { value: 0 },
  uBase: { value: new THREE.Color(COLORS.wire) },
  uGreen: { value: new THREE.Color(COLORS.green) },
};

export const energyMaterial = new THREE.ShaderMaterial({
  uniforms: energyUniforms,
  vertexShader: /* glsl */ `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: /* glsl */ `
    uniform float uTime;
    uniform float uReveal;
    uniform vec3 uBase;
    uniform vec3 uGreen;
    varying vec2 vUv;
    void main() {
      float along = vUv.x;
      // Za kamerą linia jest już „naładowana”, przed nią czeka szara.
      float lit = smoothstep(uReveal + 0.006, uReveal - 0.006, along);
      float dash = smoothstep(0.82, 1.0, fract(along * 22.0 - uTime * 0.9));
      float head = exp(-pow((along - uReveal) * 90.0, 2.0));
      vec3 color = mix(uBase, uGreen, lit);
      color += lit * dash * vec3(0.25, 0.45, 0.35);
      color += head * vec3(0.5, 0.9, 0.7) * step(0.001, uReveal);
      gl_FragColor = vec4(color, 1.0);
      #include <colorspace_fragment>
    }
  `,
});

// Na którym fragmencie trasy (0–1) leży dany przystanek – do mapowania postępu na ładowanie linii.
function routeU(x: number, z: number) {
  const samples = routeCurve.getSpacedPoints(400);
  let best = 0;
  let bestD = Infinity;
  samples.forEach((p, i) => {
    const d = Math.hypot(p.x - x, p.z - z);
    if (d < bestD) {
      bestD = d;
      best = i / 400;
    }
  });
  return best;
}

const REVEAL: [number, number][] = [
  [0.1, 0],
  [0.31, routeU(-8.5, -2.5)],
  [0.42, routeU(-5.6, 3.5)],
  [0.525, routeU(-1, 9.5)],
  [0.62, routeU(2, 10.2)],
  [0.715, routeU(9.5, 10.5)],
  [0.79, routeU(11.6, 12.2)],
  [0.88, 1],
];

export function revealAt(p: number) {
  if (p <= REVEAL[0][0]) return 0;
  for (let i = 0; i < REVEAL.length - 1; i++) {
    const [a, ua] = REVEAL[i];
    const [b, ub] = REVEAL[i + 1];
    if (p <= b) return ua + ((p - a) / (b - a)) * (ub - ua);
  }
  return 1;
}

export function Cables() {
  const { tubes, bed } = useMemo(() => {
    const tubes = Array.from({ length: LINES }, (_, i) => {
      const offset = (i - (LINES - 1) / 2) * SPACING;
      return { energy: ENERGY.has(i), geometry: new THREE.TubeGeometry(offsetCurve(offset, 0.07), 360, 0.035, 6) };
    });
    return { tubes, bed: ribbon(LINES * SPACING + 0.5, 0.012) };
  }, []);

  useFrame((state) => {
    energyUniforms.uTime.value = state.clock.elapsedTime;
    energyUniforms.uReveal.value = revealAt(journey.progress);
  });

  return (
    <group>
      <mesh geometry={bed} material={clayShade} userData={{ noCast: true }} />
      {tubes.map((t, i) => (
        <mesh key={i} geometry={t.geometry} material={t.energy ? energyMaterial : wire} userData={{ noCast: true }} />
      ))}
    </group>
  );
}
