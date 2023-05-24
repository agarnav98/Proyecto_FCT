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
  public static function validatorDNI(string $dni): bool
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
  * Method that validates CIF
  *
  * @param {string} $cif
  * @return {bool}
  */
  public static function validatorCIF(string $cif): bool
  {
    $cif = strtoupper($cif);
    $cifCodes = ["J", "A", "B", "C", "D", "E", "F", "G", "H", "I"];  
      
    // Check that the last seven digits are a number 
    if (!ctype_digit(substr($cif,1,7)))
    {
      return false;
    }

    // Sum odd numbers
    $cifSum = $cif[2] + $cif[4] + $cif[6];
    // Multiply even numbers
    for ($i = 1; $i<8; $i += 2) {
      $evenNumbers = (string) (2 * $cif[$i]);
      $evenNumbers = $evenNumbers[0] + ((strlen($evenNumbers) == 2) ? $evenNumbers[1] : 0);
      // Gets CIF sum
      $cifSum += $evenNumbers;
    }

    // Gets CIF control digit
    $cifControl = (10 - substr ($cifSum, -1)) % 10;

    if (preg_match ('/^[ABCDEFGHJNPQRSUVW]{1}/', $cif)) {
      if (in_array ($cif[0], array ('A', 'B', 'E', 'H'))) {
        // Numeric CIF
        return ($cif[8] == $cifControl);
      } elseif (in_array ($cif[0], array ('K', 'P', 'Q', 'S'))) {
        // Letters CIF
        return ($cif[8] == $cifCodes[$cifControl]);
      } else {
        // Alphanumeric CIF
        if (is_numeric ($cif[8])) {
          return ($cif[8] == $cifControl);
        } else {
          return ($cif[8] == $cifCodes[$cifControl]);
        }
      }
    }
    return false;
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
  public static function validatorPassword(string $password): bool
  {
    $status = false;
    // Password regex
    if (preg_match_all('$\S*(?=\S{8,16})(?=\S*[a-z])(?=\S*[A-Z])(?=\S*[\d])(?=\S*[\W])\S*$', $password))
    {
      $status = true;
    }
    return $status;
  }

 /**
  * Method that validates Mobile Number
  *
  * @param {string} $mobile
  * @return {bool}
  */
  public static function validatorMobile(string $mobile): bool
  {
    $status = false;
    // Password regex
    if (preg_match_all('/^(\+\d{1,3}[- ]?)?\d{9,10}$/', $mobile))
    {
      $status = true;
    }
    return $status;
  }  
}
