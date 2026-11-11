<?php

namespace App\Data;

use App\Enums\Permission;
use App\Enums\Role;
use Spatie\LaravelData\Data;

class UserInputData extends Data
{
    /**
     * @param  list<Permission>  $permissions
     */
    public function __construct(
        public string $name,
        public string $email,
        public Role $role,
        public bool $is_active,
        public array $permissions,
    ) {}

    /**
     * @return array{name: string, email: string, role: Role, is_active: bool}
     */
    public function attributes(): array
    {
        return [
            'name' => $this->name,
            'email' => $this->email,
            'role' => $this->role,
            'is_active' => $this->is_active,
        ];
    }
}
