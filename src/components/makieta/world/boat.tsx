"use client";

import * as THREE from "three";
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { COLORS, clay, clayShade, deep, green, makeChargeableMaterial, charge, purple, wire } from "../materials";
import { strut, v3 } from "../geo";
import { climbProgress, flagProgress, journey, smoothstep } from "../journey-state";
import { Person, limbs } from "./person";
import { SHORE_Z } from "./ground";
import { energyMaterial } from "./cables";

export const BOAT = new THREE.Vector3(12.4, 0, 22.5);
const PIER_X = 10;
const DECK_Y = 0.32;
const MAST_Z = 0.5;
const MAST_H = 9.6;
const NEST_Y = DECK_Y + 7.9;

/** Kadłub: dolna połowa elipsoidy z zaostrzonym dziobem (+z). */
function hullGeometry() {
  const g = new THREE.SphereGeometry(1, 36, 14, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2);
  const pos = g.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < pos.count; i++) {
    const z = pos.getZ(i);
    const bow = z > 0 ? 1 - 0.75 * z ** 1.6 : 1 - 0.15 * (-z) ** 3;
    pos.setX(i, pos.getX(i) * 1.25 * bow);
    pos.setY(i, pos.getY(i) * 0.75);
    pos.setZ(i, z * 3.3);
  }
  g.computeVertexNormals();
  return g;
}

function deckGeometry() {
  const shape = new THREE.Shape();
  for (let i = 0; i <= 48; i++) {
    const a = (i / 48) * Math.PI * 2;
    const z = Math.cos(a);
    const bow = z > 0 ? 1 - 0.75 * z ** 1.6 : 1 - 0.15 * (-z) ** 3;
    const x = Math.sin(a) * 1.25 * bow * 0.96;
    if (i === 0) shape.moveTo(x, z * 3.3 * 0.97);
    else shape.lineTo(x, z * 3.3 * 0.97);
  }
  return new THREE.ExtrudeGeometry(shape, { depth: 0.12, bevelEnabled: false }).rotateX(Math.PI / 2);
}

/** Grot: trójkąt wybrzuszony wiatrem; atrybut aH (0 dół – 1 góra) steruje wypełnieniem zielenią. */
function mainsailGeometry() {
  const rows = 18;
  const cols = 10;
  const y0 = DECK_Y + 1.25;
  const y1 = DECK_Y + MAST_H - 0.5;
  const foot = 3.1;
  const positions: number[] = [];
  const heights: number[] = [];
  const indices: number[] = [];
  for (let r = 0; r <= rows; r++) {
    const h = r / rows;
    for (let c = 0; c <= cols; c++) {
      const t = c / cols;
      const width = foot * (1 - h);
      positions.push(Math.sin(Math.PI * t) * 0.55 * (1 - h) ** 0.8, y0 + h * (y1 - y0), MAST_Z - 0.12 - t * width);
      heights.push(h);
    }
  }
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const a = r * (cols + 1) + c;
      const b = a + cols + 1;
      indices.push(a, b, a + 1, b, b + 1, a + 1);
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  g.setAttribute("aH", new THREE.Float32BufferAttribute(heights, 1));
  g.setIndex(indices);
  g.computeVertexNormals();
  return g;
}

const sailFill = { value: 0 };
// Pasek energii na maszcie rośnie od pokładu w górę.
const chargeGeo = new THREE.CylinderGeometry(0.03, 0.03, 1, 6).translate(0, 0.5, 0);

function makeSailMaterial() {
  const m = new THREE.MeshLambertMaterial({ color: COLORS.clay, side: THREE.DoubleSide });
  m.onBeforeCompile = (shader) => {
    shader.uniforms.uFill = sailFill;
    shader.uniforms.uGreen = { value: new THREE.Color(COLORS.green) };
    shader.vertexShader = shader.vertexShader
      .replace("#include <common>", "#include <common>\nattribute float aH;\nvarying float vH;")
      .replace("#include <begin_vertex>", "#include <begin_vertex>\nvH = aH;");
    shader.fragmentShader = shader.fragmentShader
      .replace("#include <common>", "#include <common>\nvarying float vH;\nuniform float uFill;\nuniform vec3 uGreen;")
      .replace(
        "#include <color_fragment>",
        "#include <color_fragment>\nfloat filled = smoothstep(uFill + 0.015, uFill - 0.015, vH);\ndiffuseColor.rgb = mix(diffuseColor.rgb, uGreen, filled);",
      )
      .replace(
        "#include <emissivemap_fragment>",
        "#include <emissivemap_fragment>\ntotalEmissiveRadiance += uGreen * 0.25 * smoothstep(uFill + 0.015, uFill - 0.015, vH);\ntotalEmissiveRadiance += uGreen * 0.6 * exp(-pow((vH - uFill) * 40.0, 2.0)) * step(0.001, uFill) * step(uFill, 0.999);",
      );
  };
  return m;
}

