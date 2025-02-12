import { DataTable } from "@/components/data-table";
import users from "@/types/user";
import { columns } from "./_components/columns";

export default function UserManagmentPage() {
  const UserList = users;
  const isLoading = false;
  return (
    <div>
      <DataTable
        isLoading={isLoading}
        searchKey="fullname"
        columns={columns}
        data={UserList}
      />
    </div>
  );
}
