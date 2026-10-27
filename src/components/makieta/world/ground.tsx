"use client";

import * as THREE from "three";
import { useLayoutEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { COLORS, clay, clayShade } from "../materials";
import { rng } from "../geo";

export const SHORE_Z = 16.5;
const LAND = { minX: -70, maxX: 70, minZ: -70 };

// Tekstura z kropką – siatka punktów jak na arkuszu makiety.
function dotTexture() {
  const size = 64;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = COLORS.clay;
  ctx.fillRect(0, 0, size, size);
  ctx.fillStyle = "#cdc5b8";
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, 2.2, 0, Math.PI * 2);
  ctx.fill();
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
}

export function Ground() {
  const width = LAND.maxX - LAND.minX;
  const depth = SHORE_Z - LAND.minZ;

  const landTop = useMemo(() => {
    const texture = dotTexture();
    texture.repeat.set(width / 1.5, depth / 1.5);
    return new THREE.MeshLambertMaterial({ map: texture });
  }, [width, depth]);

  return (
    <group>
      {/* Płyta lądu z grubą krawędzią nad wodą – jak blat makiety. */}
      <mesh position={[0, -0.4, (LAND.minZ + SHORE_Z) / 2]} material={clay} userData={{ noCast: true }}>
        <boxGeometry args={[width, 0.8, depth]} />
      </mesh>
      <mesh rotation-x={-Math.PI / 2} position={[0, 0.002, (LAND.minZ + SHORE_Z) / 2]} material={landTop} userData={{ noCast: true }}>
        <planeGeometry args={[width, depth]} />
      </mesh>
      <Water />
    </group>
  );
}

