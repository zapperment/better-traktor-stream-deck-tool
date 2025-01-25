import { program } from "commander";
import { execSync } from "node:child_process";

const secret = "W1rR0ck3nD13Bud3B31mSchu1ba112025";

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

const buttons = {
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
};

for (const button of Object.values(buttons)) {
  for (const state of Object.values(button.states)) {
    state.url = createButtonUrl(button.uuid, state.payload);
  }
}

program
  .name("better-traktor-stream-deck-tool")
  .description(
    "Command line tool that receives MIDI messages from Traktor and sends HTTP requests to BetterTouchTool, for controlling buttons on Stream Deck hardware",
  )
  .version("0.0.1");

program
  .command("send")
  .description(
    "sends a message to BetterTouchTool to change a Stream Deck button",
  )
  .option("-b, --button <button_name>", "the button to change")
  .option("-s, --state <state_name>", "the state to change the button to")
  .action(({ button, state }) => {
    const url = buttons[button].states[state].url;
    const cmd = `open "${url}"`;
    execSync(cmd);
    console.log(`switched ${button} button ${state}`);
  });

program.parse();

function createButtonUrl(uuid, payload) {
  return new URL(
    `btt://update_trigger/?uuid=${uuid}&shared_secret=${secret}&json=${encodeURIComponent(JSON.stringify(payload))}`,
  );
}
