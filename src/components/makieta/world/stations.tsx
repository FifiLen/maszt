"use client";

import * as THREE from "three";
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { COLORS, charge, clay, clayShade, deep, green, makeChargeableMaterial } from "../materials";
import { STOPS, journey, stopWeight } from "../journey-state";
import { Person, limbs } from "./person";

/** Fala „głosu” – rozchodzące się zielone pierścienie. */
function VoiceRings({ position, weight }: { position: [number, number, number]; weight: () => number }) {
  const group = useRef<THREE.Group>(null);
  const materials = useMemo(() => [0, 1, 2].map(() => green.clone()), []);
  materials.forEach((m) => {
    m.transparent = true;
    m.depthWrite = false;
  });
  useFrame((state) => {
    const w = weight();
    group.current?.children.forEach((ring, i) => {
      const life = (state.clock.elapsedTime * 0.45 + i / 3) % 1;
      ring.scale.setScalar(0.3 + life * 2.4);
      materials[i].opacity = (1 - life) * w * 0.9;
    });
  });
  return (
    <group ref={group} position={position} userData={{ dynamic: true }}>
      {materials.map((m, i) => (
        <mesh key={i} material={m} rotation-x={-Math.PI / 2} userData={{ noCast: true }}>
          <ringGeometry args={[0.92, 1, 48]} />
        </mesh>
      ))}
    </group>
  );
}

// ---------- 02 · Szkoła: uczniowie przy okrągłym stole, jeden zabiera głos ----------

const SCHOOL = new THREE.Vector3(-12.6, 0, 1.6);
const TABLE = new THREE.Vector3(-9.6, 0, 5.9);

export function School() {
  const students = useMemo(() => makeChargeableMaterial(), []);
  const speakerRig = useRef<THREE.Group>(null);
  const weight = () => stopWeight(STOPS[2], journey.progress);

  const windows = useMemo(() => {
    const out: [number, number, number][] = [];
    for (let floor = 0; floor < 2; floor++) {
      for (let i = 0; i < 7; i++) {
        if (floor === 0 && i === 3) continue;
        out.push([-3.3 + i * 1.1, 0.95 + floor * 1.35, 2.31]);
      }
    }
    return out;
  }, []);

  useFrame((state) => {
    const w = weight();
    charge(students, w);
    const rig = speakerRig.current;
    if (rig) {
      const { armR } = limbs(rig);
      armR.rotation.z = 0.2 + w * (2.3 + Math.sin(state.clock.elapsedTime * 2.2) * 0.25);
    }
  });

  const seats = 6;
  return (
    <group>
      <group position={SCHOOL.toArray()}>
        <mesh material={clay} position={[0, 1.55, 0]}>
          <boxGeometry args={[8.4, 3.1, 4.6]} />
        </mesh>
        <mesh material={clayShade} position={[0, 3.18, 0]}>
          <boxGeometry args={[8.6, 0.16, 4.8]} />
        </mesh>
        <mesh material={clay} position={[3.4, 2.2, -0.6]}>
          <boxGeometry args={[1.6, 4.4, 2.2]} />
        </mesh>
        {windows.map((p, i) => (
          <mesh key={i} material={clayShade} position={p}>
            <boxGeometry args={[0.7, 0.75, 0.06]} />
          </mesh>
        ))}
        {/* Wejście z daszkiem */}
        <mesh material={clayShade} position={[0, 0.65, 2.32]}>
          <boxGeometry args={[1.1, 1.3, 0.06]} />
        </mesh>
        <mesh material={clay} position={[0, 1.45, 2.7]}>
          <boxGeometry args={[1.8, 0.1, 0.9]} />
        </mesh>
        {/* Maszt flagowy przed szkołą */}
        <mesh material={clayShade} position={[-3.6, 2.2, 3.1]}>
          <cylinderGeometry args={[0.035, 0.035, 4.4, 6]} />
        </mesh>
        <mesh material={deep} position={[-3.25, 4.05, 3.1]}>
          <boxGeometry args={[0.7, 0.42, 0.02]} />
        </mesh>
      </group>

      {/* Dziedziniec: okrągły stół, wokół uczniowie */}
      <group position={TABLE.toArray()}>
        <mesh material={clayShade} position-y={0.03} userData={{ noCast: true }}>
          <cylinderGeometry args={[3.1, 3.1, 0.06, 48]} />
        </mesh>
        <mesh material={clay} position-y={0.42}>
          <cylinderGeometry args={[0.95, 0.95, 0.08, 32]} />
        </mesh>
        <mesh material={clay} position-y={0.2}>
          <cylinderGeometry args={[0.12, 0.2, 0.4, 10]} />
        </mesh>
        {Array.from({ length: seats }, (_, i) => {
          const a = (i / seats) * Math.PI * 2 + 0.3;
          const r = 1.45;
          const x = Math.sin(a) * r;
          const z = Math.cos(a) * r;
          const facing = a + Math.PI;
          if (i === 1) {
            // Mówca wstaje i podnosi rękę.
            return <Person key={i} animated rig={speakerRig} position={[x, 0, z]} facing={facing} material={students} />;
          }
          return (
            <group key={i}>
              <mesh material={clayShade} position={[x * 1.08, 0.18, z * 1.08]}>
                <cylinderGeometry args={[0.2, 0.2, 0.36, 12]} />
              </mesh>
              <Person position={[x * 1.08, 0, z * 1.08]} facing={facing} pose="sit" material={students} />
            </group>
          );
        })}
        <VoiceRings position={[Math.sin(0.3 + Math.PI / 3) * 1.45, 1.4, Math.cos(0.3 + Math.PI / 3) * 1.45]} weight={weight} />
      </group>
    </group>
  );
}

