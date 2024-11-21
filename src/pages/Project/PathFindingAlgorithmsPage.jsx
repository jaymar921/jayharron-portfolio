import React, { useEffect, useState } from "react";
import {
  animate,
  Astar,
  BFS,
  DFS,
  loadCanvas,
  loadVertex,
} from "../../utilities/PathFindingAlgo";
import { PathFindingAlgoritms } from "../../constants";

function PathFindingAlgorithmsPage() {
  const [algoTitle, setAlgoTitle] = useState("Path Finding Algorithms");
  const [algoDes, setAlgoDes] = useState({
    description: "",
    initialization: "",
    operations: [],
    complexity: "",
    advantages: [],
    disadvantages: [],
    exampleScenario: [],
  });

  const [nOfVisitedNodes, setNofVisitedNodes] = useState(0);

  useEffect(() => {
    setTimeout(() => {
      loadCanvas();
      loadVertex();
      animate();
    }, 500);
  }, []);
  return (
    <section className="relative block lg:flex-row flex-col max-container h-full">
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
            BFS(18, 342, setNofVisitedNodes);
            setAlgoTitle("Breadth-First Search");
            setAlgoDes(PathFindingAlgoritms.bfs);
          }}
        >
          BFS
        </button>
        <button
          className={`${
            algoTitle === "Depth-First Search" ? "bg-slate-500" : "bg-white"
          } p-2 border-2 border-gray-300 rounded-lg m-2`}
          onClick={() => {
            DFS(18, 342, setNofVisitedNodes);
            setAlgoTitle("Depth-First Search");
            setAlgoDes(PathFindingAlgoritms.dfs);
          }}
        >
          DFS
        </button>
        <button
          className={`${
            algoTitle === "A-Star (A*) Algorithm" ? "bg-slate-500" : "bg-white"
          } p-2 border-2 border-gray-300 rounded-lg m-2`}
          onClick={() => {
            Astar(18, 342, setNofVisitedNodes);
            setAlgoTitle("A-Star (A*) Algorithm");
            setAlgoDes(PathFindingAlgoritms.astar);
          }}
        >
          AStar
        </button>
        <div className="output hidden">
          <p id="output-text">OUTPUT</p>
        </div>
      </div>
      <div className="grid md:grid-cols-2 grid-cols-1 text-white gap-4">
        <div>
          <h2 className="font-bold text-lg">Description</h2>
          <p className="text-justify text-blue-300">{algoDes.description}</p>
          <h2 className="font-bold text-lg">Initialization</h2>
          <p className="text-justify text-blue-300">{algoDes.initialization}</p>
          <h2 className="font-bold text-lg">Complexity</h2>
          <p className="text-justify text-blue-300">{algoDes.complexity}</p>
          <h2 className="font-bold text-lg">Advantages</h2>
          {algoDes.advantages.map((value, index) => {
            return (
              <p
                className="text-justify text-blue-300 text-xs my-2"
                key={index}
              >
                •{value}
              </p>
            );
          })}
          <h2 className="font-bold text-lg">Disadvantages</h2>
          {algoDes.disadvantages.map((value, index) => {
            return (
              <p
                className="text-justify text-blue-300 text-xs my-2"
                key={index}
              >
                •{value}
              </p>
            );
          })}
          {algoDes.disadvantages.length === 0 && (
            <div className="h-[200px]"></div>
          )}
        </div>
        <div>
          <p className="font-bold text-lg">Visited Nodes: {nOfVisitedNodes}</p>
          <h2 className="font-bold text-lg">Operations</h2>
          {algoDes.operations.map((value, index) => {
            return (
              <p
                className="text-justify text-blue-300 text-xs my-2"
                key={index}
              >
                •{value}
              </p>
            );
          })}
          <h2 className="font-bold text-lg">Real world examples</h2>
          {algoDes.exampleScenario.map((value, index) => {
            return (
              <p
                className="text-justify text-blue-300 text-xs my-2"
                key={index}
              >
                •{value}
              </p>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default PathFindingAlgorithmsPage;
