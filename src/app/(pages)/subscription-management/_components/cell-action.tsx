import { Button } from "@/components/ui/button";
import { SubscriptionPlan } from "@/types/subscription";
import Link from "next/link";

interface CellActionProps {
  data: SubscriptionPlan;
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
