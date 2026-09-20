/**
 * The owner's own devices, kept out of the numbers.
 *
 * The admin page never sends a view, but the owner also opens the desktop
 * like anyone else, to check a change or copy a link, and every one of those
 * would land in the counters. So the moment a browser signs in to /admin it
 * is stamped in localStorage, and track.js refuses to send anything from a
 * stamped browser from then on, signed in or not. The server drops anything
 * that still arrives with a live admin cookie, as a second lock.
 *
 * Both the key and the value are SHA-256 digests rather than words, so the
 * stamp does not read as "owner" to anyone poking through site data, and a
 * value left there by an unrelated script does not match by accident. They
 * are `sha256("jayharron:owner-device")` and
 * `sha256("jayharron:owner-device:yes")`, fixed here so the check is a string
 * compare and never has to await crypto.subtle before a beacon.
 *
 * Setting it by hand only ever costs the site one visitor's worth of counts,
 * which is what the browser's do-not-track setting already does, so there is
 * nothing here worth protecting further.
 */

const OWNER_KEY = "1a6ff3305b857c7d7d61b0522bb217f997de924d2ea80f201b82b50718e2e402";
const OWNER_VALUE = "76eed18b03141ba69040666d5579f2d7b93565c20e944e4af143364e2ce37955";

/** Stamps this browser as the owner's. Called after any successful admin session. */
export function markOwnerDevice() {
  try {
    window.localStorage.setItem(OWNER_KEY, OWNER_VALUE);
  } catch {
    // Private window or storage blocked. The stamp does not stick, and this
    // visit is counted, which is the old behaviour and not a bad one.
  }
}

/** True when this browser has signed in to /admin at some point. */
export function isOwnerDevice() {
  try {
    return window.localStorage.getItem(OWNER_KEY) === OWNER_VALUE;
  } catch {
    return false;
  }
}

/** Removes the stamp, for when the device changes hands. */
export function forgetOwnerDevice() {
  try {
    window.localStorage.removeItem(OWNER_KEY);
  } catch {
    // Nothing stored, nothing to forget.
  }
}
