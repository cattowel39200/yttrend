import { useBox } from '@react-three/cannon';

export const Target = ({ position }: { position: [number, number, number] }) => {
    const [ref] = useBox(() => ({
        mass: 1,
        position,
        args: [1, 1, 1],
    }));

    return (
        <mesh ref={ref as any} castShadow receiveShadow>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="orange" />
        </mesh>
    );
};
