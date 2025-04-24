"use client";
import { Button } from "@/components/ui/button";
import { StudentViolation } from "@/types/student-violation";

interface CellActionProps {
  data: StudentViolation;
  tab: "flashcardSet" | "rating";
}

export function CellAction({ data, tab }: CellActionProps) {
  const handleView = () => {
    if (tab === "flashcardSet") {
      console.log("Viewing flashcard set:", data.studentFlashcardSet?.studentSetId);
      // Xử lý điều hướng hoặc hiển thị modal
    } else {
      console.log("Viewing rating:", data.studentCourseRating?.ratingId);
      // Xử lý điều hướng hoặc hiển thị modal
    }
  };

  return (
    <Button variant="outline" onClick={handleView}>
      View
    </Button>
  );
}
