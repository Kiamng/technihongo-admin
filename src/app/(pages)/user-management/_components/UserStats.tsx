import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface UserStatsProps {
  title: string;
  count: number;
  icon: React.ReactNode;
}

export const UserStats: React.FC<UserStatsProps> = ({ title, count, icon }) => {
  return (
    <Card className="w-64 flex items-center gap-4 p-4">
      <div className="p-3 bg-gray-100 rounded-full">{icon}</div>
      <div>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{count} accounts</p>
        </CardContent>
      </div>
    </Card>
  );
};
