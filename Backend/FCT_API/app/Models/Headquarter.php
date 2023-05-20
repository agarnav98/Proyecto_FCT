<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Headquarter extends Model
{
    // 1 Headquarter belongs to 1 Company
    public function company(){
        return $this->belongsTo(Company::class);
    }

    // The attributes that are mass assignable.
    protected $fillable = [
        'name',
        'mobile',
        'address',
        'town',
        'company_id'
    ];
}
