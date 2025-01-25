export function createButtonUrl({ uuid, payload, secret }) {
  const json = encodeURIComponent(JSON.stringify(payload));
  return `btt://update_trigger/?uuid=${uuid}&shared_secret=${secret}&json=${json}`;
}
