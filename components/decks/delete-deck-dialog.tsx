"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Trash2 } from "lucide-react";
import { deleteDeck } from "@/actions/deck-actions";

interface DeleteDeckDialogProps {
  deckId: string;
  deckTitle: string;
}

export function DeleteDeckDialog({ deckId, deckTitle }: DeleteDeckDialogProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      await deleteDeck(deckId);
      // deleteDeck sẽ tự redirect về /dashboard
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" size="sm">
          <Trash2 className="mr-2 h-4 w-4" />
          Xóa Deck
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Xác nhận xóa Deck</DialogTitle>
          <DialogDescription>
            Bạn có chắc chắn muốn xóa Deck <strong>{deckTitle}</strong>?
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-md bg-destructive/10 p-4 text-sm text-destructive">
          ⚠️ <strong>Cảnh báo:</strong> Hành động này không thể hoàn tác. Tất cả
          các thẻ trong Deck này cũng sẽ bị xóa vĩnh viễn.
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isPending}
          >
            Hủy
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isPending}
          >
            {isPending ? "Đang xóa..." : "Xóa Deck"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
