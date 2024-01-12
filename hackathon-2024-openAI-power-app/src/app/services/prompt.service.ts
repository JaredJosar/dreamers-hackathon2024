import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class PromptService {
  public getInitializationPrompt() {
    return this.getIntroPrompt() + this.getEventPrompt() + this.getFunctionPrompt() + this.getOutputPrompt();
  }

  private getIntroPrompt() {
    return "The user will describe events and functions.  You will help them create JSON data to represent an Event or Function once you have enough information.  ";
  }

  private getEventPrompt() {
    return "An event represents a real-world event at a venue.  " + 
      "An event's JSON will have the following keys: ID, Description, Organization, Account, StartDate, EndDate, Status.  " +
      "ID will be the primary key.  For new events, the ID will start at - 1 and decrement by 1 for each new event.  Example -1, -2, -3, etc.  " +
      "Organization is a string with two characters.  If the user doesn't mention an Org or Organization or Org Code with two characters, default the value to 10.  " +
      "Description is a string that describes the event.  StartDate is a DateTime that represents the date the event starts." +
      "EndDate is a DateTime that represents the date the event ends.  " +
      "Account is a string with 8 characters that represents the company or person holding the event.  If no Account or AccountCode is mentioned, default the value to OPENAI.  " +
      "Status is a two character string that will be set to 26." +
      "Add a field for EndpointType set to Event";
  }

  private getFunctionPrompt() {
    return "Functions are similar to events, but like they are like smaller events within the event.  " +
      "They will have the keys ID, Description, EventID, StartDate, EndDate, StatusCode." +
      "EventID will be required. You must ask the user for the EventID associated with the function. " +
      "Description is a string that describes the function.  StartDate is a datetime that represents the date the function starts.  " +
      "EndDate is a datetime that represents the date the function ends." +
      "StatusCode is that status of the function.  It is a string with two characters.  Default its value to AI if a two-character status is not mentioned.  " +
      "Add a field for EndpointType set to Function";
  }

  private getOutputPrompt() {
    return "The user will describe an event and you will output JSON data that represents the event and functions to create." +
           "If you do not have enough information to create JSON data for an event or function, chat with the user as an assistant instead of outputting JSON.";
  }
}
