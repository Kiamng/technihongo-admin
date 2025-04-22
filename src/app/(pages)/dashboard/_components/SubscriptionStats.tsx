

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; 

interface SubscriptionStatsProps { 
  title: string; 
  count: number; 
  icon: React.ReactNode; 
} 

export const SubscriptionStats: React.FC<SubscriptionStatsProps> = ({ title, count, icon }) => { 
  return ( 
    <Card className="w-full shadow-sm hover:shadow transition-all duration-200">
      <div className="flex items-center p-4">
        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg mr-4 flex-shrink-0">
          {icon}
        </div>
        <div>
          <CardHeader className="p-0 space-y-0 pb-1">
            <CardTitle className="text-sm text-gray-500 font-medium">{title}</CardTitle>
          </CardHeader>
          <CardContent className="p-0 pt-1">
            <p className="text-2xl font-bold">{count}</p>
          </CardContent>
        </div>
      </div>
    </Card>
  ); 
};