import {
  claude,
  contact,
  copilot,
  css,
  express,
  ftjLogo,
  fullScaleLogo,
  git,
  github,
  html,
  hirayacoder,
  illuminaryPeakLogo,
  javascript,
  jhProjectsLogo,
  linkedin,
  logevac,
  mongodb,
  nextjs,
  nodejs,
  PSITS_LOGO,
  react,
  school_stscho,
  school_ucmain,
  spigotLogo,
  tailwindcss,
  typescript,
  zygowork,
} from "../assets/icons";

import {
  cert_completion_renewavolt,
  cert_owasp_2025_knowb4,
  cert_owasp_data_hygience,
  cert_owasp_memory_management,
  cert_owasp_password_hygiene,
  cert_owasp_projecting_source_code,
  cert_owasp_top_10_sec_2021,
  cert_ai_at_work,
  cert_api_security_fundamentals,
  cert_knowbe4_2026,
  cert_phish_alert_button,
  cert_secure_app_development,
  bsit_deploma,
  itpec_logo,
  shs_deploma,
} from "../assets/images";

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
  progress,
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

const getYears = (year) => {
  return new Date().getFullYear() - year;
};

export const resumeProfile = {
  name: "Jayharron Mar Abejar",
  title: "Software Developer",
  tagline: "Full Stack | DevOps",
  summary:
    "Software Developer with 3+ years of professional experience building web applications on .NET, React, and Next.js for US clients, working remotely from Cebu, Philippines. " +
    "I work on both ends of the stack and own the path to production: automated tests, Azure CI/CD pipelines, and secrets in Key Vault. " +
    "Much of my recent work is rewriting legacy .NET and VBScript systems onto a current stack without losing the business rules they carry.",
};

// Contact details are intentionally kept out of the UI and used only when the
// resume is exported to PDF, so the address is not sitting on a public page
// waiting to be scraped. Links carry the scheme so PDF readers make them
// clickable.
export const resumeContact = {
  email: "jayharronabejar@gmail.com",
  location: "Cebu, Philippines",
  portfolio: "https://jayharronabejar.vercel.app",
  github: "https://github.com/jaymar921",
  linkedin: "https://www.linkedin.com/in/jaymar921/",
};

// Grouped skills for the PDF export. Reads faster than one long list.
export const resumeSkillGroups = [
  {
    label: "Languages",
    items: ["C#", "TypeScript", "JavaScript", "Java", "Python", "HTML", "CSS"],
  },
  { label: "Frontend", items: ["React", "Next.js", "Tailwind CSS"] },
  { label: "Backend", items: [".NET", "Node.js", "Express", "RabbitMQ"] },
  { label: "Databases", items: ["SQL Server", "MongoDB"] },
  {
    label: "DevOps and Cloud",
    items: [
      "Azure",
      "Azure Key Vault",
      "CI/CD pipelines",
      "Docker",
      "Git",
      "GitHub",
    ],
  },
  { label: "Testing", items: ["xUnit", "Jest"] },
  { label: "AI-Assisted Coding", items: ["Microsoft Copilot", "Claude Pro"] },
];

// Selected work for the PDF export. The full list lives in the Projects window.
export const resumeProjects = [
  {
    name: "LogEvac",
    link: "https://www.nuget.org/packages/LogEvac",
    description:
      ".NET library on NuGet that deletes old log rows from SQL Server databases written by Serilog MSSQL sinks, based on a configurable retention window.",
  },
  {
    name: "HirayaCoder",
    link: "https://github.com/jaymar921/HirayaCoder",
    description:
      "Open source AI coding assistant that runs fully offline on your own machine and writes and edits files from plain English prompts.",
  },
  {
    name: "Custom Enchantments 3",
    link: "https://jhprojects.vercel.app/customenchantments3",
    description:
      "Commercial Minecraft server plugin written in Java, with custom enchantments, player classes, quests, and in game currencies. Over 300,000 downloads.",
  },
];

