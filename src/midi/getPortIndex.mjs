export function getPortIndex(midiInterface, portName) {
  let portIndex = 0;
  for (; portIndex < midiInterface.getPortCount(); portIndex++) {
    if (midiInterface.getPortName(portIndex) === portName) {
      return portIndex;
    }
  }
  return null;
}
