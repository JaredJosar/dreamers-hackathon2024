import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { OpenAI } from 'openai';
import { PromptService } from './prompt.service';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private apiUrl = 'https://api.openai.com/v1/chat/completions';

  constructor(private http: HttpClient, private promptService: PromptService) { }

  async sendMessage(userMessage: string, previousMessages: string[]): Promise<Observable<any>> {
    
    try {
      let messagesRequestData: any[] = this.getMessageRequestData(userMessage, previousMessages);

      // Initialize OpenAI
      const openai = new OpenAI({ apiKey: "Replace with actual API Key.  Cannot put it on Github.", dangerouslyAllowBrowser: true });

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
    let initializationPrompt: string = this.promptService.getInitializationPrompt();

    let messagesRequestData: any[] =
      [
        { role: 'system', content: initializationPrompt },
        ...previousMessages.map((msg, index) => ({ role: index % 2 === 0 ? 'user' : 'assistant', content: msg })),
        { role: 'user', content: userMessage }
      ];

    return messagesRequestData;
  }

}
