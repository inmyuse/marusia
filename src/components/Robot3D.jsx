import { Suspense, useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

const URL = `${import.meta.env.BASE_URL}models/marusia.glb`;

const body = new THREE.MeshStandardMaterial({ color: '#303033', roughness: 0.78, metalness: 0, envMapIntensity: 0.9 });
const grille = new THREE.MeshStandardMaterial({ color: '#202022', roughness: 0.8, metalness: 0, envMapIntensity: 0.7 });
const led = new THREE.MeshStandardMaterial({ color: '#ffffff', emissive: '#ffffff', emissiveIntensity: 3, side: THREE.DoubleSide, toneMapped: false });

const FACE_Y = -0.0045; // vertical centre of the face on the dome (model units, metres)
const PX = 0.0000513; // metres per pixel of the close-up reference (eye box is 161x137 px)
const DOME_R = 0.0445;

// Seven-segment "n" eye traced from the close-up reference (absolute px, y down, left eye centre = (155.5, 179.5))
const EYE_CX = 155.5;
const EYE_CY = 179.5;
const EYE_GAP = 782; // px between the two eye centres
const BAR = [[98, 117], [103, 111], [207, 111], [212, 117], [182, 150], [127, 150]]; // top bar (reference shape)
const BAR_C = [155, 130.5];
// the legs are the top bar copied and turned 90 degrees onto the sides of the eye
const leg = (turn, cx, cy) =>
  BAR.map(([x, y]) => {
    const dx = x - BAR_C[0];
    const dy = y - BAR_C[1];
    return turn === 'left' ? [cx + dy, cy - dx] : [cx - dy, cy + dx];
  });
const EYE = [BAR, leg('left', 95.5, 192), leg('right', 216.5, 192)];

/** Static face: polygons wrapped once onto the dome surface. */
function makeFace(radiusAt) {
  const group = new THREE.Group();
  const wrapPoint = (u, v) => {
    const y = FACE_Y + v;
    const r = radiusAt(y) + 0.0004;
    const a = u / DOME_R;
    return new THREE.Vector3(Math.sin(a) * r, y, Math.cos(a) * r);
  };
  const addPoly = (pts) => {
    // pts in metres (u along surface, v up); fan triangulation of a convex polygon, subdivided so it hugs the dome
    const verts = [];
    const c = pts.reduce((m, p) => [m[0] + p[0] / pts.length, m[1] + p[1] / pts.length], [0, 0]);
    const N = 4;
    for (let i = 0; i < pts.length; i++) {
      const p0 = pts[i];
      const p1 = pts[(i + 1) % pts.length];
      for (let k = 0; k < N; k++) {
        const t0 = k / N;
        const t1 = (k + 1) / N;
        const e0 = [p0[0] + (p1[0] - p0[0]) * t0, p0[1] + (p1[1] - p0[1]) * t0];
        const e1 = [p0[0] + (p1[0] - p0[0]) * t1, p0[1] + (p1[1] - p0[1]) * t1];
        verts.push(wrapPoint(...c), wrapPoint(...e0), wrapPoint(...e1));
      }
    }
    const geo = new THREE.BufferGeometry().setFromPoints(verts);
    geo.computeVertexNormals();
    group.add(new THREE.Mesh(geo, led));
  };
  const eye = (cx) => {
    for (const poly of EYE) {
      addPoly(poly.map(([x, y]) => [cx + (x - EYE_CX) * PX, (EYE_CY - y) * PX]));
    }
  };
  eye((-EYE_GAP / 2) * PX);
  eye((EYE_GAP / 2) * PX);
  // dot between and below the eyes
  const dot = [];
  for (let i = 0; i < 24; i++) {
    const a = (i / 24) * Math.PI * 2;
    dot.push([Math.cos(a) * 17 * PX, -142 * PX + Math.sin(a) * 17 * PX]);
  }
  // circle is convex, fan works
  addPoly(dot);
  return { group };
}

/** Dome radius as a function of height, sampled from the mesh vertices. */
function profile(dome) {
  const pos = dome.geometry.attributes.position;
  const step = 0.0005;
  const buckets = new Map();
  for (let i = 0; i < pos.count; i++) {
    const k = Math.round(pos.getY(i) / step);
    const r = Math.hypot(pos.getX(i), pos.getZ(i));
    if (r > (buckets.get(k) || 0)) buckets.set(k, r);
  }
  return (y) => {
    const k = Math.round(y / step);
    for (let d = 0; d < 8; d++) {
      const v = buckets.get(k + d) ?? buckets.get(k - d);
      if (v) return v;
    }
    return 0.044;
  };
}

/** Soft procedural studio lighting (no network fetch). */
function Studio() {
  const { gl, scene } = useThree();
  useEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = env;
    return () => {
      scene.environment = null;
      env.dispose();
      pmrem.dispose();
    };
  }, [gl, scene]);
  return null;
}

