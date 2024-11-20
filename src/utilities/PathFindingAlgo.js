/*
setInterval(()=>{
	location.href = '';
}, 3000);
*/

export const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};
let canvas = null;
let context = null;
let output = null;

const backgroundColor = "rgba(255,238,204,0.5)";
const foundPathColor = "rgba(255,255,77,1)";
const startingColor = "red";
const nodeConnectionColor = "rgba(130,153,0, 0.1)";
const visitedColor = "rgba(0,0,0,0.5)";
const visitedConnectionColor = "blue";
const queuedNodeColor = "rgba(255,255,255,0.5)"

let xSize = 20;
let ySize = 20;

export const loadCanvas = () => {
    canvas = document.getElementById("path-algo-canvas");
    context = canvas.getContext("2d");
    output = document.querySelector("#output-text");

    canvas.width = xSize * 16;
    canvas.height = ySize * 16;
}

let text_type = "Path Finding Algorithms";

export const drawText = () => {
  context.fillStyle = "orange";
  context.font = "49px Arial";
  context.fillText(text_type, 2, 380);
};

export const drawBg = () => {
  context.fillStyle = "black";
  context.fillRect(0, 0, 1920, 1080);
};

export class QElement {
  constructor(element, priority) {
    this.element = element;
    this.priority = priority;
  }
}

// PriorityQueue class
export class PriorityQueue {
  // An array is used to implement priority
  constructor() {
    this.items = [];
  }

  getItems() {
    return this.items;
  }

  includes(i) {
    for (const item of this.items) {
      if (item.element === i) {
        return true;
      }
    }
    return false;
  }

  // functions to be implemented
  enqueue(element, priority) {
    // creating object from queue element
    var qElement = new QElement(element, priority);
    var contain = false;

    // iterating through the entire
    // item array to add element at the
    // correct location of the Queue
    for (var i = 0; i < this.items.length; i++) {
      if (this.items[i].priority < qElement.priority) {
        // Once the correct location is found it is
        // enqueued
        this.items.splice(i, 0, qElement);
        contain = true;
        break;
      }
    }

    // if the element have the highest priority
    // it is added at the end of the queue
    if (!contain) {
      this.items.push(qElement);
    }
  }
  dequeue() {
    // return the dequeued element
    // and remove it.
    // if the queue is empty
    // returns Underflow
    if (this.isEmpty()) return "Underflow";
    return this.items.shift().element;
  }
  front() {
    // returns the highest priority element
    // in the Priority queue without removing it.
    if (this.isEmpty()) return "No elements in Queue";
    return this.items[0];
  }
  rear() {
    // returns the lowest priority
    // element of the queue
    if (this.isEmpty()) return "No elements in Queue";
    return this.items[this.items.length - 1];
  }
  isEmpty() {
    // return true if the queue is empty.
    return this.items.length == 0;
  }

  remove(n) {
    this.items = this.items.filter((i) => i === n);
  }
}

export class Square {
  constructor({ position, width, height, color }) {
    this.position = position;
    this.width = width;
    this.height = height;
    this.color = color;
    this.connectionColor = nodeConnectionColor;
  }

  drawConnections() {
    this.neighbors.forEach((n) => {
      context.beginPath();
      context.moveTo(
        this.position.x + this.center(),
        this.position.y + this.center(),
        this.width,
        this.height
      );
      context.lineTo(
        n.position.x + n.center(),
        n.position.y + n.center(),
        n.width,
        n.height
      );
      context.strokeStyle = this.connectionColor;
      context.lineWidth = 2;
      context.stroke();
    });
  }

  draw() {
    context.fillStyle = this.color;
    context.fillRect(this.position.x, this.position.y, this.width, this.height);
    
	// context.fillStyle = 'black';
	// context.font = '7px Arial';
	// context.fillText(this.name, this.position.x+this.center()/2, this.position.y+this.center(), this.width);
		
  }

  center() {
    return this.width / 2;
  }
}

export class Vertex extends Square {
  constructor({ position, name, width = 16, height = 16, color = backgroundColor }) {
    super({ position, width, height, color });
    this.position = position;
    this.name = name;
    this.neighbors = new Array();
    this.parent = null;
    this.h = 0;
    this.g = 0;
    this.f = 0;
  }
}

export let VERTICES = new Array();

export const AddVertex = (_name, _x, _y) => {
  VERTICES.push(
    new Vertex({
      position: {
        x: _x,
        y: _y,
      },
      name: _name,
    })
  );
};

export const getDistance = (p1, p2) => {
  let a = Math.abs(p1.position.x - p2.position.x);
  let b = Math.abs(p1.position.y - p2.position.y);

  let c = a * a + b * b;
  return Math.sqrt(c);
};

