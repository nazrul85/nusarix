<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Activity;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ActivityController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $activities = Activity::with(['user'])
            ->when($request->type, fn($q) => $q->where('type', $request->type))
            ->latest()
            ->paginate($request->per_page ?? 15);

        return response()->json(['success' => true, 'data' => $activities]);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'type' => 'required|in:call,email,meeting,note,task',
            'description' => 'required|string',
            'subject_type' => 'nullable|string',
            'subject_id' => 'nullable|integer',
            'scheduled_at' => 'nullable|date',
        ]);

        $data['user_id'] = $request->user()->id;
        $activity = Activity::create($data);

        return response()->json(['success' => true, 'message' => 'Activity logged.', 'data' => $activity->load('user')], 201);
    }

    public function show(Activity $activity): JsonResponse
    {
        return response()->json(['success' => true, 'data' => $activity->load('user')]);
    }

    public function update(Request $request, Activity $activity): JsonResponse
    {
        $data = $request->validate([
            'type' => 'required|in:call,email,meeting,note,task',
            'description' => 'required|string',
            'scheduled_at' => 'nullable|date',
        ]);

        $activity->update($data);

        return response()->json(['success' => true, 'message' => 'Activity updated.', 'data' => $activity->load('user')]);
    }

    public function destroy(Activity $activity): JsonResponse
    {
        $activity->delete();

        return response()->json(['success' => true, 'message' => 'Activity deleted.']);
    }
}
