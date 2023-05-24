<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('email')->unique();
            $table->string('password');
            $table->string('name', 35);
            $table->string('last_name', 35);
            $table->string('dni', 9)->unique();
            $table->string('mobile', 15)->unique();
            $table->string('address')->nullable();
            $table->string('town', 35)->nullable();
            $table->date('birth')->nullable();
            $table->text('preferences')->nullable();
            $table->string('cv')->nullable();
            $table->foreignId('role_id');
            $table->timestamp('email_verified_at')->nullable();
            $table->rememberToken();
            $table->timestamps();
            // Relations
            $table->foreign('role_id')->references('id')->on('roles');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('users');
    }
};
