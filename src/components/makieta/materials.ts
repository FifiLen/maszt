import * as THREE from "three";

// Paleta makiety: „glina” w odcieniach piasku marki, zieleń jako energia, fiolet z flagi logo.
export const COLORS = {
  bg: "#e8e4df",
  clay: "#f2eee8",
  clayShade: "#e0d9cf",
  wire: "#cbc3b7",
  green: "#3ead8f",
  deep: "#23775f",
  purple: "#8c4693",
  water: "#cfdcd6",
};

export const clay = new THREE.MeshLambertMaterial({ color: COLORS.clay });
export const clayDouble = new THREE.MeshLambertMaterial({ color: COLORS.clay, side: THREE.DoubleSide });
export const clayShade = new THREE.MeshLambertMaterial({ color: COLORS.clayShade });
export const wire = new THREE.MeshLambertMaterial({ color: COLORS.wire });
export const green = new THREE.MeshLambertMaterial({
  color: COLORS.green,
  emissive: COLORS.green,
  emissiveIntensity: 0.35,
});
export const deep = new THREE.MeshLambertMaterial({ color: COLORS.deep });
export const purple = new THREE.MeshLambertMaterial({ color: COLORS.purple, side: THREE.DoubleSide });

/** Materiał postaci, który przy aktywnym przystanku „zapala się” na zielono. */
export function makeChargeableMaterial() {
  return new THREE.MeshLambertMaterial({ color: COLORS.clay, emissive: COLORS.green, emissiveIntensity: 0 });
}

const clayColor = new THREE.Color(COLORS.clay);
const greenColor = new THREE.Color(COLORS.green);

export function charge(material: THREE.MeshLambertMaterial, amount: number) {
  material.color.copy(clayColor).lerp(greenColor, amount);
  material.emissiveIntensity = amount * 0.25;
}
