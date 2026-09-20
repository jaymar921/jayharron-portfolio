/**
 * The one place the browser talks to the API.
 *
 * VITE_API_BASE_URL is normally empty. On Vercel the API is served from the
 * same origin as the site, and the dev proxy in vite.config.js reproduces that
 * locally, so a relative "/api/..." works in both. The variable only exists
 * for the case where the API is deployed somewhere else entirely.
 */

const BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? "").replace(/\/+$/, "");

export function apiUrl(path) {
  const suffix = path.startsWith("/") ? path : `/${path}`;
  return `${BASE_URL}${suffix}`;
}

/** Thrown for anything the server answered that was not a success. */
export class ApiError extends Error {
  constructor(message, { status, field, code } = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status ?? 0;
    this.field = field ?? null;
    this.code = code ?? "request_failed";
  }
}

/** A non JSON error page should not become a JSON parse crash. */
async function readJson(response) {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

/**
 * A JSON request that turns a failure into an ApiError carrying the field
 * name the server complained about, so a form can put the message next to
 * the input that caused it. Without a timeout a hanging request leaves a form
 * spinning forever, which reads as a broken page rather than a slow one.
 */
export async function request(
  path,
  { method = "GET", body, signal, timeoutMs = 20_000 } = {},
) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  const abortOuter = () => controller.abort();
  signal?.addEventListener("abort", abortOuter);

  try {
    const response = await fetch(apiUrl(path), {
      method,
      // Same origin is the browser default, but saying it means a future
      // change to the base URL fails loudly rather than quietly signing
      // everyone out.
      credentials: "same-origin",
      headers: body === undefined ? undefined : { "Content-Type": "application/json" },
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: controller.signal,
    });

    const payload = await readJson(response);

    if (!response.ok || payload?.ok === false) {
      throw new ApiError(
        payload?.message ?? `Request failed with status ${response.status}`,
        {
          status: response.status,
          field: payload?.field,
          code: payload?.error,
        },
      );
    }

    return payload;
  } catch (error) {
    if (error instanceof ApiError) throw error;

    if (error?.name === "AbortError") {
      throw new ApiError("That took too long. Check your connection and try again.", {
        code: "timeout",
      });
    }

    throw new ApiError("Could not reach the server. Check your connection and try again.", {
      code: "network",
    });
  } finally {
    clearTimeout(timer);
    signal?.removeEventListener("abort", abortOuter);
  }
}
