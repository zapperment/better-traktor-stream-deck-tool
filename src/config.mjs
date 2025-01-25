import "dotenv/config";
import { createButtonUrl } from "./utils/createButtonUrl.mjs";

const secret = process.env.BTT_SHARED_SECRET;

const colour = {
  licorice: "0.000000, 0.000000, 0.000000, 255.000000",
  banana: "254.881188, 252.030672, 120.527085, 255.000000",
  snow: "255.000000, 255.000000, 255.000000, 255.000000",
};

const ct = {
  on: {
    foreground: colour.licorice,
    background: colour.banana,
  },
  off: {
    foreground: colour.snow,
    background: colour.licorice,
  },
};

export const config = {
  buttons: {
    play: {
      uuid: "389804C7-2135-485C-911D-442FCE733BC1",
      states: {
        on: {
          payload: {
            BTTTriggerConfig: {
              BTTStreamDeckIconColor1: ct.on.foreground,
              BTTStreamDeckBackgroundColor: ct.on.background,
            },
          },
        },
        off: {
          payload: {
            BTTTriggerConfig: {
              BTTStreamDeckIconColor1: ct.off.foreground,
              BTTStreamDeckBackgroundColor: ct.off.background,
            },
          },
        },
      },
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
