import { execSync } from "node:child_process";
import { config } from "../config.mjs";
import { createDebug } from "../utils/createDebug.mjs";
import { createButtonUrl } from "../utils/createButtonUrl.mjs";
import { placeholderLastLoopA, placeholderLastLoopB } from "../constants.mjs";
import { getLastActiveLoop } from "./dispatch.mjs";
import { getDeck } from "../utils/getDeck.mjs";

const debug = createDebug("actions:send");

export function send({ button, state }) {
  let finalButton = button;
  if (button === placeholderLastLoopA || button === placeholderLastLoopB) {
    const deck = getDeck(button);
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
  const url = createButtonUrl({
    uuid,
    title,
    payload,
    secret,
  });
  const cmd = `open "${url}"`;
  execSync(cmd);
  debug.log(`switched ${finalButton} button ${state}`);
}
