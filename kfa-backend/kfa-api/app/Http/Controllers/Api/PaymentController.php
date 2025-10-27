<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePaymentRequest;
use App\Http\Resources\PaymentResource;
use App\Models\Payment;

class PaymentController extends Controller
{
    /**
     * Display a listing of the user's payments.
     */
    public function index()
    {
        // Return authenticated user's payments
        $payments = Payment::where('user_id', auth()->id())->get();
        return PaymentResource::collection($payments);
    }

    /**
     * Store a newly created payment.
     */
    public function store(StorePaymentRequest $request)
    {
        $data = $request->validated();
        $data['user_id'] = auth()->id();
        $data['status'] = 'pending'; // Set default status

        $payment = Payment::create($data);
        return new PaymentResource($payment);
    }
}
