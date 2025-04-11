import Pusher, { Options } from "pusher-js";

const PUSHER_APP_KEY = import.meta.env.VITE_PUSHER_APP_KEY as string;
const REVERB_HOST = import.meta.env.VITE_REVERB_HOST as string;
const REVERB_PORT = Number(import.meta.env.VITE_REVERB_PORT);
const REVERB_SCHEME = import.meta.env.VITE_REVERB_SCHEME;
const PUSHER_CLUSTER = import.meta.env.VITE_PUSHER_CLUSTER as string; 

// Define Pusher options
const options: Options = {
  wsHost: REVERB_HOST,
  wsPort: REVERB_PORT,
  wssPort: REVERB_PORT,
  forceTLS: REVERB_SCHEME === "https",
  disableStats: true,
  enabledTransports: ["ws", "wss"],
  cluster: PUSHER_CLUSTER,
};

// Initialize Pusher for Laravel Reverb
const pusher = new Pusher(PUSHER_APP_KEY, options);

// Subscribe to channels and events
const channel = pusher.subscribe("orders");
channel.bind("OrderUpdated", (data: any) => {
  console.log("Order updated:", data);
});
channel.bind("OrderCreated", (data: any) => {
  console.log("Order created:", data);
});

export default pusher;
