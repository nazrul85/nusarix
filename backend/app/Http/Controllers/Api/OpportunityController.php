<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Opportunity;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class OpportunityController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $opportunities = Opportunity::with(['customer', 'assignedTo'])
            ->when($request->search, fn($q) => $q->where('title', 'like', "%{$request->search}%"))
            ->when($request->status, fn($q) => $q->where('status', $request->status))
            ->latest()
            ->paginate($request->per_page ?? 15);

        return response()->json(['success' => true, 'data' => $opportunities]);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'customer_id' => 'nullable|exists:customers,id',
            'assigned_to' => 'nullable|exists:users,id',
            'stage' => 'nullable|in:prospecting,qualification,proposal,negotiation,closed_won,closed_lost',
            'status' => 'nullable|in:open,won,lost',
            'value' => 'nullable|numeric|min:0',
            'expected_close_date' => 'nullable|date',
            'probability' => 'nullable|integer|min:0|max:100',
            'notes' => 'nullable|string',
        ]);

        $opportunity = Opportunity::create($data);

        return response()->json(['success' => true, 'message' => 'Opportunity created.', 'data' => $opportunity->load(['customer', 'assignedTo'])], 201);
    }

    public function show(Opportunity $opportunity): JsonResponse
    {
        return response()->json(['success' => true, 'data' => $opportunity->load(['customer', 'assignedTo', 'activities'])]);
    }

    public function update(Request $request, Opportunity $opportunity): JsonResponse
    {
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'customer_id' => 'nullable|exists:customers,id',
            'assigned_to' => 'nullable|exists:users,id',
            'stage' => 'nullable|in:prospecting,qualification,proposal,negotiation,closed_won,closed_lost',
            'status' => 'nullable|in:open,won,lost',
            'value' => 'nullable|numeric|min:0',
            'expected_close_date' => 'nullable|date',
            'probability' => 'nullable|integer|min:0|max:100',
            'notes' => 'nullable|string',
        ]);

        $opportunity->update($data);

        return response()->json(['success' => true, 'message' => 'Opportunity updated.', 'data' => $opportunity->load(['customer', 'assignedTo'])]);
    }

    public function destroy(Opportunity $opportunity): JsonResponse
    {
        $opportunity->delete();

        return response()->json(['success' => true, 'message' => 'Opportunity deleted.']);
    }
}
