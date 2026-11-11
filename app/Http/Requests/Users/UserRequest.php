<?php

namespace App\Http\Requests\Users;

use App\Concerns\ProfileValidationRules;
use App\Data\UserInputData;
use App\Enums\Permission;
use App\Enums\Role;
use App\Models\User;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

class UserRequest extends FormRequest
{
    use ProfileValidationRules;

    public function authorize(): bool
    {
        $edited = $this->editedUser();

        return $edited === null
            ? $this->user()?->can('create', User::class) ?? false
            : $this->user()?->can('update', $edited) ?? false;
    }

    /**
     * @return array<string, array<int, ValidationRule|\Illuminate\Contracts\Validation\Rule|Closure|array<mixed>|string>>
     */
    public function rules(): array
    {
        return [
            'name' => $this->nameRules(),
            'email' => $this->emailRules($this->editedUser()),
            'role' => ['required', Rule::enum(Role::class)],
            'is_active' => ['required', 'boolean'],
            'permissions' => ['present', 'array'],
            'permissions.*' => ['distinct', Rule::enum(Permission::class)],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'name' => 'naam',
            'email' => 'e-mailadres',
            'role' => 'rol',
            'is_active' => 'status',
            'permissions' => 'rechten',
            'permissions.*' => 'recht',
        ];
    }

    /**
     * @return array<int, callable(Validator): void>
     */
    public function after(): array
    {
        return [
            function (Validator $validator) {
                $edited = $this->editedUser();

                if ($edited === null || $edited->isNot($this->user())) {
                    return;
                }

                if (! $this->boolean('is_active')) {
                    $validator->errors()->add('is_active', 'Je kunt je eigen account niet op inactief zetten.');
                }

                // Raw values: after() also runs when a value failed the enum rule.
                $permissions = array_unique(array_filter($this->array('permissions'), is_string(...)));
                $current = $edited->getPermissionNames()->all();

                if ($this->input('role') !== $edited->role->value
                    || count($permissions) !== count($current)
                    || array_diff($permissions, $current) !== []) {
                    $validator->errors()->add('permissions', 'Je kunt je eigen rol en rechten niet wijzigen.');
                }
            },
        ];
    }

    public function toData(): UserInputData
    {
        return new UserInputData(
            name: $this->string('name')->toString(),
            email: $this->string('email')->toString(),
            role: Role::from($this->string('role')->toString()),
            is_active: $this->boolean('is_active'),
            permissions: array_values(array_map(
                fn (string $value) => Permission::from($value),
                $this->array('permissions'),
            )),
        );
    }

    protected function prepareForValidation(): void
    {
        $this->merge(['email' => mb_strtolower($this->string('email')->trim()->toString())]);
    }

    private function editedUser(): ?User
    {
        $user = $this->route('user');

        return $user instanceof User ? $user : null;
    }
}
