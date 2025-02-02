import { execSync } from "node:child_process";
import { config } from "../config.mjs";
import { createDebug } from "../utils/createDebug.mjs";
import { createButtonUrl } from "../utils/createButtonUrl.mjs";
import { placeholderLastLoopA, placeholderLastLoopB } from "../constants.mjs";
import { getLastActiveLoop } from "./dispatch.mjs";
import { getDeck } from "../utils/getDeck.mjs";
import { backgroundColourManager } from "../managers/BackgroundColourManager.mjs";

const debug = createDebug("actions:send");

export function send({ button, state }) {
  let finalButton = button;
  const deck = getDeck(button);
  if (button === placeholderLastLoopA || button === placeholderLastLoopB) {
    finalButton = getLastActiveLoop(deck);
    if (!finalButton) {
      debug.warn("no last active loop found for deck %s", deck);
      return;
    }
  }
  const secret = config.secret;
  debug.log("sending button", finalButton, "state", state);
  const { uuid, title, states } = config.buttons[finalButton];
  const { payload } = states[state];

  // background colour manager modifies the payload if the deck is active
  // so that it has a different background colour, which warns the user
  // that the deck is active
  let finalPayload = backgroundColourManager.getFinalPayload({
    payload,
    button: finalButton,
    state,
    deck,
  });

  const url = createButtonUrl({
    uuid,
    title,
    payload: finalPayload,
    secret,
  });
  const cmd = `open "${url}"`;
  execSync(cmd);
  debug.log(`switched ${finalButton} button ${state}`);
}
