import { useSphere } from '@react-three/cannon';
import { useThree, useFrame } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import { Vector3 } from 'three';
import { PointerLockControls } from '@react-three/drei';

const SPEED = 5;

export const Player = ({ onShoot }: { onShoot: (pos: Vector3, vel: Vector3) => void }) => {
    const { camera } = useThree();
    const [ref, api] = useSphere(() => ({
        mass: 1,
        type: 'Dynamic',
        position: [0, 2, 0],
        args: [1], // Radius
        fixedRotation: true,
    }));

    const velocity = useRef([0, 0, 0]);
    useEffect(() => api.velocity.subscribe((v) => (velocity.current = v)), [api.velocity]);

    const pos = useRef([0, 0, 0]);
    useEffect(() => api.position.subscribe((p) => (pos.current = p)), [api.position]);

    // Input state refs
    const moveForward = useRef(false);
    const moveBackward = useRef(false);
    const moveLeft = useRef(false);
    const moveRight = useRef(false);
    const jump = useRef(false);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            switch (e.code) {
                case 'KeyW': moveForward.current = true; break;
                case 'KeyS': moveBackward.current = true; break;
                case 'KeyA': moveLeft.current = true; break;
                case 'KeyD': moveRight.current = true; break;
                case 'Space': jump.current = true; break;
            }
        };
        const handleKeyUp = (e: KeyboardEvent) => {
            switch (e.code) {
                case 'KeyW': moveForward.current = false; break;
                case 'KeyS': moveBackward.current = false; break;
                case 'KeyA': moveLeft.current = false; break;
                case 'KeyD': moveRight.current = false; break;
                case 'Space': jump.current = false; break;
            }
        };

        const handleMouseDown = () => {
            if (document.pointerLockElement) {
                const position = new Vector3();
                const direction = new Vector3();
                camera.getWorldPosition(position);
                camera.getWorldDirection(direction);
                // Spawn bullet slightly in front of camera
                position.add(direction.clone().multiplyScalar(1));
                const velocity = direction.multiplyScalar(20);
                onShoot(position, velocity);
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('keyup', handleKeyUp);
        document.addEventListener('mousedown', handleMouseDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('keyup', handleKeyUp);
            document.removeEventListener('mousedown', handleMouseDown);
        };
    }, [camera, onShoot]);

    useFrame(() => {
        if (!ref.current) return;

        // Sync camera to player position
        camera.position.copy(new Vector3(pos.current[0], pos.current[1] + 1, pos.current[2]));

        // Movement logic
        const direction = new Vector3();
        const frontVector = new Vector3(
            0,
            0,
            Number(moveBackward.current) - Number(moveForward.current)
        );
        const sideVector = new Vector3(
            Number(moveLeft.current) - Number(moveRight.current),
            0,
            0
        );

        direction
            .subVectors(frontVector, sideVector)
            .normalize()
            .multiplyScalar(SPEED)
            .applyEuler(camera.rotation);

        api.velocity.set(direction.x, velocity.current[1], direction.z);

        // Jump
        if (jump.current && Math.abs(velocity.current[1]) < 0.05) {
            api.velocity.set(velocity.current[0], 5, velocity.current[2]);
        }
    });

    return (
        <>
            <PointerLockControls />
            <mesh ref={ref as any} />
        </>
    );
};
