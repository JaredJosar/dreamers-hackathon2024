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

  constructor(private chatService: ChatService, private upiService: UPIService) { }

  onInputChange() {
    // You can add any processing logic here based on the user input
    // For simplicity, this example just echoes the input
    this.response = 'You entered: ' + this.userInput;
  }

  sendMessageToChatGPT() {
    // New method to send user message to ChatGPT
    this.chatService.sendMessage(this.userInput).subscribe(response => {
      this.response = response.choices[0].message.content;
    });
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
