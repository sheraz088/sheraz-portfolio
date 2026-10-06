import { Environment, Lightformer, RoundedBox } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { Fragment, useEffect, useRef, useState } from "react";
import { Color, Group } from "three";

type SceneProps = {
  color: string;
  metal: string;
  position: [number, number, number];
  reduced: boolean;
  phase?: number;
};

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

const damp = (current: number, target: number, lambda: number, dt: number) =>
  current + (target - current) * (1 - Math.exp(-lambda * dt));

/** Polished clear-coated finish so the metal reads as real, not plastic. */
function Finish({
  color,
  metalness,
  roughness,
}: {
  color: string;
  metalness: number;
  roughness: number;
}) {
  return (
    <meshPhysicalMaterial
      color={color}
      metalness={metalness}
      roughness={roughness}
      clearcoat={0.85}
      clearcoatRoughness={0.16}
      envMapIntensity={1.25}
    />
  );
}

function Sculpture({ color, metal, position, reduced, phase = 0 }: SceneProps) {
  const shape = useRef<Group>(null);
  const core = useRef<Group>(null);
  const elapsed = useRef(phase);
  const revealed = useRef(0);

  useFrame(({ pointer }, rawDelta) => {
    const group = shape.current;
    if (!group || reduced) return;
    const dt = Math.min(rawDelta, 0.05);
    elapsed.current += dt;
    revealed.current = Math.min(1, revealed.current + dt / 1.4);
    const t = elapsed.current;
    const reveal = easeOutCubic(revealed.current);

    // Entrance: ease up into place, then settle into a slow, damped float.
    group.scale.setScalar(0.68 + 0.32 * reveal);
    group.rotation.y += dt * (0.3 - 0.16 * reveal);
    group.rotation.x = damp(group.rotation.x, 0.4 + pointer.y * 0.12, 2.2, dt);
    group.rotation.z = damp(group.rotation.z, Math.sin(t * 0.32) * 0.1 + pointer.x * 0.08, 2.2, dt);
    group.position.x = damp(group.position.x, position[0] + Math.sin(t * 0.4) * 0.12, 2, dt);
    group.position.y = damp(group.position.y, position[1] + Math.sin(t * 0.62) * 0.16, 2, dt);
    if (core.current) {
      core.current.rotation.y -= dt * 0.45;
      core.current.rotation.x = Math.sin(t * 0.5) * 0.35;
    }
  });

  return (
    <group ref={shape} position={position} rotation={[0.4, 0.6, 0.1]}>
      {[0, 1, 2].map((i) => (
        <group key={i} rotation={[0, 0, (i * Math.PI) / 3]}>
          {[-1, 1].map((side) => (
            <group key={side}>
              <RoundedBox
                args={[2.2, 0.19, 0.22]}
                radius={0.08}
                smoothness={3}
                position={[0, side, 0]}
              >
                <Finish
                  color={i === 1 ? metal : color}
                  metalness={i === 1 ? 0.9 : 0.45}
                  roughness={i === 1 ? 0.16 : 0.28}
                />
              </RoundedBox>
              <RoundedBox
                args={[0.19, 2.2, 0.22]}
                radius={0.08}
                smoothness={3}
                position={[side, 0, 0]}
              >
                <Finish
                  color={i === 1 ? metal : color}
                  metalness={i === 1 ? 0.9 : 0.45}
                  roughness={i === 1 ? 0.16 : 0.28}
                />
              </RoundedBox>
            </group>
          ))}
        </group>
      ))}
      {/* Counter-rotating core adds depth and a jewellery-like centrepiece. */}
      <group ref={core}>
        <mesh>
          <icosahedronGeometry args={[0.5, 0]} />
          <Finish color={metal} metalness={0.95} roughness={0.14} />
        </mesh>
        <mesh rotation={[Math.PI / 2.6, 0, 0]}>
          <torusGeometry args={[0.98, 0.028, 12, 96]} />
          <Finish color={color} metalness={0.85} roughness={0.2} />
        </mesh>
      </group>
    </group>
  );
}

