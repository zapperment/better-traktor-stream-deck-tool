import { initPort } from "../midi/initPort.mjs";
import { config } from "../config.mjs";
import { dispatch, clearLastActiveLoop } from "./dispatch.mjs";
import { createDebug } from "../utils/createDebug.mjs";
import { isControlChange } from "../midi/isControlChange.mjs";
import { getMidiChannel } from "../midi/getMidiChannel.mjs";
import { getDeck } from "../utils/getDeck.mjs";
import { isLoopButton } from "../utils/isLoopButton.mjs";
import { backgroundColourManager } from "../managers/BackgroundColourManager.mjs";
import { stateOff } from "../constants.mjs";

const debug = createDebug("actions:receive");

export function receive() {
  const input = initPort(config.midiPort, "input");
  input.on("message", (deltaTime, midiMessage) => {
    backgroundColourManager.processMidi(midiMessage);
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

    if (Array.isArray(bttAction)) {
      // Only clear last active loop if this is a loop size change (controller 3)
      // and not a loop off message (controller 4)
      const isLoopSizeChange =
        bttAction.every(
          ({ button, state }) => isLoopButton(button) && state === stateOff,
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
