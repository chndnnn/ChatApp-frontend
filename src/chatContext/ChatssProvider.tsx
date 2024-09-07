import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";

interface iProp {
  children: ReactNode;
}
interface User {
  id: number;
  name: string;
  image: string;
  token: String;
  user: any;
  _id :any
}

interface SelectedChat{
 _id : string;
 users:any
}

interface Chat{
  chat : []
}
interface ChatContextProps {
  users: User | null;
  setUsers: React.Dispatch<React.SetStateAction<User | null>>;
  selectedChat : SelectedChat | null ;
  setSelectedChat : React.Dispatch<React.SetStateAction<SelectedChat | null>>;
  chat : Chat[] | null ;
  setChat : React.Dispatch<React.SetStateAction<Chat[] | null>>;
  showResponsive : boolean
  SetShowResponsive : React.Dispatch<React.SetStateAction<boolean>>;
  notification: any[];
  setNotification: React.Dispatch<React.SetStateAction<any[]>>
  onlineUser: any[];
  setOnlineUser: React.Dispatch<React.SetStateAction<any[]>>
  allNotificationData: Record<string, number>;
  setAllNotificationData : any
  darkMode : boolean
  setDarkMode:React.Dispatch<React.SetStateAction<boolean>>
}

const chatContext = createContext<ChatContextProps | undefined>(undefined);

const ChatssProvider: React.FC<iProp> = ({ children }) => {
  const [users, setUsers] = useState<User | null>(null);
  const [selectedChat,setSelectedChat] = useState<SelectedChat | null>(null)
  const [chat,setChat] = useState<Chat[] | null>(null)
  const [showResponsive,SetShowResponsive] = useState(false)
  const [darkMode,setDarkMode] = useState(false)
  const [notification,setNotification] = useState<any[]>([]);
 const [onlineUser,setOnlineUser] = useState<any[]>([]);
 let[allNotificationData,setAllNotificationData]=useState<Record<string, number>>({});
 
  let navigate = useNavigate();
  useEffect(() => {
    let userInfo;
    try {
      userInfo = JSON.parse(localStorage.getItem("userInfo") || "");
    } catch (err) {
      console.log(err);
    }
    setUsers(userInfo);
    if (!userInfo) {
      navigate("/");
    }
  }, [navigate]);
  return (
    <chatContext.Provider value={{ users, setUsers,selectedChat,setSelectedChat,chat,setChat,showResponsive,SetShowResponsive,allNotificationData,setAllNotificationData,notification,darkMode,setDarkMode,setNotification,onlineUser,setOnlineUser}}>
      {children}
    </chatContext.Provider>
  );
};

export const chatState = () => {
  const context = useContext(chatContext);
  if (!context) {
    throw new Error("useChatState must be used within a ChatssProvider");
  }
  return context;
};

export default ChatssProvider;
