"use client";
import { Button } from "@/components/ui/button";
import { StudentViolation } from "@/types/violation";

interface CellActionProps {
  data: StudentViolation;
  tab: "flashcardSet" | "rating";
}

export function CellAction({ data, tab }: CellActionProps) {
  const handleView = () => {
    if (tab === "flashcardSet") {
      console.log("Viewing flashcard set:", data.student_set_id);
      // Xử lý điều hướng hoặc hiển thị modal
    } else {
      console.log("Viewing rating:", data.rating_id);
      // Xử lý điều hướng hoặc hiển thị modal
    }
  };

  return (
    <Button className="bg-black text-white" variant="outline" onClick={handleView}>
      View
    </Button>
  );
}
