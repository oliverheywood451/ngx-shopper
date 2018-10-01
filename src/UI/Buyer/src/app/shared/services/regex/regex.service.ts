import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
// These regular expressions are all used for form validation
export class RegexService {
  constructor() {}

  // used for FirstName, LastName, City
  get HumanName() {
    return "^[a-zA-Z0-9-.'\\s]*$"; // only alphanumic and space . '
  }

  get Email() {
    return '^.+@.+\\..+$'; // contains @ and . with text surrounding
  }

  get Phone() {
    return '^[0-9-]{0,20}$'; // max 20 chars, numbers and -
  }

  get Date() {
    return '\\d\\d-\\d\\d-\\d\\d\\d\\d'; // mm-dd-yyyy, all numbers
  }

  get Zip() {
    return '^[0-9]{5}$'; // US zip - five numbers
  }
}
