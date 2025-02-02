import { placeholderLastLoopA, placeholderLastLoopB } from "../constants.mjs";
import { deckA, deckB } from "../constants.mjs";

export function getDeck(button) {
  if (button === placeholderLastLoopA || button === placeholderLastLoopB) {
    return button === placeholderLastLoopA ? deckA : deckB;
  }
  return button.endsWith(deckA) ? deckA : deckB;
}