function Water() {
  const ripples = useRef<THREE.InstancedMesh>(null);
  const count = 70;
  const seeds = useMemo(() => {
    const random = rng(16);
    return Array.from({ length: count }, () => ({
      x: -40 + random() * 80,
      z: SHORE_Z + 1 + random() * 30,
      len: 0.6 + random() * 2.2,
      speed: 0.15 + random() * 0.35,
    }));
  }, []);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const update = (time: number) => {
    const mesh = ripples.current;
    if (!mesh) return;
    seeds.forEach((s, i) => {
      dummy.position.set(((s.x + time * s.speed + 40) % 80) - 40, -0.34, s.z);
      dummy.scale.set(s.len, 1, 1);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
  };

  useLayoutEffect(() => update(0));
  useFrame((state) => update(state.clock.elapsedTime));

  return (
    <group>
      <mesh rotation-x={-Math.PI / 2} position={[0, -0.36, SHORE_Z + 35]} userData={{ noCast: true }}>
        <planeGeometry args={[160, 70]} />
        <meshLambertMaterial color={COLORS.water} />
      </mesh>
      <instancedMesh ref={ripples} args={[undefined, undefined, count]} userData={{ noCast: true }}>
        <boxGeometry args={[1, 0.01, 0.05]} />
        <meshBasicMaterial color="#e9f0ec" />
      </instancedMesh>
    </group>
  );
}

type Block = { x: number; z: number; w: number; d: number; h: number; roof: boolean; rot: number };

// Zabudowa i zieleń w tle, z dala od trasy i przystanków.
export function Town() {
  const blocks = useMemo<Block[]>(() => {
    const random = rng(7);
    const out: Block[] = [];
    // Zabudowa tylko na obrzeżach i w jednym kwartale – przystanki i słupy muszą mieć oddech.
    const allowed = (x: number, z: number) =>
      (x < -27 || x > 24 || z < -26 || (x > 3 && x < 19 && z > -14 && z < -6)) && Math.abs(z + 19.5) > 3.5;
    for (let gx = -46; gx <= 44; gx += 4.6) {
      for (let gz = -46; gz <= 14; gz += 4.6) {
        const x = gx + (random() - 0.5) * 1.6;
        const z = gz + (random() - 0.5) * 1.6;
        if (!allowed(x, z) || random() < 0.4) continue;
        const roof = random() < 0.65;
        out.push({ x, z, w: 1.6 + random() * 1.2, d: 1.8 + random() * 1.4, h: roof ? 0.9 + random() * 0.7 : 1 + random() * 1.8, roof, rot: random() < 0.5 ? 0 : Math.PI / 2 });
      }
    }
    return out;
  }, []);

  const trees = useMemo(() => {
    const random = rng(21);
    const out: { x: number; z: number; s: number }[] = [];
    const spots: [number, number][] = [
      [-4, -6], [-2, -3], [-17, 6], [-16, 1.5], [0.5, 1], [7.5, 1.5], [6.5, -1], [3, -1.5], [-0.5, 4],
      [19.5, 4.5], [13, 2.5], [-18, -5], [-21, -2], [-9, -9], [16.5, 2], [-6, -8], [22, 8], [-20, 12],
    ];
    spots.forEach(([x, z]) => out.push({ x: x + (random() - 0.5), z: z + (random() - 0.5), s: 0.8 + random() * 0.6 }));
    return out;
  }, []);

  const bodies = useRef<THREE.InstancedMesh>(null);
  const roofs = useRef<THREE.InstancedMesh>(null);
  const canopies = useRef<THREE.InstancedMesh>(null);
  const trunks = useRef<THREE.InstancedMesh>(null);

  useLayoutEffect(() => {
    const o = new THREE.Object3D();
    let r = 0;
    blocks.forEach((b, i) => {
      o.position.set(b.x, b.h / 2, b.z);
      o.rotation.set(0, b.rot, 0);
      o.scale.set(b.w, b.h, b.d);
      o.updateMatrix();
      bodies.current!.setMatrixAt(i, o.matrix);
      if (b.roof) {
        o.position.set(b.x, b.h, b.z);
        o.scale.set(b.w * 0.5, 0.75, b.d);
        o.updateMatrix();
        roofs.current!.setMatrixAt(r++, o.matrix);
      }
    });
    roofs.current!.count = r;
    trees.forEach((t, i) => {
      o.rotation.set(0, i, 0);
      o.position.set(t.x, 0.6 * t.s, t.z);
      o.scale.set(0.09 * t.s, 1.2 * t.s, 0.09 * t.s);
      o.updateMatrix();
      trunks.current!.setMatrixAt(i, o.matrix);
      o.position.set(t.x, 1.55 * t.s, t.z);
      o.scale.setScalar(0.85 * t.s);
      o.updateMatrix();
      canopies.current!.setMatrixAt(i, o.matrix);
    });
    [bodies, roofs, canopies, trunks].forEach((m) => {
      m.current!.instanceMatrix.needsUpdate = true;
      m.current!.computeBoundingSphere();
    });
  }, [blocks, trees]);

  const roofGeo = useMemo(() => {
    // Graniastosłup trójkątny: dach dwuspadowy, podstawa 2×1 (x,z), wysokość 1.
    const shape = new THREE.Shape([new THREE.Vector2(-1, 0), new THREE.Vector2(1, 0), new THREE.Vector2(0, 1)]);
    return new THREE.ExtrudeGeometry(shape, { depth: 1, bevelEnabled: false }).translate(0, 0, -0.5);
  }, []);

  return (
    <group>
      <instancedMesh ref={bodies} args={[undefined, undefined, blocks.length]} material={clay}>
        <boxGeometry />
      </instancedMesh>
      <instancedMesh ref={roofs} args={[roofGeo, undefined, blocks.length]} material={clayShade} />
      <instancedMesh ref={trunks} args={[undefined, undefined, trees.length]} material={clayShade}>
        <cylinderGeometry args={[1, 1, 1, 6]} />
      </instancedMesh>
      <instancedMesh ref={canopies} args={[undefined, undefined, trees.length]} material={clay}>
        <icosahedronGeometry args={[1, 1]} />
      </instancedMesh>
    </group>
  );
}
