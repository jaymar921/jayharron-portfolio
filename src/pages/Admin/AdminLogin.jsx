import { useState } from "react";
import { Button, Field, FormStatus, Panel, TextInput } from "./ui";
import { login } from "../../lib/api/admin";

/**
 * The gate.
 *
 * It says as little as possible. One message covers a wrong username and a
 * wrong password, because telling them apart is how someone finds out which
 * usernames are real, and the server answers both the same way for the same
 * reason.
 */
function AdminLogin({ onSignedIn, configured = true }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(event) {
    event.preventDefault();
    if (busy) return;

    setBusy(true);
    setError(null);

    try {
      const result = await login({ username, password });
      // The password is dropped from state on the way out rather than left
      // sitting in a React tree for as long as the tab is open.
      setPassword("");
      onSignedIn?.(result);
    } catch (failure) {
      setError(failure.message ?? "That did not work. Try again.");
      setPassword("");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm">
        <div className="pb-6 text-center">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl border border-ubuntu-orange/40 bg-ubuntu-orange/10 text-ubuntu-orange">
            <i className="fa-solid fa-lock" aria-hidden="true" />
          </span>
          <h1 className="pt-4 text-base font-bold tracking-wide text-white">Admin</h1>
          <p className="pt-1 text-xs text-ubuntu-warm-grey">
            Portfolio analytics. Nothing here is public.
          </p>
        </div>

        <Panel accent="orange" className="p-5">
          {!configured ? (
            <FormStatus tone="error" title="Not configured">
              This deployment has no database connection, so there is nothing to sign in
              to. Set MONGODB_URI and restart.
            </FormStatus>
          ) : (
            <form className="flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
              <Field label="Username" htmlFor="admin-username" required>
                <TextInput
                  id="admin-username"
                  name="username"
                  autoComplete="username"
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck="false"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  disabled={busy}
                  required
                />
              </Field>

              <Field label="Password" htmlFor="admin-password" required>
                <TextInput
                  id="admin-password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  disabled={busy}
                  required
                />
              </Field>

              {error && (
                <FormStatus tone="error" title="Not signed in">
                  {error}
                </FormStatus>
              )}

              <Button
                accent="orange"
                type="submit"
                icon={busy ? "fa-solid fa-circle-notch fa-spin" : "fa-solid fa-right-to-bracket"}
                className="w-full"
                disabled={busy || username.trim() === "" || password === ""}
              >
                {busy ? "Checking" : "Sign in"}
              </Button>
            </form>
          )}
        </Panel>

        <p className="pt-5 text-center text-[11px] leading-relaxed text-slate-500">
          Accounts are created from a terminal with{" "}
          <code className="text-slate-400">npm run admin -- create</code>. There is no sign up
          and no password reset by email.
        </p>
      </div>
    </div>
  );
}

export default AdminLogin;
