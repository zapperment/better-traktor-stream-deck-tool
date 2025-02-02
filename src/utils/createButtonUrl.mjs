import { placeholderTitle } from "../constants.mjs";
import { createDebug } from "../utils/createDebug.mjs";

const debug = createDebug("utils:creeateButtonUrl");

export function createButtonUrl({ uuid, title, payload, secret }) {
  const finalPayload = structuredClone(payload);
  debug.log("title: %s", title);

  if (title) {
    finalPayload.BTTTriggerConfig.BTTStreamDeckAttributedTitle =
      finalPayload.BTTTriggerConfig.BTTStreamDeckAttributedTitle.replace(
        placeholderTitle,
        title,
      );
  }
  const json = encodeURIComponent(JSON.stringify(finalPayload));
  return `btt://update_trigger/?uuid=${uuid}&shared_secret=${secret}&json=${json}`;
}
