export type User = {
  id: string;
  fullname: string;
  email: string;
  joinDate: string;
};

const users: User[] = [
  {
    id: "1",
    fullname: "Nguyễn Văn A",
    email: "nguyenvana@example.com",
    joinDate: "2024-01-15",
  },
  {
    id: "2",
    fullname: "Trần Thị B",
    email: "tranthib@example.com",
    joinDate: "2023-12-10",
  },
  {
    id: "3",
    fullname: "Lê Văn C",
    email: "levanc@example.com",
    joinDate: "2024-02-05",
  },
  {
    id: "4",
    fullname: "Phạm Thị D",
    email: "phamthid@example.com",
    joinDate: "2023-11-20",
  },
  {
    id: "5",
    fullname: "Hoàng Văn E",
    email: "hoangvane@example.com",
    joinDate: "2024-01-30",
  },
];

export default users;
