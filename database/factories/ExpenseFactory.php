<?php

namespace Database\Factories;

use App\Models\Expense;
use Illuminate\Database\Eloquent\Factories\Factory;

class ExpenseFactory extends Factory
{
    protected $model = Expense::class;

    public function definition(): array
    {
        return [
            'description' => $this->faker->sentence(),
            'exp_date' => $this->faker->date(),
            'exp_type' => $this->faker->randomElement(['Operational', 'Maintenance', 'Salaries', 'Utilities']),
            'exp_amount' => $this->faker->randomFloat(2, 10, 1000),
        ];
    }
}
