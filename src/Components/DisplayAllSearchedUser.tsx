import { Avatar } from "@chakra-ui/react";
import { chatState } from "../chatContext/ChatssProvider";
import axios from "axios";
import { useEffect } from "react";

interface DisplayAllSearchedUserInterface {
  allUserData: any[];
  onUserclick:any
}

let baseUrl = 'https://chatapp-backend-1-kwns.onrender.com'

const DisplayAllSearchedUser: React.FC<DisplayAllSearchedUserInterface> = ({
  allUserData,onUserclick
}) => {
 
  const { users ,setSelectedChat,onlineUser,setOnlineUser} = chatState();

  useEffect(()=>{
    let items: any[] = []
   allUserData.forEach((user)=>{
    if(user.is_online){
      items.push(user._id)
    }
   })
   setOnlineUser((prev)=>[...prev,...items])

   },[])
  
  async function onUserClick(user:any){
       const headers = {
        "Authorization" : `Bearer ${users?.token}`
    }
    const data = {
      "userID": user._id
    }
   
    await axios.post(`${baseUrl}/chat/v1/accessChat`,data,{headers}).then((res)=>{
      setSelectedChat(res.data)
    })

    onUserclick()
  }
  return (
    <div className="py-2">
      {allUserData.map((user: any, index: number) => {
        return (
          <div key={index} className="my-2 h-[50px] flex bg-slate-100 hover:bg-slate-200 rounded cursor-pointer" onClick={()=>onUserClick(user)}>
            <div className="relative h-[100%] w-[25%] pl-2">
              <Avatar name={user.name} src={user.image}/>
              <sup className={`ml-[-5px] absolute top-2 ${onlineUser.includes(user._id) ? 'bg-green-500' : 'bg-red-500'} rounded-full`} style={{ width: '12px', height: '12px' }}></sup>
            </div>
            <div className="flex flex-col">
              <span>
                <b>{user.name}</b>
               
              </span>
              <span>{user.email}</span>
            </div>
            
          </div>
        );
      })}
    </div>
  );
};

export default DisplayAllSearchedUser;
