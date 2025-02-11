import React, { useEffect } from "react";
import { useCanvas } from "../../hooks/useCanvas";
import TilemapLevelGenerator from "../../handlers/TilemapLevelGenerator";
import { convertSingleArrayMapTo2DArray } from "../../utilities/TilemapUtility";
import { Map1Colliders } from "../../constants";
import Map1ImageSource from "../../assets/pixelarts/map-1.png";
import PlayerHandler from "../../handlers/PlayerHandler";

function Graphic2D() {
  const canvasScreen = useCanvas(
    "canvas-screen",
    window.innerWidth,
    window.innerHeight,
    "#020617"
  );

  useEffect(() => {
    canvasScreen.enableScreenDrag(true);
    // center the offset on initial load
    canvasScreen.setCameraOffset(
      960 / 2 - window.innerWidth / 2,
      640 / 2 - window.innerHeight / 2
    );

    const tilemapLevelGenerator = new TilemapLevelGenerator(canvasScreen);

    const collider = convertSingleArrayMapTo2DArray(
      Map1Colliders,
      { row: 20, column: 30 },
      1
    );

    tilemapLevelGenerator.addLevel(
      Map1ImageSource,
      960,
      640,
      { x: 0, y: 0 },
      collider
    );

    tilemapLevelGenerator.loadLevel(1);

    const playerHandler = new PlayerHandler(canvasScreen, {
      x: 32 * 14,
      y: 32 * 5,
    });
    playerHandler.addColliders(tilemapLevelGenerator.getBoxCollider(1));
  }, [canvasScreen]);

  return (
    <>
      <canvas id="canvas-screen"></canvas>
    </>
  );
}

export default Graphic2D;
