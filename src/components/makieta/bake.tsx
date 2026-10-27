"use client";

import * as THREE from "three";
import { useLayoutEffect, useRef, type ReactNode } from "react";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";

const KEEP = ["position", "normal", "uv"];

/**
 * Scala nieruchome siatki w jedną siatkę na materiał – z kilkuset draw calli robi się kilkanaście.
 * Pomija InstancedMesh i wszystko pod węzłem z `userData.dynamic` (animowane postaci, łódka, efekty).
 * Oryginały zostają w drzewie Reacta, tylko niewidoczne.
 */
export function Baked({ children }: { children: ReactNode }) {
  const root = useRef<THREE.Group>(null);

  useLayoutEffect(() => {
    const group = root.current;
    if (!group) return;
    group.updateMatrixWorld(true);
    const toLocal = group.matrixWorld.clone().invert();
    const buckets = new Map<string, { material: THREE.Material; noCast: boolean; geometries: THREE.BufferGeometry[] }>();
    const originals: THREE.Mesh[] = [];

    const visit = (object: THREE.Object3D) => {
      if (object.userData.dynamic || !object.visible) return;
      const mesh = object as THREE.Mesh;
      if (mesh.isMesh && !(object as THREE.InstancedMesh).isInstancedMesh && !Array.isArray(mesh.material)) {
        const source = mesh.geometry;
        const attributes = KEEP.filter((name) => source.attributes[name]);
        if (attributes.includes("normal")) {
          const geometry = new THREE.BufferGeometry();
          attributes.forEach((name) => geometry.setAttribute(name, source.attributes[name]));
          if (source.index) geometry.setIndex(source.index);
          const baked = (geometry.index ? geometry.toNonIndexed() : geometry.clone()).applyMatrix4(
            new THREE.Matrix4().multiplyMatrices(toLocal, mesh.matrixWorld),
          );
          const noCast = Boolean(mesh.userData.noCast);
          const key = `${mesh.material.uuid}|${noCast}|${attributes.join()}`;
          if (!buckets.has(key)) buckets.set(key, { material: mesh.material, noCast, geometries: [] });
          buckets.get(key)!.geometries.push(baked);
          originals.push(mesh);
        }
      }
      object.children.forEach(visit);
    };
    group.children.forEach(visit);

    const merged: THREE.Mesh[] = [];
    buckets.forEach(({ material, noCast, geometries }) => {
      const geometry = mergeGeometries(geometries);
      geometries.forEach((g) => g.dispose());
      if (!geometry) return;
      const mesh = new THREE.Mesh(geometry, material);
      mesh.userData.noCast = noCast;
      mesh.matrixAutoUpdate = false;
      group.add(mesh);
      merged.push(mesh);
    });
    originals.forEach((mesh) => (mesh.visible = false));

    return () => {
      merged.forEach((mesh) => {
        group.remove(mesh);
        mesh.geometry.dispose();
      });
      originals.forEach((mesh) => (mesh.visible = true));
    };
  }, []);

  return <group ref={root}>{children}</group>;
}
