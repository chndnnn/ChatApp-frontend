import { AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Button, useDisclosure } from "@chakra-ui/react"
import React, { ReactNode } from "react"

interface AlertDialogBoxInterface{
    children : ReactNode
}

const AlertDialogBox:React.FC<AlertDialogBoxInterface> = ({children})=>{
    const { isOpen, onOpen, onClose } = useDisclosure()
    const cancelRef = React.useRef<HTMLButtonElement>(null);
  
    return (
      <>
        <span onClick={onOpen}>
          {children}
        </span>
  
        <AlertDialog
          isOpen={isOpen}
          leastDestructiveRef={cancelRef}
          onClose={onClose}
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                Delete Customer
              </AlertDialogHeader>
  
              <AlertDialogBody>
                Are you sure? You can't undo this action afterwards.
              </AlertDialogBody>
  
              <AlertDialogFooter>
                <Button ref={cancelRef} onClick={onClose}>
                  Cancel
                </Button>
                <Button colorScheme='red' onClick={onClose} ml={3}>
                  Delete
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
      </>
    )
  }

export default AlertDialogBox;