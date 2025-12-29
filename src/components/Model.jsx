import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, useAnimations } from '@react-three/drei';

export default function Model(props) {
    const group = useRef();
    const { scene, animations } = useGLTF('/phoenix_bird.glb');
    const { actions } = useAnimations(animations, group);

    useEffect(() => {
        // Play the animation
        if (actions && Object.keys(actions).length > 0) {
            const firstActionName = Object.keys(actions)[0];
            const action = actions[firstActionName];
            action.reset().fadeIn(0.5).play();
            action.timeScale = 1.5; // Speed it up to give a "running" / energetic feel
        }
    }, [actions]);

    useFrame((state) => {
        if (!group.current) return;

        // Smoothly rotate the group based on mouse position
        // state.mouse.x is between -1 and 1
        // state.mouse.y is between -1 and 1

        const targetRotationY = state.mouse.x * 0.5; // Rotate left/right
        const targetRotationX = state.mouse.y * 0.3; // Rotate up/down slightly

        // Linear interpolation for smoothness
        group.current.rotation.y += (targetRotationY - group.current.rotation.y) * 0.1;
        group.current.rotation.x += (targetRotationX - group.current.rotation.x) * 0.1;
    });

    return (
        <group ref={group} {...props} dispose={null}>
            <primitive object={scene} />
        </group>
    );
}

useGLTF.preload('/phoenix_bird.glb');
