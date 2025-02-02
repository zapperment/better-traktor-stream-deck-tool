import { config } from "../config.mjs";
import { createDebug } from "../utils/createDebug.mjs";
import { createButtonUrl } from "../utils/createButtonUrl.mjs";
import { placeholderLastLoopA, placeholderLastLoopB } from "../constants.mjs";
import { getLastActiveLoop } from "./dispatch.mjs";
import { getDeck } from "../utils/getDeck.mjs";
import { backgroundColourManager } from "../managers/BackgroundColourManager.mjs";

const debug = createDebug("actions:send");

export async function send({ button, state }) {
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

  try {
    const response = await fetch(url);
    if (!response.ok) {
      debug.error(`HTTP error! status: ${response.status}`);
      return;
    }
    const body = await response.json();
    debug.log("response body: %O", body);
  } catch (error) {
    debug.error("Failed to send button state: %s", error.message);
    return;
  }
  debug.log(`switched ${finalButton} button ${state}`);
}