// ---------- 03 · Park: krąg wsparcia ----------

const PARK = new THREE.Vector3(4, 0, 4.8);

export function Park() {
  const people = useMemo(() => makeChargeableMaterial(), []);
  const pulse = useRef<THREE.Mesh>(null);
  const pulseMaterial = useMemo(() => {
    const m = green.clone();
    m.transparent = true;
    return m;
  }, []);

  useFrame((state) => {
    const w = stopWeight(STOPS[3], journey.progress);
    charge(people, w);
    if (pulse.current) {
      const s = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.05;
      pulse.current.scale.setScalar(s * (0.4 + w * 0.6));
      (pulse.current.material as THREE.MeshLambertMaterial).opacity = 0.15 + w * 0.75;
    }
  });

  const count = 7;
  return (
    <group position={PARK.toArray()}>
      <mesh material={clayShade} position-y={0.04} userData={{ noCast: true }}>
        <cylinderGeometry args={[3.6, 3.7, 0.08, 64]} />
      </mesh>
      <mesh ref={pulse} material={pulseMaterial} rotation-x={-Math.PI / 2} position-y={0.1} userData={{ noCast: true, dynamic: true }}>
        <ringGeometry args={[0.55, 0.75, 48]} />
      </mesh>
      {Array.from({ length: count }, (_, i) => {
        const a = (i / count) * Math.PI * 2;
        return (
          <Person
            key={i}
            position={[Math.sin(a) * 1.25, 0.08, Math.cos(a) * 1.25]}
            facing={a + Math.PI}
            pose="armsOut"
            material={people}
            scale={i % 3 === 0 ? 0.82 : 1}
          />
        );
      })}
      {/* Ławki na obrzeżu */}
      {[0.9, 2.6, 4.4].map((a) => (
        <group key={a} position={[Math.sin(a) * 3, 0.08, Math.cos(a) * 3]} rotation-y={a}>
          <mesh material={clay} position-y={0.32}>
            <boxGeometry args={[1.2, 0.08, 0.38]} />
          </mesh>
          <mesh material={clayShade} position={[-0.45, 0.16, 0]}>
            <boxGeometry args={[0.08, 0.32, 0.3]} />
          </mesh>
          <mesh material={clayShade} position={[0.45, 0.16, 0]}>
            <boxGeometry args={[0.08, 0.32, 0.3]} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// ---------- 04 · Pawilon „pod naszymi żaglami”: młodzi robią własny projekt ----------

const PAVILION = new THREE.Vector3(15.6, 0, 7.6);
const SAIL_REST = new THREE.Color(COLORS.clay);
const SAIL_CHARGED = new THREE.Color(COLORS.green);

/** Żagiel-zadaszenie: paraboloida hiperboliczna rozpięta na czterech słupach. */
function sailCanopy(w: number, d: number, high: number, low: number) {
  const g = new THREE.PlaneGeometry(w, d, 20, 20);
  g.rotateX(-Math.PI / 2);
  const pos = g.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < pos.count; i++) {
    const u = pos.getX(i) / (w / 2);
    const v = pos.getZ(i) / (d / 2);
    pos.setY(i, (high + low) / 2 + ((high - low) / 2) * u * v);
  }
  g.computeVertexNormals();
  return g;
}

export function Pavilion() {
  const makers = useMemo(() => makeChargeableMaterial(), []);
  const sailMaterial = useMemo(() => {
    const m = green.clone();
    m.side = THREE.DoubleSide;
    m.emissiveIntensity = 0.1;
    return m;
  }, []);
  const canopy = useMemo(() => sailCanopy(5.4, 4.4, 3.3, 2.1), []);
  const carrier = useRef<THREE.Group>(null);

  useFrame((state) => {
    const w = stopWeight(STOPS[4], journey.progress);
    charge(makers, w);
    sailMaterial.color.copy(SAIL_REST).lerp(SAIL_CHARGED, 0.35 + w * 0.65);
    // Osoba z kartonem chodzi między stertą a stołem.
    const rig = carrier.current;
    if (rig) {
      const t = state.clock.elapsedTime * 0.35;
      const phase = (Math.sin(t) + 1) / 2;
      rig.position.set(-1.9 + phase * 2.4, 0.2, 1.3);
      rig.rotation.y = Math.cos(t) > 0 ? Math.PI / 2 : -Math.PI / 2;
      const { legL, legR } = limbs(rig);
      const step = Math.sin(state.clock.elapsedTime * 6) * 0.5 * Math.abs(Math.cos(t));
      legL.rotation.x = step;
      legR.rotation.x = -step;
    }
  });

  const corners: [number, number, number][] = [
    [-2.7, 3.3, -2.2],
    [2.7, 2.1, -2.2],
    [2.7, 3.3, 2.2],
    [-2.7, 2.1, 2.2],
  ];

  return (
    <group position={PAVILION.toArray()}>
      <mesh material={clay} position-y={0.1}>
        <boxGeometry args={[6.4, 0.2, 5.4]} />
      </mesh>
      {corners.map(([x, y, z], i) => (
        <mesh key={i} material={clayShade} position={[x, y / 2 + 0.2, z]}>
          <cylinderGeometry args={[0.06, 0.06, y, 8]} />
        </mesh>
      ))}
      <mesh geometry={canopy} material={sailMaterial} position-y={0.2} />

      {/* Stół warsztatowy, sterta kartonów, tablica z pomysłem */}
      <mesh material={clay} position={[0.7, 0.62, -0.3]}>
        <boxGeometry args={[2, 0.08, 1]} />
      </mesh>
      {[-0.2, 1.6].map((x) => (
        <mesh key={x} material={clayShade} position={[x, 0.41, -0.3]}>
          <boxGeometry args={[0.08, 0.42, 0.9]} />
        </mesh>
      ))}
      {[
        [-2, 0.42, 1.4],
        [-2.2, 0.42, 0.9],
        [-2.05, 0.86, 1.15],
      ].map((p, i) => (
        <mesh key={i} material={clayShade} position={p as [number, number, number]} rotation-y={i * 0.4}>
          <boxGeometry args={[0.45, 0.44, 0.45]} />
        </mesh>
      ))}
      <mesh material={clayShade} position={[0.9, 0.9, -1.5]} rotation-x={-0.12}>
        <boxGeometry args={[1.6, 1.1, 0.06]} />
      </mesh>
      <mesh material={deep} position={[0.9, 1.05, -1.45]} rotation-x={-0.12}>
        <boxGeometry args={[1.1, 0.12, 0.02]} />
      </mesh>
      <mesh material={green} position={[0.9, 0.8, -1.45]} rotation-x={-0.12}>
        <boxGeometry args={[0.7, 0.1, 0.02]} />
      </mesh>

      <Person position={[0.2, 0.2, 0.45]} facing={Math.PI} material={makers} pose="carry" />
      <Person position={[1.3, 0.2, 0.5]} facing={Math.PI + 0.3} material={makers} />
      <Person position={[1.9, 0.2, -1.2]} facing={-Math.PI / 2 - 0.4} material={makers} pose="raise" />
      <Person animated rig={carrier} material={makers} pose="carry">
        <mesh material={clayShade} position={[0, 0.32, 0.34]}>
          <boxGeometry args={[0.42, 0.36, 0.36]} />
        </mesh>
      </Person>
    </group>
  );
}