function Model({ tilt }) {
  const { scene } = useGLTF(URL);
  const group = useRef();
  const gaze = useRef({ x: 0, y: 0 });
  const canvasEl = useRef(null);

  const { model, face } = useMemo(() => {
    const root = scene.clone(true);
    root.traverse((o) => {
      if (!o.isMesh) return;
      o.material = /\.00[12]$/.test(o.name) ? led : /\.00[345]$/.test(o.name) ? grille : body;
    });
    root.rotation.y = Math.PI; // turn the body half a turn; the face stays in front

    const dome = root.getObjectByName('Cylinder');
    const face = makeFace(profile(dome));

    const box = new THREE.Box3().setFromObject(root);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const k = 1.75 / Math.max(size.x, size.y, size.z);
    const wrap = new THREE.Group();
    wrap.add(root);
    wrap.add(face.group);
    wrap.children.forEach((c) => c.position.sub(center));
    wrap.scale.setScalar(k);
    return { model: wrap, face };
  }, [scene]);

  // remember the cursor in viewport coordinates; the gaze is recomputed every frame so scrolling keeps tracking
  const pointer = useRef(null);
  useEffect(() => {
    const onMove = (e) => {
      pointer.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  useFrame((state, dt) => {
    canvasEl.current = state.gl.domElement;
    const g = group.current;
    if (!g) return;
    const k = Math.min(1, dt * 5);
    const el = canvasEl.current;
    if (pointer.current && el) {
      const b = el.getBoundingClientRect();
      gaze.current.x = THREE.MathUtils.clamp((pointer.current.x - (b.left + b.width / 2)) / (window.innerWidth * 0.5), -1, 1);
      gaze.current.y = THREE.MathUtils.clamp((pointer.current.y - (b.top + b.height / 2)) / (window.innerHeight * 0.5), -1, 1);
    }
    const gz = gaze.current;
    // the whole speaker turns to face the cursor
    g.rotation.y += (gz.x * 0.75 + tilt.y - g.rotation.y) * k;
    g.rotation.x += (gz.y * 0.35 + tilt.x - g.rotation.x) * k;
    g.rotation.z += (tilt.z - g.rotation.z) * k;
  });

  return (
    <group ref={group}>
      <primitive object={model} />
    </group>
  );
}

const PAINT = {
  dark: { body: '#303033', grille: '#202022' },
  light: { body: '#6c7478', grille: '#60686c' }, // grey like the light-theme speaker
};

/** Repaint the shared materials whenever the page theme changes. */
function useThemePaint() {
  useEffect(() => {
    const apply = () => {
      const paint = PAINT[document.documentElement.dataset.theme] || PAINT.dark;
      body.color.set(paint.body);
      grille.color.set(paint.grille);
    };
    apply();
    const mo = new MutationObserver(apply);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => mo.disconnect();
  }, []);
}

export default function Robot3D({ className = '', tilt = { x: 0.1, y: 0, z: 0 } }) {
  useThemePaint();
  return (
    <div className={`robot3d ${className}`}>
      <Canvas camera={{ position: [0, 0.8, 7], fov: 16 }} dpr={[1, 2]} gl={{ alpha: true, antialias: true }} onCreated={({ camera }) => camera.lookAt(0, 0, 0)}>
        <Studio />
        <ambientLight intensity={0.25} />
        <directionalLight position={[2, 3, 6]} intensity={0.9} />
        <directionalLight position={[-5, 1, -2]} intensity={0.5} color="#bfe0ff" />
        <Suspense fallback={null}>
          <Model tilt={tilt} />
        </Suspense>
      </Canvas>
    </div>
  );
}

useGLTF.preload(URL);
