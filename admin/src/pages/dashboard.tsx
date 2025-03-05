import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import dayjs, { Dayjs } from 'dayjs';
import ordersData from '../data/orders.json';

// Define the type for an Order
interface Order {
    timestamp: string;
    fees: {
      grandTotal: number;
    };
    status: string; // Add status field to the Order type
  }

export default function Dashboard() {
  const now: Dayjs = dayjs();
  const today = now.format('DD/MM/YYYY');

  // Utility function to get the month and year from a timestamp
  const getMonthYear = (timestamp: string) => {
    const date = dayjs(timestamp);
    return date.format('YYYY-MM'); // Format: "2025-02"
  };

  // Calculate the total grandTotal and customers count for the last 5 months
  const getMonthlyData = (orders: Order[]) => {
    const lastFiveMonths: {
      Earnings: number;
      name: string;
      Customers: number;
    }[] = [];
  
    // Get the last 5 months' data
    for (let i = 0; i < 5; i++) {
      const month = now.subtract(i, 'month').format('YYYY-MM');
      lastFiveMonths.push({ name: dayjs(month).format('MMM'), Earnings: 0, Customers: 0 });
    }
  
    // Group the completed orders by month and calculate the totals
    orders.forEach((order) => {
      if (order.status === 'completed') { // Only consider completed orders
        const monthYear = getMonthYear(order.timestamp);
        const index = lastFiveMonths.findIndex((item) => item.name === dayjs(monthYear).format('MMM'));
  
        if (index !== -1) {
          lastFiveMonths[index].Earnings += order.fees.grandTotal;
          lastFiveMonths[index].Customers += 1;
        }
      }
    });
  
    return lastFiveMonths;
  };
  


    // Function to get orders for today and calculate the total grandTotal
    const getTotalForToday = (orders: Order[]) => {
        const todayStart = now.startOf('day');
        const todayEnd = now.endOf('day');
      
        const todayOrders = orders.filter((order) => {
          const orderDate = dayjs(order.timestamp);
          // Filter orders for today and ensure status is 'completed'
          return orderDate.isBetween(todayStart, todayEnd, null, '[]') && order.status === 'completed';
        });
      
        // Sum up the grandTotal for today's completed orders
        const totalToday = todayOrders.reduce((sum, order) => sum + order.fees.grandTotal, 0);
        return totalToday;
      };
      
    // Function to get count of orders by status (e.g., "pending" or "completed")
    const getOrderStatusCountForToday = (orders: Order[], status: string) => {
        const todayStart = now.startOf('day'); // Start of the day (00:00:00)
        const todayEnd = now.endOf('day'); // End of the day (23:59:59)
    
        const todayOrders = orders.filter((order) => {
          const orderDate = dayjs(order.timestamp);
          return orderDate.isBetween(todayStart, todayEnd, null, '[]'); // Filter orders for today
        });
    
        return todayOrders.filter((order) => order.status === status).length; // Count by status
      };
  // Type the orders data as an array of Order objects
  const orders: Order[] = ordersData;

  const data = getMonthlyData(orders);

  const totalToday = getTotalForToday(orders);

  // Get the count of pending and completed orders
  const pendingOrders = getOrderStatusCountForToday(orders, 'pending');
  const completedOrders = getOrderStatusCountForToday(orders, 'completed');


  // Format the grandTotal with ₱ symbol
  const formatCurrency = (value: number) => {
    return `₱${value.toFixed(2)}`; // Fix to 2 decimal places and prepend ₱ symbol
  };

  return (
    <div>
      <div className="p-4">
        <p className="text-3xl" style={{ fontFamily: "Madimi One" }}>Welcome Back User!</p>
        <p className="text-sm text-gray-500">Here's what's happening with the store today.</p>
      </div>

      <div className="flex flex-row">
        <div className="flex w-full p-4 flex-col h-full text-center">
          <p style={{ fontFamily: "Madimi One" }}>Today's Overview - {today}</p>
          <div className="border-2 rounded-sm border-gray-700 w-full">
            <div className="flex w-full p-2 border-b-2 border-gray-700 justify-center" style={{ backgroundColor: "#FB7F3B" }}>
              <p className="text-white text-lg" style={{ fontFamily: "Madimi One" }}>TOTAL EARNINGS</p>
            </div>
            <div className="flex w-full p-3 justify-center">
              <p className="text-sm">{formatCurrency(totalToday)}</p> 
            </div>
          </div>

          <div className="flex border-2 rounded-sm border-gray-700 w-full mt-3">
            <div className="flex w-full flex-col">
              <div className="flex w-full p-2 border-b-2 border-gray-700 justify-center" style={{ backgroundColor: "#FB7F3B" }}>
                <p className="text-white text-lg" style={{ fontFamily: "Madimi One" }}>PENDING ORDERS</p>
              </div>
              <div className="flex w-full p-3 justify-center">
                <p className="text-sm">{pendingOrders}</p>
              </div>
            </div>
            <div className="flex w-full flex-col border-l-2 border-gray-700">
              <div className="flex w-full p-2 border-b-2 border-gray-700 justify-center" style={{ backgroundColor: "#FB7F3B" }}>
                <p className="text-white text-lg" style={{ fontFamily: "Madimi One" }}>COMPLETED ORDERS</p>
              </div>
              <div className="flex w-full p-3 justify-center">
                <p className="text-sm">{completedOrders}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col w-full p-2 text-center border-l border-gray-400">
          <p style={{ fontFamily: "Madimi One" }}>Profit and Customer Count Over the Last 5 Months.</p>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip
                formatter={(value: number, name: string) => {
                  // Apply ₱ symbol only to grandTotal (skip the 'customers' key)
                  if (name === 'Earnings' && typeof value === 'number') {
                    return formatCurrency(value);
                  }
                  return value; // Leave customers count as is
                }}
              />
              <Legend />
              <Bar dataKey="Customers" fill="#343434" />
              <Bar dataKey="Earnings" fill="#FB7F3B" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
