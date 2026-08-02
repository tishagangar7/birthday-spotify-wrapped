"use client";

import { createContext, useContext } from "react";

// Lets a card's own content (e.g. the Chapter Menu) jump the deck straight to
// another card by id, for non-linear "table of contents"-style navigation —
// without every card needing to know its numeric index.
export const StoryDeckContext = createContext(null);

export function useStoryDeckNav() {
  return useContext(StoryDeckContext);
}
