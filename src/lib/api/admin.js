import { ApiError, request } from "./client.js";

/**
 * The browser half of the admin gateway.
 *
 * There is no token in localStorage and no Authorization header here on
 * purpose. The session lives in an HttpOnly cookie the server sets, which
 * means no script on the page, including anything that got onto it by
 * accident, can read it. The only thing this module does is send requests to
 * the same origin and let the browser attach the cookie itself.
 */

/** True when the failure means "you are not signed in", rather than anything else. */
export function isSignedOut(error) {
  return error instanceof ApiError && error.status === 401;
}

/** True when the server is refusing everything until the password is replaced. */
export function needsPasswordChange(error) {
  return error instanceof ApiError && error.code === "password_change_required";
}

export function readSession({ signal } = {}) {
  return request("/api/admin/session", { signal });
}

export function login({ username, password }, { signal } = {}) {
  return request("/api/admin/login", {
    method: "POST",
    body: { username, password },
    // A login costs a deliberate scrypt hash on the server, so it gets a
    // longer leash than a normal request before the client gives up.
    timeoutMs: 30_000,
    signal,
  });
}

export function logout({ signal } = {}) {
  return request("/api/admin/logout", { method: "POST", signal });
}

export function changePassword({ currentPassword, newPassword }, { signal } = {}) {
  return request("/api/admin/password", {
    method: "POST",
    body: { currentPassword, newPassword },
    timeoutMs: 30_000,
    signal,
  });
}

export function fetchStats({ signal } = {}) {
  return request("/api/stats", { signal });
}

export function fetchEvents({ page = null, limit = 50, signal } = {}) {
  const query = new URLSearchParams({ limit: String(limit) });
  if (page) query.set("page", page);
  return request(`/api/stats/events?${query}`, { signal });
}
