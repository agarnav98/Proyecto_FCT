<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Candidacy extends Model
{
    // Table name
    protected $table = 'candidacies';

    // 1 Candidacy belongs to 1 Company
    public function company(){
        return $this->belongsTo(Company::class);
    }

    // 1 Candidacy belongs to 1 User
    public function user(){
        return $this->belongsTo(User::class);
    }
}
