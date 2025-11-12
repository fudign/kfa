<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('membership_applications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('cascade');
            $table->enum('membership_type', ['individual', 'corporate']);
            $table->enum('status', ['pending', 'approved', 'rejected'])->default('pending');
            $table->string('first_name');
            $table->string('last_name');
            $table->string('organization_name')->nullable();
            $table->string('position');
            $table->string('email')->unique();
            $table->string('phone', 50);
            $table->text('experience');
            $table->text('motivation');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('membership_applications');
    }
};
