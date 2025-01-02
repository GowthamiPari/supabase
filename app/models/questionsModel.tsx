type Question = {
    id: number;
    type: string;
    question: string;
    options?: string[]; // Optional array of strings
    answer: string;
  };
  
  // Function to create a Question object from a database row (Map equivalent)
  function questionFromMap(map: { [key: string]: any }): Question {
    return {
      id: map.id as number,
      type: map.type as string,
      question: map.question as string,
      options: map.options ? (map.options as string[]) : undefined,
      answer: map.answer as string,
    };
  }
  
  // Function to convert a Question object to a plain object (for inserting into a database)
  function questionToMap(question: Question): { [key: string]: any } {
    return {
      id: question.id,
      type: question.type,
      question: question.question,
      options: question.options,
      answer: question.answer,
    };
  }
  