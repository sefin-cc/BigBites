<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Branch;
use App\Models\Client;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Routing\Controller;
use App\Events\OrderUpdated;
use App\Events\OrderCreated;
use Illuminate\Support\Facades\DB;

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
            'user_id' => 'required', 
            'type' => 'required|string',
            'pick_up_type' => 'nullable|string',
            'location' => 'nullable|array',
            'branch_id' => 'required|exists:branches,id', 
            'order_items' => 'required|array',
            'base_price' => 'required|numeric',
            'timestamp' => 'required|date',
            'date_time_pickup' => 'nullable|date',
            'status' => 'required|string',
            'discount_card_details' => 'nullable|array',
            'fees' => 'required|array',
            'reference_number' => 'required'
        ]);

    
        $branch = Branch::find($validated['branch_id']);
        if (!$branch) {
            return response()->json(['message' => 'Branch not found'], 404);
        }
    
    
        // Create the order
        $order = Order::create([
            'user_id' => $validated['user_id'],
            'type' => $validated['type'],
            'pick_up_type' => $validated['pick_up_type'],
            'location' => $validated['location'],
            'branch_id' => $branch->id,
            'order_items' =>$validated['order_items'], // Ensure order_items is in JSON format
            'base_price' => $validated['base_price'],
            'timestamp' => $validated['timestamp'],
            'date_time_pickup' => $validated['date_time_pickup'],
            'status' => $validated['status'],
            'discount_card_details' => $validated['discount_card_details'],
            'fees' => $validated['fees'],
            'reference_number' => $validated['reference_number']
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
