import { Button } from "@/components/ui/button";
import { User } from "@/types/user";

interface CellActionProps {
  data: User;
}

export const CellAction: React.FC<CellActionProps> = () => {
  return (
    <>
        <Button> View</Button>
    </>
  );
};
