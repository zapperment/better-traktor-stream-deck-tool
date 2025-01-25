import { program } from "commander";
import { send } from "./actions/send.mjs";

program
  .name("better-traktor-stream-deck-tool")
  .description(
    "Command line tool that receives MIDI messages from Traktor and sends " +
      "HTTP requests to BetterTouchTool, for controlling buttons on Stream Deck hardware",
  )
  .version("0.0.1");

program
  .command("send")
  .description(
    "sends a message to BetterTouchTool to change a Stream Deck button",
  )
  .option("-b, --button <button_name>", "the button to change")
  .option("-s, --state <state_name>", "the state to change the button to")
  .action(send);

program.parse();
