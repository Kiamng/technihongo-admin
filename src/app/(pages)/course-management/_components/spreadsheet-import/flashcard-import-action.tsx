import Papa from 'papaparse';

interface Flashcard {
    japaneseDefinition: string,
    vietEngTranslation: string
}

interface CSVRow {
    'Term': string;
    'Definition': string;
}

export const handleFlashcardFileUpload = (file: File): Promise<Flashcard[]> => {
    return new Promise((resolve) => {
        Papa.parse(file, {
            complete: (result) => {
                const flashcards: Flashcard[] = (result.data as CSVRow[]).map((row) => {
                    const japaneseDefinition = row['Term'];
                    const vietEngTranslation = row['Definition'];

                    return {
                        japaneseDefinition,
                        vietEngTranslation
                    };
                });

                resolve(flashcards);
            },
            header: true,
            skipEmptyLines: true,
        });
    });
};