// Condensed certification list for the PDF export. The Resume window shows
// every certificate individually.
export const resumeCertifications = [
  "ITPEC Information Technology Passport (IP), IT Professionals Examination Council, 2023",
  "Secure Application Development Fundamentals and API Security Fundamentals, KnowBe4, 2026",
  "Secure Application Development: OWASP Top 10 2021, Data Hygiene, Protecting Source Code, KnowBe4, 2025",
  "Security Awareness Training, KnowBe4, 2025 and 2026",
];

export const skills = [
  {
    imageUrl: css,
    name: "CSS",
    type: "Frontend",
    years: getYears(2019),
  },
  {
    imageUrl: express,
    name: "Express",
    type: "Backend",
    years: getYears(2023),
  },
  {
    imageUrl: git,
    name: "Git",
    type: "Version Control",
    years: getYears(2020),
  },
  {
    imageUrl: github,
    name: "GitHub",
    type: "Version Control",
    years: getYears(2020),
  },
  {
    imageUrl: html,
    name: "HTML",
    type: "Frontend",
    years: getYears(2019),
  },
  {
    imageUrl: javascript,
    name: "JavaScript",
    type: "Frontend",
    years: getYears(2020),
  },
  {
    imageUrl: mongodb,
    name: "MongoDB",
    type: "Database",
    years: getYears(2022),
  },
  {
    imageUrl: nextjs,
    name: "Next.js",
    type: "Frontend",
    years: getYears(2023),
  },
  {
    imageUrl: nodejs,
    name: "Node.js",
    type: "Backend",
    years: getYears(2022),
  },
  {
    imageUrl: react,
    name: "React",
    type: "Frontend",
    years: getYears(2022),
  },
  {
    imageUrl: tailwindcss,
    name: "Tailwind CSS",
    type: "Frontend",
    years: getYears(2022),
  },
  {
    imageUrl: typescript,
    name: "TypeScript",
    type: "Frontend",
    years: getYears(2023),
  },
  {
    imageUrl: "https://wpguru.co.uk/wp-content/uploads/2020/04/dotnet-logo.png",
    name: ".NET",
    type: "Framework",
    years: getYears(2022),
  },
  {
    imageUrl: "https://komorinfo.com/blog/cast-of-smart-pointers/feature.png",
    name: "C#",
    type: "Backend",
    years: getYears(2022),
  },
  {
    imageUrl:
      "https://th.bing.com/th/id/OIP.xT82C8aQ9vnAyGbemBkCcgHaH1?rs=1&pid=ImgDetMain",
    name: "RabbitMQ",
    type: "Message Broker",
    years: getYears(2023),
  },
  {
    imageUrl:
      "https://cdn4.iconfinder.com/data/icons/logos-and-brands/512/267_Python_logo-512.png",
    name: "Python",
    type: "Backend",
    years: getYears(2021),
  },
  {
    imageUrl:
      "https://cdn4.iconfinder.com/data/icons/logos-and-brands/512/97_Docker_logo_logos-1024.png",
    name: "Docker",
    type: "DevOps",
    years: 2, // Only 2 years of experience with Docker, so we set it to 2 instead of calculating from the current year
  },
  {
    imageUrl:
      "https://www.vaisulweb.com/wp-content/uploads/2019/02/azure_logo_794_new.png",
    name: "Azure",
    type: "DevOps",
    years: getYears(2024),
  },
  {
    imageUrl: copilot,
    name: "Microsoft Copilot",
    type: "AI-Assisted Coding",
    years: getYears(2025),
  },
  {
    imageUrl: claude,
    name: "Claude Pro",
    type: "AI-Assisted Coding",
    years: getYears(2025),
  },
];

