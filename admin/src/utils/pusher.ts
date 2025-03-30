import Pusher, { Options } from "pusher-js";

const PUSHER_APP_KEY = import.meta.env.VITE_PUSHER_APP_KEY as string;
const PUSHER_CLUSTER = import.meta.env.VITE_PUSHER_CLUSTER as string; // Required for TypeScript

const REVERB_HOST = import.meta.env.VITE_REVERB_HOST as string;
const REVERB_PORT = Number(import.meta.env.VITE_REVERB_PORT);

// Define Pusher options
const options: Options = {
  cluster: PUSHER_CLUSTER, // Required to avoid TypeScript error
  wsHost: REVERB_HOST, // Localhost WebSocket Server
  wsPort: REVERB_PORT, // Laravel Reverb WebSocket Port
  forceTLS: false, // No TLS for localhost
  disableStats: true, // Disable Pusher stats
  enabledTransports: ["ws"], // Use WebSockets only
};

// Initialize Pusher with cluster & Reverb settings
const pusher = new Pusher(PUSHER_APP_KEY, options);

// Subscribe to the "orders" channel
const channel = pusher.subscribe("orders");

// Listen for the "OrderUpdated" event
channel.bind("OrderUpdated", (data: any) => {
  console.log("Order updated:", data);
});
channel.bind("OrderCreated", (data: any) => {
  console.log("Order updated:", data);
});

export default pusher;
