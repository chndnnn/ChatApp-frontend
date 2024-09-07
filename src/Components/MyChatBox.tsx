import { useEffect, useRef, useState } from "react";
import { chatState } from "../chatContext/ChatssProvider";
import { displayAvatarAtEndMessage, displayedUser } from "../Functions/ChatFunctions";
import ProfileModal from "./ProfileModal";
import { Avatar, Box, Input, InputGroup, InputRightElement, Tooltip, useToast, Wrap, WrapItem } from "@chakra-ui/react";
import { IoMdSend } from "react-icons/io";
import axios, { all } from "axios";
import { IoMdArrowRoundBack } from "react-icons/io";
import { io, Socket } from "socket.io-client";
import { DefaultEventsMap } from "@socket.io/component-emitter";
import Lottie from 'react-lottie';
import typingJson from '../Animation/typing.json'
import { SiMagisk } from "react-icons/si";

interface DisplayUser{
  _id: any;
  name:string
  updatedAt:any
}
interface User {
  _id: string;
  name: string;
  image?: string;
}
interface Message {
  _id: string;
  sender: User;
  content: string;
  chat: Chat;
}
interface Chat {
  _id: string;
  users: User[];
}

let baseUrl = 'https://chatapp-backend-1-kwns.onrender.com'
const ENDPOINT = "https://chatapp-backend-1-kwns.onrender.com"
var socket: Socket<DefaultEventsMap, DefaultEventsMap> 
var selectedChatCompare : any 

