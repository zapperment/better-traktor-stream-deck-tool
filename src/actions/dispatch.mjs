// If BetterTouchTool receives update_trigger messages in
// rapic succession, it "chokes", i.e. when it is busy
// updating a trigger and a message to update it again
// arrives, the last message is ignored. This means if
// we send the trigger update request to BTT immediately,
// the on/off state of a button will be incorrect if
// the buttons are pushed too quickly. We fix this with
// this dispatch action, which makes sure that between
// two update_trigger calls, a minimum time has elapsed.

import { send } from "./send.mjs";
import { createDebug } from "../utils/createDebug.mjs";
import { isLoopButton } from "../utils/isLoopButton.mjs";
import { getDeck } from "../utils/getDeck.mjs";
import { stateOn } from "../constants.mjs";

const debug = createDebug("actions:dispatch");

const lastActiveLoopButton = {
  A: null,
  B: null,
};

export function dispatch(bttAction) {
  const { button, state } = bttAction;
  updateLastActiveLoop(button, state);
  send({ button, state });
}

export function updateLastActiveLoop(button, state) {
  if (isLoopButton(button) && state === stateOn) {
    const deck = getDeck(button);
    lastActiveLoopButton[deck] = button;
  }
}

export function clearLastActiveLoop(deck) {
  lastActiveLoopButton[deck] = null;
}

export function getLastActiveLoop(deck) {
  return lastActiveLoopButton[deck];
}
