import { initPort } from "../midi/initPort.mjs";
import { config } from "../config.mjs";
import { send } from "./send.mjs";

export function receive() {
  const input = initPort(config.midiPort, "input");
  input.on("message", (deltaTime, midiMessage) => {
    if (midiMessage.length !== 3) {
      return;
    }
    const midiMessageKey = midiMessage.toString();
    console.log(`received MIDI message: ${midiMessageKey}`);
    const bttAction = config.midi[midiMessageKey];
    if (!bttAction) {
      console.warn("no BTT action configured");
      return;
    }
    send(bttAction);
  });
}
