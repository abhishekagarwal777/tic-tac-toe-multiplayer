import { Client, Session } from "@heroiclabs/nakama-js";

// Configure your Nakama client connection
const client = new Client("defaultkey", "localhost", "7350", false);

// You can authenticate a user (device or email)
export async function authenticateUser(): Promise<Session> {
  const deviceId = "device_" + Math.random().toString(36).substring(2, 15);

  const session = await client.authenticateDevice(deviceId, true);
  console.log("Authenticated:", session);
  return session;
}

export default client;
