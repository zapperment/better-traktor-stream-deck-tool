import "dotenv/config";
import { readConfig } from "./file/readConfig.mjs";
import { createDebug } from "./utils/createDebug.mjs";

const debug = createDebug("config");

const configFromYaml = readConfig();

export const config = {
  secret: process.env.BTT_SHARED_SECRET,
  midiPort: process.env.MIDI_PORT,
  colours: {
    ...configFromYaml.colours,
  },
  states: {
    ...configFromYaml.states,
  },
  buttons: {
    ...configFromYaml.buttons,
  },
  midi: {
    ...configFromYaml.midi,
  },
};
