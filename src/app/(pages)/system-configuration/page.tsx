"use client";
import { getParentDomains } from "@/app/api/system-configuration/system.api";

import DomainFormPopup from "./_components/add-domain-popup";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";

import { DomainList } from "@/types/domain";

import { CirclePlus } from "lucide-react";

import { useEffect, useState } from "react";
import ParentDomainsList from "./_components/parent-domains-list";
import { useSession } from "next-auth/react";

export default function DomainManagement() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [parentDomains, setParentDomains] = useState<DomainList>();
  const { data: session } = useSession();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState<boolean>(false);

  const fetchParentDomains = async () => {
    try {
      setIsLoading(true);
      const response = await getParentDomains({
        token: session?.user.token as string,
        pageNo: 0,
        pageSize: 10,
        sortBy: 'createdAt',
        sortDir: 'desc'
      });
      setParentDomains(response);
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if (!parentDomains) {
      fetchParentDomains();
    }
  }, [parentDomains, session?.user.token]);

  return (
    <div className="w-full space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold">Domain</h1>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger
            className="flex items-center gap-2 py-2 px-2 bg-primary rounded-lg hover:bg-primary/90 text-white"
          >
            <CirclePlus />Create new domain
          </DialogTrigger>
          <DialogContent width='400px'>
            <DomainFormPopup
              token={session?.user.token as string}
              initialData={null}
              setIsDialogOpen={setIsCreateDialogOpen}
              parentDomainList={parentDomains?.content}
              fetchParentDomains={fetchParentDomains}
            />
          </DialogContent>
        </Dialog>
      </div>

      {isLoading && <Skeleton className="w-full h-[500px]" />}
      {parentDomains && <ParentDomainsList token={session?.user.token as string} fetchParentDomains={fetchParentDomains} parentDomains={parentDomains} />}
    </div>
  );
}
