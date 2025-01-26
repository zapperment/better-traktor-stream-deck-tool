export function getMidiChannel(message) {
  return message[0] & 0x0f;
}
