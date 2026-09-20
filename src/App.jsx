import { Suspense, lazy } from "react";
import { Route, Routes, RouterProvider, usePath } from "./routing";
import { Home, About, Projects, Contact } from "./pages";
import PathFindingAlgorithmsPage from "./pages/Project/PathFindingAlgorithmsPage";
import Graphic2D from "./pages/Graphic2D/Graphic2D";
import Home_V2 from "./pages/Home_V2";
import { usePageView, PAGE_BY_PATH } from "./lib/analytics";

/**
 * The admin dashboard is the one route that is loaded on demand. A visitor who
 * never goes to /admin never downloads it, which keeps the login form, the
 * charts, the world atlas and the whole admin API client out of the bundle
 * every other page pays for.
 */
const AdminPage = lazy(() => import("./pages/Admin/AdminPage"));

/** Shown for the moment the admin chunk is in flight. */
function AdminLoading() {
  return (
    <div className="linux-wallpaper flex min-h-screen items-center justify-center font-ubuntu">
      <p className="text-xs uppercase tracking-widest text-ubuntu-warm-grey">
        <i className="fa-solid fa-circle-notch fa-spin pr-3" aria-hidden="true" />
        Loading
      </p>
    </div>
  );
}

/**
 * Records one view per route. It lives inside the router so it sees every
 * navigation, and it maps the path to a slug so an unknown route, /admin
 * included, sends nothing.
 */
function PageViewTracker() {
  const path = usePath();
  usePageView(PAGE_BY_PATH[path] ?? null);
  return null;
}

const App = () => {
  return (
    <main className="bg-slate-900 h-full">
      <RouterProvider>
        <PageViewTracker />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/graphic2d" element={<Graphic2D />} />
          <Route path="/v2" element={<Home_V2 />} />
          <Route path="/about" element={<About />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/contact" element={<Contact />} />
          <Route
            path="/projects/path-finding-algorithms"
            element={<PathFindingAlgorithmsPage />}
          />
          <Route
            path="/admin"
            element={
              <Suspense fallback={<AdminLoading />}>
                <AdminPage />
              </Suspense>
            }
          />
        </Routes>
      </RouterProvider>
    </main>
  );
};

export default App;
