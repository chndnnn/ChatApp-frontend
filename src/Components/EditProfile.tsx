import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    useDisclosure,
    Input,
  } from '@chakra-ui/react'
import { ReactNode, useState } from 'react'

  interface EditProfileInterface{
    children : ReactNode
  }

const EditProfile:React.FC<EditProfileInterface> = ({children})=>{
    
    const { isOpen, onOpen, onClose } = useDisclosure()
    let [showName,setShowName]= useState(false)
    let [showImage,setShowImage]= useState(false)
    let [showPassword,setShowPassword]= useState(false)
    return <>
     <span onClick={onOpen}>{children}</span>

<Modal isOpen={isOpen} onClose={onClose}>
  <ModalOverlay />
  <ModalContent>
    <ModalHeader>EDIT PROFILE</ModalHeader>
    <ModalCloseButton />
    <ModalBody>
        <div className='flex justify-between border border-solid'>
            <div>
            <label htmlFor="acceptname">edit name</label>
            <input id='acceptname' type="checkbox" onChange={(e)=>{e.target.checked?setShowName(true):setShowName(false)}}/>
            </div>
            <div>
            <label htmlFor="acceptimage">edit image</label>
            <input id='acceptimage' type="checkbox" onChange={(e)=>{e.target.checked?setShowImage(true):setShowImage(false)}}/>
            </div>
            <div>
            <label htmlFor="acceptpass">edit password</label>
            <input id='acceptpass' type="checkbox" onChange={(e)=>{e.target.checked?setShowPassword(true):setShowPassword(false)}} />
            </div>
        </div>
        <div className='border border-solid mt-2'>
       {showName && <Input type='text' placeholder='Edit name' className='mt-2'></Input>}
        {showImage && <Input className='p-1 mt-2 mb-2' type='file' placeholder='Edit name'></Input>}
       {showPassword && <> <Input type='text' placeholder='Old password'></Input>
        <Input type='text' placeholder='new Password'></Input> </>}
        </div>
    </ModalBody>

    <ModalFooter>
      <Button colorScheme='blue' mr={3} onClick={onClose}>
        Close
      </Button>
      <Button variant='ghost'>Secondary Action</Button>
    </ModalFooter>
  </ModalContent>
</Modal></>
}

export default EditProfile