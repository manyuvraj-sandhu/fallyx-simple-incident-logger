export class OpenAIApi {
    createChatCompletion = jest.fn().mockResolvedValue({
      data: {
        choices: [{ message: { content: 'This is a test summary.' } }],
      },
    });
  }
  
  export class Configuration {
    constructor(_: any) {}
  }
  