const MyChatBox = () => {

  let {users,selectedChat,setSelectedChat,darkMode,showResponsive,SetShowResponsive, setAllNotificationData,onlineUser,setOnlineUser} = chatState();
  let [typedMessage,setTypedMessage]=useState('');
  let [userData,setUserData] = useState<DisplayUser | null>(null);
  let [allMessages,setAllMessages] = useState<Message[]>([]);
  let [socketConnected,setSocketConnected] = useState(false)
  const [loading,setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [showChatLoading,setShowChatLoading] = useState(false)
  const [maxiPage,setMaxiPage]=useState(0)
  let [page,setPage] = useState(1)
  let [typing,setTyping] = useState(false)
  const [isTyping, setIsTyping] = useState(false);

  let toast = useToast();

  const defaultOptions = {
    loop: true,
    autoplay: true, 
    animationData: typingJson,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  };

  useEffect(()=>{
    setSelectedChat(null)
    socket = io(ENDPOINT)
    socket.emit("setup",users?.user)
    socket.on('connected',()=>setSocketConnected(true))
    socket.on('typing',()=>setIsTyping(true))
    socket.on('stop typing',()=>setIsTyping(false))
  },[])

  useEffect(() => {
    deleteNotification(selectedChat?._id)
    fetchNotification()
    if (messagesEndRef.current && page==1) { 
     messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [allMessages,selectedChat]);
 
  

  useEffect(()=>{
    
    socket.on("message received",(newMessageReceived)=>{
      debugger
      if(!selectedChatCompare || selectedChatCompare._id !== newMessageReceived.chat._id){        
        let data:any = newMessageReceived.chat._id
         setAllNotificationData((prev:any)=>({...prev,[data]:1}))
         
      }else{
        setAllMessages([...allMessages,newMessageReceived])
      }
    })
})

useEffect(()=>{
  socket.on('userOnline',(data)=>{
    console.log('loggedin User --> '+data.name)
    setOnlineUser((prev)=>[...prev,data._id])
  })
  
  socket.on('userOffile',(data)=>{
    console.log('offline User --> '+data.name)
  setOnlineUser((prev:any)=>{
    return prev.filter((id:any)=>{
      return id != data._id
    })
  })
  })
},[])

  const sendNotification = async(chatId:any,userId:any)=>{
    let data = {
      chatId:chatId,
      userId:userId
    }

    let config = {
      headers :{
           Authorization : `Bearer ${users?.token}`
      }
    }
    try{
      let result = await axios.post(`${baseUrl}/chat/v1/sendNotification`,data,config)
    }catch(err){
      console.log(err)

    }

  }

  useEffect(()=>{
    if(selectedChat){
  setAllMessages([])
  setPage(1)
  setMaxiPage(0)
   setUserData(displayedUser(users?.user.name,selectedChat))
   fetchMessageApi(1);
   selectedChatCompare = selectedChat
   socket.emit("join chat",selectedChat?._id)
   }
  },[selectedChat])

    let data = {
      user:userData
    }
  
  function onSendIconClick(){
    if(typedMessage == ''){
     
    }
   else{
    sendMessageApi();
    setTypedMessage('')
    fetchMessageApi(1)
    }
  }

  function onEnterClick(e:any){
    if(e.key === "Enter"){
     if(typedMessage == ''){
     
    }
   else{
    sendMessageApi();
    setTypedMessage('')
    fetchMessageApi(1)
    }
    }

  }
  
  const fetchNotification = async()=>{
    let config = {
      headers: {
        Authorization: `Bearer ${users?.token}`,
      },
    };
    try{
     let data = await axios.get(`${baseUrl}/chat/v1/fetchNotification`,config)
     let notiArray = data.data.data
     const counts: Record<string, number> = {};
     notiArray.forEach((noti:any)=>{
        if(counts[noti.selectedChatID]){
          counts[noti.selectedChatID]++
        } else {
          counts[noti.selectedChatID] = 1;
        }
     })
     setAllNotificationData(counts)
    }catch(err){
     console.log(err)
    }
  }

  const sendMessageApi = async ()=>{

    socket.emit('stop typing',selectedChat?._id)
    selectedChat?.users.forEach((user:any)=>{
      if(user._id != users?.user._id && !onlineUser.includes(user._id)){
        sendNotification(selectedChat?._id,user._id)
      }
    })
    let config = {
      headers :{
           Authorization : `Bearer ${users?.token}`
      }
    }

    try{
      let message = await axios.post(`${baseUrl}/chat/v1/sendMessage`,{
        chatId:selectedChat?._id,
        content:typedMessage
      },config)

     socket.emit("message received",message.data.data.message)
     setAllMessages([...allMessages,message.data.data.message])

    }catch(err){
      toast({
        title: 'some Issue Occured',
        description: "Please try to login again and check",
        status: 'error',
        duration: 4000,
        isClosable: true,
      })
    }
  }

  const fetchMessageApi = async (pageNumber:number)=>{
    setLoading(true)
    let config = {
      headers :{
           Authorization : `Bearer ${users?.token}`
      }
    }

    try{
      var message = await axios.get(`${baseUrl}/chat/v1/fetchMessagepagination/${selectedChat?._id}/?page=${pageNumber}`,config)
        setAllMessages((prev)=>[...message.data.data.message.reverse(),...prev])
        setMaxiPage(message.data.data.maximumPage)
      //socket.emit("join chat",selectedChat?._id)
      setLoading(false)
      setShowChatLoading(false)
      return message
    }catch(err){
      console.log(err)
      setLoading(false)
      setShowChatLoading(false)
      toast({
        title: 'some Issue Occured',
        description: "Please try to login again and check",
        status: 'error',
        duration: 4000,
        isClosable: true,
      })
    }
  }

  function onBackClick(){
    SetShowResponsive(false)
  }

function onChatScrool(e:any){
  if(e.target.scrollTop == 0 && maxiPage>page) {
      setPage((prev)=>prev+1)
  }
}

useEffect(()=>{
  if(page>1){
   fetchMessageApi(page);
  }
},[page])

let deleteNotification = async (chatId1:any)=>{
  let config = {
    headers :{
         Authorization : `Bearer ${users?.token}`
    }
  }
  try{
  await axios.post(`${baseUrl}/chat/v1/deleteNotification`,{chatId:chatId1},config)
  }catch(err){
    console.log(err)
  }

}

function onInputChange(e:any){
  setTypedMessage(e.target.value) 
  if(!socketConnected) return

  if(!typing){
    setTyping(true);
    socket.emit('typing',selectedChat?._id)
  }

  let lastTypingTime = new Date().getTime();
  let timeLength = 3000
  setTimeout(()=>{
    let timenow = new Date().getTime();
    let timeDiff = timenow - lastTypingTime

    if(timeDiff >= timeLength && typing){
      socket.emit("stop typing",selectedChat?._id)
      setTyping(false)
        setIsTyping(false)
    }
  },timeLength)
}
  return (
    <div className={` h-[100%] pl-1 w-[160vh] ${!showResponsive?"hidden md:flow-root":''}`}>
        { selectedChat &&
      <div className={`w-[100%]  h-[45px] rounded flex justify-between items-center p-5  mt-1 ${!darkMode?'bg-slate-200 ':'bg-slate-700 text-gray-50'}`}>
        <IoMdArrowRoundBack onClick={onBackClick} className="md:hidden" />
        {userData?<>
        <div>
        <h1 className="text-xl">{userData?.name}</h1>
        {userData?.updatedAt &&
        <p className="text-[12px]"> {onlineUser.includes(userData?._id)?'online': `last seen ${new Date(userData?.updatedAt).toLocaleString()}`}</p>
        }   
        </div>
        <ProfileModal users={data} /></>:""}     
         
      </div>
       } 
      <div className={` h-[70%] flex justify-center items-center `}>
          {selectedChat?<>
          <Box className={`md:h-[80vh] h-[85vh] w-[98%] rounded mt-2 bg-slate-100 ${!darkMode?'bg-slate-200 ':'bg-slate-500'}`} >
            <Box className="w-[100%] h-[90%] flex flex-col overflow-y-auto p-1 overflow-x-wrap" onScroll={(e)=>onChatScrool(e)}>
              {loading && <div className="flex justify-center mt-40 min-h-screen">
  <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
</div>}
{showChatLoading && <span>Lodaing..</span>}
              {allMessages && allMessages.map((m:any,index:any)=>{
                return <>
                <span className={`${users?.user._id == m.sender._id ? "ml-auto" : ""} p-1 max-w-[300px] md:max-w-[600px] w-fit flex `}>
                {users?.user._id != m.sender._id && displayAvatarAtEndMessage(allMessages,index)  && <ProfileModal users={{user:m.sender}}><Avatar className="mr-1" size="xs" name={m.sender.name} src={m.sender.image}></Avatar></ProfileModal>}
                 <span className={`${users?.user._id == m.sender._id ? (!darkMode?"bg-teal-300 rounded-br-none":"bg-green-400 rounded-br-none") : (!darkMode?"bg-sky-200 rounded-bl-none rounded-bl-none":"bg-stone-700 text-slate-300 rounded-bl-none")}  rounded-lg cursor-pointer w-fit p-1 rounded ${displayAvatarAtEndMessage(allMessages,index)?"":"ml-7"}  break-words break-all`} ><Tooltip label={new Date(m.updatedAt).toLocaleString()} aria-label="Message timestamp" marginLeft={users?.user._id != m.sender._id?40:''} marginRight={users?.user._id == m.sender._id?10:''}>{m.content}</Tooltip></span>
                 </span>
                </>
              })}
               <div ref={messagesEndRef} />
            </Box>
            {isTyping?<div className="flex ml-10 w-[30px] ml-[0px]"><Lottie options={defaultOptions}
              height={20}
              width={20}></Lottie></div>:<></>}
            <Box className="w-[100%] h-[10%] flex items-center justify-between p-2">
              <InputGroup className="bg-zinc-100 rounded-lg">
              <Input type="text" value={typedMessage} onKeyDown={(e:any)=>onEnterClick(e)} onChange={onInputChange} placeholder="write message" className="w-[95%] p-1 rounded"/>
              <InputRightElement><IoMdSend onClick={onSendIconClick} className="text-2xl cursor-pointer" /></InputRightElement>
              
              </InputGroup>
            </Box>
          </Box>
          </>:<>
          <div className="w-[100%] h-[90vh] flex items-center justify-center">
            <h1 className="text-2xl">Please select users to start chat</h1>
          </div>
          </>}
      </div>
   
    </div>
  );
};

export default MyChatBox;
