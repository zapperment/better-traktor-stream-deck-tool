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
import { throttleDispatchMs } from "../constants.mjs";

const debug = createDebug("actions:dispatch");

const queues = {};
const states = {};
const lastActiveLoopButton = {
  A: null,
  B: null,
};

export function dispatch(bttAction) {
  const { button, state } = bttAction;
  updateLastActiveLoop(button, state);
  states[button] = state;
  if (queues[button] === undefined) {
    queues[button] = Promise.resolve();
    debug.log(`queue cache add button ${button}`);
  } else {
    debug.log(`queue cache hit button ${button}`);
  }
  queues[button] = queues[button].then(
    () =>
      new Promise((resolve) => {
        debug.log(`dispatched ${button} button ${states[button]}`);
        send({ button, state: states[button] });
        setTimeout(resolve, throttleDispatchMs);
      }),
  );
}

export function updateLastActiveLoop(button, state) {
  if (button.startsWith("loop") && state === "on") {
    const deck = button.endsWith("A") ? "A" : "B";
    lastActiveLoopButton[deck] = button;
  }
}

export function clearLastActiveLoop(deck) {
  lastActiveLoopButton[deck] = null;
}

export function getLastActiveLoop(deck) {
  return lastActiveLoopButton[deck];
}
