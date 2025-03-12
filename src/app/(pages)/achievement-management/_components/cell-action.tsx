import { Button } from "@/components/ui/button";
import { Achievement } from "@/types/achievement";
import Link from "next/link";

interface CellActionProps {
  data: Achievement;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  return (
    <>
      <Link href={`/achievement-management/${data.achievementId}`}>
        <Button> View</Button>
      </Link>
    </>
  );
};
