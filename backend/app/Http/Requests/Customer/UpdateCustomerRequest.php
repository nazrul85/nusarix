<?php

namespace App\Http\Requests\Customer;

use Illuminate\Foundation\Http\FormRequest;

class UpdateCustomerRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $customerId = $this->route('customer')?->id;

        return [
            'first_name' => 'required|string|max:100',
            'last_name' => 'required|string|max:100',
            'email' => "nullable|email|unique:customers,email,{$customerId}",
            'phone' => 'nullable|string|max:50',
            'company_id' => 'nullable|exists:companies,id',
            'job_title' => 'nullable|string|max:150',
            'address' => 'nullable|string',
            'city' => 'nullable|string|max:100',
            'country' => 'nullable|string|max:100',
            'status' => 'nullable|in:active,inactive,prospect',
            'notes' => 'nullable|string',
        ];
    }
}
