import { initPort } from "../midi/initPort.mjs";
import { config } from "../config.mjs";
import { dispatch } from "./dispatch.mjs";
import { createDebug } from "../utils/createDebug.mjs";
import { isControlChange } from "../midi/isControlChange.mjs";
import { getMidiChannel } from "../midi/getMidiChannel.mjs";

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
    const bttAction = config.midi[`${channel},${controller},${value}`];
    if (!bttAction) {
      debug.warn("no BTT action configured");
      return;
    }
    dispatch(bttAction);
  });
}
