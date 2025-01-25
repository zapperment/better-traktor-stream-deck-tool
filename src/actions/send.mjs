import { execSync } from "node:child_process";
import { config } from "../config.mjs";

export function send({ button, state }) {
  const url = config.buttons[button].states[state].url;
  const cmd = `open "${url}"`;
  execSync(cmd);
  console.log(`switched ${button} button ${state}`);
}