export function Boat() {
  const hull = useMemo(() => hullGeometry(), []);
  const deck = useMemo(() => deckGeometry(), []);
  const mainsail = useMemo(() => mainsailGeometry(), []);
  const sailMaterial = useMemo(() => makeSailMaterial(), []);
  const crew = useMemo(() => makeChargeableMaterial(), []);

  const rigging = useMemo(() => {
    const top = v3(0, DECK_Y + MAST_H - 0.3, MAST_Z);
    return [
      strut(v3(1.12, DECK_Y + 0.05, MAST_Z - 0.3), top, 0.012, 4),
      strut(v3(-1.12, DECK_Y + 0.05, MAST_Z - 0.3), top, 0.012, 4),
      strut(v3(0, DECK_Y + 0.15, 3.1), top, 0.012, 4),
      strut(v3(0, DECK_Y + 0.15, -3.1), top, 0.012, 4),
    ];
  }, []);

  // Stopnie na maszcie po stronie, z której patrzy kamera.
  const steps = useMemo(() => Array.from({ length: 16 }, (_, i) => DECK_Y + 0.6 + i * 0.47), []);

  const climber = useRef<THREE.Group>(null);
  const flag = useRef<THREE.Mesh>(null);
  const mastCharge = useRef<THREE.Mesh>(null);
  const bobbing = useRef<THREE.Group>(null);
  const flagGeo = useMemo(() => new THREE.PlaneGeometry(1.3, 0.78, 16, 6).translate(0.65, 0, 0), []);
  const flagRest = useMemo(() => Float32Array.from(flagGeo.attributes.position.array), [flagGeo]);

  useFrame((state) => {
    const p = journey.progress;
    const t = state.clock.elapsedTime;
    const climb = climbProgress(p);
    const flagUp = flagProgress(p);
    sailFill.value = climb;
    charge(crew, smoothstep(0.86, 0.92, p));

    if (bobbing.current) {
      bobbing.current.position.y = Math.sin(t * 0.9) * 0.04;
      bobbing.current.rotation.z = Math.sin(t * 0.7) * 0.012;
      bobbing.current.rotation.x = Math.sin(t * 0.55) * 0.008;
    }

    const rig = climber.current;
    if (rig) {
      const { armL, armR, legL, legR, hips } = limbs(rig);
      const atTop = smoothstep(0.97, 1, climb);
      const y = DECK_Y + climb * (NEST_Y - DECK_Y);
      // W czasie wspinaczki postać trzyma się masztu; na górze odwraca się do nas.
      const out = 0.32 + atTop * 0.12;
      rig.position.set(out, y, MAST_Z + atTop * 0.05);
      rig.rotation.y = -Math.PI / 2 + atTop * (Math.PI / 2 + 0.35);
      const phase = climb * 34;
      const moving = climb > 0.001 && climb < 0.999 ? 1 : 0;
      const reach = Math.sin(phase) * 0.35 * moving;
      armL.rotation.set(-2.75 + reach, 0, 0);
      armR.rotation.set(-2.75 - reach, 0, 0);
      legL.rotation.x = -0.5 - Math.max(0, Math.sin(phase)) * 0.9 * moving;
      legR.rotation.x = -0.5 - Math.max(0, -Math.sin(phase)) * 0.9 * moving;
      hips.position.z = -0.08 * (1 - atTop);
      if (atTop > 0) {
        // Na szczycie: wyprostowana postawa, prawa ręka macha.
        legL.rotation.x = THREE.MathUtils.lerp(legL.rotation.x, 0, atTop);
        legR.rotation.x = THREE.MathUtils.lerp(legR.rotation.x, 0, atTop);
        armL.rotation.set(THREE.MathUtils.lerp(-2.75, 0, atTop), 0, -0.1 * atTop);
        armR.rotation.set(THREE.MathUtils.lerp(-2.75, 0, atTop), 0, atTop * (2.55 + Math.sin(t * 5) * 0.2));
      }
    }

    if (mastCharge.current) {
      const height = Math.max(0.001, climb * (NEST_Y - DECK_Y));
      mastCharge.current.scale.y = height;
      mastCharge.current.visible = climb > 0.001;
    }

    if (flag.current) {
      flag.current.scale.set(Math.max(0.001, flagUp), Math.max(0.001, flagUp), 1);
      flag.current.position.y = DECK_Y + MAST_H - 0.55 - (1 - flagUp) * 0.8;
      const pos = flag.current.geometry.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < pos.count; i++) {
        const x = flagRest[i * 3];
        pos.setZ(i, Math.sin(x * 3.2 - t * 5) * 0.12 * x);
      }
      pos.needsUpdate = true;
      flag.current.geometry.computeVertexNormals();
    }
  });

  return (
    <group>
      <Pier crew={crew} />
      <group position={BOAT.toArray()}>
        <group ref={bobbing} userData={{ dynamic: true }}>
          <mesh geometry={hull} material={deep} position-y={DECK_Y} />
          <mesh geometry={deck} material={clay} position-y={DECK_Y + 0.02} />
          {/* Maszt, bom, bocianie gniazdo */}
          <mesh material={clay} position={[0, DECK_Y + MAST_H / 2, MAST_Z]}>
            <cylinderGeometry args={[0.07, 0.11, MAST_H, 12]} />
          </mesh>
          <mesh material={clayShade} position={[0, DECK_Y + 1.2, MAST_Z - 1.55]} rotation-x={Math.PI / 2}>
            <cylinderGeometry args={[0.06, 0.06, 3.3, 8]} />
          </mesh>
          <mesh material={clay} position={[0, NEST_Y - 0.06, MAST_Z]}>
            <cylinderGeometry args={[0.55, 0.45, 0.12, 24]} />
          </mesh>
          <mesh material={clayShade} position={[0, NEST_Y + 0.28, MAST_Z]}>
            <torusGeometry args={[0.52, 0.025, 6, 32]} />
          </mesh>
          {steps.map((y, i) => (
            <mesh key={i} material={clayShade} position={[0.13, y, MAST_Z + (i % 2 ? 0.07 : -0.07)]} rotation-z={Math.PI / 2}>
              <cylinderGeometry args={[0.025, 0.025, 0.2, 6]} />
            </mesh>
          ))}
          {rigging.map((g, i) => (
            <mesh key={i} geometry={g} material={wire} userData={{ noCast: true }} />
          ))}
          <mesh geometry={mainsail} material={sailMaterial} />
          {/* Energia wspina się po maszcie razem z postacią */}
          <mesh ref={mastCharge} geometry={chargeGeo} material={green} position={[0.075, DECK_Y, MAST_Z]} userData={{ noCast: true }} />
          <mesh ref={flag} geometry={flagGeo} material={purple} position={[0, DECK_Y + MAST_H - 0.55, MAST_Z]} rotation-y={-Math.PI / 2} />
          <Person animated rig={climber} material={crew} />
        </group>
      </group>
    </group>
  );
}

