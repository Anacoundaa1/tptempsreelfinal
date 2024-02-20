import { Injectable } from '@nestjs/common';
import { OpenAI } from 'openai';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class QuizzService {
  private openai: OpenAI;
  private apiKey: string = process.env.OPENAI_API_KEY || '';

  constructor() {
    if (!this.apiKey) {
      throw new Error(
        "La clé API OpenAI n'est pas spécifiée dans le fichier .env",
      );
    }

    this.openai = new OpenAI({ key: this.apiKey } as any);
  }

  async getQuestions(
    selectedDifficulty,
    selectedQuestionCount,
    selectedQuizzTitle,
  ): Promise<any[]> {
    const generatedQuestions = await Promise.all([
      this.generateQuestion(
        selectedDifficulty,
        selectedQuestionCount,
        selectedQuizzTitle,
      ),
    ]);
    return generatedQuestions;
  }

  private async generateQuestion(
    selectedDifficulty,
    selectedQuestionCount,
    selectedQuizzTitle,
  ): Promise<any> {
    // Utilisez la bibliothèque OpenAI pour générer une question et sa réponse
    const prompt = `Donne moi un objet JSON VALIDE d\'une listes de ${selectedQuestionCount} questions, sur le thème "${selectedQuizzTitle}", avec une difficulté "${selectedDifficulty}" et avec pour chaque question, sa bonne réponse et trois mauvaise réponses en suivant STRICTEMENT ce format : {"questions":[{"question1":{"question": "contenuQuestion","bonne_reponse":"contenuBonneReponse","mauvaises_reponses": ["mauvaiseReponse1", "mauvaiseReponse2","mauvaiseReponse3"]}},{"question2":{"question": "contenuQuestion","bonne_reponse":"contenuBonneReponse","mauvaises_reponses": ["mauvaiseReponse1", "mauvaiseReponse2", "mauvaiseReponse3"]}}]}`;
    const response = await this.openai.chat.completions.create({
      model: 'gpt-3.5-turbo-1106',
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      max_tokens: 4096,
      // stop: ['\n'],
      temperature: 0.5,
      response_format: { type: 'json_object' },
    });

    // Extrait les informations de la réponse de l'API
    const withoutLineBreaks = response.choices[0].message.content.replace(
      /[\n]/gm,
      '',
    );
    const apiResponse = JSON.parse(withoutLineBreaks);
    const questions = apiResponse.questions;

    return questions;
  }
}
