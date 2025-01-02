import { createClient, SupabaseClient } from '@supabase/supabase-js';
import Response from '../models/responseModel'; 
import { getQuestionsByCategory, getCorrectAnswerByQuestionId } from '../repositories/questionsRepository';
import { supabase } from '@/utils/supabaseClient';
// const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
// const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
// const supabase: SupabaseClient = createClient(supabaseUrl, supabaseKey);


class ResponseService {
   static _instance: ResponseService;

 constructor() {}

  static getInstance(): ResponseService {
    if (!ResponseService._instance) {
      ResponseService._instance = new ResponseService();
    }
    return ResponseService._instance;
  }

  // Fetch responses from the database
  async fetchResponses(): Promise<Array<{ question_id: number; correct_attempts: number }>> {
    const { data, error } = await supabase
      .from('responses')
      .select('question_id, correct_attempts');

    if (error) {
      throw new Error(`Error fetching responses: ${error.message}`);
    }

    return data || [];
  }

  // Calculate correct answer percentages per question
  async calculateCorrectAnswerPercentages(): Promise<Record<number, number>> {
    const responses = await this.fetchResponses();

    const groupedResponses: Record<number, number[]> = {};
    for (const response of responses) {
      const { question_id, correct_attempts } = response;
      groupedResponses[question_id] = groupedResponses[question_id] || [];
      groupedResponses[question_id].push(correct_attempts > 0 ? 1 : 0);
    }

    const percentages: Record<number, number> = {};
    for (const questionId in groupedResponses) {
      const attempts = groupedResponses[questionId];
      const totalAttempts = attempts.length;
      const correctAttempts = attempts.filter((attempt) => attempt === 1).length;
      percentages[+questionId] = totalAttempts > 0 ? (correctAttempts / totalAttempts) * 100 : 0;
    }

    return percentages;
  }

  // Insert a response record into the database
  async insertResponse(userId: string, questionId: number, userAnswer: string): Promise<void> {
    const correctAnswer = await getCorrectAnswerByQuestionId(questionId);
    const totalAttempts = userAnswer ? 1 : 0;
    const correctAttempts = userAnswer === correctAnswer ? 1 : 0;

    const { error } = await supabase.from('responses').insert({
      user_id: userId,
      question_id: questionId,
      total_attempts: totalAttempts,
      correct_attempts: correctAttempts,
    });

    if (error) {
      throw new Error(`Error inserting response: ${error.message}`);
    }
  }

  // Insert response data into DB using a model
  async insertResponseIntoDbWithEasyFunc(response: Response): Promise<void> {
    const { error } = await supabase.from('responses').insert(response.toMap());

    if (error) {
      throw new Error(`Error inserting response: ${error.message}`);
    }
  }

  // Insert or update a response record in the database
  async insertOrUpdateResponse(userId: string, questionId: number, userAnswer: string): Promise<void> {
    const correctAnswer = await getCorrectAnswerByQuestionId(questionId);
    const totalAttempts = userAnswer ? 1 : 0;
    const correctAttempts = userAnswer === correctAnswer ? 1 : 0;

    try {
        const { data, error } = await supabase
        .from('responses')
        .select('*')
        .eq('user_id', userId)
        .eq('question_id', questionId);

      if (data!.length > 0) {
        const { data, error } = await supabase
        .from('responses')
        .select('*')
        .eq('user_id', userId)
        .eq('question_id', questionId)
        .single();
        if (error ) {
            //|| error.code !== 'PGRST116'
            throw error;
          }
          if (data!==null) {
            // Update existing response
            const { error: updateError } = await supabase
              .from('responses')
              .update({
                total_attempts: data.total_attempts + totalAttempts,
                correct_attempts: data.correct_attempts + correctAttempts,
              })
              .eq('user_id', userId)
              .eq('question_id', questionId);
            if (updateError) {
              throw new Error(`Error updating response: ${updateError.message}`);
            }
          }
      }
      else {
        // Insert a new response
        const { error: insertError } = await supabase.from('responses').insert({
          user_id: userId,
          question_id: questionId,
          total_attempts: totalAttempts,
          correct_attempts: correctAttempts,
        });

        if (insertError) {
          throw new Error(`Error inserting response: ${insertError.message}`);
        }
      }
    } catch (e) {
      console.error(`Error in insertOrUpdateResponse: ${e}`);
    }
  }
}

export default ResponseService;
