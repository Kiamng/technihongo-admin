import Papa from 'papaparse';

interface Question {
  quizQuestionId: number | null;
  questionId: number | null;
  questionText: string;
  explanation: string;
  url: string;
  initialIndex: number | null;
  questionType: 'Single_choice' | 'Multiple_choice';
  options: Option[];
}

interface Option {
  optionText: string;
  isCorrect: boolean;
}

interface CSVRow {
  'Question Text': string;
  'Answer 1': string;
  'Answer 2': string;
  'Answer 3': string;
  'Answer 4': string;
  'Correct Answer(s)': string;
}

export const handleFileUpload = (file: File): Promise<Question[]> => {
  return new Promise((resolve) => {
    Papa.parse(file, {
      complete: (result) => {
        const questions: Question[] = (result.data as CSVRow[]).map((row) => {
          const questionText = row['Question Text'];
          const answers = [
            row['Answer 1'],
            row['Answer 2'],
            row['Answer 3'],
            row['Answer 4'],
          ];

          const correctAnswers = row['Correct Answer(s)']
            .split(',')
            .map((answer: string) => parseInt(answer.trim(), 10));

          const options = answers.map((answer, index) => ({
            optionText: answer,
            isCorrect: correctAnswers.includes(index + 1),
          }));

          const questionType = correctAnswers.length > 1 ? 'Multiple_choice' : 'Single_choice';

          return {
            quizQuestionId: null,
            questionId: null,
            questionText,
            explanation: '',
            url: '',
            initialIndex: null,
            questionType,
            options,
          };
        });

        resolve(questions);
      },
      header: true,
      skipEmptyLines: true,
    });
  });
};
