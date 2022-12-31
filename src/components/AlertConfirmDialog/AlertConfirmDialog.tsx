import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  useDisclosure,
} from '@chakra-ui/react';
import React from 'react';

export interface AlertConfirmDialogProps {
  header: string;
  body?: React.ReactNode;
  buttonText?: React.ReactNode;
  cancelText?: React.ReactNode;
  confirmText?: React.ReactNode;
  onConfirm: any;
}

export const AlertConfirmDialog = ({
  buttonText,
  body,
  cancelText,
  confirmText,
  header,
  onConfirm,
}: AlertConfirmDialogProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef(null);

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <>
      <Button colorScheme="red" onClick={onOpen}>
        {buttonText}
      </Button>

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              {header}
            </AlertDialogHeader>

            <AlertDialogBody>
              {body || "Are you sure? You can't undo this action afterwards."}
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                {cancelText || 'Cancel'}
              </Button>
              <Button colorScheme="red" onClick={handleConfirm} ml={3}>
                {confirmText || 'Delete'}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};