// Each certification carries an image of the certificate itself. Entries that
// also have a `link` point at an external page that verifies the credential;
// the rest open in the in-app preview modal.
export const certifications = [
  {
    name: "2026 KnowBe4 Security Awareness Training",
    issuer: "KnowBe4",
    imageUrl: cert_knowbe4_2026,
    dateIssued: "August 10, 2026",
  },
  {
    name: "Secure Application Development Fundamentals",
    issuer: "KnowBe4",
    imageUrl: cert_secure_app_development,
    dateIssued: "August 10, 2026",
  },
  {
    name: "API Security Fundamentals Part 1: Why API Security",
    issuer: "KnowBe4",
    imageUrl: cert_api_security_fundamentals,
    dateIssued: "August 10, 2026",
  },
  {
    name: "AI At Work: Use It Wisely",
    issuer: "KnowBe4",
    imageUrl: cert_ai_at_work,
    dateIssued: "August 10, 2026",
  },
  {
    name: "Using the Phish Alert Button: Reporting Suspicious Email in Outlook",
    issuer: "KnowBe4",
    imageUrl: cert_phish_alert_button,
    dateIssued: "August 10, 2026",
  },
  {
    name: "Basic Solar PV Design",
    issuer: "RenewaVolt",
    imageUrl: cert_completion_renewavolt,
    link: "https://drive.google.com/file/d/1CUgFWkW09ja1YRSRTD4STfoes6UOCdDa/view?usp=sharing",
    dateIssued: "June 27, 2026",
  },
  {
    name: "2025 KnowBe4 Security Awareness Training",
    issuer: "KnowBe4",
    imageUrl: cert_owasp_2025_knowb4,
    dateIssued: "September 16, 2025",
  },
  {
    name: "Secure Application Development: OWASP Top 10 2021",
    issuer: "KnowBe4",
    imageUrl: cert_owasp_top_10_sec_2021,
    dateIssued: "August 6, 2025",
  },
  {
    name: "Secure Application Development: Protecting Source Code",
    issuer: "KnowBe4",
    imageUrl: cert_owasp_projecting_source_code,
    dateIssued: "August 6, 2025",
  },
  {
    name: "Secure Application Development: Data Hygiene",
    issuer: "KnowBe4",
    imageUrl: cert_owasp_data_hygience,
    dateIssued: "August 6, 2025",
  },
  {
    name: "Secure Application Development: Memory Management",
    issuer: "KnowBe4",
    imageUrl: cert_owasp_memory_management,
    dateIssued: "August 6, 2025",
  },
  {
    name: "Secure Application Development: Password Hygiene",
    issuer: "KnowBe4",
    imageUrl: cert_owasp_password_hygiene,
    dateIssued: "August 6, 2025",
  },
  {
    name: "ITPEC Information Technology Passport (IP)",
    issuer: "IT Professionals Examination Council",
    imageUrl: itpec_logo,
    link: "https://itpec.org/statsandresults/all-passers-information/Philippines/2023S_IP_rev.pdf",
    dateIssued: "April 2023",
  },
];

// Freelance and after-hours work. Kept apart from `experiences` so the About
// page and the resume only list employment.
export const sideProjects = [
  {
    title: "Lead Software Engineer",
    company_name: "Illuminary Peak",
    company_url: "https://illuminary-peak.vercel.app",
    job_type: "Freelance",
    location: "Philippines | Remote",
    icon: illuminaryPeakLogo,
    iconBg: "#FFFFFF",
    date: "Mar 2026 - Present",
    points: [
      "Build modern web applications on the MERN stack, structured so they can grow with the product instead of being rewritten later.",
      "Use Microsoft Copilot, Claude Pro, and Cursor as part of an agentic workflow, which lets a small team move quickly without skipping code review.",
    ],
  },
  {
    title: "Software Engineer",
    company_name: "ZygoWork",
    company_url: "https://www.zygowork.com",
    job_type: "Freelance",
    location: "Philippines | Remote",
    icon: zygowork,
    iconBg: "#FFFFFF",
    date: "Jul 2026 - Present",
    points: [
      "Designed the system architecture from scratch and carried it all the way through to deployment.",
      "Shipped a secure application with full SAST and DAST coverage, checked against OWASP standards.",
      "Work directly with the client to understand what they need, own the product decisions, and keep a working relationship that lasts beyond a single release.",
    ],
  },
  {
    title: "Independent Developer",
    company_name: "JHProjects",
    company_url: "https://jhprojects.vercel.app",
    job_type: "Personal",
    location: "Philippines | Remote",
    icon: jhProjectsLogo,
    iconBg: "#FFFFFF",
    date: "Sep 2020 - Present",
    summary:
      "JHProjects is where I publish what I build outside of client work. Most of it is Minecraft server plugins, released on SpigotMC under the name JayMar921, along with a JavaScript graphics library, a few Bedrock addons, and some small games. It is a one-person operation, not a company.",
    points: [
      "Started writing plugins in 2020 to get properly good at Java, and kept going because people were running them on live servers.",
      "Maintain a mix of free and paid plugins. The paid ones cover hosting and the time that goes into updates.",
      "Test every idea on a real server before it gets a public listing. Most features come from requests by server owners and players.",
      "Document each release on its project page, and give paid plugins free updates for as long as they are actively maintained.",
    ],
  },
];

