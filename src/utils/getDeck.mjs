import { placeholderLastLoopA, placeholderLastLoopB } from "../constants.mjs";

export function getDeck(button) {
  if (button === placeholderLastLoopA || button === placeholderLastLoopB) {
    return button === placeholderLastLoopA ? "A" : "B";
  }
  return button.endsWith("A") ? "A" : "B";
}
