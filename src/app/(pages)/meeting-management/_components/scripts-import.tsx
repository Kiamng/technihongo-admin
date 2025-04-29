import Papa from 'papaparse';

interface Script {
    question: string,
    questionExplain: string,
    answer: string,
    answerExplain: string
}

interface CSVRow {
    'Câu hỏi': string;
    'Bản dịch câu hỏi': string;
    'Phản hồi': string;
    'Bản dịch phản hồi': string;
}

export const handleScriptFileUpload = (file: File): Promise<Script[]> => {
    return new Promise((resolve) => {
        Papa.parse(file, {
            complete: (result) => {
                const scripts: Script[] = (result.data as CSVRow[]).map((row) => {
                    const question = row['Câu hỏi'];
                    const questionExplain = row['Bản dịch câu hỏi'];
                    const answer = row['Phản hồi'];
                    const answerExplain = row['Bản dịch phản hồi'];

                    return {
                        question,
                        questionExplain,
                        answer,
                        answerExplain
                    };
                });

                resolve(scripts);
            },
            header: true,
            skipEmptyLines: true,
        });
    });
};
