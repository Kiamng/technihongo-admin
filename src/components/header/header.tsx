import { UserNav } from "./user-nav";

const Header = () => {
  return (
    <div className="w-full flex flex-row justify-between items-center px-10 py-3 border-b-[1px]">
      <div className="text-2xl font-semibold text-[#56D071]">TechNihongo</div>
      <UserNav />
    </div>
  );
};

export default Header;
