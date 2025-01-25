export function createButtonUrl({ uuid, payload, secret }) {
  return new URL(
    `btt://update_trigger/?uuid=${uuid}&shared_secret=${secret}&json=${encodeURIComponent(JSON.stringify(payload))}`,
  );
}
