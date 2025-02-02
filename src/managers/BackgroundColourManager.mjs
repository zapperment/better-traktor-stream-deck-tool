import {
  backgroundManagerChannel,
  backgroundManagerController,
  backgroundColourNameActiveDeck,
  stateOff,
  stateOn,
} from "../constants.mjs";
import { isControlChange } from "../midi/isControlChange.mjs";
import { getMidiChannel } from "../midi/getMidiChannel.mjs";
import { deckA, deckB } from "../constants.mjs";
import { createDebug } from "../utils/createDebug.mjs";
import { config } from "../config.mjs";
import { createButtonUrl } from "../utils/createButtonUrl.mjs";
import { getDeck } from "../utils/getDeck.mjs";

const debug = createDebug("managers:BackgroundColourManager");

class BackgroundColourManager {
  #isDeckActive = {
    [deckA]: null,
    [deckB]: null,
  };

  #buttonStates = Object.keys(config.buttons).reduce((acc, button) => {
    acc[button] = stateOff;
    return acc;
  }, {});

  processMidi(midiMessage) {
    const [, controller, value] = midiMessage;
    const channel = getMidiChannel(midiMessage);
    if (
      !isControlChange(midiMessage) ||
      channel !== backgroundManagerChannel ||
      controller !== backgroundManagerController
    ) {
      return;
    }
    const prevActiveA = this.#isDeckActive[deckA];
    const prevActiveB = this.#isDeckActive[deckB];
    this.#isDeckActive[deckA] = value < 127;
    this.#isDeckActive[deckB] = value > 0;
    if (prevActiveA !== this.#isDeckActive[deckA]) {
      this.updateDeckActive(deckA);
    }
    if (prevActiveB !== this.#isDeckActive[deckB]) {
      this.updateDeckActive(deckB);
    }
  }

  async updateDeckActive(deck) {
    const isDeckActive = this.#isDeckActive[deck];
    debug.log("deck %s is now %s", deck, isDeckActive ? "active" : "inactive");
    const state = isDeckActive ? stateOn : stateOff;
    const payload = config.states.deck[state].payload;
    for (const [button, state] of Object.entries(this.#buttonStates)) {
      if (getDeck(button) === deck && state === stateOff) {
        debug.log(
          "button %s is off, setting background colour to %s",
          button,
          backgroundColourNameActiveDeck,
        );
        const { uuid } = config.buttons[button];
        const { secret } = config;
        const url = createButtonUrl({
          uuid,
          payload,
          secret,
        });
        try {
          const response = await fetch(url);
          if (!response.ok) {
            debug.error(`HTTP error! status: ${response.status}`);
            return;
          }
        } catch (error) {
          debug.error("Failed to send button state: %s", error.message);
          return;
        }
      }
    }
  }

  isDeckActive(deck) {
    return this.#isDeckActive[deck];
  }

  getFinalPayload({ payload, button, state, deck }) {
    this.#buttonStates[button] = state;
    let finalPayload = payload;
    if (state !== stateOff || !this.isDeckActive(deck)) {
      return finalPayload;
    }
    const backgroundColourActiveDeck =
      config.colours[backgroundColourNameActiveDeck];
    debug.log(
      "deck %s is active, setting background colour to active deck colour %s",
      deck,
      backgroundColourActiveDeck,
    );
    finalPayload = {
      ...payload,
      BTTTriggerConfig: {
        ...payload.BTTTriggerConfig,
        BTTStreamDeckBackgroundColor: backgroundColourActiveDeck,
      },
    };
    debug.log("final payload: %O", finalPayload);
    return finalPayload;
  }
}

export const backgroundColourManager = new BackgroundColourManager();
