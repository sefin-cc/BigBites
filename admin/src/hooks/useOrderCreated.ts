import { useEffect } from "react";
import { toast } from "react-toastify";
import { Slide } from "react-toastify";
import pusher from "../utils/pusher"; 

const useOrderCreated = (refetch: () => void) => {
  useEffect(() => {
    // Subscribe to the "orders" channel
    const channel = pusher.subscribe("orders");

    // Handler function for the event
    const handleOrderCreated = (newOrder: any) => {
      toast.success(`🎉 New Order #${newOrder.order.id} has been placed!`, {
        position: "top-right",
        autoClose: 5000,
        theme: "light",
        transition: Slide,
      });

      // Refetch orders to update the UI
      refetch();
    };

    // Bind the event listener
    channel.bind("OrderCreated", handleOrderCreated);

    // Cleanup function to unsubscribe when the component unmounts
    return () => {
      channel.unbind("OrderCreated", handleOrderCreated); // Unbind specific event
      pusher.unsubscribe("orders");
    };
  }, [refetch]); // Depend on `refetch`

  return null; // This is a hook, no need to return JSX
};

export default useOrderCreated;
