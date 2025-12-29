import React, { useEffect, useRef, Suspense, useLayoutEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Model from './components/Model';
import ErrorBoundary from './ErrorBoundary';
import './index.css';

gsap.registerPlugin(ScrollTrigger);

function App() {
  const containerRef = useRef(null);
  const modelWrapperRef = useRef(null);

  useEffect(() => {
    // Reveal animation for Hero text
    gsap.fromTo(
      '.hero h1',
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1.5, ease: 'power3.out' }
    );

    gsap.fromTo(
      '.hero .subtitle',
      { opacity: 0 },
      { opacity: 1, duration: 1.5, delay: 0.5, ease: 'power3.out' }
    );

    // Scroll reveal for story paragraphs
    const paragraphs = gsap.utils.toArray('.story p');
    paragraphs.forEach((p) => {
      gsap.fromTo(p,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          scrollTrigger: {
            trigger: p,
            start: "top 85%", // when the top of the element hits 85% of the viewport height
            toggleActions: "play none none reverse"
          }
        }
      );
    });
  }, []);

  const [windowWidth, setWindowWidth] = React.useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getModelProps = () => {
    if (windowWidth < 768) {
      // Mobile: Smaller, centered or slightly offset
      return {
        position: [0, -1.5, 0],
        scale: [0.008, 0.008, 0.008]
      };
    } else if (windowWidth < 1200) {
      // Tablet/Small Laptop: Slightly closer
      return {
        position: [3, -1, 0],
        scale: [0.01, 0.01, 0.01]
      };
    } else {
      // Desktop: Original
      return {
        position: [5, -1, 0],
        scale: [0.012, 0.012, 0.012]
      };
    }
  };

  const modelProps = getModelProps();

  useLayoutEffect(() => {
    if (!modelWrapperRef.current) return;

    let ctx = gsap.context(() => {
      // Continuous "Running"/Flying Animation across the screen
      // The bird flies from Left (-15) to Right (+15) repeatedly

      const tl = gsap.timeline({ repeat: -1 });

      // Ensure bird faces right (PI/2)
      gsap.set(modelWrapperRef.current.rotation, { y: Math.PI / 2, x: 0, z: 0 });

      tl.fromTo(modelWrapperRef.current.position,
        { x: -15, y: -1, z: 0 },
        {
          x: 15,
          y: 1, // Slight drift up
          z: 0,
          duration: 5,
          ease: "none"
        }
      );
    }, modelWrapperRef); // Scope to ref

    return () => ctx.revert(); // Cleanup
  }, []); // Run once on mount

  return (
    <>
      <div className="background"></div>

      {/* 3D Scene Container */}
      <div className="canvas-container" style={{ position: 'fixed', inset: 0, zIndex: 0 }}>
        <ErrorBoundary>
          <Canvas camera={{ position: [0, 0, 13], fov: 75 }}>
            <ambientLight intensity={1.5} />
            <directionalLight position={[10, 10, 5]} intensity={1} />
            {/* Original lighting was strong directional. Adjusting for standard scene. */}

            <Suspense fallback={null}>
              <group
                ref={modelWrapperRef}
                scale={modelProps.scale}
              >
                <Model />
              </group>

              {/* Optional: Add environment for better reflections on the model */}
              <Environment preset="city" />
            </Suspense>
          </Canvas>
        </ErrorBoundary>
      </div>

      <main className="container" ref={containerRef} style={{ position: 'relative', zIndex: 1 }}>
        <section className="hero">
          <h1>A Quiet Measure of Days</h1>
          <p className="subtitle">A character study in stillness, movement, and light</p>
        </section>

        <section className="story">
          <p>I learned to measure my days by the way light settles on things.</p>

          <p>
            There are mornings when the world is a cool, quiet bowl — mist settling over the valley,
            the distant teeth of the mountains softened by blue haze.
          </p>

          <p>
            The trail is honest work. Stones remember rain. Roots remember footsteps.
            I walk alone, not because I am lonely, but because the forest speaks more clearly that way.
          </p>

          <p>
            When I come down, I carry a steadiness in my chest.
            I move through the city without urgency — watching shadows stretch.
          </p>

          <p>
            At home, there is softness. A sleeping cat. A couch warmed by afternoon light.
          </p>

          <p>
            What I am learning is not speed, nor certainty.
            It is presence.
          </p>
        </section>

        <footer>
          <p> vin the pooh ~ by Mii </p>
        </footer>
      </main>
    </>
  );
}

export default App;
