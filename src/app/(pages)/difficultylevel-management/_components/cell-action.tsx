import { Button } from "@/components/ui/button";
import { DifficultyLevel } from "@/types/difficulty-level";
import { useRouter } from "next/navigation";

interface CellActionProps {
  data: DifficultyLevel;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const router = useRouter();

  const handleViewDifficultyLevel = () => {
    router.push(`/difficultylevel-management/${data.tag}`);
  };

  return (
    <Button onClick={handleViewDifficultyLevel} variant="outline">
      View
    </Button>
  );
};