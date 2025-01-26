import { configFileName } from "../constants.mjs";
import { findFile } from "./findFile.mjs";
import { createDebug } from "../utils/createDebug.mjs";
import { load } from "js-yaml";
import { readFileSync } from "node:fs";
import { homedir } from "node:os";

const debug = createDebug("file:readConfig");

export function readConfig() {
  const startDir = process.cwd();
  debug.log(`Start dir: ${startDir}`);
  let configFilePath = findFile(startDir, configFileName);
  if (configFilePath === null) {
    configFilePath = findFile(homedir(), configFileName);
  }
  if (configFilePath === null) {
    debug.error(
      `Failed to find config file ${configFileName} starting at path ${startDir}`,
    );
    return null;
  }
  let rawConfig;
  try {
    rawConfig = readFileSync(configFilePath, "utf8");
  } catch (error) {
    debug.error(`Error reading config file ${configFilePath}`, error);
    return null;
  }
  let config;
  try {
    config = load(rawConfig);
  } catch (error) {
    debug.error(`Error parsing config file ${configFilePath}`, error);
    return null;
  }
  return config;
}
