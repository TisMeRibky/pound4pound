<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create a single user like your register method
        User::create([
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => Hash::make('password123'), // hashed password
        ]);

        // Optionally, create multiple users
        $users = [
            ['name' => 'Lij Faeldonea', 'email' => 'lij@gmail.com', 'password' => 'lij123'],
            ['name' => 'KJR Calampinay', 'email' => 'kjr@gmail.com', 'password' => 'kjr123'],
            ['name' => 'Russ Garde', 'email' => 'russgarde03@gmail.com', 'password' => 'russ123'],
        ];

        foreach ($users as $user) {
            User::create([
                'name' => $user['name'],
                'email' => $user['email'],
                'password' => Hash::make($user['password']),
            ]);
        }

        // If you want, you can still use factories for more random users
        // User::factory(10)->create();
    }
}
