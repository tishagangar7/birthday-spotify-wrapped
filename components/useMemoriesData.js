"use client";

import { useEffect, useState } from "react";

/**
 * Fetches the friend-submitted memories from `GET /api/memories`, used for
 * the Closing Credits chapter's "Directed by <contributors>" line. Fails
 * safe to an empty contributors list if the endpoint isn't reachable — the
 * closing credits still render with a generic fallback line in that case.
 */
export default function useMemoriesData() {
  const [state, setState] = useState({ status: "loading", memories: [], contributors: [], count: 0 });

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const response = await fetch("/api/memories");
        if (!response.ok) throw new Error(`unexpected status ${response.status}`);
        const data = await response.json();
        if (!cancelled) {
          setState({
            status: "ready",
            memories: data.memories ?? [],
            contributors: data.contributors ?? [],
            count: data.count ?? 0,
          });
        }
      } catch {
        if (!cancelled) setState({ status: "error", memories: [], contributors: [], count: 0 });
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}
