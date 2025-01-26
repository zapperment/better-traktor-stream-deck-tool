import { initPort } from "../midi/initPort.mjs";
import { config } from "../config.mjs";
import { send } from "./send.mjs";
import { createDebug } from "../utils/createDebug.mjs";

const debug = createDebug("actions:receive");

export function receive() {
  const input = initPort(config.midiPort, "input");
  input.on("message", (deltaTime, midiMessage) => {
    if (midiMessage.length !== 3) {
      return;
    }
    const midiMessageKey = midiMessage.toString();
    debug.log(`received MIDI message: ${midiMessageKey}`);
    const bttAction = config.midi[midiMessageKey];
    if (!bttAction) {
      debug.warn("no BTT action configured");
      return;
    }
    send(bttAction);
  });
}
