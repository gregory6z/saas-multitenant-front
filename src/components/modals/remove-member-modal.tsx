import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useRemoveMember } from "@/hooks/use-team-members";

interface RemoveMemberModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  memberId: string;
  memberName: string;
  memberEmail: string;
}

export function RemoveMemberModal({
  open,
  onOpenChange,
  memberId,
  memberName,
  memberEmail,
}: RemoveMemberModalProps) {
  const removeMember = useRemoveMember();

  const handleRemove = () => {
    removeMember.mutate(memberId, {
      onSuccess: () => {
        onOpenChange(false);
      },
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl">Remove Team Member</AlertDialogTitle>
          <AlertDialogDescription className="space-y-4 pt-2">
            <div className="rounded-md border border-red-200 bg-red-50 p-3">
              <p className="text-sm text-red-900">
                Are you sure you want to remove <span className="font-semibold">{memberName}</span>{" "}
                from your team?
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">Email:</span> {memberEmail}
              </p>
              <p className="text-sm text-muted-foreground">
                This member will lose access to all chatbots, knowledge bases, and team resources.
                They can be re-invited later if needed.
              </p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={removeMember.isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              if (!removeMember.isPending) {
                handleRemove();
              }
            }}
            disabled={removeMember.isPending}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
          >
            {removeMember.isPending ? "Removing..." : "Remove Member"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
