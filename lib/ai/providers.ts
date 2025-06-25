import {
  customProvider,
  extractReasoningMiddleware,
  wrapLanguageModel,
} from 'ai';
import { xai } from '@ai-sdk/xai';
import { isTestEnvironment } from '../constants';
import {
  artifactModel,
  chatModel,
  reasoningModel,
  titleModel,
} from './models.test';

import { createOpenAICompatible } from '@ai-sdk/openai-compatible';
import { createOpenAI } from '@ai-sdk/openai';

const openai = createOpenAICompatible({
  apiKey: "test",
  baseURL: "https://text.pollinations.ai/openai",
  name: 'openai',
});

const searchgpt = createOpenAI({
  apiKey: "test",
  baseURL: "https://text.pollinations.ai/openai",
  name: 'azure-openai',
});

export const myProvider = isTestEnvironment
  ? customProvider({
      languageModels: {
        'chat-model': chatModel,
        'chat-model-reasoning': reasoningModel,
        'title-model': titleModel,
        'artifact-model': artifactModel,
      },
    })
  : customProvider({
      languageModels: {
        'chat-model': openai('openai'),
        'search-model': searchgpt('searchgpt'),
        'chat-model-reasoning': wrapLanguageModel({
          model: openai('deepseek-reasoning'),
          middleware: extractReasoningMiddleware({ tagName: 'think' }),
        }),
        'title-model': openai('openai'),
        'artifact-model': openai('openai'),
      },
      imageModels: {
        'small-model': xai.image('grok-2-image'),
      },
    });
