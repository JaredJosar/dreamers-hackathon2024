import { Component } from '@angular/core';
import { ChatService } from './services/chat.service';
import { UPIService } from './services/upi.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  userInput: string = '';
  response: string = '';
  chatHistory: string[] = [];

  constructor(private chatService: ChatService, private upiService: UPIService) { }

  onInputChange() {
    // You can add any processing logic here based on the user input
    // For simplicity, this example just echoes the input
    //this.response = 'You entered: ' + this.userInput;
  }

  async sendMessageToChatGPT() {
    // method to send user message to ChatGPT
    if (this.userInput) {
      (await this.chatService.sendMessage(this.userInput, this.chatHistory)).subscribe(response => {
        // The Open AI response is in the choices array
        this.response = response;
        // Add the response to the history
        this.chatHistory.push(response);
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

  signIn() {
    // If sign in is required we can add it here.
    console.log("signin is not yet implemented...")
  }
}
