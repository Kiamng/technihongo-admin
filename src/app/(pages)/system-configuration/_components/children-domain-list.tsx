import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"

import { Domain, DomainList } from "@/types/domain"

import { CirclePlus, SquarePen, Trash2 } from "lucide-react"
import DomainFormPopup from "./add-domain-popup"
import { useState } from "react"
import DeleteAlert from "./delete-alert"

interface ChildrenDomainListProps {
    list: DomainList
    parentId: number
    parentDomains: DomainList
    fetchChildrenDomains: (parentId: number) => Promise<void>
}
const ChildrenDomainList = ({ list, parentId, parentDomains, fetchChildrenDomains }: ChildrenDomainListProps) => {
    const [isCreateChildrenDialogOpen, setIsCreateChildrenDialogOpen] = useState<boolean>(false);
    const [selectedChildDomain, setSelectedChildDomain] = useState<{ domainId: number } | null>(null);

    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [domainToDelete, setDomainToDelete] = useState<null | Domain>(
        null
    );

    const openDeleteDialog = (domain: Domain) => {
        setDomainToDelete(domain);
        setIsDeleteDialogOpen(true);
    };
    return (
        <div className="flex flex-col space-y-4">
            <div className="flex items-center justify-center space-x-2">
                <div className="flex-grow border-t border-gray-300" />
                <span className="px-2 text-center text-base font-medium">
                    Children domains ({list.totalElements}):
                </span>
                <div className="flex-grow border-t border-gray-300" />
            </div>
            {list?.content?.length ?
                list.content.map((child) => (
                    <div key={child.domainId} className="px-3 flex justify-between items-center">
                        <div className="flex flex-col space-x-1 ">
                            <div className="text-base font-bold">{child.tag}. {child.name}:</div>
                            <div className="text-base text-gray-500">{child.description}</div>
                        </div>
                        <div className="flex space-x-2">
                            <Dialog open={selectedChildDomain?.domainId === child.domainId} onOpenChange={(isOpen) => {
                                if (!isOpen) setSelectedChildDomain(null);
                            }}>
                                <DialogTrigger
                                    className="flex items-center gap-2 py-2 px-2 bg-primary rounded-lg hover:bg-primary/90 text-white transition duration-200"
                                    onClick={() => setSelectedChildDomain({ domainId: child.domainId })}
                                >
                                    <SquarePen size={18} />
                                </DialogTrigger>
                                <DialogContent width='400px'>
                                    <DomainFormPopup
                                        initialData={child}
                                        setIsDialogOpen={() => setSelectedChildDomain(null)}
                                        fetchChildrenDomains={fetchChildrenDomains}
                                        parentId={child.parentDomainId}
                                        parentDomainList={parentDomains.content}
                                    />
                                </DialogContent>
                            </Dialog>
                            <Button size="icon" variant="ghost" onClick={() => openDeleteDialog(child)}><Trash2 /></Button>
                        </div>
                    </div>
                ))
                :
                (
                    <p className="text-gray-500">No children domains found</p>
                )}
            <Separator />
            <Dialog open={isCreateChildrenDialogOpen} onOpenChange={setIsCreateChildrenDialogOpen}>
                <DialogTrigger
                    className="flex items-center gap-2 py-2 px-2 bg-primary rounded-lg hover:bg-primary/90 text-white mx-auto"
                >
                    <CirclePlus />Add a new children domain
                </DialogTrigger>
                <DialogContent width='400px'>
                    <DomainFormPopup
                        initialData={null}
                        setIsDialogOpen={setIsCreateChildrenDialogOpen}
                        parentDomainList={parentDomains.content}
                        parentId={parentId}
                        fetchChildrenDomains={fetchChildrenDomains}
                    />
                </DialogContent>
            </Dialog>

            {domainToDelete && (
                <DeleteAlert
                    open={isDeleteDialogOpen}
                    onOpenChange={setIsDeleteDialogOpen}
                    domain={domainToDelete}
                    fetchChildrenDomains={fetchChildrenDomains}
                />
            )}
        </div>
    )
}

export default ChildrenDomainList
