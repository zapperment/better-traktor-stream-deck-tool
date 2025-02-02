export function isLoopButton(button) {
  return /^loop(\d+)[AB]$/.test(button);
}
