import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { OpenAI } from 'openai';
import { ChatHistory } from '../models/chat-history.interface';
import { PromptService } from './prompt.service';
import { UPIService } from './upi.service';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  constructor(private upiService: UPIService, private promptService: PromptService) { }

  async sendMessage(userMessage: string, previousMessages: ChatHistory[]): Promise<Observable<any>> {
    
    try {
      let messagesRequestData: any[] = this.getMessageRequestData(userMessage, previousMessages);

      // Initialize OpenAI
      const openai = new OpenAI({ apiKey: "FAKE KEY", dangerouslyAllowBrowser: true }); //Replace with actual API Key.  Cannot put it on Github.

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

        if (content.includes("EndpointType") && JSON.parse(content).EndpointType === "Event") {
          this.upiService.createNewEvent(content);
        } else if (content.includes("EndpointType") && JSON.parse(content).EndpointType === "Function") {
          this.upiService.createNewFunction(content);
        }
      }
      // converts the string to an Observable
      return of(content);
    }
    catch (e) {
      console.error('get wrecked nerd:', e);
      throw e;
    }
  }

  getMessageRequestData(userMessage: string, previousMessages: ChatHistory[]): any[] {
    let initializationPrompt: string = this.promptService.getInitializationPrompt();

    let messagesRequestData: any[] =
      [
        { role: 'system', content: initializationPrompt },
        ...previousMessages.map(history => ({ role: 'user', content: history.sender })),
        ...previousMessages.map(history => ({ role: 'assistant', content: history.response })),
        { role: 'user', content: userMessage }
      ];

    return messagesRequestData;
  }
}
