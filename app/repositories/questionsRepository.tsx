// import { supabase } from '@/utils/supabaseClient';
// import { createClient } from '@supabase/supabase-js';



// export const getQuestionsByCategory = async (category: string): Promise<Question[]> => {
//   const { data, error } = await supabase
//     .from('questions')
//     .select('*')
//     .eq('topic_name', category);
//   console.log("Selected category is:",category);
//   console.log("Data is:",data);
//   if (error) {
//     throw new Error(`Failed to fetch questions: ${error.message}`);
//   }

//   return data as Question[]; // Ensure data is cast to the correct Question[] type
// };


import { supabase } from '@/utils/supabaseClient';
import { createClient } from '@supabase/supabase-js';

export const getQuestionsByCategory = async (category: string): Promise<Question[]> => {
  const { data, error } = await supabase
    .from('questions')
    .select('*')
    .eq('topic_name', category);

  console.log("Selected category is:", category);
  console.log("Data is:", data);

  if (error) {
    throw new Error(`Failed to fetch questions: ${error.message}`);
  }

  return data as Question[]; // Ensure data is cast to the correct Question[] type
};

export const getCorrectAnswerByQuestionId = async (questionId: number): Promise<string> => {
  const { data, error } = await supabase
    .from('questions')
    .select('answer')
    .eq('id', questionId)
    .single();

  if (error) {
    console.error(`Error fetching correct answer: ${error.message}`);
    return 'No Answer';
  }

  return data?.answer || 'No Answer';
};
