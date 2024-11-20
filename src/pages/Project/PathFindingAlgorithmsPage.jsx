import React, { useEffect, useState } from "react";
import {
  animate,
  Astar,
  BFS,
  DFS,
  loadCanvas,
  loadVertex,
} from "../../utilities/PathFindingAlgo";

function PathFindingAlgorithmsPage() {
  const [algoTitle, setAlgoTitle] = useState("Path Finding Algorithms");
  useEffect(() => {
    setTimeout(() => {
      loadCanvas();
      loadVertex();
      animate();
    }, 500);
  }, []);
  return (
    <section className="relative block lg:flex-row flex-col max-container h-[100vh]">
      <div className="text-center">
        <canvas
          className="relative left-[50%] translate-x-[-50%] "
          id="path-algo-canvas"
        ></canvas>
        <h3 className="text-orange-300 text-2xl font-bold py-2">{algoTitle}</h3>
      </div>
      <div className="text-center">
        <button
          className={`${
            algoTitle === "Breadth-First Search" ? "bg-slate-500" : "bg-white"
          } p-2 border-2 border-gray-300 rounded-lg m-2`}
          onClick={() => {
            BFS(18, 342);
            setAlgoTitle("Breadth-First Search");
          }}
        >
          BFS
        </button>
        <button
          className={`${
            algoTitle === "Depth-First Search" ? "bg-slate-500" : "bg-white"
          } p-2 border-2 border-gray-300 rounded-lg m-2`}
          onClick={() => {
            DFS(18, 342);
            setAlgoTitle("Depth-First Search");
          }}
        >
          DFS
        </button>
        <button
          className={`${
            algoTitle === "A-Star (A*) Algorithm" ? "bg-slate-500" : "bg-white"
          } p-2 border-2 border-gray-300 rounded-lg m-2`}
          onClick={() => {
            Astar(18, 342);
            setAlgoTitle("A-Star (A*) Algorithm");
          }}
        >
          AStar
        </button>
        <div className="output hidden">
          <p id="output-text">OUTPUT</p>
        </div>
      </div>
    </section>
  );
}

export default PathFindingAlgorithmsPage;
