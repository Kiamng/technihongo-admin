import { Button } from "@/components/ui/button";

interface FormActionProps {
    isEditingOrder: boolean;
    isSaving: boolean;
    isSavingNewOrder: boolean;
    handleCancelUpdateOrder: (e: React.MouseEvent<HTMLButtonElement>) => void;
    handleSaveNewOrder: (e: React.MouseEvent<HTMLButtonElement>) => Promise<void>;
    handleUpdateOrderToggle: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const FormAction = ({
    isEditingOrder,
    isSaving,
    isSavingNewOrder,
    handleCancelUpdateOrder,
    handleSaveNewOrder,
    handleUpdateOrderToggle,
}: FormActionProps) => {
    return isEditingOrder ? (
        <EditingOrderActions
            isSavingNewOrder={isSavingNewOrder}
            handleCancelUpdateOrder={handleCancelUpdateOrder}
            handleSaveNewOrder={handleSaveNewOrder}
        />
    ) : (
        <NonEditingOrderActions
            isSaving={isSaving}
            handleUpdateOrderToggle={handleUpdateOrderToggle}
        />
    );
};

interface NonEditingOrderActionsProps {
    isSaving: boolean;
    handleUpdateOrderToggle: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const NonEditingOrderActions = ({
    isSaving,
    handleUpdateOrderToggle,
}: NonEditingOrderActionsProps) => {
    return (
        <div className="flex flex-row space-x-4">
            <Button type="submit" disabled={isSaving}>
                {isSaving ? "Đang lưu..." : "Lưu"}
            </Button>
            <Button variant={"outline"} type="button" onClick={handleUpdateOrderToggle}>
                Cập nhật thứ tự
            </Button>
        </div>
    );
};

interface EditingOrderActionsProps {
    isSavingNewOrder: boolean;
    handleCancelUpdateOrder: (e: React.MouseEvent<HTMLButtonElement>) => void;
    handleSaveNewOrder: (e: React.MouseEvent<HTMLButtonElement>) => Promise<void>;
}

const EditingOrderActions = ({
    isSavingNewOrder,
    handleCancelUpdateOrder,
    handleSaveNewOrder,
}: EditingOrderActionsProps) => {
    return (
        <div className="flex flex-row space-x-4">
            <Button disabled={isSavingNewOrder} type="button" variant={"outline"} onClick={handleCancelUpdateOrder}>
                Hủy
            </Button>
            <Button disabled={isSavingNewOrder} type="button" onClick={handleSaveNewOrder}>
                Lưu thứ tự
            </Button>
        </div>
    );
};

export default FormAction;
