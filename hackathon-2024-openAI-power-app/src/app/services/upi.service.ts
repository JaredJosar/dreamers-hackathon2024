import { Injectable } from '@angular/core';
import KJUR from 'jsrsasign';
import { SpinnerService } from './spinner.service';
import { SharedService } from './shared.service';
import { ChatHistory } from '../models/chat-history.interface';

@Injectable({
  providedIn: 'root'
})
export class UPIService {
  private apiUrlBase = "https://192.168.33.45/ebms/api/v1/"; // Events/10/41782"; 
  private secret = "ce0509ef-c474-4e1a-aa0c-6844bd65aaca";
  private userId = "DREAMUSER"
  private key = "4e17e22e-863b-4c2e-9a21-f636ca3be9cf";

  constructor(private spinnerService: SpinnerService, public sharedService: SharedService) { }

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

  makeApiCall(apiCall: string, methodCall: string, data: string): void {
    const token = this.generateUPIToken();
    this.spinnerService.show();

    fetch(this.apiUrlBase + apiCall, {
      method: methodCall,      
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: data
    })
      .then(response => response.json())
      .then(data => {
        console.log('API Response:', data);
        this.spinnerService.hide();
        this.sendResponseToChatHistory(data);
        return data;
      })
      .catch(error => {
        console.error('API Error:', error);
        this.spinnerService.hide();
        return error;
      });
  }

  createNewEvent(data: any): void {
    this.makeApiCall("Events", "POST", data);
  }

  createNewFunction(data: any): void {
    this.makeApiCall("Functions", "POST", data);
  }


  sendResponseToChatHistory(data: any) {
    let chatResponse: ChatHistory = {
      sender: '',
      response: ''
    };

    if (data.ErrorList) {
      chatResponse.sender = "ERROR!"
      chatResponse.response = "There was an issue with creating the data you requested.";
    } else {
      chatResponse.sender = "SUCCESS!"
      chatResponse.response = "You have successfully created data with the API. Here is the data below so you can find it in v30: " + "\n\r" + JSON.stringify(data);

      chatResponse.response = chatResponse.response.substring(0, 200);
    }

    this.sharedService.chatHistory.push(chatResponse);
  }
}