function Orbit({
  color,
  metal,
  position,
  reduced,
  speed,
  phase = 0,
}: SceneProps & { speed: number }) {
  const orbit = useRef<Group>(null);
  const elapsed = useRef(phase);
  const revealed = useRef(0);

  useFrame((_, rawDelta) => {
    const group = orbit.current;
    if (!group || reduced) return;
    const dt = Math.min(rawDelta, 0.05);
    elapsed.current += dt;
    revealed.current = Math.min(1, revealed.current + dt / 1.4);
    const reveal = easeOutCubic(revealed.current);

    group.rotation.y += dt * speed;
    group.rotation.x = damp(group.rotation.x, 0.3 + Math.sin(elapsed.current * 0.4) * 0.08, 2, dt);
    group.scale.setScalar(0.8 + 0.2 * reveal);
  });

  const radius = 2.6;
  const beads = [0, 1, 2, 3];
  return (
    <group ref={orbit} position={position} rotation={[0.3, phase, 0.08]}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[radius, 0.016, 10, 128]} />
        <Finish color={metal} metalness={0.95} roughness={0.18} />
      </mesh>
      {beads.map((i) => {
        const angle = (i / beads.length) * Math.PI * 2;
        return (
          <mesh
            key={i}
            position={[
              Math.cos(angle) * radius,
              Math.sin(angle * 2) * 0.16,
              Math.sin(angle) * radius,
            ]}
          >
            <sphereGeometry args={[i % 2 ? 0.13 : 0.08, 32, 32]} />
            <Finish color={i % 2 ? color : metal} metalness={i % 2 ? 0.5 : 0.95} roughness={0.15} />
          </mesh>
        );
      })}
    </group>
  );
}

export default function PortfolioScene({ dark }: { dark: boolean }) {
  const [palette, setPalette] = useState<{
    blue: string;
    metal: string;
    light: string;
  }>();
  const [mobile, setMobile] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [visible, setVisible] = useState(true);
  const host = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const css = getComputedStyle(document.documentElement);
    const resolve = (token: string) => {
      const element = document.createElement("span");
      element.style.color = css.getPropertyValue(token);
      document.body.appendChild(element);
      const result = new Color(getComputedStyle(element).color).getStyle();
      element.remove();
      return result;
    };
    // Convert CSS OKLCH tokens through the browser's canvas for Three's sRGB parser.
    const rgb = (token: string) => {
      const canvas = document.createElement("canvas");
      canvas.width = canvas.height = 1;
      const ctx = canvas.getContext("2d");
      if (!ctx) return resolve(token);
      ctx.fillStyle = css.getPropertyValue(token).trim();
      ctx.fillRect(0, 0, 1, 1);
      const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
      return `rgb(${r},${g},${b})`;
    };
    setPalette({
      blue: rgb("--primary"),
      metal: rgb("--scene-metal"),
      light: rgb("--scene-light"),
    });
  }, [dark]);
  useEffect(() => {
    const size = matchMedia("(max-width: 640px)");
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
      setMobile(size.matches);
      setReduced(motion.matches);
    };
    update();
    size.addEventListener("change", update);
    motion.addEventListener("change", update);
    const observer = new IntersectionObserver(([entry]) => {
      if (entry) setVisible(entry.isIntersecting);
    });
    if (host.current) observer.observe(host.current);
    return () => {
      size.removeEventListener("change", update);
      motion.removeEventListener("change", update);
      observer.disconnect();
    };
  }, []);

  const spots: [number, number, number][] = mobile
    ? [[0, 0, 0]]
    : [
        [-12, 0, 0],
        [12, 0, 0],
      ];

  return (
    <div ref={host} className="portfolio-scene" aria-hidden="true">
      {palette && (
        <Canvas
          dpr={[1, 1.5]}
          camera={{ position: [0, 0, 12], fov: 35 }}
          frameloop={visible && !reduced ? "always" : "demand"}
          gl={{ alpha: true, antialias: true }}
        >
          <ambientLight intensity={0.9} />
          <directionalLight position={[3, 5, 6]} intensity={2.5} />
          <directionalLight position={[-5, 2, -4]} intensity={1.3} color={palette.light} />
          <Environment resolution={128}>
            <Lightformer
              intensity={3}
              position={[0, 4, 3]}
              scale={[10, 5, 1]}
              color={palette.light}
            />
            <Lightformer
              intensity={2}
              position={[-4, 0, 2]}
              scale={[5, 5, 1]}
              color={palette.light}
            />
            <Lightformer
              intensity={2.2}
              position={[5, -2, -2]}
              rotation={[0, -Math.PI / 2, 0]}
              scale={[6, 6, 1]}
              color={palette.blue}
            />
          </Environment>
          <group scale={mobile ? 0.88 : 1.15}>
            {spots.map((spot, i) => (
              <Fragment key={i}>
                <Sculpture
                  color={palette.blue}
                  metal={palette.metal}
                  position={spot}
                  reduced={reduced}
                  phase={i * 2}
                />
                <Orbit
                  color={palette.blue}
                  metal={palette.metal}
                  position={spot}
                  reduced={reduced}
                  speed={i % 2 ? -0.18 : 0.22}
                  phase={i * 1.4}
                />
              </Fragment>
            ))}
          </group>
        </Canvas>
      )}
    </div>
  );
}
