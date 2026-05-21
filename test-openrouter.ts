import { OpenRouter } from '@openrouter/sdk';
import dotenv from 'dotenv';
dotenv.config();

const client = new OpenRouter({
  apiKey: process.env.open_router_key as string,
});

async function main() {
  try {
    const completion = await client.chat.send({
      chatRequest: {
        model: 'deepseek/deepseek-v4-flash:free',
        messages: [
          {
            role: 'user',
            content: 'hello',
          },
        ],
      }
    });
    console.log(completion);
  } catch (error) {
    console.error('Error details:', error);
  }
}

main();
