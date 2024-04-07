"use client";

import { useTheme } from "next-themes";
import { useState, useEffect } from "react";

const MouseSpotlight = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const { resolvedTheme } = useTheme();

  const handleMouseMove = (e: MouseEvent) => {
    setPosition({ x: e.clientX, y: e.clientY });
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove, false);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove, false);
    };
  }, []);

  return (
    <div
      className="pointer-events-none  inset-0 z-40 top-0 transition duration-300 lg:fixed"
      style={{
        background: `radial-gradient(600px circle at ${position.x}px ${
          position.y
        }px, ${
          resolvedTheme === "dark"
            ? "rgba(255,255,255, 0.1)"
            : "rgba(0,0,0, 0.1)"
        }, transparent 80%)`,
      }}
    />
  );
};

export default MouseSpotlight;
