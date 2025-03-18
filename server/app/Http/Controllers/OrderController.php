<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Branch;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Routing\Controller;
use App\Events\OrderUpdated;
use App\Events\OrderCreated;

class OrderController extends Controller
{
    public function __construct()
    {
        // Apply permission middleware to all actions except 'index' and 'show'
        $this->middleware('permission:view-order', ['only' => ['index', 'show']]);
        $this->middleware('permission:create-order', ['only' => ['create', 'store']]);
        $this->middleware('permission:edit-order', ['only' => ['edit', 'update']]);
        $this->middleware('permission:delete-order', ['only' => ['destroy']]);
    }

    public function index(): JsonResponse
    {
        $orders = Order::with(['user', 'branch'])->get();
        return response()->json($orders);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'costumer' => 'nullable|array',
            'type' => 'required|string',
            'pickUpType' => 'nullable|string',
            'location' => 'nullable|array',
            'branch' => 'required|array',
            'order' => 'required|array',
            'basePrice' => 'required|numeric',
            'timestamp' => 'required|date',
            'dateTimePickUp' => 'nullable|date',
            'status' => 'required|string',
            'discountCardDetails' => 'nullable|array',
            'fees' => 'required|array',
        ]);
    
        // If customer exists, find or create a user
        $user = null;
        if (!empty($validated['costumer']) && !empty($validated['costumer']['email'])) {
            $user = User::firstOrCreate(
                ['email' => $validated['costumer']['email']],
                [
                    'name' => $validated['costumer']['name'],
                    'phone' => $validated['costumer']['phone'],
                    'address' => $validated['costumer']['address'],
                    'password' => bcrypt('default_password') // Change this for security
                ]
            );
        }
    
        // Get branch
        $branch = Branch::findOrFail($validated['branch'][0]['id']);
    
        // Create order
        $order = Order::create([
            'user_id' => $user?->id,
            'type' => $validated['type'],
            'pick_up_type' => $validated['pickUpType'],
            'location' => $validated['location'],
            'branch_id' => $branch->id,
            'order_items' => $validated['order'],
            'base_price' => $validated['basePrice'],
            'timestamp' => $validated['timestamp'],
            'date_time_pickup' => $validated['dateTimePickUp'],
            'status' => $validated['status'],
            'discount_card_details' => $validated['discountCardDetails'],
            'fees' => $validated['fees'],
        ]);
    
        // **Broadcast Order Created Event**
        broadcast(new OrderCreated($order))->toOthers();
    
        return response()->json(['message' => 'Order created successfully', 'order' => $order], 201);
    }

    public function show($id): JsonResponse
    {
        $order = Order::with(['user', 'branch'])->findOrFail($id);
        return response()->json($order);
    }


    public function update(Request $request, $id): JsonResponse
    {
        $validated = $request->validate([
            'status' => 'nullable|string',
        ]);
    
        $order = Order::findOrFail($id);
        $order->update($validated);
    
        // Broadcast the update
        broadcast(new OrderUpdated($order))->toOthers();
    
        return response()->json(['message' => 'Order updated successfully', 'order' => $order]);
    }

    public function destroy($id): JsonResponse
    {
        $order = Order::findOrFail($id);
        $order->delete();

        return response()->json(['message' => 'Order deleted successfully']);
    }
}
