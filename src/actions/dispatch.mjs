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

export function dispatch(bttAction) {
  const { button, state } = bttAction;
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
