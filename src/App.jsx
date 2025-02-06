import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import { Home, About, Projects, Contact } from "./pages";
import PathFindingAlgorithmsPage from "./pages/Project/PathFindingAlgorithmsPage";
import HomeV2 from "./pages/HomeV2";

const App = () => {
  return (
    <main className="bg-slate-900 h-full">
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/v2" element={<HomeV2 />} />
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
