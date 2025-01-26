import fs from "node:fs";
import path from "node:path";
import { createDebug } from "../utils/createDebug.mjs";

const debug = createDebug("file:findFile");

/**
 * Function to find the config file by traversing up the directory tree.
 *
 * @param {string} startDir - The directory where the search starts.
 * @param {string} fileName - The file to search for.
 * @returns {string|null} - Returns the full path of the config file if found, otherwise null.
 */
export function findFile(startDir, fileName) {
  let currentDir = startDir;
  while (true) {
    const filePath = path.join(currentDir, fileName);

    if (fs.existsSync(filePath)) {
      debug.log(`Found file ${fileName} in directory ${currentDir}`);
      return filePath;
    }

    const parentDir = path.dirname(currentDir);
    if (parentDir === currentDir) {
      break;
    }

    debug.log(`Did not find file ${fileName} in directory ${currentDir}`);
    currentDir = parentDir;
  }

  debug.error(`Did not find file ${fileName} anywhere`);
  return null;
}
