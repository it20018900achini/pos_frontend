import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Trash2 } from "lucide-react";

const DeleteButton = ({ rowId, handleDeleteBranch, loading }) => {
  const [open, setOpen] = useState(false);

  const confirmDelete = () => {
    handleDeleteBranch(rowId);
    setOpen(false); // close modal after delete
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* Trigger button */}
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
          disabled={loading}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>

      {/* Dialog content */}
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Confirm Delete</DialogTitle>
        </DialogHeader>
        <p>Are you sure you want to delete this branch? This action cannot be undone.</p>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            className="bg-red-500 hover:bg-red-600 text-white"
            onClick={confirmDelete}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteButton;