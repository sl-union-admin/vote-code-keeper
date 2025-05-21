
import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Candidate } from '@/services/types';

interface ConfirmVoteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  candidate: Candidate | null;
  isSubmitting: boolean;
}

const ConfirmVoteDialog: React.FC<ConfirmVoteDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  candidate,
  isSubmitting
}) => {
  if (!candidate) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Confirm Your Vote</DialogTitle>
          <DialogDescription>
            You are about to cast your vote for {candidate.name}
            {candidate.party ? ` (${candidate.party})` : ''}.
            This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2 py-4">
          <div className="w-full">
            <p className="font-medium">{candidate.name}</p>
            {candidate.party && (
              <p className="text-sm text-muted-foreground">{candidate.party}</p>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            type="button" 
            onClick={onConfirm}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Processing..." : "Confirm Vote"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmVoteDialog;
