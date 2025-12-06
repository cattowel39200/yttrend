import { usePlane } from '@react-three/cannon';

export const World = () => {
    const [ref] = usePlane(() => ({
        rotation: [-Math.PI / 2, 0, 0],
        position: [0, 0, 0]
    }));

    return (
        <>
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
            <mesh ref={ref as any} receiveShadow>
                <planeGeometry args={[100, 100]} />
                <meshStandardMaterial color="#444" />
            </mesh>
            <gridHelper args={[100, 100]} />
        </>
    );
};
