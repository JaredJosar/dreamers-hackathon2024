import { Component } from '@angular/core';
import { ChatService } from './services/chat.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  userInput: string = '';
  response: string = '';

  constructor(private chatService: ChatService) { }

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
}
