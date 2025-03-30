import { getChildrenDomainsByParentId } from "@/app/api/system-configuration/system.api";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

import { Domain, DomainList } from "@/types/domain";

import { ChevronRight, LoaderCircle, SquarePen, Trash2 } from "lucide-react";
import { useState } from "react";
import ChildrenDomainList from "./children-domain-list";
import DomainFormPopup from "./add-domain-popup";
import DeleteAlert from "./delete-alert";

interface ParentDomainsListProps {
    parentDomains: DomainList
    fetchParentDomains: () => Promise<void>
}


const ParentDomainsList = ({ parentDomains, fetchParentDomains }: ParentDomainsListProps) => {
    const [selectedParentDomain, setSelectedParentDomain] = useState<{ domainId: number } | null>(null);
    const [childrenDomains, setChildrenDomains] = useState<{ [key: number]: DomainList }>({});
    const [loadingChildren, setLoadingChildren] = useState<{ [key: number]: boolean }>({});
    const [isChildrenVisible, setIsChildrenVisible] = useState<{ [key: number]: boolean }>({});

    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);  // State to open/close delete dialog
    const [domainToDelete, setDomainToDelete] = useState<null | Domain>(
        null
    );

    const toggleChildrenVisibility = (parentId: number) => {
        setIsChildrenVisible((prev) => ({
            ...prev,
            [parentId]: !prev[parentId],
        }));
    };

    const fetchChildrenDomains = async (parentId: number) => {
        try {
            setLoadingChildren((prev) => ({ ...prev, [parentId]: true }));
            const response = await getChildrenDomainsByParentId({ parentId });
            setChildrenDomains((prev) => ({
                ...prev,
                [parentId]: response,
            }));
        } catch (err) {
            console.log(err);
        } finally {
            setLoadingChildren((prev) => ({ ...prev, [parentId]: false }));
        }
    };

    const openDeleteDialog = (domain: Domain) => {
        setDomainToDelete(domain);
        setIsDeleteDialogOpen(true);
    };

    return (
        <div className="w-full min-h-[500px] bg-[#F5F5F5] p-[10px] rounded-2xl space-y-7">
            {parentDomains?.content.map((parent) => (
                <div key={parent.domainId} className="domains w-full bg-white rounded-2xl space-y-4 px-5 py-4 border-[1px] shadow-md hover:shadow-lg transition-all duration-200 ease-in-out">
                    <div className="w-full flex flex-row justify-between items-center">
                        <div className="space-y-1 flex flex-col ">
                            <div className="font-semibold text-xl">{parent.tag}. {parent.name}</div>
                            <div className="text-base text-gray-500">{parent.description}</div>
                        </div>
                        <div className="flex flex-row space-x-4">
                            <Dialog open={selectedParentDomain?.domainId === parent.domainId} onOpenChange={(isOpen) => {
                                if (!isOpen) setSelectedParentDomain(null);
                            }}>
                                <DialogTrigger
                                    className="flex items-center gap-2 py-2 px-2 bg-primary rounded-lg hover:bg-primary/90 text-white transition duration-200"
                                    onClick={() => setSelectedParentDomain({ domainId: parent.domainId })}
                                >
                                    <SquarePen size={18} />
                                </DialogTrigger>
                                <DialogContent width='400px'>
                                    <DomainFormPopup
                                        initialData={parent}
                                        setIsDialogOpen={() => setSelectedParentDomain(null)}
                                        fetchParentDomains={fetchParentDomains}
                                    />
                                </DialogContent>
                            </Dialog>
                            <Button
                                size={"icon"}
                                variant={"destructive"}
                                onClick={() => openDeleteDialog(parent)}
                            >
                                <Trash2 />
                            </Button>
                            <Button
                                size={"icon"}
                                variant={"ghost"}
                                disabled={loadingChildren[parent.domainId]}
                                onClick={() => {
                                    if (!childrenDomains[parent.domainId]) {
                                        fetchChildrenDomains(parent.domainId);
                                    }
                                    toggleChildrenVisibility(parent.domainId);
                                }}
                                className="text-primary hover:bg-primary/20"
                            >
                                {loadingChildren[parent.domainId] ? (
                                    <LoaderCircle className="animate-spin" />
                                ) : (
                                    <ChevronRight />
                                )}
                            </Button>
                        </div>
                    </div>
                    {isChildrenVisible[parent.domainId] && childrenDomains[parent.domainId] &&
                        <ChildrenDomainList
                            fetchChildrenDomains={fetchChildrenDomains}
                            list={childrenDomains[parent.domainId]}
                            parentDomains={parentDomains}
                            parentId={parent.domainId} />
                    }
                </div>
            )
            )}

            {domainToDelete && (
                <DeleteAlert
                    open={isDeleteDialogOpen}
                    onOpenChange={setIsDeleteDialogOpen}
                    domain={domainToDelete}
                    fetchParentDomains={fetchParentDomains}
                    fetchChildrenDomains={fetchChildrenDomains}
                />
            )}
        </div>
    )
}

export default ParentDomainsList
