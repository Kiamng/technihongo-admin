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
    type: "quiz" | "flashcard"
}
const ImportCSVPopup = ({ type }: ImportType) => {

    const quizCSVLink = "https://docs.google.com/spreadsheets/d/19T8CRZZ3AdcpxgZDUE3TosFsFiCGV82T8JcZ5StlhCc"
    const flashcardCSVLink = "https://docs.google.com/spreadsheets/d/1QZZcp9f4Gnqp1ZKLhEW60IJ53NKSAZgcvQJadsMLDNA"

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
                    <div>1. <a target="_blank" rel="noopener noreferrer" className="text-blue-600 underline" href={`${type === 'flashcard' ? flashcardCSVLink : quizCSVLink}/edit?usp=sharing/copy`}>Copy</a> or <a target="_blank" rel="noopener noreferrer" className="text-blue-600 underline" href={`${type === 'flashcard' ? flashcardCSVLink : quizCSVLink}/export?format=xlsx`}>Download</a> our template.</div>
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