export const AddNeighbor = (v_1, v_2) => {
  const vertex_1 = VERTICES.filter((v) => v.name === v_1)[0];
  const vertex_2 = VERTICES.filter((v) => v.name === v_2)[0];

  vertex_1.neighbors.push(vertex_2);
  vertex_2.neighbors.push(vertex_1);
};

export const blockGenerator = async () => {
  let i = 0;
  for (let x = 0; x < 16 * xSize; x += 17) {
    for (let y = 0; y < 16 * ySize; y += 17) {
      AddVertex(i++, x, y);
    }
  }
};

export const connectAllNodes = () => {
  VERTICES.forEach((n1) => {
    VERTICES.forEach((n2) => {
      if (getDistance(n1, n2) <= 17) {
        // if (
        //   (n1.name >= 90 && n1.name <= 95) ||
        //   (n2.name >= 90 && n2.name <= 95) ||
        //   (n1.name >= 97 && n1.name <= 103) ||
        //   (n2.name >= 97 && n2.name <= 103) ||
        //   (n1.name >= 105 && n1.name <= 107) ||
        //   (n2.name >= 105 && n2.name <= 107)
        // ); else AddNeighbor(n1.name, n2.name);
        if(!IsPathBlocked(n1.name) && !IsPathBlocked(n2.name))
            AddNeighbor(n1.name, n2.name);

        // if (
        //   (n1.name >= 90 && n1.name <= 95) ||
        //   (n1.name >= 97 && n1.name <= 103) ||
        //   (n1.name >= 105 && n1.name <= 107)
        // ) {
        //   n1.color = "rgba(25,102,255, 0.5)";
        // }
        if(IsPathBlocked(n1.name))
            n1.color = "rgba(25,102,255, 0.5)";
      }
    });
  });
};

export const loadVertex = async () => {
  VERTICES = new Array();
  await blockGenerator();
  connectAllNodes();
  /*
	AddVertex('A', 128, 86);
	AddVertex('B', 99, 217);
	AddVertex('C', 47, 345);
	AddVertex('D', 286, 266);
	AddVertex('E', 352, 176);
	AddVertex('F', 395, 364);
	AddVertex('G', 464, 64);
	AddVertex('H', 601, 141);
	AddVertex('I', 544, 276);
	AddVertex('J', 181, 463);
	AddVertex('K', 518, 421);

	AddNeighbor('A','B');
	AddNeighbor('B','C');
	AddNeighbor('B','D');
	AddNeighbor('C','F');
	AddNeighbor('D','E');
	AddNeighbor('A','E');
	AddNeighbor('F','E');
	AddNeighbor('G','E');
	AddNeighbor('G','H');
	AddNeighbor('H','I');
	AddNeighbor('F','J');
	AddNeighbor('F','K');
	*/
};

//loadVertex();

/*
 
	 get the node
	 if this node is near the goal
	 visit the node
	 expand the node (neighbors)
*/
export const DFS = async (vertex_name, goalVertex) => {
  loadVertex();
  text_type = "Depth-First-Search";
  let output_string = `OUTPUT<br>Starting Postion: ${vertex_name}`;
  const starting = VERTICES.filter((v) => v.name === vertex_name)[0];
  const goal = VERTICES.filter((v) => v.name === goalVertex)[0];

  goal.color = "orange";
  const queue = new Array();
  const visited = new Array();

  queue.push(starting);
  starting.color = startingColor;
  starting.draw();
  while (queue.length != 0) {
    await sleep(1);
    // pop
    const v = queue.pop();
    if (visited.includes(v.name)) {
      continue;
    }
    starting.color = startingColor;
    starting.draw();
    if (v.name === goalVertex) {
      reconstruct_path(v);
      break;
    }
    visited.push(v.name);
    v.color = visitedColor;
    v.connectionColor = visitedConnectionColor;
    for (let n of v.neighbors) {
      if (visited.includes(n.name)) {
        continue;
      }
      n.color = queuedNodeColor;
      n.parent = v;
      output_string += `<br>Visited ${n.name}`;
      output.innerHTML = output_string;
      if (!queue.includes(n)) queue.push(n);
    }
  }
  output_string += `<br>Graph Traversed`;
  output.innerHTML = output_string;
};
export const BFS = async (vertex_name, goalVertex) => {
  loadVertex();
  text_type = "Breadth-First-Search";
  let output_string = `OUTPUT<br>Starting Postion: ${vertex_name}`;
  const starting = VERTICES.filter((v) => v.name === vertex_name)[0];
  const goal = VERTICES.filter((v) => v.name === goalVertex)[0];

  goal.color = "orange";
  const queue = new Array();
  const visited = new Array();

  queue.push(starting);
  starting.color = startingColor;
  starting.draw();
  while (queue.length != 0) {
    await sleep(1);
    // pop
    const v = queue.shift();
    if (visited.includes(v.name)) {
      continue;
    }
    starting.color = startingColor;
    starting.draw();
    if (v.name === goalVertex) {
      reconstruct_path(v);
      break;
    }
    visited.push(v.name);
    v.color = visitedColor;
    v.connectionColor = visitedConnectionColor;
    for (let n of v.neighbors) {
      if (visited.includes(n.name)) {
        continue;
      }
      n.parent = v;
      n.color = queuedNodeColor;
      output_string += `<br>Visited ${n.name}`;
      output.innerHTML = output_string;
      if (!queue.includes(n)) queue.push(n);
    }
  }
  output_string += `<br>Graph Traversed`;
  output.innerHTML = output_string;
};

