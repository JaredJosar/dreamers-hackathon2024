import { Component } from '@angular/core';
import { ChatService } from './services/chat.service';
import { UPIService } from './services/upi.service';
import { ChatHistory } from './models/chat-history.interface';
import { SharedService } from './services/shared.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  userInput: string = '';
  response: string = '';

  constructor(private chatService: ChatService, private upiService: UPIService, public sharedService: SharedService) { }

  async sendMessageToChatGPT() {
    let chatResponse: ChatHistory = {
        sender: '',
        response: ''
    };
    // method to send user message to ChatGPT
    if (this.userInput) {
      (await this.chatService.sendMessage(this.userInput, this.sharedService.chatHistory)).subscribe(response => {
        // The Open AI response is in the choices array
        chatResponse.sender = this.userInput;
        chatResponse.response = response;
        // Add the response to the history
        this.sharedService.chatHistory.push(chatResponse);
        // Clear user input after sending
        this.userInput = '';
      });
    }
  }

  addExampleText() {
    this.userInput = "Can you create an Event for a comic convention that starts today and ends a week from today. Use all other default values.";
  }
}
