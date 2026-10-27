import * as THREE from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";

const UP = new THREE.Vector3(0, 1, 0);

/** Pręt (walec) między dwoma punktami – do kratownic, masztów, lin. */
export function strut(a: THREE.Vector3, b: THREE.Vector3, radius: number, segments = 5) {
  const dir = b.clone().sub(a);
  const length = dir.length();
  const g = new THREE.CylinderGeometry(radius, radius, length, segments, 1, true);
  g.translate(0, length / 2, 0);
  g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(UP, dir.normalize()));
  g.translate(a.x, a.y, a.z);
  return g;
}

export const v3 = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);

export function merge(geometries: THREE.BufferGeometry[]) {
  const prepared = geometries.map((g) => (g.index ? g.toNonIndexed() : g));
  prepared.forEach((g) => {
    if (!g.attributes.uv) g.setAttribute("uv", new THREE.Float32BufferAttribute(new Float32Array(g.attributes.position.count * 2), 2));
  });
  return mergeGeometries(prepared)!;
}

/** Deterministyczny generator liczb losowych – makieta wygląda tak samo przy każdym wejściu. */
export function rng(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