export const experiences = [
  {
    title: "Software Engineer (Contract)",
    company_name: "Forrest T Jones (FTJ)",
    company_url: "https://ftj.com",
    job_type: "Full-Time | Remote",
    icon: ftjLogo,
    iconBg: "#FFFFFF",
    date: "Mar 2024 - Present",
    points: [
      "Build and maintain insurance web applications on .NET, React, and Next.js for a US insurer with decades of policy logic behind it.",
      "Rewrite legacy .NET and classic VBScript systems on the current stack while keeping the business rules intact.",
      "Own releases to Microsoft Azure: CI/CD pipelines, environment configuration, and Key Vault secrets.",
      "Write xUnit and Jest tests around critical paths so refactors ship without regressions.",
      "Work with designers, product managers, and developers across time zones from requirements to release.",
    ],
  },
  {
    title: "Software Developer",
    company_name: "FullScale",
    company_url: "https://fullscale.ph",
    job_type: "Full-Time | Remote",
    icon: fullScaleLogo,
    iconBg: "#BDFFD1",
    date: "May 2023 - Present",
    points: [
      "Build client web applications on .NET, React, and Next.js as an embedded developer on offshore product teams.",
      "Build responsive interfaces and test them across browsers, screen sizes, and devices.",
      "Review pull requests for correctness, maintainability, and consistency with the rest of the codebase.",
      "Break product requirements into scoped, estimable tickets with designers and product managers.",
    ],
  },
  {
    title: "Full Stack Developer",
    company_name: "PSITS UC MAIN",
    company_url: "https://www.psits.org",
    job_type: "Part-Time | On site",
    icon: PSITS_LOGO,
    iconBg: "#4CA0C2",
    date: "Sep 2022 - May 2023",
    points: [
      "Built and maintained the organization's website on Flask, used by students across the computing college.",
      "Built a point of sale application for campus merchandise and event ticket sales.",
    ],
  },
  {
    title: "Developer Intern",
    company_name: "FullScale",
    company_url: "https://fullscale.ph",
    job_type: "Part-Time | Remote",
    icon: fullScaleLogo,
    iconBg: "#BDFFD1",
    date: "Sep 2022 - Jan 2023",
    points: [
      "Shipped features on live client projects alongside senior developers.",
      "Turned design handoffs into responsive, cross browser interfaces.",
    ],
  },
  {
    title: "Game Developer (Freelance)",
    company_name: "SpigotMC.org",
    company_url: "https://www.spigotmc.org/resources/authors/jaymar921.1073076/",
    projects_label: "JHProjects",
    projects_url: "https://jhprojects.vercel.app",
    job_type: "Part-Time | Remote",
    icon: spigotLogo,
    iconBg: "#FFD3BB",
    date: "Sep 2020 - Present",
    points: [
      "Build and sell Java plugins for Minecraft servers. Custom Enchantments has passed 300,000 downloads.",
      "Maintain them in my free time with version updates, bug fixes, documentation, and customer support.",
      "Profile and optimize code in the server tick loop, where slow code shows up as lag for every player.",
    ],
  },
];

