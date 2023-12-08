// const OpenAI = require("openai");

// const openai = new OpenAI();

// async function main() {
//   console.log("Starting the script");
//   try {
//     const completion = await openai.chat.completions.create({
//       messages: [{ role: "system", content: "You are a helpful assistant." }],
//       model: "gpt-3.5-turbo",
//     });

//     console.log("API Response:", completion.choices[0]);
//   } catch (error) {
//     console.error("Error:", error);
//   }
//   console.log("End of the script");
// }

// main();

import * as dotenv from 'dotenv';
import { OpenAI } from "openai";
dotenv.config();
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})


  const assistant = await openai.beta.assistants.retrieve('asst_x1kPyTy2StLakuZt5vy3yZlR');
  console.log(assistant);


// fetchData();

const thread = await openai.beta.threads.create();

const message = await openai.beta.threads.messages.create(thread.id, {
  role: 'user',
  content: 'I want to start a cupcake business'
});

const run = await openai.beta.threads.runs.create(thread.id, {
  assistant_id: assistant.id,
  instructions: "address the user as Sir William Copperbottom"
});

const run = await openai.beta.threads.runs.retrieve()

console.log(run);