import * as dotenv from 'dotenv';
import { OpenAI } from 'openai';

dotenv.config();

async function main() {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY2,
  });

  // Retrieve Assistant
  const assistant = await openai.beta.assistants.retrieve('asst_x1kPyTy2StLakuZt5vy3yZlR');
  console.log('Assistant:', assistant);

  // Create Thread
  const thread = await openai.beta.threads.create();
  console.log('Thread:', thread);

// Add user message to the thread
const userMessage = await openai.beta.threads.messages.create(thread.id, {
  role: 'user', // Make sure 'user' is lowercase here
  content: 'I want to start a cupcake business',
});
console.log('User Message:', userMessage);

  // Create Assistant message in the thread
  const assistantMessage = await openai.beta.threads.messages.create(thread.id, {
    role: 'assistant',
    content: 'Sure, I can help you with that.',
  });
  console.log('Assistant Message:', assistantMessage);

  // Continue the conversation or perform other actions as needed
}

// Call the main function
main();
