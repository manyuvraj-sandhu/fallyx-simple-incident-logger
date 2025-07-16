export default class OpenAI {
  chat = {
    completions: {
      create: jest.fn().mockResolvedValue({
        choices: [{ message: { content: 'This is a test summary.' } }],
      }),
    },
  };
}
