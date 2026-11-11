<?php

namespace App\Concerns;

use App\Models\User;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Email;

trait ProfileValidationRules
{
    /**
     * Get the validation rules used to validate user profiles.
     *
     * @return array<string, array<int, ValidationRule|\Illuminate\Contracts\Validation\Rule|Closure|array<mixed>|string>>
     */
    protected function profileRules(?User $user = null): array
    {
        return [
            'name' => $this->nameRules(),
            'email' => $this->emailRules($user),
        ];
    }

    /**
     * Get the validation rules used to validate user names.
     *
     * @return array<int, ValidationRule|array<mixed>|string>
     */
    protected function nameRules(): array
    {
        return ['required', 'string', 'max:255'];
    }

    /**
     * Get the validation rules used to validate user emails.
     *
     * @return array<int, ValidationRule|\Illuminate\Contracts\Validation\Rule|Closure|array<mixed>|string>
     */
    protected function emailRules(?User $user = null): array
    {
        return [
            'required',
            'string',
            // Only a new address gets the MX lookup (B167).
            $this->input('email') === $user?->email
                ? (new Email)->rfcCompliant()
                : Email::default(),
            'max:255',
            $user === null
                ? Rule::unique(User::class)->withoutTrashed()
                : Rule::unique(User::class)->withoutTrashed()->ignore($user),
            // The index still holds deleted rows, so the address stays taken.
            function (string $attribute, mixed $value, Closure $fail) use ($user) {
                if ($user !== null && is_string($value) && User::onlyTrashed()->where('email', $value)->exists()) {
                    $fail('Dit adres hoort bij een verwijderde gebruiker. Maak via "Gebruiker toevoegen" een gebruiker op dit adres aan om die terug te zetten.');
                }
            },
        ];
    }
}
