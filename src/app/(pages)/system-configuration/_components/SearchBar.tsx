import { Input } from "@/components/ui/input";

export const SearchBar = ({ onChange }: { onChange: (value: string) => void }) => {
  return (
    <Input
      type="text"
      placeholder="Search name"
      className="w-64 border p-2 rounded"
      onChange={(e) => onChange(e.target.value)}
    />
  );
};