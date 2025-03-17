import { Button } from "@/components/ui/button";
import { User } from "@/types/user";
import { useRouter } from "next/navigation";

interface CellActionProps {
  data: User;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const router = useRouter();

  const handleViewUser = () => {
    router.push(`/user-management/${data.userId}`);
  };
  

  return (
    <Button onClick={handleViewUser} variant="outline">
      View
    </Button>
  );
};
