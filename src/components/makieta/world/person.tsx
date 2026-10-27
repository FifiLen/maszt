import * as THREE from "three";
import type { ReactNode, RefObject } from "react";
import { clay } from "../materials";

// Figurka ~1,15 j. wysokości, bez twarzy – jak ludziki na makietach architektonicznych.
const legGeo = new THREE.CapsuleGeometry(0.075, 0.3, 4, 8).translate(0, -0.225, 0);
const torsoGeo = new THREE.CapsuleGeometry(0.15, 0.22, 4, 10);
const headGeo = new THREE.SphereGeometry(0.13, 14, 10);
const armGeo = new THREE.CapsuleGeometry(0.055, 0.28, 4, 8).translate(0, -0.19, 0);

export type Pose = "stand" | "sit" | "armsOut" | "raise" | "carry";

const POSES: Record<Pose, { armL: [number, number]; armR: [number, number]; legs: number; lift: number }> = {
  // [rotacja X, rotacja Z] ramion, rotacja X nóg, obniżenie bioder
  stand: { armL: [0, -0.08], armR: [0, 0.08], legs: 0, lift: 0 },
  sit: { armL: [-0.7, -0.05], armR: [-0.7, 0.05], legs: -1.45, lift: -0.13 },
  armsOut: { armL: [0, -1.25], armR: [0, 1.25], legs: 0, lift: 0 },
  raise: { armL: [0, -0.1], armR: [0, 2.6], legs: 0, lift: 0 },
  carry: { armL: [-1.2, 0], armR: [-1.2, 0], legs: 0, lift: 0 },
};

type PersonProps = {
  position?: [number, number, number];
  /** Obrót wokół osi Y (0 = przodem do +z). */
  facing?: number;
  pose?: Pose;
  material?: THREE.Material;
  scale?: number;
  rig?: RefObject<THREE.Group | null>;
  /** Postać poruszana z zewnątrz – nie trafia do scalonej, statycznej geometrii. */
  animated?: boolean;
  /** Rzeczy trzymane przez postać – w układzie bioder. */
  children?: ReactNode;
};

type Limbs = Record<"hips" | "armL" | "armR" | "legL" | "legR", THREE.Group>;

/** Części figurki do animowania z zewnątrz (wyszukane raz i zapamiętane w userData). */
export function limbs(root: THREE.Group): Limbs {
  root.userData.limbs ??= {
    hips: root.getObjectByName("hips"),
    armL: root.getObjectByName("armL"),
    armR: root.getObjectByName("armR"),
    legL: root.getObjectByName("legL"),
    legR: root.getObjectByName("legR"),
  };
  return root.userData.limbs as Limbs;
}

export function Person({ position = [0, 0, 0], facing = 0, pose = "stand", material = clay, scale = 1, rig, animated = false, children }: PersonProps) {
  const p = POSES[pose];
  return (
    <group ref={rig} position={position} rotation-y={facing} scale={scale} userData={{ dynamic: animated }}>
      <group name="hips" position-y={0.5 + p.lift}>
        <group name="legL" position={[-0.08, 0, 0]} rotation-x={p.legs}>
          <mesh geometry={legGeo} material={material} />
        </group>
        <group name="legR" position={[0.08, 0, 0]} rotation-x={p.legs}>
          <mesh geometry={legGeo} material={material} />
        </group>
        <mesh geometry={torsoGeo} material={material} position-y={0.27} />
        <mesh geometry={headGeo} material={material} position-y={0.68} />
        <group name="armL" position={[-0.21, 0.45, 0]} rotation={[p.armL[0], 0, p.armL[1]]}>
          <mesh geometry={armGeo} material={material} />
        </group>
        <group name="armR" position={[0.21, 0.45, 0]} rotation={[p.armR[0], 0, p.armR[1]]}>
          <mesh geometry={armGeo} material={material} />
        </group>
        {children}
      </group>
    </group>
  );
}
