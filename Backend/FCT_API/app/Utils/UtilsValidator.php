<?php

namespace App\Utils;

class UtilsValidator
{

 /**
  * Method that validates DNI
  *
  * @param {string} $dni
  * @return {bool}
  */
  static function validatorDNI(string $dni): bool
  {
    $letters = ["T", "R", "W", "A", "G", "M", "Y", "F", "P", "D", "X", "B", "N", "J", "Z", "S", "Q", "V", "H", "L" ,"C" ,"K" , "E"];
    $status = false;
    // Check if DNI has 9 digits
    if (strlen($dni) == 9)
    {
      // Get DNI letter and number
      $dniLetter = substr($dni,8);
      $dniNumber = substr($dni,0,8);  
      
      // Check that the last seven digits are a number 
      if (is_numeric(substr($dniNumber,1)))
      {
        // Replace the letters X,Y Z by their corresponding number
        $dniNumber = str_replace("X", 0, $dniNumber);
        $dniNumber = str_replace("Y", 1, $dniNumber);
        $dniNumber = str_replace("Z", 2, $dniNumber);

        // Get the position in the letters array by dividing by 23
        $position = $dniNumber % 23;

        // If the letter obtained from the array matches the letter that the DNI has received, it is correct
        if ($letters[$position] == strtoupper($dniLetter))
        {
            $status = true;
        }
      }
    }
    return $status;
  }

 /**
  * Method that validates Password
  *
  * From 8 to 16 characters and must contain:
  * At least one digit.
  * At least one lowercase letter.
  * At least one uppercase letter.
  * At least a special character.
  * @param {string} $password
  * @return {bool}
  */
  static function validatorPassword(string $password): bool
  {
    $status = false;
    // Password regex
    if (preg_match_all('$\S*(?=\S{8,16})(?=\S*[a-z])(?=\S*[A-Z])(?=\S*[\d])(?=\S*[\W])\S*$', $password))
    {
      $status = true;
    }
    return $status;
  }
}
