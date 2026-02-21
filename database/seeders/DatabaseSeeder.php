<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Member;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        User::create([
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => Hash::make('password123'), 
        ]);

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

        Member::factory()->count(10)->create();
    }
}
