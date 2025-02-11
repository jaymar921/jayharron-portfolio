import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import { Home, About, Projects, Contact } from "./pages";
import PathFindingAlgorithmsPage from "./pages/Project/PathFindingAlgorithmsPage";
import Graphic2D from "./pages/Graphic2D/Graphic2D";

const App = () => {
  return (
    <main className="bg-slate-900 h-full">
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/graphic2d" element={<Graphic2D />} />
          <Route path="/about" element={<About />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/contact" element={<Contact />} />
          <Route
            path="/projects/path-finding-algorithms"
            element={<PathFindingAlgorithmsPage />}
          />
        </Routes>
      </Router>
    </main>
  );
};

export default App;
