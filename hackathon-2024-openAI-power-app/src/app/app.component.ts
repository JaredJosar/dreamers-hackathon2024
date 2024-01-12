import { Component } from '@angular/core';
import { ChatService } from './services/chat.service';
import { UPIService } from './services/upi.service';
import { ChatHistory } from './models/chat-history.interface';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  userInput: string = '';
  response: string = '';
  chatHistory: ChatHistory[] = [];

  constructor(private chatService: ChatService, private upiService: UPIService) { }

  async sendMessageToChatGPT() {
    let chatResponse: ChatHistory = {
        sender: '',
        response: ''
    };
    // method to send user message to ChatGPT
    if (this.userInput) {
      (await this.chatService.sendMessage(this.userInput, this.chatHistory)).subscribe(response => {
        // The Open AI response is in the choices array
        chatResponse.sender = this.userInput;
        chatResponse.response = response;
        // Add the response to the history
        this.chatHistory.push(chatResponse);
        // Clear user input after sending
        this.userInput = '';
      });
    }
  }

  handleExampleTextAdd(buttonName: string) {

    if (buttonName === "AddFunction") {
      this.userInput = "Some Example Text for add function";
    } else if (buttonName === "AddServiceOrder") {
      this.userInput = "Some Example Text for add service order";
    }    
  }

  addExampleText() {
    this.userInput = "Test 123";
  }
}
