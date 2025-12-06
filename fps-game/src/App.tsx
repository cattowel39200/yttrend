import { Canvas } from '@react-three/fiber';
import { Physics } from '@react-three/cannon';
import { Sky } from '@react-three/drei';
import { useState } from 'react';
import { Vector3 } from 'three';
import { Player } from './components/Player';
import { World } from './components/World';
import { Bullet } from './components/Bullet';
import { Target } from './components/Target';
import './App.css';

function App() {
  const [bullets, setBullets] = useState<{ id: number, position: [number, number, number], velocity: [number, number, number] }[]>([]);

  const handleShoot = (pos: Vector3, vel: Vector3) => {
    setBullets(prev => [
      ...prev,
      {
        id: Date.now(),
        position: [pos.x, pos.y, pos.z],
        velocity: [vel.x, vel.y, vel.z]
      }
    ]);
  };

  return (
    <div id="canvas-container">
      <Canvas>
        <Sky sunPosition={[100, 10, 100]} />
        <Physics gravity={[0, -9.8, 0]}>
          <Player onShoot={handleShoot} />
          <World />
          {bullets.map(b => (
            <Bullet key={b.id} position={b.position} velocity={b.velocity} />
          ))}
          <Target position={[5, 1, 5]} />
          <Target position={[-5, 1, 5]} />
          <Target position={[0, 1, 10]} />
        </Physics>
      </Canvas>
      <div id="crosshair">+</div>
      <div id="instructions">
        Click to play | WASD to move | SPACE to jump | CLICK to shoot
      </div>
    </div>
  );
}

export default App;
