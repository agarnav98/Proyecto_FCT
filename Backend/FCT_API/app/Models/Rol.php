<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Rol extends Model
{
    // Table name
    protected $table = 'roles';

    // 1 Rol has N Users
    public function users(){
        return $this->hasMany(User::class);
    }
}
