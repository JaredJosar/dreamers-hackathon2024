import { Injectable } from '@angular/core';
import { ChatHistory } from '../models/chat-history.interface';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  public chatHistory: ChatHistory[];

  constructor() {
    this.chatHistory = [];
  }
}
