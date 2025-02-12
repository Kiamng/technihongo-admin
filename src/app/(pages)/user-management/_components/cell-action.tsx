import { Button } from "@/components/ui/button";
import { User } from "@/types/user";
import Link from "next/link";

interface CellActionProps {
  data: User;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  return (
    <>
      <Link href={data.id}>
        <Button> View</Button>
      </Link>
    </>
  );
};
