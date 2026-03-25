<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Lead;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class LeadController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $leads = Lead::with(['customer', 'assignedTo'])
            ->when($request->search, fn($q) => $q->where('title', 'like', "%{$request->search}%"))
            ->when($request->status, fn($q) => $q->where('status', $request->status))
            ->latest()
            ->paginate($request->per_page ?? 15);

        return response()->json(['success' => true, 'data' => $leads]);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'customer_id' => 'nullable|exists:customers,id',
            'assigned_to' => 'nullable|exists:users,id',
            'source' => 'nullable|string|max:100',
            'status' => 'nullable|in:new,contacted,qualified,unqualified,converted',
            'value' => 'nullable|numeric|min:0',
            'notes' => 'nullable|string',
        ]);

        $lead = Lead::create($data);

        return response()->json(['success' => true, 'message' => 'Lead created.', 'data' => $lead->load(['customer', 'assignedTo'])], 201);
    }

    public function show(Lead $lead): JsonResponse
    {
        return response()->json(['success' => true, 'data' => $lead->load(['customer', 'assignedTo', 'activities'])]);
    }

    public function update(Request $request, Lead $lead): JsonResponse
    {
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'customer_id' => 'nullable|exists:customers,id',
            'assigned_to' => 'nullable|exists:users,id',
            'source' => 'nullable|string|max:100',
            'status' => 'nullable|in:new,contacted,qualified,unqualified,converted',
            'value' => 'nullable|numeric|min:0',
            'notes' => 'nullable|string',
        ]);

        $lead->update($data);

        return response()->json(['success' => true, 'message' => 'Lead updated.', 'data' => $lead->load(['customer', 'assignedTo'])]);
    }

    public function destroy(Lead $lead): JsonResponse
    {
        $lead->delete();

        return response()->json(['success' => true, 'message' => 'Lead deleted.']);
    }
}
