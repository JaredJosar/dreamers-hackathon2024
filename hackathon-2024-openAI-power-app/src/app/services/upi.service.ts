import { Injectable } from '@angular/core';

import KJUR from 'jsrsasign';
import { SpinnerService } from './spinner.service';

@Injectable({
  providedIn: 'root'
})
export class UPIService {
  private apiUrlBase = "https://192.168.33.45/ebms/api/v1/"; // Events/10/41782"; 
  private secret = "ce0509ef-c474-4e1a-aa0c-6844bd65aaca";
  private userId = "DREAMUSER"
  private key = "4e17e22e-863b-4c2e-9a21-f636ca3be9cf";

  constructor(private spinnerService: SpinnerService) { }

  generateUPIToken(): string {
    const claimSet =
    {
      "iss": this.userId,
      "key": this.key,
      "exp": (KJUR.KJUR.jws.IntDate.get("now") + 60).toString(),
      "iat": KJUR.KJUR.jws.IntDate.get("now").toString()
    }
    const header = { alg: 'HS256', typ: 'JWT' };
    const token = KJUR.KJUR.jws.JWS.sign(null, header, claimSet, this.secret);
    return token;
  }

  // could potentially have 3 separate generic API functions for GET/PUT/POST
  // I dont think the method below will easily handle POST without making it muddy

  makeApiCall(apiCall: string, methodCall: string): void {
    const token = this.generateUPIToken();
    this.spinnerService.show();

    fetch(this.apiUrlBase + apiCall, {
      method: methodCall,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(data => {
        console.log('API Response:', data);
        this.spinnerService.hide();
        return data;
      })
      .catch(error => {
        console.error('API Error:', error);
        this.spinnerService.hide();
      });
  }

  // We could potentially make methods for each endpoint... etc Functions and Services Orders

  // The methods in those controllers would look similar to below

  addNewFunction(data: any): void {

    // get JSON data
    // take values from it
    // potentially have models that we can assign values to
    // put those 

    this.makeApiCall("Functions", "POST");
  }
}
