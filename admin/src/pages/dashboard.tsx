import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import dayjs, { Dayjs } from 'dayjs';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { useGetOrdersQuery, Order} from '../features/api/orderApi';
import { useEffect, useMemo, useState } from 'react';
import { setLoading } from '../features/loadingSlice';


export default function Dashboard() {
  const now: Dayjs = dayjs();
  const today = now.format('DD-MM-YYYY');
  const admin = useSelector((state: RootState) => state.auth.admin);
  const dispatch = useDispatch();
  const { data: ordersData, isLoading: ordersLoading } = useGetOrdersQuery();
  const [orders, setOrders] = useState<Order[]>([]);



  // Get month and year
  const getMonthYear = (timestamp: string) => dayjs(timestamp).format('YYYY-MM');

  // Get last 5 months' earnings & customer data
  const getMonthlyData = (orders: Order[]) => {
    const lastFiveMonths: Record<string, { name: string; Earnings: number; Customers: number }> = {};

    for (let i = 0; i < 5; i++) {
      const monthKey = now.subtract(i, 'month').format('YYYY-MM');
      lastFiveMonths[monthKey] = { name: dayjs(monthKey).format('MMM'), Earnings: 0, Customers: 0 };
    }

    orders.forEach((order) => {
      if (order.status === 'completed') {
        const monthYear = getMonthYear(order.timestamp);
        if (lastFiveMonths[monthYear]) {
          lastFiveMonths[monthYear].Earnings += order.fees.grandTotal;
          lastFiveMonths[monthYear].Customers += 1;
        }
      }
    });

    return Object.values(lastFiveMonths);
  };

  // Get total earnings for today
  const getTotalForToday = (orders: Order[]) => {
    const todayStart = now.startOf('day');
    const todayEnd = now.endOf('day');

    return orders
      .filter(order => dayjs(order.timestamp).isBetween(todayStart, todayEnd, null, '[]') && order.status === 'completed')
      .reduce((sum, order) => sum + order.fees.grandTotal, 0);
  };

  // Get count of orders by status (e.g., "pending" or "completed")
  const getOrderStatusCountForToday = (orders: Order[], status: string) => {
    const todayStart = now.startOf('day');
    const todayEnd = now.endOf('day');

    return orders.filter(order =>
      dayjs(order.timestamp).isBetween(todayStart, todayEnd, null, '[]') && order.status === status
    ).length;
  };

  useEffect(() => {
    if (ordersData) {
      setOrders(ordersData as Order[]);
    }
  }, [ordersData]);

  // Memoized values to prevent unnecessary recalculations
  const data = useMemo(() => getMonthlyData(orders), [orders]);
  const totalToday = useMemo(() => getTotalForToday(orders), [orders]);
  const pendingOrders = useMemo(() => getOrderStatusCountForToday(orders, 'pending'), [orders]);
  const completedOrders = useMemo(() => getOrderStatusCountForToday(orders, 'completed'), [orders]);

  // Format the grandTotal with ₱ symbol
  const formatCurrency = (value: number) => `₱${value.toFixed(2)}`;

  useEffect(() => {
    dispatch(setLoading(ordersLoading));
  }, [ordersLoading]);
  
  return (
    <div>
      <div className="p-4">
        <p className="text-3xl" style={{ fontFamily: "Madimi One" }}>Welcome Back <p className='text-lg'>{admin?.name}!</p></p>
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
