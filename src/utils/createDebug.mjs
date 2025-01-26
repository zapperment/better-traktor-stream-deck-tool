import debug from "debug";

export function createDebug(name) {
  return {
    log: debug(`btsdt:${name}:log`),
    warn: debug(`btsdt:${name}:warn`),
    error: debug(`btsdt:${name}:error`),
  };
}
