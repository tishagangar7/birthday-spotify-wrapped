"use client";

import { useEffect, useState } from "react";

/**
 * Fetches `/api/wrapped`. Prefers the authenticated Spotify response; on 401
 * (or any failure) falls back to `?mock=true` so soundtrack / timeline cards
 * still render without credentials. `source` is `"spotify"` | `"mock"`;
 * `needsAuth` is true when the live route required login.
 */
export default function useWrappedData() {
  const [state, setState] = useState({ status: "loading", data: null, source: null, needsAuth: false });

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const real = await fetch("/api/wrapped");
        if (real.ok) {
          const data = await real.json();
          if (!cancelled) setState({ status: "ready", data, source: "spotify", needsAuth: false });
          return;
        }

        const needsAuth = real.status === 401;
        const mock = await fetch("/api/wrapped?mock=true");
        if (mock.ok) {
          const data = await mock.json();
          if (!cancelled) setState({ status: "ready", data, source: "mock", needsAuth });
          return;
        }

        if (!cancelled) setState({ status: "error", data: null, source: null, needsAuth });
      } catch {
        try {
          const mock = await fetch("/api/wrapped?mock=true");
          if (mock.ok) {
            const data = await mock.json();
            if (!cancelled) setState({ status: "ready", data, source: "mock", needsAuth: true });
            return;
          }
        } catch {
          // fall through to error state below
        }
        if (!cancelled) setState({ status: "error", data: null, source: null, needsAuth: true });
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}
