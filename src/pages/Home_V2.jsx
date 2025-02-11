import React from "react";
import ProfileCard from "../components/ProfileCard";
import { useCanvas } from "../hooks/useCanvas";

function Home_V2() {
  const canvasScreen = useCanvas(
    "canvas-screen",
    window.innerWidth,
    window.innerHeight,
    "bg-slate-100"
  );

  return (
    <>
      <section className="w-full h-screen relative z-0">
        <canvas id="canvas-screen" className="absolute z-0"></canvas>
        <ProfileCard className={"z-[2]"} />
      </section>
    </>
  );
}

export default Home_V2;
