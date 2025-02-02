import { execSync } from "node:child_process";
import { config } from "../config.mjs";
import { createDebug } from "../utils/createDebug.mjs";
import { createButtonUrl } from "../utils/createButtonUrl.mjs";

const debug = createDebug("actions:send");

export function send({ button, state }) {
  const secret = config.secret;
  const { uuid, states } = config.buttons[button];
  const { title, payload } = states[state];
  const url = createButtonUrl({
    uuid,
    title,
    payload,
    secret,
  });
  const cmd = `open "${url}"`;
  execSync(cmd);
  debug.log(`switched ${button} button ${state}`);
}
