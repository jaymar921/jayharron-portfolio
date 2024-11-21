import { meta, shopify, starbucks, tesla } from "../assets/images";
import {
  car,
  contact,
  css,
  estate,
  express,
  git,
  github,
  html,
  javascript,
  linkedin,
  mongodb,
  motion,
  mui,
  nextjs,
  nodejs,
  pricewise,
  react,
  redux,
  sass,
  snapgram,
  summiz,
  tailwindcss,
  threads,
  typescript,
} from "../assets/icons";
export const positions = [
  { position: [3, -67, 4], rotation: [0, 1.0, 0] },
  { position: [0, -48, 4], rotation: [0, -0.9, 0] },
  { position: [0, -32, 7], rotation: [0, -1.3, 0] },
  { position: [2, -38, -19], rotation: [0, 1.3, 0] },
  { position: [5, -70, -10], rotation: [0, 1.0, 0] },
];

export const cubicEaseInOut = (t) => {
  if ((t /= 0.5) < 1) return 0.5 * t * t * t;
  return 0.5 * ((t -= 2) * t * t + 2);
};

// Function to interpolate between two values using an easing function
export const InterpolateWithEase = (start, end, t) => {
  return start + (end - start) * cubicEaseInOut(t);
};

export const smoothTransition = (
  startPos,
  endPos,
  startRot,
  endRot,
  progress
) => {
  const smoothPosition = [
    InterpolateWithEase(startPos[0], endPos[0], progress),
    InterpolateWithEase(startPos[1], endPos[1], progress),
    InterpolateWithEase(startPos[2], endPos[2], progress),
  ];

  const smoothRotation = [
    InterpolateWithEase(startRot[0], endRot[0], progress),
    InterpolateWithEase(startRot[1], endRot[1], progress),
    InterpolateWithEase(startRot[2], endRot[2], progress),
  ];

  return { position: smoothPosition, rotation: smoothRotation };
};

export const AnimalPositions = [
  {
    position: [-3.5, 66, -4],
    rotation: [0.3, 2, -0.2],
  },
  {
    position: [4, 49, -7],
    rotation: [0.3, 2.2, -0.2],
  },
  {
    position: [-1, 48, -5],
    rotation: [0.3, 4, 0.2],
  },
  {
    position: [-1.5, 31, -7],
    rotation: [0.1, 4, 0.1],
  },
  {
    position: [0, 34, -11],
    rotation: [0.1, 0.2, 0],
  },
  {
    position: [-3, 36.5, 21],
    rotation: [-0.5, 0.4, 0.1],
  },

  {
    position: [-1.5, 37.6, 23.5],
    rotation: [0, -0.8, 0],
  },

  {
    position: [-1.5, 37.6, 18],
    rotation: [0, -0.3, 0],
  },
];

export const skills = [
  {
    imageUrl: css,
    name: "CSS",
    type: "Frontend",
  },
  {
    imageUrl: express,
    name: "Express",
    type: "Backend",
  },
  {
    imageUrl: git,
    name: "Git",
    type: "Version Control",
  },
  {
    imageUrl: github,
    name: "GitHub",
    type: "Version Control",
  },
  {
    imageUrl: html,
    name: "HTML",
    type: "Frontend",
  },
  {
    imageUrl: javascript,
    name: "JavaScript",
    type: "Frontend",
  },
  {
    imageUrl: mongodb,
    name: "MongoDB",
    type: "Database",
  },
  {
    imageUrl: nextjs,
    name: "Next.js",
    type: "Frontend",
  },
  {
    imageUrl: nodejs,
    name: "Node.js",
    type: "Backend",
  },
  {
    imageUrl: react,
    name: "React",
    type: "Frontend",
  },
  {
    imageUrl: tailwindcss,
    name: "Tailwind CSS",
    type: "Frontend",
  },
  {
    imageUrl: typescript,
    name: "TypeScript",
    type: "Frontend",
  },
  {
    imageUrl: "https://wpguru.co.uk/wp-content/uploads/2020/04/dotnet-logo.png",
    name: ".NET",
    type: "Framework",
  },
  {
    imageUrl: "https://komorinfo.com/blog/cast-of-smart-pointers/feature.png",
    name: "C#",
    type: "Backend",
  },
  {
    imageUrl:
      "https://cdn-images-1.medium.com/max/1200/1*M7czUa8kD4sY6IATtiXGuw.png",
    name: "gRPC",
    type: "MessageBus",
  },
  {
    imageUrl:
      "https://th.bing.com/th/id/OIP.xT82C8aQ9vnAyGbemBkCcgHaH1?rs=1&pid=ImgDetMain",
    name: "RabbitMq",
    type: "MessageBus",
  },
  {
    imageUrl:
      "https://cdn4.iconfinder.com/data/icons/logos-and-brands/512/267_Python_logo-512.png",
    name: "Python",
    type: "Backend",
  },
  {
    imageUrl: "https://flask-training-courses.uk/images/flask-logo.png",
    name: "Flask",
    type: "Framework",
  },
  {
    imageUrl:
      "https://cdn4.iconfinder.com/data/icons/logos-and-brands/512/97_Docker_logo_logos-1024.png",
    name: "Docker",
    type: "DevOps",
  },
  {
    imageUrl:
      "https://www.vaisulweb.com/wp-content/uploads/2019/02/azure_logo_794_new.png",
    name: "Azure",
    type: "DevOps",
  },
];

