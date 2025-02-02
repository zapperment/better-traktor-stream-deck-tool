import { placeholderTitle } from "../constants.mjs";
import { createDebug } from "../utils/createDebug.mjs";
import { config } from "../config.mjs";

const debug = createDebug("utils:createButtonUrl");

export function createButtonUrl({ uuid, title, payload, secret }) {
  const finalPayload = structuredClone(payload);

  if (title) {
    debug.log("title: %s", title);
    finalPayload.BTTTriggerConfig.BTTStreamDeckAttributedTitle =
      finalPayload.BTTTriggerConfig.BTTStreamDeckAttributedTitle.replace(
        placeholderTitle,
        title,
      );
  }
  const json = encodeURIComponent(JSON.stringify(finalPayload));
  return `${config.baseUrl}/update_trigger/?uuid=${uuid}&shared_secret=${secret}&json=${json}`;
}
