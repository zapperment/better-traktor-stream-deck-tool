import "dotenv/config";
import { createButtonUrl } from "./utils/createButtonUrl.mjs";

const secret = process.env.BTT_SHARED_SECRET;

const colours = {
  licorice: "0.000000, 0.000000, 0.000000, 255.000000",
  banana: "254.881188, 252.030672, 120.527085, 255.000000",
  snow: "255.000000, 255.000000, 255.000000, 255.000000",
};

const semanticColours = {
  on: {
    foreground: colours.licorice,
    background: colours.banana,
  },
  off: {
    foreground: colours.snow,
    background: colours.licorice,
  },
};

export const config = {
  midiPort: process.env.MIDI_PORT,
  buttons: {
    playA: {
      uuid: "389804C7-2135-485C-911D-442FCE733BC1",
      states: {
        on: {
          payload: {
            BTTTriggerConfig: {
              BTTStreamDeckIconColor1: semanticColours.on.foreground,
              BTTStreamDeckBackgroundColor: semanticColours.on.background,
            },
          },
        },
        off: {
          payload: {
            BTTTriggerConfig: {
              BTTStreamDeckIconColor1: semanticColours.off.foreground,
              BTTStreamDeckBackgroundColor: semanticColours.off.background,
            },
          },
        },
      },
    },
    playB: {
      uuid: "52894AAF-B332-41A5-85C2-199E950A05D7",
      states: {
        on: {
          payload: {
            BTTTriggerConfig: {
              BTTStreamDeckIconColor1: semanticColours.on.foreground,
              BTTStreamDeckBackgroundColor: semanticColours.on.background,
            },
          },
        },
        off: {
          payload: {
            BTTTriggerConfig: {
              BTTStreamDeckIconColor1: semanticColours.off.foreground,
              BTTStreamDeckBackgroundColor: semanticColours.off.background,
            },
          },
        },
      },
    },
  },
  midi: {
    "178,0,127": {
      button: "playA",
      state: "on",
    },
    "178,0,0": {
      button: "playA",
      state: "off",
    },
    "179,0,127": {
      button: "playB",
      state: "on",
    },
    "179,0,0": {
      button: "playB",
      state: "off",
    },
  },
};

for (const button of Object.values(config.buttons)) {
  for (const state of Object.values(button.states)) {
    state.url = createButtonUrl({
      uuid: button.uuid,
      payload: state.payload,
      secret,
    });
  }
}
