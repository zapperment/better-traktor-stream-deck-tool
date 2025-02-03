import { dispatchRepeatMs, dispatchRepeatCount } from "../constants.mjs";
import { createDebug } from "../utils/createDebug.mjs";

const debug = createDebug("managers:DispatchManager");

class DispatchManager {
  #intervalHandles = {};

  dispatch(button, url) {
    const existingIntervalHandle = this.#intervalHandles[button];
    if (existingIntervalHandle) {
      debug.log("clearing existing interval handle for %s", button);
      clearInterval(existingIntervalHandle);
    }
    debug.log("setting interval handle for %s", button);

    let count = 0;
    this.#executeFetch(url);
    const intervalHandle = setInterval(() => {
      this.#executeFetch(url);
      if (++count === dispatchRepeatCount - 1) {
        debug.log(
          "clearing interval handle for %s after %d repeats",
          button,
          dispatchRepeatCount,
        );
        clearInterval(intervalHandle);
        delete this.#intervalHandles[button];
      }
    }, dispatchRepeatMs);

    this.#intervalHandles[button] = intervalHandle;
  }

  #executeFetch = async (url) => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        debug.error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      debug.error("Failed to send button state: %s", error.message);
    }
  };
}

export const dispatchManager = new DispatchManager();
