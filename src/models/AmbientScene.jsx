import { useFrame } from "@react-three/fiber";
import {
  DepthOfField,
  EffectComposer,
  Vignette,
} from "@react-three/postprocessing";
import React, { useEffect, useRef, useState } from "react";

const AmbientScene = () => {
  const [mouseY, setMouseY] = useState(500);
  const totalHeight = Math.max(
    document.documentElement.scrollHeight,
    window.innerHeight
  );
  const DoF_Ref = useRef();
  useFrame(() => {
    if (DoF_Ref.current) {
      DoF_Ref.current.target.set(
        0,
        1 + ((totalHeight - mouseY) * 0.02) / 2 - 3,
        0
      );
      DoF_Ref.current.bokehScale = (mouseY / totalHeight) * 2 + 2;
    }
  });

  useEffect(() => {
    const handleMouseMove = (event) => {
      setMouseY(event.clientY);
    };

    document.addEventListener("mousemove", handleMouseMove);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, []); // Empty dependency array means this effect runs only once after mounting

  return (
    <EffectComposer>
      <DepthOfField
        ref={DoF_Ref}
        target={[0, 5, 0]}
        focusDistance={1}
        bokehScale={1}
        height={512}
      />
      <Vignette darkness={0.6} />
    </EffectComposer>
  );
};

export default AmbientScene;