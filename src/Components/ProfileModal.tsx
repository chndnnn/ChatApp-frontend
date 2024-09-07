import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Image,
  useDisclosure,
  Input,
  InputGroup,
  InputRightElement,
  useToast,
  Avatar,
} from "@chakra-ui/react";
import { ReactNode, useEffect, useRef, useState } from "react";
import { MdModeEdit } from "react-icons/md";
import { IoEyeSharp } from "react-icons/io5";
import AddedUser from "./AddedUser";
import { chatState } from "../chatContext/ChatssProvider";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { MdOutlineCancel } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
import { MdAddAPhoto } from "react-icons/md";

interface profileModalProps {
  children?: ReactNode;
  users?: any;
}

interface User {
  name : any;
  _id : any
}

let baseUrl = 'https://chatapp-backend-1-kwns.onrender.com'

const ProfileModal: React.FC<profileModalProps> = ({ children, users }) => {
  const {users:loggedinUser,setSelectedChat,selectedChat } = chatState();
  
  const { user} = users;
  const { isOpen, onOpen, onClose } = useDisclosure();
 // const [groupUser,setGroupUser] = useState(user?.completeData?.users)
  const [groupUser,setGroupUser] = useState(selectedChat?.users)
  const [searchUser , setSearchUser] = useState('');
  const [allSearchedUser , setAllSearchedUser] = useState<any[]>([]);
  const [updateUserName,setUpdateUserName] = useState('');
  let [userToadd,setUsertoadd] = useState<User | undefined>(undefined);
  let colorArr = ["green", "pink","blue" ,"cyan", "purple","teal"];
  const [loading,setLoading] = useState(false)
  const [userUpdateloading,setUserUpdateloading] = useState(false)
  const [groupNameUpdateloading,setGroupNameUpdateloading] = useState(false)
  const [isnameEditable,setIsnameEditable] = useState(false)
  const [newName,setNewName]= useState('')
  let [name,setName] = useState(user?.name)
  let [showImage,setShowImage] = useState(user?.image)
  let[imageLoading,setImageLoading] = useState(false)
  let fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(()=>{
    setGroupUser(selectedChat?.users)
  },[selectedChat])
 


  let nav = useNavigate();
  let toast = useToast();

  function onCancelClick(user1:any){
       removeFromGroup(user.completeData._id,user1._id)
  }

  useEffect(()=>{
    setAllSearchedUser([])
  },[user])

  useEffect(()=>{
    let timeout = setTimeout(()=>{
      fetchUSer(searchUser)
    },500)

    return ()=>{clearTimeout(timeout)}
  },[searchUser])

  function onUserUpdateClick(){
    addUserToGroup(userToadd?._id)
  }


  const addUserToGroup = async (userid : any)=>{
    setUserUpdateloading(true)
    let data = {
      chatId : user.completeData._id,
      user : userid
    }
    let config = {
      headers :{
           Authorization : `Bearer ${loggedinUser?.token}`
      }
     }
     try{
     await axios.patch(`${baseUrl}/chat/v1/addToGroup`,data,config)
     setGroupUser((prev:any)=>[...prev,userToadd])
     setUserUpdateloading(false)
     }catch(err:any){
      setUserUpdateloading(false)
      toast({
        title: err.response.data.message,
        status: 'error',
        duration: 4000,
        isClosable: true,
      })
     }

  }

  const fetchUSer = async (e:any)=>{
    setLoading(true)
    if(e == "" || e==null){
        e = "aaaaxxxaaaaxxxaaaaaa"
    }
  try{
   let config = {
    headers :{
         Authorization : `Bearer ${loggedinUser?.token}`
    }
   }
   let response = await axios.get(`${baseUrl}/chat/v1/?search=${e}`,config)
   let {data:{getAlluser}} = response
   setAllSearchedUser(getAlluser)
   setLoading(false)
  }catch(err){
    setLoading(false)
    toast({
        title: 'some Issue Occured',
        description: "Please try to login again and check",
        status: 'error',
        duration: 4000,
        isClosable: true,
      })
      localStorage.removeItem("userInfo");
    nav('/')
  }
}

  const removeFromGroup = async(chatid:any,userId:any)=>{
    let data = {
      chatId:chatid,
      user:userId
    }
    let config = {
      headers :{
        Authorization : `Bearer ${loggedinUser?.token}`
      }
    }
    try{
      await axios.patch(`${baseUrl}/chat/v1/removeFromGroup`,data,config)
      toast({
        title: 'User removed successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
      setGroupUser((prev:any)=> prev.filter((u:any)=> u._id != userId));
    }catch(err){
      toast({
        title: 'some error occured',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }
  }

  const renameGroup = async(chatid:any,name:any)=>{
    if(name == '' || name == null) return
    setGroupNameUpdateloading(true)
    let data = {
      chatID:chatid,
      chatName:name
    }
    let config = {
      headers :{
        Authorization : `Bearer ${loggedinUser?.token}`
      }
    }
    try{
      let res = await axios.patch(`${baseUrl}/chat/v1/renameGroup`,data,config) 
       setSelectedChat(res.data.updateChat)
       setGroupNameUpdateloading(false)
      toast({
        title: 'Chat Name Updated Successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
    }catch(err){
      setGroupNameUpdateloading(false)
      toast({
        title: 'some error occured',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }
  }

  function onGroupNameUpdateClick(){
    renameGroup(user.completeData._id,updateUserName)
  }

  function onUserClick(e:any){
    setUsertoadd(e)
  }


  function onLeaveGroupClick(){
    removeFromGroup(user.completeData._id,loggedinUser?.user?._id)
    setSelectedChat(null)
  }

  let onEditClick = async()=>{
    if(!newName || newName=='') return
    let config = {
      headers :{
        Authorization : `Bearer ${loggedinUser?.token}`
      }
    }
    try{
    await axios.post(`${baseUrl}/chat/v1/updatename/${newName}`,{},config)
    setName(newName)
    setIsnameEditable(false)
    }catch(err){
      console.log(err)
    }
  }
  function onImageEditClick(){
    if(fileInputRef.current){
      fileInputRef.current.click();
      console.log(fileInputRef.current)
    }
  }

  async function onFileChange(e:any){
    setImageLoading(true)
    const data = new FormData()
    data.append("file",e.target.files[0])
    data.append("upload_preset", "ChatApp");
    data.append("cloud_name", "depf0vje1");

    try{
      let uploadedImage = await axios.post("https://api.cloudinary.com/v1_1/depf0vje1/image/upload", data)
      let config = {
        headers :{
          Authorization : `Bearer ${loggedinUser?.token}`
        }
      }
      let data1:any = {
        imgUrl : uploadedImage.data.secure_url
      }
      await axios.post(`${baseUrl}/chat/v1/updateuserImage`,data1,config)
      setShowImage(uploadedImage.data.secure_url)
      setImageLoading(false)
    }catch(err){
      console.log(err)
      setImageLoading(false)
    }
  }

  return (
    <>
      {children ? <span onClick={onOpen}>{children}</span> : <IoEyeSharp className="cursor-pointer text-2xl" onClick={onOpen}/>}

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        
        <ModalContent
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
        >
         
          {!user.completeData?<>
           { !isnameEditable?<>{!children?<ModalHeader className="font-bold flex">{user.name} {user?._id ==loggedinUser?.user?._id && <MdModeEdit onClick={()=>{setIsnameEditable(true)}} className="mt-1 ml-5 cursor-pointer" />}</ModalHeader>:<ModalHeader className="font-bold flex">{name} {user?._id ==loggedinUser?.user?._id && <MdModeEdit onClick={()=>{setIsnameEditable(true)}} className="mt-1 ml-5 cursor-pointer" />}</ModalHeader>}</>
          :
          <ModalHeader className="font-bold flex"><InputGroup><Input type='text' onChange={(e)=>setNewName(e.target.value)}  placeholder={user?.name} /> {user?._id ==loggedinUser?.user?._id && <div className="border border-solid flex items-center justify-center  w-20"> <InputRightElement><FaRegEdit onClick={onEditClick} className="ml-5 cursor-pointer" /></InputRightElement> <InputRightElement className="mr-5"><MdOutlineCancel className='cursor-pointer' onClick={()=>{setIsnameEditable(false)}} /></InputRightElement></div>}</InputGroup></ModalHeader>
           }
          <ModalCloseButton />
          <ModalBody
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
          >
           
            {!children?<Image src={user.image} height="300px" borderRadius="200px"  className="relative"/>:<Image src={showImage} height="300px" borderRadius="200px"  className="relative"/>}
            
            {imageLoading && <div className="absolute top-10"><div className="flex justify-center mt-40 min-h-screen">
  <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
</div></div>}
            <input id='imageFile' className="hidden" onChange={onFileChange} type="file" ref={fileInputRef}></input>
            {user?._id ==loggedinUser?.user?._id &&  <MdAddAPhoto onClick={onImageEditClick} className="absolute top-20 ml-40 cursor-pointer" />}
            <p className="pt-5 text-xl font-bold mb-2">{user?.email}</p>
          </ModalBody>
          </>:  <><ModalHeader>{user?.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
          >
            <div className="flex flex-wrap p-2">
            {groupUser?.filter((u:any)=>u._id != loggedinUser?.user?._id ).map((user1:any,index:any)=>{
            return <span key={index} className="ml-1 mt-1"><AddedUser onCancelClick={()=>onCancelClick(user1)} showCancelButton={user?.completeData?.groupAdmin?._id == loggedinUser?.user?._id} bgcolor={`${colorArr[index]}`}>{user1.name}</AddedUser></span>
          })}
          </div>
          {user?.completeData?.groupAdmin?._id == loggedinUser?.user?._id?
          <>
          <InputGroup>
          <Input className="mb-1" onChange={(e)=>setUpdateUserName(e.target.value)} placeholder="Update Chat Name"/>
          <InputRightElement width='4.5rem'><Button isLoading={groupNameUpdateloading} h='1.75rem' size='sm' onClick={onGroupNameUpdateClick} className="mr-1" >Update</Button></InputRightElement>
          </InputGroup>
           <InputGroup>
           <Input value = {userToadd?.name} onFocus={()=>setUsertoadd(undefined)} onChange={(e:any)=>setSearchUser(e.target.value)} placeholder="Add User"/>
           <InputRightElement  width='4.5rem'><Button isLoading={userUpdateloading} onClick={onUserUpdateClick} h='1.75rem' size='sm' className="mr-1" >Update</Button></InputRightElement>
           </InputGroup>
           </>
          :""}
          {
                    loading && <div className="flex ">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-blue-500"></div>
                    </div>
          }
          {allSearchedUser?<>{allSearchedUser.slice(0,4).map((user:any,index:any)=>{
             return <div key={index} className="w-[300px] my-1 h-[50px] flex bg-slate-100 hover:bg-slate-200 rounded cursor-pointer" onClick={()=>onUserClick(user)}>
             <div className="h-[100%] pl-2">
               <Avatar name={user.name} src={user.image} />
             </div>
             <div className="flex flex-col ml-2">
               <span>
                 <b>{user.name}</b>
               </span>
               <span>{user.email}</span>
             </div>
           </div>
            })}
             <Button colorScheme="red" onClick={onLeaveGroupClick} className="mt-3">leave Group</Button></>:''}
          </ModalBody></> }
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProfileModal;
