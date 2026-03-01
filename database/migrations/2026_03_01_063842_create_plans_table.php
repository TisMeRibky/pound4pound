<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('plans', function (Blueprint $table) {
            $table->id('plan_id');

            $table->unsignedBigInteger('program_id');

            $table->string('name');
            $table->integer('duration_days');
            $table->decimal('price', 10, 2);

            $table->boolean('is_promo')->default(false);
            $table->date('promo_start_date')->nullable();
            $table->date('promo_end_date')->nullable();

            $table->integer('max_slots')->nullable();
            $table->boolean('is_active')->default(true);

            $table->timestamps();

            $table->foreign('program_id')
                ->references('program_id')
                ->on('programs')
                ->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('plans');
    }
};