export const experiences = [
  {
    title: "Software Engineer II (Contract)",
    company_name: "Forrest T Jones (FTJ)",
    icon: "https://th.bing.com/th/id/OIP.Z6mFUf0I5KcWgOPnksW8SwAAAA?rs=1&pid=ImgDetMain",
    iconBg: "#FFFFFF",
    date: "March 10, 2024 - Present",
    points: [
      "Developing and maintaining web applications using .NET, React.js, NextJS and other related technologies.",
      "Experienced xUnit, Jest testing tools",
      "Has background in deploying application with Microsoft Azure, DevOps"
    ],
  },
  {
    title: "Software Developer",
    company_name: "FullScale",
    icon: "https://jaymar921.github.io/jayharronabejar/assets/images/fullScale.png",
    iconBg: "#BDFFD1",
    date: "May 22, 2023 - Present",
    points: [
      "Developing and maintaining web applications using .NET, React.js, NextJS and other related technologies.",
      "Collaborating with cross-functional teams including designers, product managers, and other developers to create high-quality products.",
      "Implementing responsive design and ensuring cross-browser compatibility.",
      "Participating in code reviews and providing constructive feedback to other developers.",
    ],
  },
  {
    title: "FullStack Developer",
    company_name: "PSITS UC MAIN",
    icon: "https://jaymar921.github.io/jayharronabejar/assets/images/PSITS_LOGO.png",
    iconBg: "#4CA0C2",
    date: "Sep 12, 2022 - May 22, 2023",
    points: [
      "Built and maintained the organization's website using Flask Microframework",
      "Experienced working on a Point of Sale Application",
    ],
  },
  {
    title: "Developer Intern",
    company_name: "FullScale",
    icon: "https://jaymar921.github.io/jayharronabejar/assets/images/fullScale.png",
    iconBg: "#BDFFD1",
    date: "Sep 6, 2022 - Jan 16, 2023",
    points: [
      "Collaborating with cross-functional teams including designers, product managers, and other developers to create high-quality products.",
      "Implementing responsive design and ensuring cross-browser compatibility.",
    ],
  },
  {
    title: "Game Developer | Freelance",
    company_name: "SpigotMC.org",
    icon: "https://static.spigotmc.org/img/spigot.png",
    iconBg: "#FFD3BB",
    date: "Sep 10, 2020 - Dec 31, 2023",
    points: [
      "Experienced building awesome game plugin specific for Minecraft Servers.",
      "Enhanced game development experience.",
    ],
  },
];

export const socialLinks = [
  {
    name: "Contact",
    iconUrl: contact,
    link: "/contact",
  },
  {
    name: "GitHub",
    iconUrl: github,
    link: "https://github.com/YourGitHubUsername",
  },
  {
    name: "LinkedIn",
    iconUrl: linkedin,
    link: "https://www.linkedin.com/in/YourLinkedInUsername",
  },
];