/** Pomost z kolejnymi osobami, które czekają, żeby wejść na pokład. */
function Pier({ crew }: { crew: THREE.Material }) {
  const length = BOAT.z + 1 - (SHORE_Z - 0.3);
  const centerZ = SHORE_Z - 0.3 + length / 2;
  const posts = useMemo(() => {
    const out: [number, number][] = [];
    for (let z = SHORE_Z + 1; z < BOAT.z + 1; z += 1.6) out.push([-0.95, z], [0.95, z]);
    return out;
  }, []);
  const pierLine = useMemo(
    () => new THREE.TubeGeometry(new THREE.LineCurve3(v3(0.6, 0.24, SHORE_Z - 0.2), v3(0.6, 0.24, BOAT.z + 0.6)), 40, 0.035, 6),
    [],
  );
  const planks = useMemo(() => Array.from({ length: Math.floor(length / 0.5) }, (_, i) => SHORE_Z - 0.05 + i * 0.5), [length]);

  return (
    <group position={[PIER_X, 0, 0]}>
      {planks.map((z) => (
        <mesh key={z} material={clay} position={[0, 0.16, z]}>
          <boxGeometry args={[2.1, 0.1, 0.44]} />
        </mesh>
      ))}
      <mesh material={clayShade} position={[0, 0.07, centerZ]}>
        <boxGeometry args={[1.9, 0.08, length]} />
      </mesh>
      {posts.map(([x, z], i) => (
        <mesh key={i} material={clayShade} position={[x, -0.2, z]}>
          <cylinderGeometry args={[0.09, 0.09, 0.9, 8]} />
        </mesh>
      ))}
      {/* Zielona linia energii biegnie pomostem aż do łódki */}
      <mesh geometry={pierLine} material={energyMaterial} userData={{ noCast: true }} />
      <Person position={[-0.35, 0.21, BOAT.z - 2.2]} facing={0.2} material={crew} />
      <Person position={[0.2, 0.21, BOAT.z - 3.6]} facing={-0.1} material={crew} scale={0.9} />
      <Person position={[-0.3, 0.21, BOAT.z - 5.1]} facing={0.3} material={crew} pose="raise" />
    </group>
  );
}
