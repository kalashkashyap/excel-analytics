import React, { useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, SoftShadows, Text } from "@react-three/drei";

function ThreeDChart({ data, numericKeys, xAxis }) {
  const colors = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#8dd1e1"];
  const barWidth = 0.8;
  const gap = 1.2;

  const xOffset = (numericKeys.length - 1) * (barWidth + gap) / 2;
  const zOffset = (data.length - 1) * (barWidth + gap) / 2;

  // ✅ useMemo is now before the early return
  const maxVal = useMemo(() => {
    if (!data.length || !numericKeys.length) return 0;
    return Math.max(
      ...numericKeys.flatMap((key) => data.map((row) => row[key] || 0))
    );
  }, [data, numericKeys]);

  // Early return
  if (!data.length || !numericKeys.length) return null;

  return (
    <Canvas
      shadows
      camera={{ position: [numericKeys.length * 1.5, maxVal * 1.5, data.length * 1.5], fov: 50 }}
    >
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[10, 20, 10]}
        intensity={1}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />

      {/* Ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[50, 50]} />
        <shadowMaterial opacity={0.2} />
      </mesh>

      {/* Bars */}
      {data.map((row, rowIndex) =>
        numericKeys.map((key, colIndex) => {
          const height = ((row[key] || 0) / maxVal) * 5;
          return (
            <mesh
              key={`${rowIndex}-${colIndex}`}
              position={[
                colIndex * (barWidth + gap) - xOffset,
                height / 2,
                rowIndex * (barWidth + gap) - zOffset
              ]}
              castShadow
            >
              <boxGeometry args={[barWidth, height, barWidth]} />
              <meshStandardMaterial color={colors[colIndex % colors.length]} />
            </mesh>
          );
        })
      )}

      {/* Labels */}
      {numericKeys.map((key, colIndex) => (
        <Text
          key={`x-label-${colIndex}`}
          position={[colIndex * (barWidth + gap) - xOffset, -0.3, zOffset + 0.5]}
          fontSize={0.3}
          color="#000"
          anchorX="center"
          anchorY="middle"
        >
          {key}
        </Text>
      ))}

      {data.map((row, rowIndex) => (
        <Text
          key={`z-label-${rowIndex}`}
          position={[-xOffset - 0.5, -0.3, rowIndex * (barWidth + gap) - zOffset]}
          fontSize={0.3}
          color="#000"
          anchorX="center"
          anchorY="middle"
        >
          {row[xAxis]}
        </Text>
      ))}

      <OrbitControls />
      <SoftShadows />
    </Canvas>
  );
}

export default ThreeDChart;