export const educationalAttainment = [
  {
    school: "University of Cebu - Main Campus",
    year: "2019-2023",
    curriculum: "Course: Bachelor of Science in Information Technology (BSIT)",
    logo: school_ucmain,
    graduationDate: "May 27, 2023",
    diploma: bsit_deploma,
    onResume: true,
  },
  {
    school: "St. Scholastica's Academy - Tabunok",
    year: "2017-2019",
    curriculum:
      "Strand: Science, Technology, Engineering and Mathematics (STEM)",
    logo: school_stscho,
    graduationDate: "April 27, 2019",
    diploma: shs_deploma,
  },
  {
    school: "St. Scholastica's Academy - Tabunok",
    year: "2013-2017",
    curriculum: "Junior High School",
    logo: school_stscho,
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
    iconUrl: logevac,
    theme: "btn-back-blue",
    name: "LogEvac",
    description:
      "A .NET library that quietly retires old log rows from SQL Server databases fed by Serilog MSSQL sinks. Drop it in, set a retention window, and stop paying for storage nobody reads. Published on NuGet.",
    link: "https://www.nuget.org/packages/LogEvac",
    isOpenSource: true,
  },
  {
    iconUrl: hirayacoder,
    theme: "btn-back-blue",
    name: "HirayaCoder",
    description:
      "A free AI coding assistant that runs entirely on your own machine. Describe what you want in plain English and it writes and edits files locally. No account, no subscription, no internet connection, and nothing about your code ever leaves the laptop.",
    link: "https://github.com/jaymar921/HirayaCoder",
    isOpenSource: true,
  },
  {
    iconUrl: zygowork,
    theme: "btn-back-green",
    name: "ZygoWork",
    description:
      "A workforce management platform for small and mid sized businesses. Tracks hours, attendance, and productivity, then carries leave requests, shift plans, and delegated approvals all the way through to accountant sign off on payroll.",
    link: "https://www.zygowork.com",
  },
  {
    iconUrl:
      "https://jaymar921.github.io/jayharronabejar/assets/images/PSITS_LOGO.png",
    theme: "btn-back-blue",
    name: "PSITS Website",
    description:
      "The official platform for a university computing organization. Officers publish announcements, run events, and sell tickets and merchandise, while students create accounts to reserve and order. Built and maintained during my time as a student developer.",
    link: "https://github.com/PSITS-UC-MAIN",
    isOpenSource: true,
  },
  {
    iconUrl:
      "https://jaymar921.github.io/jayharronabejar/assets/images/ayus%20icon.png",
    theme: "btn-back-blue",
    name: "AYUS: Roadside Vehicle Assistance",
    description:
      "A mobile and web system that connects stranded drivers with nearby service providers, built for the moments when a breakdown happens somewhere with no other vehicle in sight. My undergraduate capstone project.",
    link: "https://github.com/jaymar921/AYUS-WebASP",
    isOpenSource: true,
  },
  {
    iconUrl: "https://avatars.githubusercontent.com/u/148028870?s=48&v=4",
    theme: "btn-back-green",
    name: "QuizMaster",
    description:
      "A web and mobile quiz bee platform built for live competition: rounds, scoring, and contestant management that hold up while an audience is watching.",
    link: "https://github.com/full-scale-teams/rocks-quizmaster",
    isOpenSource: true,
  },
  {
    iconUrl: "https://avatars.githubusercontent.com/u/148028870?s=48&v=4",
    theme: "btn-back-green",
    name: "Event Registration",
    description:
      "QR code check in, real time analytics, and automated notifications for company events. Attendees get a smooth arrival, organizers get live numbers, and built in raffle randomizers keep the room engaged.",
    link: null,
  },
  {
    iconUrl:
      "https://jaymar921.github.io/jayharronabejar/assets/images/ce3.png",
    theme: "btn-back bg-purple-300",
    name: "Custom Enchantments 3",
    description:
      "A commercial Minecraft server plugin with custom enchantments, a skill system, player classes, in game currencies, and quests layered into a full RPG experience. Past 300,000 downloads and sold to server owners worldwide.",
    link: "https://jhprojects.vercel.app/customenchantments3",
  },
  {
    iconUrl:
      "https://raw.githubusercontent.com/jaymar921/jayharron-portfolio/471644d9ca5a7a8fd0ffa968fa638e41edb0c173/src/assets/icons/jh-logo.svg",
    theme: "btn-back bg-slate-800",
    name: "JHC Blockchain",
    description:
      "JHCoin, a hands on blockchain demo. Watch a transaction enter the pool, a block get mined, and the chain validate itself, all in the browser.",
    link: "https://jhc-blockchain.vercel.app/",
  },
];

