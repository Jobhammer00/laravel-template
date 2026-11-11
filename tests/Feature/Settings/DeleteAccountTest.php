<?php

use App\Models\User;

test('nobody can delete their own account from the profile, not even an admin', function () {
    foreach ([User::factory()->create(), User::factory()->admin()->create()] as $user) {
        $this->actingAs($user)->delete('/settings/profile', ['password' => 'password'])->assertMethodNotAllowed();

        $this->assertNotSoftDeleted($user);
    }
});
