import { ColumnDef } from "@tanstack/react-table";
import { SubscriptionPlan } from "@/types/subscription";
import { CellAction } from "./cell-action";

interface ColumnProps {
  fetchSubscriptions: () => void;
}

export const SubscriptionPlanColumns = ({ fetchSubscriptions }: ColumnProps): ColumnDef<SubscriptionPlan>[] => [
  {
    accessorKey: "name",
    header: "Tên gói",
  },
  {
    accessorKey: "price",
    header: "Giá",
    cell: ({ row }) => {
      return row.original.price.toLocaleString();
    },
  },
  {
    accessorKey: "durationDays",
    header: "Thời hạn",
  },
  {
    accessorKey: "active",
    header: "Trạng thái",
    cell: ({ row }) => {
      return row.original.active ? (
        <div className="px-4 py-2 bg-[#56D071] w-fit text-[#56D071] rounded-xl bg-opacity-10">Đang hoạt động</div>
      ) : (
        <div className="px-4 py-2 bg-[#FD5673] w-fit text-[#FD5673] rounded-xl bg-opacity-10">Không hoạt động</div>
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