export const PathFindingAlgoritms = {
  bfs: {
    description:
      "Breadth First Search (BFS) is used to search a Graph Data Structure for a node that meets a set of criteria. It starts at the root of the graph and visits all nodes at the current depth level before moving to the nodes at the next depth level.",
    initialization:
      "Enqueue the given source vertex into a queue and mark it as visited.",
    operations: [
      "Visit the adjacent unvisited node. Mark it as visited. Insert it into the queue.",
      "If no adjacent vertex/node is found, remove the first node from the queue.",
      "Repeat the 2 operations above until the queue is empty.",
    ],
    complexity:
      "O(V + E) where V is the number of vertices and E is the number of edges.",
    advantages: [
      "Guarantees the shortest path in an unweighted graph.",
      "It explores all nodes at the current depth level before moving deeper, ensuring completeness.",
    ],
    disadvantages: [
      "Can be inefficient for large graphs as it needs to visit all nodes at each depth level.",
      "Requires more memory to store all visited nodes in the queue, which can be a limitation for large graphs.",
    ],
    exampleScenario: [
      "Social Network Connectivity: Finding the shortest path between two people in a social network by exploring each person's direct connections before moving to deeper connections.",
      "Web Crawlers: A web crawler that visits all pages at a certain depth level before moving to pages at deeper levels on a website.",
    ],
  },

  dfs: {
    description:
      "Depth First Search (DFS) explores a graph by starting at the root (or an arbitrary node) and exploring as far as possible along each branch before backtracking.",
    initialization:
      "Push the source vertex onto a stack and mark it as visited.",
    operations: [
      "Visit the adjacent unvisited node. Mark it as visited and push it onto the stack.",
      "If no adjacent vertex/node is found, pop a node from the stack.",
      "Repeat the above operations until the stack is empty.",
    ],
    complexity:
      "O(V + E) where V is the number of vertices and E is the number of edges.",
    advantages: [
      "Requires less memory than BFS as it uses a stack (in-place traversal).",
      "Can be useful for exploring deeply nested structures and for algorithms like topological sorting.",
    ],
    disadvantages: [
      "Does not guarantee the shortest path (can get stuck in deep branches).",
      "Can be inefficient in terms of time if the graph has many branches and deep paths.",
    ],
    exampleScenario: [
      "Maze Solving: Finding a path in a maze by exploring deep into one branch before backtracking when hitting dead ends.",
      "Topological Sorting: Sorting tasks that have dependencies, where DFS is used to determine the order in which tasks must be completed.",
    ],
  },

  astar: {
    description:
      "A* (A-star) is a popular pathfinding and graph traversal algorithm used for finding the shortest path from a start node to a goal node. It uses heuristics to improve performance by estimating the cost to reach the goal.",
    initialization:
      "Initialize an open list with the start node and a closed list as empty. Each node is assigned a cost based on distance from the start node and heuristic (estimated cost to goal).",
    operations: [
      "Pick the node with the lowest f-cost (g-cost + h-cost) from the open list.",
      "Check if the current node is the goal. If yes, return the path.",
      "For each adjacent node, calculate the tentative g-cost. If the new path is better, update the node's values and add it to the open list.",
      "Move the current node to the closed list and repeat until the goal is found or open list is empty.",
    ],
    complexity:
      "O(E log V) where E is the number of edges and V is the number of vertices (due to the priority queue).",
    advantages: [
      "Finds the shortest path efficiently in a weighted graph.",
      "Can be optimized with different heuristics to improve performance based on the problem domain.",
    ],
    disadvantages: [
      "Heavily dependent on the heuristic function; a poor heuristic can make the algorithm slower.",
      "Requires more memory than BFS and DFS due to storing additional information for each node (f, g, h values).",
    ],
    exampleScenario: [
      "GPS Navigation: Finding the shortest route from one location to another, considering both distance and real-time traffic data.",
      "Game Development: Pathfinding in video games for non-player characters (NPCs) to find the shortest route in a map with obstacles.",
    ],
  },
};

