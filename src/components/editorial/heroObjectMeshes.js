import {
  Shape,
  ShapeUtils,
  Vector2,
  ExtrudeGeometry,
  Group,
  Mesh,
  MeshPhysicalMaterial,
  EdgesGeometry,
  LineSegments,
  LineBasicMaterial,
} from 'three';

const opening = [
  [0.42, 1],
  [0.66, 0.72],
  [-0.35, 0],
  [0.66, -0.72],
  [0.42, -1],
  [-0.95, 0],
];
const slash = [
  [-1.15, -1.02],
  [-0.82, -1.02],
  [-0.13, 1.02],
  [-0.46, 1.02],
];
const closing = opening.map(([x, y]) => [-x * 0.8 + 0.55, y]);

function geometryFor(points, shard = false) {
  const shape = new Shape(points.map(([x, y]) => new Vector2(x, y)));
  shape.closePath();
  const geometry = new ExtrudeGeometry(shape, {
    depth: 0.28,
    bevelEnabled: true,
    bevelThickness: shard ? 0.012 : 0.065,
    bevelSize: shard ? 0.012 : 0.055,
    bevelSegments: shard ? 1 : 4,
    steps: 1,
  });
  geometry.translate(0, 0, -0.14);
  return geometry;
}

function glassPiece(geometry, material, outline) {
  const mesh = new Mesh(geometry, material);
  mesh.add(new LineSegments(new EdgesGeometry(geometry, 35), outline));
  return mesh;
}

export function createHeroObjects() {
  return [[opening], [slash, closing]].map((polygons, index) => {
    const root = new Group(),
      intact = new Group(),
      broken = new Group();
    root.add(intact, broken);
    const glass = new MeshPhysicalMaterial({
      color: index ? 0xeac5e4 : 0xc0cee9,
      roughness: 0.08,
      metalness: 0,
      transmission: 0.65,
      thickness: 0.8,
      ior: 1.45,
      clearcoat: 1,
      clearcoatRoughness: 0.05,
      transparent: true,
      opacity: 0.92,
      envMapIntensity: 1.7,
    });
    const outline = new LineBasicMaterial({
      color: index ? 0xe9d9ed : 0xd5e3f5,
      transparent: true,
      opacity: 0.6,
    });
    const fragments = [];
    for (const polygon of polygons) {
      intact.add(glassPiece(geometryFor(polygon), glass, outline));
      const vertices = polygon.map(([x, y]) => new Vector2(x, y));
      // Divide each triangle once more, producing bounded, reproducible shards.
      for (const face of ShapeUtils.triangulateShape(vertices, [])) {
        const corners = face.map((i) => polygon[i]);
        const center = corners.reduce(([x, y], p) => [x + p[0] / 3, y + p[1] / 3], [0, 0]);
        for (let edge = 0; edge < 3; edge++) {
          const triangle = [corners[edge], corners[(edge + 1) % 3], center];
          const origin = triangle.reduce(([x, y], p) => [x + p[0] / 3, y + p[1] / 3], [0, 0]);
          const local = triangle.map(([x, y]) => [x - origin[0], y - origin[1]]);
          const mesh = glassPiece(geometryFor(local, true), glass, outline);
          mesh.position.set(...origin, 0);
          broken.add(mesh);
          fragments.push({ mesh, origin });
        }
      }
    }
    broken.visible = false;
    return { root, intact, broken, fragments };
  });
}
