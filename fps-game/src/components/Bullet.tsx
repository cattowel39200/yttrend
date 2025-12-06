import { useSphere } from '@react-three/cannon';
import { useEffect } from 'react';

export const Bullet = ({ position, velocity }: { position: [number, number, number], velocity: [number, number, number] }) => {
    const [ref] = useSphere(() => ({
        mass: 0.1,
        position,
        velocity,
        args: [0.1],
    }));

    return (
        <mesh ref={ref as any}>
            <sphereGeometry args={[0.1]} />
            <meshStandardMaterial color="hotpink" emissive="hotpink" />
        </mesh>
    );
};
