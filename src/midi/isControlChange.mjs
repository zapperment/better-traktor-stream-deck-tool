export function isControlChange(message) {
  return (message[0] & 0xf0) === 0xb0;
}
