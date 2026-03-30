<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('walk_ins', function (Blueprint $table) {
            $table->id();
            // Nullable: filled when an existing member walks in
            $table->foreignId('member_id')->nullable()->constrained()->nullOnDelete();
            // Filled when a non-member (guest) walks in
            $table->string('guest_name')->nullable();
            $table->boolean('has_membership')->default(false);
            $table->decimal('amount', 8, 2);
            $table->date('date');
            $table->string('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('walk_ins');
    }
};
