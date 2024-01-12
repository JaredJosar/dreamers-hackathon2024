import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { OpenAI } from 'openai';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private apiUrl = 'https://api.openai.com/v1/chat/completions'; 

  constructor(private http: HttpClient) { }

  async sendMessage(userMessage: string, previousMessages: string[]): Promise<Observable<any>> {
    
    try {
      let messagesRequestData: any[] = this.getMessageRequestData(userMessage, previousMessages);

      // Initialize OpenAI
      const openai = new OpenAI({ apiKey: "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", dangerouslyAllowBrowser: true });

      // Send the message to OpenAI and await a response
      const chatCompletion = await openai.chat.completions.create({
        messages: messagesRequestData,
        model: "gpt-3.5-turbo",
      });

      // Process the response
      let content = chatCompletion.choices[0]?.message?.content?.trim() ?? '';
      if (content && content.includes('{') && content.includes('}')) {
        // probably an overly simplistic way to extract JSON from the output, but I only have 2 days so YOLO #speed
        content = content.substring(content.indexOf("{"), content.lastIndexOf("}") + 1);
      }
      // converts the string to an Observable
      return of(content);
    }
    catch (e) {
      console.error('get wrecked nerd:', e);
      throw e;
    }
  }

  getMessageRequestData(userMessage: string, previousMessages: string[]): any[] {
    let initializationPrompt: string = this.getInitializationPrompt();

    let messagesRequestData: any[] =
      [
        { role: 'system', content: initializationPrompt },
        ...previousMessages.map((msg, index) => ({ role: index % 2 === 0 ? 'user' : 'assistant', content: msg })),
        { role: 'user', content: userMessage }
      ];

    return messagesRequestData;
  }

  getInitializationPrompt() {
    return this.getIntroPrompt() + this.getEventPrompt() + this.getFunctionPrompt() + this.getOutputPrompt();
  }

  getIntroPrompt() {
    return "The user will describe events and functions.   You will output your responses in JSON format that can be sent to another API.  " +
           "An event represents a real - world event at a venue.  A function is a session within that event.Events can have multiple functions.";
  }

  getEventPrompt() {
    return "An event's JSON will have the following keys: ID, EventDescription, EventStartDate, EventStartTime, EventEndDate, EventEndTime." + 
            "ID will be the primary key.For new events, the ID will be - 1.  " +
            "EventDescription describes the event.EventStartDate is the date the event starts.EventStartTime is the time of day the event starts." +
            "EventEndDate is the date the event ends.EventEndTime is the time of day the event ends.";
  }

  getFunctionPrompt() {
    return "Functions are similar to events, but like they are like smaller events within the event.  " +
           "They will have the keys ID, FunctionDescription, FunctionStartDate, FunctionStartTime, FunctionEndDate, FunctionEndTime.";
  }

  getOutputPrompt() {
    return "The user will describe an event and you will output JSON data that represents the event and functions to create.";
  }
}