export const Astar = async (vertex_name, goalVertex) => {
  loadVertex();
  text_type = "A* Algorithm";
  let output_string = `OUTPUT<br>Starting Postion: ${vertex_name}`;
  const starting = VERTICES.filter((v) => v.name === vertex_name)[0];
  const goal = VERTICES.filter((v) => v.name === goalVertex)[0];
  generateHeuristic(starting, goal);
  goal.color = "orange";
  const queue = new PriorityQueue();
  const visited = new Array();

  starting.f = starting.g + starting.h;
  //console.log(starting);
  await sleep(100);
  queue.enqueue(starting, starting.f);
  starting.color = startingColor;
  starting.draw();

  while (queue.items.length > 0) {
    await sleep(10);
    // dequeue
    const v = getLowestFScore(queue.getItems());

    starting.color = startingColor;
    starting.draw();

    if (v.name === goalVertex) {
      //console.log("final f score: ", v.f);
      reconstruct_path(v);
      break;
    }

    v.color = visitedColor;
    v.connectionColor = visitedConnectionColor;

    for (let n of v.neighbors) {
      let gtotal = v.g + 0;

      if (!visited.includes(n.name) && !queue.includes(n)) {
        n.parent = v;
        n.g = gtotal;
        n.f = n.g + n.h;
        queue.enqueue(n, n.f);
        n.color = queuedNodeColor;
        output_string += `<br>Visited ${n.name}`;
        output.innerHTML = output_string;
      } else {
        if (gtotal < n.g) {
          n.parent = v;
          n.g = gtotal;
          n.f = n.g + n.h;
          //console.log("\n\nEEEE\n\n");
          if (visited.includes(n.name)) {
            queue.enqueue(n, n.f);
          }
        }
      }
    }
    //console.log("removed ", v.name, "  | queue size ", queue.items.length);
  }

  output_string += `<br>Graph Traversed`;
  output.innerHTML = output_string;
};

export const getLowestFScore = (openList) => {
  let lowestFScore = 1000;
  openList.forEach((v) => {
    if (v.element.f < lowestFScore) lowestFScore = v.element.f;
  });
  //console.log("lowest ", lowestFScore);
  for (const v of openList) {
    if (v.element.f === lowestFScore) return v.element;
  }
  return null;
};

export const generateHeuristic = (start_node, goal_node) => {
  for (let node of VERTICES) {
    // update the heuristic value from this node to the goal node
    if (node !== goal_node) {
      node.h = getDistance(node, goal_node);
      //console.log("heuristic of ",node.name," and ",goal_node.name," is ",node.h);
    }
  }
};
export const animate = () => {
  requestAnimationFrame(animate);
  context.clearRect(0, 0, canvas.width, canvas.height);
  drawText();
  VERTICES.forEach((v) => {
    v.drawConnections();
  });
  VERTICES.forEach((v) => {
    v.draw();
  });
};

export const reconstruct_path = async (v) => {
  let i = 0;
  for (let node = v; node != null; node = node.parent) {
    if (i++ >= 500) {
      break;
    }
    await sleep(5);
    node.color = foundPathColor;
    node.connectionColor = "aqua";
  }
};

export const IsPathBlocked = (pathName) => {
    const blockedPaths = [];

    
    for(let x = 57; x <= 75; x++){
        if(x != 72)
            blockedPaths.push(x);
    }

    for(let x = 171; x <= 189; x++){
        if(x != 180)
            blockedPaths.push(x);
    }

    
    for(let x = 266; x <= 284; x++){
        if(x != 270)
            blockedPaths.push(x);
    }


    return blockedPaths.filter(x => x === pathName).length > 0;
}

//animate();
