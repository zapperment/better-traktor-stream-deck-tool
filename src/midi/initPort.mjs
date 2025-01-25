import midi from "@julusian/midi";
import { getPortIndex } from "./getPortIndex.mjs";

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
  console.log(`opened MIDI ${portType} port (#${portIndex})`);

  return midiInterface;
}
