import { Injectable } from '@angular/core';

import KJUR from 'jsrsasign';

@Injectable({
  providedIn: 'root'
})
export class UPIService {
  private apiUrl = "https://192.168.33.45/ebms/api/v1/Events/10/41782"; 
  private secret = "ce0509ef-c474-4e1a-aa0c-6844bd65aaca";
  private userId = "DREAMUSER"
  private key = "4e17e22e-863b-4c2e-9a21-f636ca3be9cf";

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

  makeApiCall(): void {
    const token = this.generateUPIToken();

    fetch(this.apiUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(data => {
        console.log('API Response:', data);
      })
      .catch(error => {
        console.error('API Error:', error);
      });
  }
}