export const projects = [
  {
    iconUrl:
      "https://jaymar921.github.io/jayharronabejar/assets/images/PSITS_LOGO.png",
    theme: "btn-back-blue",
    name: "PSITS Website",
    description:
      "PSITS web application allows PSITS officers to manage announcements, selling tickets/t-shirts, and create events! UC Main CCS students can create an account for reservation/order of event merch purpose. ",
    link: "https://github.com/PSITS-UC-MAIN/PSITS-WEB",
  },
  {
    iconUrl:
      "https://jaymar921.github.io/jayharronabejar/assets/images/ayus%20icon.png",
    theme: "btn-back-blue",
    name: "AYUS - Mobile App for vehicle assistance (Capstone)",
    description:
      "The task of helping drivers whose cars break down on the road can be difficult for service providers, especially when there are no other vehicles around.",
    link: "https://github.com/jaymar921/AYUS-WebASP",
  },
  {
    iconUrl: "https://avatars.githubusercontent.com/u/148028870?s=48&v=4",
    theme: "btn-back-green",
    name: "QuizMaster",
    description:
      "To ignite the spirit of friendly competition, knowledge exploration, and personal growth through the Quiz Bee Competition Web and Mobile Application, creating a community of lifelong learners and champions.",
    link: null,
  },
  {
    iconUrl: "https://avatars.githubusercontent.com/u/148028870?s=48&v=4",
    theme: "btn-back-green",
    name: "Event Registration",
    description:
      "The Registration System streamlines event management with QR code-based registration, real-time analytics, and automated notifications, ensuring seamless attendee experiences and efficient operations. Its versatility extends to various company events, while features like name randomizers for raffles add engagement and excitement.",
    link: null,
  },
  {
    iconUrl:
      "https://jaymar921.github.io/jayharronabejar/assets/images/ce3.png",
    theme: "btn-back bg-purple-300",
    name: "Custom Enchantments 3",
    description:
      "The plugin is so called an advanced because it has a built in Custom Enchantments, Skilling System, Player Classifications, CE Currencies/Quests and an RPG feels in the game.",
    link: "https://www.spigotmc.org/resources/%E2%9C%AF-custom-enchantments-3-rpg-%E2%9C%AF-1-16-1-20-all-in-one-pugin.102275/",
  },
  {
    iconUrl:
      "https://raw.githubusercontent.com/jaymar921/jayharron-portfolio/471644d9ca5a7a8fd0ffa968fa638e41edb0c173/src/assets/icons/jh-logo.svg",
    theme: "btn-back bg-slate-800",
    name: "JHC Blockchain",
    description:
      "JHCoin. A simple blockchain demonstration, how transaction works in a blockchain, how blocks are being mined.",
    link: "https://jhc-blockchain.vercel.app/",
  },
  // {
  //   iconUrl: threads,
  //   theme: "btn-back-green",
  //   name: "Full Stack Threads Clone",
  //   description:
  //     'Created a full-stack replica of the popular discussion platform "Threads," enabling users to post and engage in threaded conversations.',
  //   link: "https://github.com/adrianhajdin/threads",
  // },
  // {
  //   iconUrl: car,
  //   theme: "btn-back-blue",
  //   name: "Car Finding App",
  //   description:
  //     "Designed and built a mobile app for finding and comparing cars on the market, streamlining the car-buying process.",
  //   link: "https://github.com/adrianhajdin/project_next13_car_showcase",
  // },
  // {
  //   iconUrl: snapgram,
  //   theme: "btn-back-pink",
  //   name: "Full Stack Instagram Clone",
  //   description:
  //     "Built a complete clone of Instagram, allowing users to share photos and connect with friends in a familiar social media environment.",
  //   link: "https://github.com/adrianhajdin/social_media_app",
  // },
  // {
  //   iconUrl: estate,
  //   theme: "btn-back-black",
  //   name: "Real-Estate Application",
  //   description:
  //     "Developed a web application for real estate listings, facilitating property searches and connecting buyers with sellers.",
  //   link: "https://github.com/adrianhajdin/projects_realestate",
  // },
  // {
  //   iconUrl: summiz,
  //   theme: "btn-back-yellow",
  //   name: "AI Summarizer Application",
  //   description:
  //     "App that leverages AI to automatically generate concise & informative summaries from lengthy text content, or blogs.",
  //   link: "https://github.com/adrianhajdin/project_ai_summarizer",
  // },
];

