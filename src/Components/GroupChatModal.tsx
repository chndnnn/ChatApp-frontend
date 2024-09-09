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
    useToast,
    Avatar,
  } from '@chakra-ui/react'
import { ReactNode, useEffect, useState } from 'react'
import { chatState } from '../chatContext/ChatssProvider';
import axios from 'axios';
import AddedUser from './AddedUser';
import { useNavigate } from 'react-router-dom';


interface groupChatInterface {
    children : ReactNode;
}

let baseUrl = 'https://chatapp-backend-1-kwns.onrender.com'

const GroupChatModal:React.FC<groupChatInterface> = ({children})=>{

    let [typedUser,settypedUser] = useState("");
    let [searchedUser,setSearchedUser] = useState([]);
    let [groupChatName,setGroupChatName] = useState();
    let [addedusertoGroup,setAddedUserToGroup] = useState<any[]>([]);
    let colorArr = ["green", "pink","blue" ,"cyan", "purple","teal"]
    let {users,setChat,darkMode} = chatState();
    const toast = useToast()
    const { isOpen, onOpen, onClose } = useDisclosure()
    let nav = useNavigate();
    let[loading,setLoading]=useState(false)

    useEffect(()=>{
        let value = setTimeout(()=>{
            fetchUSer(typedUser)
        },200)

        return()=>{clearTimeout(value)}
    },[typedUser])

    const fetchUSer = async (e:string)=>{
      setLoading(true)
        if(e == "" || e==null){
            e = "aaaaxxxaaaaxxxaaaaaa"
        }
      try{
       let config = {
        headers :{
             Authorization : `Bearer ${users?.token}`
        }
       }
       let response = await axios.get(`${baseUrl}/chat/v1/?search=${e}`,config)
       let {data:{getAlluser}} = response
       setSearchedUser(getAlluser)
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

    const onUserClick = (user:any)=>{
        if(!addedusertoGroup.find((u)=>u._id === user._id)){
        setAddedUserToGroup((prev)=>[...prev,user])
        }
    }

    const removeUser = (user:any)=>{
        setAddedUserToGroup((prev)=> prev.filter((e)=> e._id != user._id))
    }

    function onSubmitClick(){
    if(groupChatName === "" || groupChatName==null ){
            toast({
                title: 'Please enter chat name',
                status: 'error',
                duration: 4000,
                isClosable: true,
              })
              return
        }else if(addedusertoGroup.length<2){
          toast({
            title: 'Please add at least two user to group',
            status: 'error',
            duration: 4000,
            isClosable: true,
          })
          return
        }else{
          createGroupChat()
        }
    
    }

    const createGroupChat = async()=>{
     let config = {
        headers:{
            Authorization : `Bearer ${users?.token}`
        }
     }
     try{

        let addUser = addedusertoGroup.map((user)=>user._id)
        let data1 = {
            name : groupChatName,
            users : addUser
        }
        let response = await axios.post(`${baseUrl}/chat/v1/createGroup`,data1,config);
        let {data} = response
        setChat((prev:any)=>[...prev,data])
        onClose();

     }catch(err){
        console.log(err)
        toast({
            title: 'some error occured',
            status: 'error',
            duration: 4000,
            isClosable: true,
          })
     }
    }

   
  return (
    <>
      <span onClick={onOpen}>{children}</span>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create Group Chat</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input mb={3} onChange={(e:any)=>setGroupChatName(e.target.value)} placeholder='Enter Chat Name' />
            <Input onChange={(e)=>settypedUser(e.target.value)} placeholder="Search Users"/>
            <div className='flex mt-2'>
            {addedusertoGroup?addedusertoGroup?.map((user:any,index:any)=>{
               return <span className='m-1' onClick={()=>removeUser(user)}><AddedUser bgcolor = {colorArr?.[index]}>{user.name}</AddedUser></span> 
            }):""}
            </div>
            {loading && <div className="flex ">
  <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-blue-500"></div>
</div>}

            {searchedUser?<>{searchedUser.slice(0,4).map((user:any,index:any)=>{
             return <div key={index} className="my-2 h-[50px] flex bg-slate-100 hover:bg-slate-200 rounded cursor-pointer" onClick={()=>onUserClick(user)}>
             <div className="h-[100%] w-[25%] pl-2">
               <Avatar name={user.name} src={user.image} />
             </div>
             <div className="flex flex-col">
               <span>
                 <b>{user.name}</b>
               </span>
               <span>{user.email}</span>
             </div>
           </div>
            })}</>:''}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={onSubmitClick}>
              Submit
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default GroupChatModal;
