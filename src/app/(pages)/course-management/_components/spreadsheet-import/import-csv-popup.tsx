import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { FileSpreadsheet } from "lucide-react";

interface ImportType {
    type: "quiz" | "flashcard" | "script"
}
const ImportCSVPopup = ({ type }: ImportType) => {

    const quizCSVLink = process.env.NEXT_PUBLIC_QUIZ_CSV_LINK
    const flashcardCSVLink = process.env.NEXT_PUBLIC_FLASHCARD_CSV_LINK
    const scriptCSVLink = process.env.NEXT_PUBLIC_SCRIPT_CSV_LINK

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">Spreadsheet import <FileSpreadsheet /></Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="text-3xl font-bold text-center">Import From Spreadsheet</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col space-y-4 text-xl text-center p-4">
                    <div>1. <a
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline"
                        href={`${type === 'flashcard' ? flashcardCSVLink : type === 'quiz' ? quizCSVLink : scriptCSVLink}/edit?usp=sharing/copy`}>Copy</a>
                        or
                        <a
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 underline"
                            href={`${type === 'flashcard' ? flashcardCSVLink : type === 'quiz' ? quizCSVLink : scriptCSVLink}/export?format=xlsx`}>Download</a>
                        our template.</div>
                    <div>2. Fill it out and export as CSV UTF-8</div>
                    <div>3. Upload Below</div>
                    <Button
                        type="button"
                        onClick={() => {
                            const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
                            fileInput?.click();
                        }}
                        className=""
                    >
                        Upload
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default ImportCSVPopup
