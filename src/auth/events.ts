import type { AuthEvent, AuthEventType } from "./types";

/**
 * Event system for authentication state changes
 */

const authEventTarget = new EventTarget();

/**
 * Subscribe to authentication state changes
 *
 * @returns Cleanup function to unsubscribe
 */
export function onAuthChange(callback: (event: AuthEvent) => void): () => void {
  const handler = (e: Event) => {
    callback((e as CustomEvent<AuthEvent>).detail);
  };

  authEventTarget.addEventListener("auth-change", handler);

  // Return cleanup function
  return () => {
    authEventTarget.removeEventListener("auth-change", handler);
  };
}

/**
 * Emit authentication event
 */
export function emitAuthEvent(type: AuthEventType): void {
  const event = new CustomEvent<AuthEvent>("auth-change", {
    detail: {
      type,
      timestamp: Date.now(),
    },
  });
  authEventTarget.dispatchEvent(event);
}
