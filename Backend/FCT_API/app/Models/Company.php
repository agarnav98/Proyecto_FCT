<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Company extends Model
{
    // Table name
    protected $table = 'companies';

    // 1 Company has N Headquarters
    public function headquarters(){
        return $this->hasMany(Headquarter::class);
    }

    // 1 Company has N Candidacies
    public function candidacies(){
        return $this->hasMany(Candidacy::class);
    }
    
    // The attributes that are mass assignable.
    protected $fillable = [
        'name',
        'cif',
        'email'
    ];
}
