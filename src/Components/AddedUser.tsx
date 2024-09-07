import {  Button } from "@chakra-ui/react";
import React from "react";
import { FC, ReactNode } from "react";
import { MdOutlineCancel } from "react-icons/md";
interface AddedUserInterface {
    children : ReactNode
    bgcolor : String
    showCancelButton?:boolean
    onCancelClick?:any
}

const AddedUser:React.FC<AddedUserInterface> =  ({children,bgcolor,showCancelButton,onCancelClick})=>{

    function onClick(){
        onCancelClick()
    }
return<>
<Button colorScheme={`${bgcolor}`} size='sm' rightIcon={showCancelButton?<MdOutlineCancel onClick={onClick}/>:undefined}>{children}</Button>
</>
}

export default AddedUser;

