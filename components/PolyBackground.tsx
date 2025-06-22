import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';

function Polygons({ count = 80 }: { count?: number }) {
  const mesh = useRef<THREE.InstancedMesh>(null!);
  const { mouse } = useThree();

  const positions = useMemo(() => {
    const arr: [number, number, number][] = [];
    for (let i = 0; i < count; i++) {
      arr.push([
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20,
      ]);
    }
    return arr;
  }, [count]);

  const dummy = useMemo(() => new THREE.Object3D(), []);
  const geometry = useMemo(() => new THREE.IcosahedronGeometry(0.4, 0), []);
  const material = useMemo(
    () => new THREE.MeshBasicMaterial({ color: 'white', wireframe: true }),
    []
  );

  useFrame(() => {
    for (let i = 0; i < count; i++) {
      const [x, y, z] = positions[i];
      dummy.position.set(x + mouse.x * 5, y - mouse.y * 5, z);
      dummy.rotation.x += 0.01;
      dummy.rotation.y += 0.008;
      dummy.updateMatrix();
      mesh.current.setMatrixAt(i, dummy.matrix);
    }
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore - three.js JSX intrinsic
    <instancedMesh ref={mesh} args={[geometry, material, count]} />
  );
}

export default function PolyBackground() {
  return (
    <Canvas
      className="fixed top-0 left-0 w-full h-full z-0"
      camera={{ position: [0, 0, 15] }}
    >
      <Polygons count={100} />
    </Canvas>
  );
}
