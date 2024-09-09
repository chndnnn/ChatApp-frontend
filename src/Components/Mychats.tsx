import { Box, Button } from "@chakra-ui/react";
import { chatState } from "../chatContext/ChatssProvider";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { useEffect, useState } from "react";
import { displayedUserName } from "./../Functions/ChatFunctions";
import { IoMdAdd } from "react-icons/io";
import GroupChatModal from "./GroupChatModal";

let baseUrl = "https://chatapp-backend-1-kwns.onrender.com"

const Mychats = () => {


  let { users , setChat,chat,selectedChat,setSelectedChat,showResponsive,SetShowResponsive,allNotificationData,setAllNotificationData,darkMode} = chatState()
  let [sideloading] = useState(false)

  useEffect(() => {
    fetchChats(); 
  }, [selectedChat]);

  useEffect(()=>{
    fetchNotification()
  },[])

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

  const fetchChats = async () => {
    
    try {
      let config = {
        headers: {
          Authorization: `Bearer ${users?.token}`,
        },
      };

      await axios
        .get(`${baseUrl}/chat/v1/getAllChats`, config)
        .then((res) => {
          setChat(res.data.myChats);
        });
    } catch (err: any) {
      toast.error(err);
    }
  };

  function onMyChatClick(chat:any){
    setSelectedChat(chat)
    SetShowResponsive(true)
  }
  return (
    <Box className={`mt-1 w-[100%] md:w-[28%] h-[90vh] ${!darkMode?'bg-slate-200 ':'bg-slate-600 text-gray-50'} ${showResponsive?"hidden md:flow-root":''}`}>
      <div className="w-[100%] h-[10%] flex justify-between items-center p-2">
        <h2 className="text-2xl">My Chats</h2>
        <GroupChatModal> <Button colorScheme={`${!darkMode?'gray':'blackAlpha'}`}  rightIcon={<IoMdAdd className="text-2xl " />}>New Group Chat </Button></GroupChatModal>
      </div>
      {
                    sideloading && <div className="flex ">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-blue-500"></div>
                    </div>
          }
    
      {chat?.map((chat: any,index:any) => {
        return (
            <Box key={index} onClick={()=>onMyChatClick(chat)} className={`overflow-y-scroll h-[50px] w-[95%] ml-2 mt-1 cursor-pointer hover:bg-slate-400 hover:text-black pl-2 pr-2 rounded ${selectedChat?._id == chat._id?'bg-teal-200 border border-solid text-black':!darkMode?'bg-slate-300 ':'bg-slate-500 text-white'}} `}>
            <span >
            {chat.chatName == "sender"
              ? displayedUserName(users?.user?.name, chat.users)
              : chat.chatName}
               {allNotificationData && allNotificationData[chat._id] > 0 && (
              <span className="ml-2 bg-red-500 text-white rounded-full px-2 text-xs">
                {allNotificationData[chat._id]}
              </span>
            )}
              </span>
              { chat?.latestMessage && 
              <span className='flex overflow_hidden ' >
              <p className="text-xs text-nowrap font-bold">{chat?.latestMessage?.sender?._id == users?.user?._id ? "you":chat?.latestMessage?.sender?.name}</p>
              <p className="text-xs text-nowrap overflow-hidden text-ellipsis">: {chat?.latestMessage?.content}</p>
              </span>
              }
           
          </Box>
        );
      })}
      <ToastContainer />
    </Box>
  );
};

export default Mychats;
