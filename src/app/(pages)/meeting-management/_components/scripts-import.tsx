import Papa from 'papaparse';

interface Script {
    question: string,
    answer: string
}

interface CSVRow {
    'Câu hỏi': string;
    'Phản hồi': string;
}

export const handleScriptFileUpload = (file: File): Promise<Script[]> => {
    return new Promise((resolve) => {
        Papa.parse(file, {
            complete: (result) => {
                const scripts: Script[] = (result.data as CSVRow[]).map((row) => {
                    const question = row['Câu hỏi'];
                    const answer = row['Phản hồi'];

                    return {
                        question,
                        answer
                    };
                });

                resolve(scripts);
            },
            header: true,
            skipEmptyLines: true,
        });
    });
};
