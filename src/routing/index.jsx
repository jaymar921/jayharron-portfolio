import { createContext, useContext, useEffect, useState } from "react";

/**
 * Minimal, dependency-free client-side router.
 *
 * This project only needs static-path matching (no dynamic ":id" segments)
 * and basic internal/external link handling, so a tiny in-house router
 * avoids depending on react-router-dom (which currently has no published
 * version free of known advisories).
 */

const RouterContext = createContext(null);

function getPath() {
  return window.location.pathname;
}

export function RouterProvider({ children }) {
  const [path, setPath] = useState(getPath());

  useEffect(() => {
    const onPopState = () => setPath(getPath());
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const navigate = (to) => {
    if (to !== getPath()) {
      window.history.pushState({}, "", to);
    }
    setPath(getPath());
    window.scrollTo(0, 0);
  };

  return (
    <RouterContext.Provider value={{ path, navigate }}>
      {children}
    </RouterContext.Provider>
  );
}

function useRouter() {
  const ctx = useContext(RouterContext);
  if (!ctx) {
    throw new Error("useRouter must be used within a RouterProvider");
  }
  return ctx;
}

/** The current path, kept in step with pushState and the back button. */
export function usePath() {
  return useRouter().path;
}

export function Routes({ children }) {
  const { path } = useRouter();
  const routes = Array.isArray(children) ? children : [children];
  const match = routes.find((route) => route && route.props.path === path);
  return match ? match.props.element : null;
}

// Route is a data-only component; Routes reads its props and never renders it directly.
export function Route() {
  return null;
}

function isExternalTarget(to, target) {
  return target === "_blank" || /^https?:\/\//i.test(to || "");
}

export function Link({ to, children, className, target, ...rest }) {
  const { navigate } = useRouter();

  if (isExternalTarget(to, target)) {
    return (
      <a
        href={to}
        className={className}
        target={target}
        rel={target === "_blank" ? "noopener noreferrer" : undefined}
        {...rest}
      >
        {children}
      </a>
    );
  }

  const handleClick = (e) => {
    e.preventDefault();
    navigate(to);
  };

  return (
    <a href={to} className={className} onClick={handleClick} {...rest}>
      {children}
    </a>
  );
}

export function NavLink({ to, children, className, ...rest }) {
  const { path, navigate } = useRouter();
  const isActive = path === to;
  const resolvedClassName =
    typeof className === "function" ? className({ isActive }) : className;

  const handleClick = (e) => {
    e.preventDefault();
    navigate(to);
  };

  return (
    <a href={to} className={resolvedClassName} onClick={handleClick} {...rest}>
      {children}
    </a>
  );
}
