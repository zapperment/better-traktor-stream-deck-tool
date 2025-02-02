import midi from "@julusian/midi";
import { getPortIndex } from "./getPortIndex.mjs";
import { createDebug } from "../utils/createDebug.mjs";

const debug = createDebug("midi:initPort");

export function initPort(portName, portType) {
  let midiInterface;

  if (portType === "input") {
    midiInterface = new midi.Input();
  } else {
    midiInterface = new midi.Output();
  }

  const portIndex = getPortIndex(midiInterface, portName);
  if (portIndex === null) {
    throw new Error(`MIDI ${portType} port ${portName} not found`);
  }

  midiInterface.openPort(portIndex);
  debug.log(`opened MIDI ${portType} port (#${portIndex})`);

  return midiInterface;
}
