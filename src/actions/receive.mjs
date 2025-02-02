import { initPort } from "../midi/initPort.mjs";
import { config } from "../config.mjs";
import {
  dispatch,
  getLastActiveLoop,
  clearLastActiveLoop,
} from "./dispatch.mjs";
import { createDebug } from "../utils/createDebug.mjs";
import { isControlChange } from "../midi/isControlChange.mjs";
import { getMidiChannel } from "../midi/getMidiChannel.mjs";
import { placeholderLastLoopA, placeholderLastLoopB } from "../constants.mjs";
import { getDeck } from "../utils/getDeck.mjs";
import { isLoopButton } from "../utils/isLoopButton.mjs";

const debug = createDebug("actions:receive");

export function receive() {
  const input = initPort(config.midiPort, "input");
  input.on("message", (deltaTime, midiMessage) => {
    if (!isControlChange(midiMessage)) {
      debug.warn(
        "received MIDI message other than control change: %o",
        midiMessage,
      );
      return;
    }
    const [, controller, value] = midiMessage;
    const channel = getMidiChannel(midiMessage);
    debug.log(
      "received MIDI message ch=%d cc=%d val=%d",
      channel,
      controller,
      value,
    );

    let bttAction = config.midi[`${channel},${controller},${value}`];

    if (!bttAction) {
      debug.warn("no BTT action configured");
      return;
    }

    // Handle special case for loop active messages
    if (bttAction?.button === placeholderLastLoopA) {
      const lastLoop = getLastActiveLoop("A");
      if (lastLoop) {
        bttAction = { button: lastLoop, state: "on" };
      } else {
        return;
      }
    } else if (bttAction?.button === placeholderLastLoopB) {
      const lastLoop = getLastActiveLoop("B");
      if (lastLoop) {
        bttAction = { button: lastLoop, state: "on" };
      } else {
        return;
      }
    }

    if (Array.isArray(bttAction)) {
      // Only clear last active loop if this is a loop size change (controller 3)
      // and not a loop off message (controller 4)
      const isLoopSizeChange =
        bttAction.every(
          ({ button, state }) => isLoopButton(button) && state === "off",
        ) && controller === 3;

      if (isLoopSizeChange) {
        const deck = getDeck(bttAction[0].button);
        clearLastActiveLoop(deck);
      }

      debug.log("dispatching %d BTT actions", bttAction.length);
      bttAction.forEach(dispatch);
    } else {
      debug.log("dispatching BTT action");
      dispatch(bttAction);
    }
  });
}
