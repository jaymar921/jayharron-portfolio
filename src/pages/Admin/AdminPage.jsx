import { useCallback, useEffect, useState } from "react";
import AdminDashboard from "./AdminDashboard";
import AdminLogin from "./AdminLogin";
import AdminPasswordChange from "./AdminPasswordChange";
import { readSession } from "../../lib/api/admin";
import { markOwnerDevice } from "../../lib/analytics/owner";

/**
 * /admin.
 *
 * Not linked from anywhere on the site, disallowed in robots.txt, and marked
 * noindex by the tag added below for the crawlers that run JavaScript and
 * ignore the first two. None of that is security; the security is that the API
 * behind it refuses every request without a session. It is here so the page
 * does not turn up in a search result, which is a different problem.
 *
 * This component is only ever loaded through a lazy import, so none of it, and
 * none of the dashboard behind it, is in the bundle a normal visitor downloads.
 *
 * There is no usePageView call here. The admin looking at their own numbers
 * should not be adding to them. Going one further, any browser that gets a
 * session here is stamped as the owner's, and the tracking module leaves it
 * out of the counts on every other page too. See lib/analytics/owner.js.
 */

const NOINDEX = "noindex, nofollow, noarchive, nosnippet";

function useNoIndex() {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = "Admin | Jayharron Mar Abejar";

    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = NOINDEX;
    document.head.appendChild(meta);

    return () => {
      document.title = previousTitle;
      meta.remove();
    };
  }, []);
}

function AdminPage() {
  useNoIndex();

  const [state, setState] = useState({ status: "loading", session: null, configured: true });
  const [changingPassword, setChangingPassword] = useState(false);

  const refreshSession = useCallback(async ({ signal } = {}) => {
    try {
      const payload = await readSession({ signal });

      if (!payload.authenticated) {
        setState({
          status: "signed-out",
          session: null,
          configured: payload.configured !== false,
        });
        return;
      }

      markOwnerDevice();
      setState({
        status: payload.mustChangePassword ? "must-change" : "ready",
        session: payload,
        configured: true,
      });
    } catch (error) {
      if (error?.code === "timeout") return;
      // Anything that is not a clear "you are signed in" is treated as signed
      // out. A dashboard that half loads is worse than a login form.
      setState({ status: "signed-out", session: null, configured: true });
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    refreshSession({ signal: controller.signal });
    return () => controller.abort();
  }, [refreshSession]);

  const handleSignedIn = useCallback((result) => {
    markOwnerDevice();
    setChangingPassword(false);
    setState({
      status: result.mustChangePassword ? "must-change" : "ready",
      session: result,
      configured: true,
    });
  }, []);

  const handleSignedOut = useCallback(() => {
    setChangingPassword(false);
    setState({ status: "signed-out", session: null, configured: true });
  }, []);

  const handlePasswordChanged = useCallback((result) => {
    setChangingPassword(false);
    setState((current) => ({
      status: "ready",
      session: { ...current.session, ...result, mustChangePassword: false },
      configured: true,
    }));
  }, []);

  const shell = (children) => (
    <div className="linux-wallpaper min-h-screen w-full overflow-x-hidden font-ubuntu text-white">
      {children}
    </div>
  );

  if (state.status === "loading") {
    return shell(
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-xs uppercase tracking-widest text-ubuntu-warm-grey">
          <i className="fa-solid fa-circle-notch fa-spin pr-3" aria-hidden="true" />
          Checking session
        </p>
      </div>,
    );
  }

  if (state.status === "signed-out") {
    return shell(<AdminLogin onSignedIn={handleSignedIn} configured={state.configured} />);
  }

  if (state.status === "must-change" || changingPassword) {
    return shell(
      <AdminPasswordChange
        forced={state.status === "must-change"}
        username={state.session?.username}
        onDone={handlePasswordChanged}
        onCancel={() => setChangingPassword(false)}
      />,
    );
  }

  return shell(
    <AdminDashboard
      session={state.session}
      onSignedOut={handleSignedOut}
      onChangePassword={() => setChangingPassword(true)}
    />,
  );
}

export default AdminPage;
