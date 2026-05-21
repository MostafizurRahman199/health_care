import { OpenRouter } from '@openrouter/sdk';
import config from '../config';
import ApiError from '../errors/ApiError';

const client = new OpenRouter({
  apiKey: config.open_router_key as string,
});

const sendPrompt = async (
  prompt: string,
  model: string = 'nvidia/nemotron-3-super-120b-a12b:free'
) => {
  try {
    const completion = await client.chat.send({
      chatRequest: {
        model,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      }
    });

    const content = completion.choices[0].message.content;
    if (!content) {
      throw new Error('No response from AI');
    }

    return content;
  } catch (error: any) {
    console.error('Error in openRouterHelper:', error);
    
    // Extract message if the SDK throws a structured error
    let errorMessage = 'Failed to get completion from AI';
    if (error?.error?.message) {
      errorMessage += `: ${error.error.message}`;
    }
    if (error?.error?.metadata?.raw) {
      errorMessage += ` - ${error.error.metadata.raw}`;
    } else if (error instanceof Error) {
      errorMessage += `: ${error.message}`;
    }

    throw ApiError.internal(errorMessage);
  }
};

export const openRouterHelper = {
  sendPrompt,
};
