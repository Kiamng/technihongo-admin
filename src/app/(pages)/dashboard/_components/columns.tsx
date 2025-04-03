import { ColumnDef } from "@tanstack/react-table";
import { SubscriptionPlan } from "@/types/subscription";
import { CellAction } from "./cell-action";

interface ColumnProps {
  fetchSubscriptions: () => void;
}

export const columns = ({ fetchSubscriptions }: ColumnProps): ColumnDef<SubscriptionPlan>[] => [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => {
      return row.original.price.toLocaleString();
    },
  },
  {
    accessorKey: "durationDays",
    header: "DurationDays",
  },
  {
    accessorKey: "active",
    header: "Active",
    cell: ({ row }) => {
      return row.original.active ? (
        <div className="px-4 py-2 bg-[#56D071] w-fit text-[#56D071] rounded-xl bg-opacity-10">ACTIVE</div>
      ) : (
        <div className="px-4 py-2 bg-[#FD5673] w-fit text-[#FD5673] rounded-xl bg-opacity-10">INACTIVE</div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return <CellAction data={row.original} fetchSubscriptions={fetchSubscriptions} />; // Truyền fetchSubscriptions vào CellAction
    },
  },
];
