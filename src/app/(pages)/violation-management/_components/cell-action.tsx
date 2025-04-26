"use client";
import { Button } from "@/components/ui/button";
import { StudentViolation } from "@/types/student-violation";
import Link from "next/link";

interface CellActionProps {
  data: StudentViolation;
  tab: "flashcardSet" | "rating";
}

export function CellAction({ data, tab }: CellActionProps) {

  return (
    <Link href={tab === "flashcardSet"
      ? `/violation-management/flashcard-set/${data.studentFlashcardSet?.studentSetId}`
      : `/violation-management/rating/${data.studentCourseRating?.ratingId}?courseId=${data.studentCourseRating?.course.courseId}`}>
      <Button variant="outline">
        Xem chi tiết
      </Button>
    </Link>
  );
}
