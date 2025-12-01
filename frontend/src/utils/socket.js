import io from "socket.io-client";
import { BASE_URL } from "./constants";

export const createSocketConnection = () => {
  // BASE_URL is something like "http://localhost:7777/api"
  // Socket.io needs the root path "http://localhost:7777"
  // We simply remove the "/api" suffix to get the correct socket URL.
  const socketUrl = BASE_URL.replace("/api", "");

  return io(socketUrl);
};
