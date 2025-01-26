import { execSync } from "node:child_process";
import { config } from "../config.mjs";
import { createDebug } from "../utils/createDebug.mjs";

const debug = createDebug("actions:send");

export function send({ button, state }) {
  const url = config.buttons[button].states[state].url;
  const cmd = `open "${url}"`;
  execSync(cmd);
  debug.log(`switched ${button} button ${state}`);
}
