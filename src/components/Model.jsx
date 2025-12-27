import React, { useRef, useEffect } from 'react';
import { useGLTF, useAnimations } from '@react-three/drei';

export default function Model(props) {
    const group = useRef();
    const { scene, animations } = useGLTF('/phoenix_bird.glb');
    const { actions } = useAnimations(animations, group);

    useEffect(() => {
        // Play the first animation if it exists
        if (actions && Object.keys(actions).length > 0) {
            // Play the first animation found
            const firstActionName = Object.keys(actions)[0];
            actions[firstActionName]?.reset().fadeIn(0.5).play();
        }
    }, [actions]);

    return (
        <group ref={group} {...props} dispose={null}>
            <primitive object={scene} />
        </group>
    );
}

useGLTF.preload('/phoenix_bird.glb');
