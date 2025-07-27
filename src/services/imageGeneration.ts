import { ImageGenerationRequest, ImageGenerationResponse } from '@/types';

export class ImageGenerationService {
  private static readonly MOCK_IMAGES = [
    'https://picsum.photos/512/512?random=1',
    'https://picsum.photos/512/512?random=2',
    'https://picsum.photos/512/512?random=3',
    'https://picsum.photos/512/512?random=4',
    'https://picsum.photos/512/512?random=5',
    'https://picsum.photos/512/512?random=6',
    'https://picsum.photos/512/512?random=7',
    'https://picsum.photos/512/512?random=8',
    'https://picsum.photos/512/512?random=9',
    'https://picsum.photos/512/512?random=10',
  ];

  static async generateImage(request: ImageGenerationRequest): Promise<ImageGenerationResponse> {
    const useMockApi = process.env.NEXT_PUBLIC_USE_MOCK_API === 'true';

    if (useMockApi) {
      return this.generateMockImage(request);
    }

    try {
      return await this.generateWithHuggingFace(request);
    } catch (error) {
      console.warn('HuggingFace API failed, trying DeepAI:', error);
      try {
        return await this.generateWithDeepAI(request);
      } catch (error) {
        console.warn('DeepAI API failed, trying Replicate', error);
        try {
          return await this.generateWithReplicate(request);
        } catch (error) {
          console.warn('Replicate API failed, using :', error);
          return this.generateMockImage(request);
        }
      }
    }
  }

  private static async generateMockImage(request: ImageGenerationRequest): Promise<ImageGenerationResponse> {
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));

    const randomIndex = Math.floor(Math.random() * this.MOCK_IMAGES.length);
    const imageUrl = `${this.MOCK_IMAGES[randomIndex]}&t=${Date.now()}`;

    return {
      success: true,
      imageUrl,
      creditsRemaining: undefined,
    };
  }

  private static async generateWithHuggingFace(request: ImageGenerationRequest): Promise<ImageGenerationResponse> {
    const apiKey = process.env.NEXT_PUBLIC_HUGGINGFACE_API_KEY;
    const model = process.env.NEXT_PUBLIC_HUGGINGFACE_MODEL || 'stabilityai/stable-diffusion-xl-base-1.0';

    if (!apiKey) {
      throw new Error('HuggingFace API key not configured');
    }

    const response = await fetch(`https://router.huggingface.co/nebius/v1/images/generations${model}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: request.prompt,
        parameters: {
          num_inference_steps: 20,
          guidance_scale: 7.5,
          width: 512,
          height: 512,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`HuggingFace API error: ${response.status}`);
    }

    const blob = await response.blob();
    const imageUrl = URL.createObjectURL(blob);

    return {
      success: true,
      imageUrl,
    };
  }

  private static async generateWithDeepAI(request: ImageGenerationRequest): Promise<ImageGenerationResponse> {
    const apiKey = process.env.NEXT_PUBLIC_DEEPAI_API_KEY;

    if (!apiKey) {
      throw new Error('DeepAI API key not configured');
    }

    const formData = new FormData();
    formData.append('text', request.prompt);

    const response = await fetch('https://api.deepai.org/api/text2img', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': apiKey,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`DeepAI API error: ${response.status}`);
    }

    const data = await response.json();

    if (data.output_url) {
      return {
        success: true,
        imageUrl: data.output_url,
      };
    } else {
      throw new Error('DeepAI API did not return an image URL');
    }
  }

  private static async generateWithReplicate(request: ImageGenerationRequest): Promise<ImageGenerationResponse> {
    const apiKey = process.env.NEXT_PUBLIC_REPLICATE_API_KEY;

    if (!apiKey) {
      throw new Error('Replicate API key not configured');
    }

    const response = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        version: 'd4c3f8b1e2f0c3a5b6d7e8f9a0b1c2d3e4f5g6h7i8j9k0l1m2n3o4p5q6r7s8t9',
        input: {
          prompt: request.prompt,
          num_inference_steps: 20,
          guidance_scale: 7.5,
          width: 512,
          height: 512,
        },
      }),
    });
    if (!response.ok) {
      throw new Error(`Replicate API error: ${response.status}`);
    }
    const data = await response.json();
    if (data.output && data.output.length > 0) {
      return {
        success: true,
        imageUrl: data.output[0],
      };
    }
    throw new Error('Replicate API did not return an image URL');
  }


  static validatePrompt(prompt: string): { isValid: boolean; error?: string } {
    if (!prompt || prompt.trim().length === 0) {
      return { isValid: false, error: 'Prompt não pode estar vazio' };
    }

    if (prompt.length > 500) {
      return { isValid: false, error: 'Prompt muito longo (máximo 500 caracteres)' };
    }

    const inappropriateWords = ['nude', 'naked', 'sex', 'porn', 'violence'];
    const lowerPrompt = prompt.toLowerCase();
    
    for (const word of inappropriateWords) {
      if (lowerPrompt.includes(word)) {
        return { isValid: false, error: 'Prompt contém conteúdo inapropriado' };
      }
    }

    return { isValid: true };
  }

  static async getApiStatus(): Promise<{
    huggingface: boolean;
    deepai: boolean;
    replicate: boolean;
    mock: boolean;
  }> {
    return {
      huggingface: !!process.env.NEXT_PUBLIC_HUGGINGFACE_API_KEY,
      deepai: !!process.env.NEXT_PUBLIC_DEEPAI_API_KEY,
      replicate: !!process.env.NEXT_PUBLIC_REPLICATE_API_KEY,
      mock: process.env.NEXT_PUBLIC_USE_MOCK_API === 'true',
    };
  }
}

