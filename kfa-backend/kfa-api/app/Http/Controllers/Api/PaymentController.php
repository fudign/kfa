<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class PaymentController extends Controller
{
    /**
     * Display a listing of all payments (admin only).
     */
    public function index()
    {
        $payments = Payment::with(['user', 'application'])
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return response()->json($payments);
    }

    /**
     * Get current user's payments.
     */
    public function my(Request $request)
    {
        $user = $request->user();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized',
            ], 401);
        }

        $payments = Payment::with('application')
            ->where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $payments,
        ]);
    }

    /**
     * Store a newly created payment.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'application_id' => 'required|exists:membership_applications,id',
            'amount' => 'required|integer|min:1',
            'payment_type' => 'required|string|in:membership_fee,subscription,donation,other',
        ]);

        $user = $request->user();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized',
            ], 401);
        }

        try {
            $payment = Payment::create([
                'user_id' => $user->id,
                'application_id' => $validated['application_id'],
                'amount' => $validated['amount'],
                'payment_type' => $validated['payment_type'],
                'status' => 'pending',
            ]);

            // TODO: Integrate with payment gateway (Stripe, PayPal, etc.)
            // TODO: Send payment confirmation email

            return response()->json([
                'success' => true,
                'message' => 'Payment created successfully',
                'data' => $payment,
            ], 201);

        } catch (\Exception $e) {
            \Log::error('Payment creation failed', [
                'error' => $e->getMessage(),
                'user_id' => $user->id,
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to create payment',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }

    /**
     * Display the specified payment.
     */
    public function show(Request $request, string $id)
    {
        $payment = Payment::with(['user', 'application'])->findOrFail($id);

        $user = $request->user();

        // Allow only owner or admin to view payment
        if (!$user || ($payment->user_id !== $user->id && !$user->hasRole('admin'))) {
            return response()->json([
                'success' => false,
                'message' => 'Forbidden',
            ], 403);
        }

        return response()->json([
            'success' => true,
            'data' => $payment,
        ]);
    }

    /**
     * Confirm a payment (admin only).
     */
    public function confirm(string $id)
    {
        $payment = Payment::findOrFail($id);

        if ($payment->status !== 'pending') {
            return response()->json([
                'success' => false,
                'message' => 'Only pending payments can be confirmed',
            ], 400);
        }

        $payment->update(['status' => 'completed']);

        // TODO: Send confirmation email to user
        // TODO: Activate membership or subscription

        return response()->json([
            'success' => true,
            'message' => 'Payment confirmed successfully',
            'data' => $payment,
        ]);
    }

    /**
     * Mark payment as failed (admin only).
     */
    public function fail(Request $request, string $id)
    {
        $payment = Payment::findOrFail($id);

        if ($payment->status !== 'pending') {
            return response()->json([
                'success' => false,
                'message' => 'Only pending payments can be marked as failed',
            ], 400);
        }

        $validated = $request->validate([
            'reason' => 'nullable|string|max:500',
        ]);

        $payment->update([
            'status' => 'failed',
            'failure_reason' => $validated['reason'] ?? null,
        ]);

        // TODO: Send failure notification to user

        return response()->json([
            'success' => true,
            'message' => 'Payment marked as failed',
            'data' => $payment,
        ]);
    }

    /**
     * Refund a payment (admin only).
     */
    public function refund(Request $request, string $id)
    {
        $payment = Payment::findOrFail($id);

        if ($payment->status !== 'completed') {
            return response()->json([
                'success' => false,
                'message' => 'Only completed payments can be refunded',
            ], 400);
        }

        $validated = $request->validate([
            'reason' => 'required|string|max:500',
        ]);

        $payment->update([
            'status' => 'refunded',
            'refund_reason' => $validated['reason'],
        ]);

        // TODO: Process refund with payment gateway
        // TODO: Send refund confirmation email

        return response()->json([
            'success' => true,
            'message' => 'Payment refunded successfully',
            'data' => $payment,
        ]);
    }

    /**
     * Delete a payment (admin only).
     */
    public function destroy(string $id)
    {
        $payment = Payment::findOrFail($id);

        // Only allow deletion of failed or pending payments
        if (!in_array($payment->status, ['failed', 'pending'])) {
            return response()->json([
                'success' => false,
                'message' => 'Only failed or pending payments can be deleted',
            ], 400);
        }

        $payment->delete();

        return response()->json([
            'success' => true,
            'message' => 'Payment deleted successfully',
        ]);
    }
}