export const Map1Colliders = [
  0, 0, 0, 3, 4, 4, 4, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 3, 13, 0, 0, 0, 14, 5, 0, 3, 4, 4, 4, 4, 4, 5, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 13, 0, 0, 0, 0, 0, 9, 3, 13, 0, 0, 0, 0, 0,
  14, 4, 4, 5, 3, 4, 4, 5, 0, 0, 0, 0, 0, 0, 0, 6, 0, 0, 0, 0, 0, 0, 14, 13, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 14, 13, 0, 0, 14, 5, 0, 0, 0, 0, 0, 0, 6, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 14, 5, 0, 0, 0, 0, 0, 6,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9, 0, 0,
  0, 0, 0, 8, 11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  12, 7, 0, 0, 0, 0, 0, 0, 8, 10, 10, 10, 10, 11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 12, 10, 10, 10, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 13, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 14, 4, 4, 4, 4, 4, 5, 0, 0, 0, 0, 0, 0, 3, 4, 4, 13,
  0, 0, 0, 0, 12, 10, 10, 10, 10, 10, 11, 0, 0, 0, 0, 0, 0, 0, 0, 14, 5, 0, 0,
  0, 0, 3, 13, 0, 0, 0, 0, 0, 0, 12, 7, 0, 0, 0, 3, 4, 13, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 9, 0, 0, 0, 3, 13, 0, 0, 0, 0, 0, 0, 12, 7, 0, 0, 0, 3, 13, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 9, 0, 0, 0, 6, 0, 0, 0, 0, 0, 0, 0, 9, 0, 0, 0, 3, 13, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9, 0, 0, 0, 6, 0, 0, 12, 11, 0, 0, 0, 9, 0,
  0, 3, 13, 0, 0, 0, 12, 11, 0, 0, 0, 0, 0, 0, 0, 12, 7, 0, 0, 0, 6, 0, 0, 9, 6,
  0, 0, 0, 14, 5, 0, 6, 0, 0, 0, 0, 9, 8, 11, 0, 0, 0, 0, 0, 12, 7, 1, 0, 0, 0,
  6, 0, 0, 14, 5, 11, 0, 0, 0, 14, 5, 6, 0, 0, 0, 0, 14, 5, 8, 10, 10, 10, 10,
  10, 7, 3, 4, 5, 1, 0, 6, 0, 0, 0, 14, 13, 0, 0, 0, 0, 9, 6, 0, 0, 0, 0, 0, 14,
  4, 4, 4, 4, 4, 4, 4, 13, 0, 14, 5, 0, 8, 11, 0, 0, 0, 0, 0, 0, 0, 0, 9, 8, 11,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9, 0, 0, 8, 11, 0, 0, 0, 0, 0, 0,
  12, 7, 0, 8, 10, 10, 10, 10, 11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 12, 7, 0, 0, 0, 8,
  10, 10, 10, 10, 10, 10, 7, 0, 0, 0, 0, 0, 0, 0, 8, 10, 10, 10, 10, 10, 10, 10,
  10, 10, 7, 0,
];
