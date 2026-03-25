<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use App\Models\Lead;
use App\Models\Opportunity;
use App\Models\Task;
use App\Models\Activity;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function stats(Request $request): JsonResponse
    {
        $stats = [
            'total_customers' => Customer::count(),
            'total_leads' => Lead::count(),
            'total_opportunities' => Opportunity::count(),
            'total_tasks' => Task::count(),
            'open_tasks' => Task::where('status', 'open')->count(),
            'total_users' => User::count(),
            'revenue_opportunities' => Opportunity::where('status', 'won')->sum('value'),
            'pipeline_value' => Opportunity::whereIn('stage', ['prospecting', 'qualification', 'proposal', 'negotiation'])->sum('value'),
        ];

        return response()->json([
            'success' => true,
            'data' => $stats,
        ]);
    }

    public function recentActivities(Request $request): JsonResponse
    {
        $activities = Activity::with(['user', 'subject'])
            ->latest()
            ->take(10)
            ->get()
            ->map(function ($activity) {
                return [
                    'id' => $activity->id,
                    'type' => $activity->type,
                    'description' => $activity->description,
                    'user' => $activity->user ? ['id' => $activity->user->id, 'name' => $activity->user->name] : null,
                    'user_name' => $activity->user ? $activity->user->name : 'System',
                    'subject_type' => $activity->subject_type,
                    'subject_id' => $activity->subject_id,
                    'created_at' => $activity->created_at,
                ];
            });

        return response()->json([
            'success' => true,
            'data' => $activities,
        ]);
    }
}