export const PathFindingAlgoritms = {
  bfs: {
    description: "Breadth First Search (BFS) is used to search a Graph Data Structure for a node that meets a set of criteria. It starts at the root of the graph and visits all nodes at the current depth level before moving to the nodes at the next depth level.",
    initialization: "Enqueue the given source vertex into a queue and mark it as visited.",
    operations: [
      "Visit the adjacent unvisited node. Mark it as visited. Insert it into the queue.",
      "If no adjacent vertex/node is found, remove the first node from the queue.",
      "Repeat the 2 operations above until the queue is empty."
    ],
    complexity: "O(V + E) where V is the number of vertices and E is the number of edges.",
    advantages: [
      "Guarantees the shortest path in an unweighted graph.",
      "It explores all nodes at the current depth level before moving deeper, ensuring completeness."
    ],
    disadvantages: [
      "Can be inefficient for large graphs as it needs to visit all nodes at each depth level.",
      "Requires more memory to store all visited nodes in the queue, which can be a limitation for large graphs."
    ],
    exampleScenario: [
      "Social Network Connectivity: Finding the shortest path between two people in a social network by exploring each person's direct connections before moving to deeper connections.",
      "Web Crawlers: A web crawler that visits all pages at a certain depth level before moving to pages at deeper levels on a website."
    ]
  },
  
  dfs: {
    description: "Depth First Search (DFS) explores a graph by starting at the root (or an arbitrary node) and exploring as far as possible along each branch before backtracking.",
    initialization: "Push the source vertex onto a stack and mark it as visited.",
    operations: [
      "Visit the adjacent unvisited node. Mark it as visited and push it onto the stack.",
      "If no adjacent vertex/node is found, pop a node from the stack.",
      "Repeat the above operations until the stack is empty."
    ],
    complexity: "O(V + E) where V is the number of vertices and E is the number of edges.",
    advantages: [
      "Requires less memory than BFS as it uses a stack (in-place traversal).",
      "Can be useful for exploring deeply nested structures and for algorithms like topological sorting."
    ],
    disadvantages: [
      "Does not guarantee the shortest path (can get stuck in deep branches).",
      "Can be inefficient in terms of time if the graph has many branches and deep paths."
    ],
    exampleScenario: [
      "Maze Solving: Finding a path in a maze by exploring deep into one branch before backtracking when hitting dead ends.",
      "Topological Sorting: Sorting tasks that have dependencies, where DFS is used to determine the order in which tasks must be completed."
    ]
  },

  astar: {
    description: "A* (A-star) is a popular pathfinding and graph traversal algorithm used for finding the shortest path from a start node to a goal node. It uses heuristics to improve performance by estimating the cost to reach the goal.",
    initialization: "Initialize an open list with the start node and a closed list as empty. Each node is assigned a cost based on distance from the start node and heuristic (estimated cost to goal).",
    operations: [
      "Pick the node with the lowest f-cost (g-cost + h-cost) from the open list.",
      "Check if the current node is the goal. If yes, return the path.",
      "For each adjacent node, calculate the tentative g-cost. If the new path is better, update the node's values and add it to the open list.",
      "Move the current node to the closed list and repeat until the goal is found or open list is empty."
    ],
    complexity: "O(E log V) where E is the number of edges and V is the number of vertices (due to the priority queue).",
    advantages: [
      "Finds the shortest path efficiently in a weighted graph.",
      "Can be optimized with different heuristics to improve performance based on the problem domain."
    ],
    disadvantages: [
      "Heavily dependent on the heuristic function; a poor heuristic can make the algorithm slower.",
      "Requires more memory than BFS and DFS due to storing additional information for each node (f, g, h values)."
    ],
    exampleScenario: [
      "GPS Navigation: Finding the shortest route from one location to another, considering both distance and real-time traffic data.",
      "Game Development: Pathfinding in video games for non-player characters (NPCs) to find the shortest route in a map with obstacles."
    ]
  }
};
