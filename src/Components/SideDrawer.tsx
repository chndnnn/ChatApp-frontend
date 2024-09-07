import {
  Box,
  Tooltip,
  Text,
  Button,
  Menu,
  MenuButton,
  Avatar,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import { chatState } from "../chatContext/ChatssProvider";
import { FaChevronDown } from "react-icons/fa";
import { FaBell } from "react-icons/fa";
import { FaSearch } from "react-icons/fa";
import ProfileModal from "./ProfileModal";
import { useNavigate } from "react-router-dom";
import LeftDrawer from "./LeftDrawer";
import { displayedUserName } from "../Functions/ChatFunctions";
import { MdOutlineLightMode } from "react-icons/md";
import { MdDarkMode } from "react-icons/md";
import { io, Socket } from "socket.io-client";

const ENDPOINT = "https://chatapp-backend-1-kwns.onrender.com";


const SideDrawer: React.FC = () => {
  const { users,SetShowResponsive,notification,setNotification ,darkMode,setDarkMode} = chatState();
  let Navigate = useNavigate();
  const socket: Socket = io(ENDPOINT,{
    auth:{
      token:users?.user
    }
  });

  function onLogoutClick() {
    localStorage.removeItem("userInfo");
    Navigate("/");
    socket.disconnect();
  }

  const onModeClick = ()=>{
    setDarkMode((prev)=>!prev)
  }

  return (
    <>
      <Box className={`h-[55px] flex items-center justify-between p-2  ${!darkMode?'bg-slate-300 ':'bg-slate-700 text-gray-50'}`}>
        <Tooltip label="Search Users" hasArrow={true}>
          <LeftDrawer>
            <Button colorScheme={`${!darkMode?'gray':'blackAlpha'}`}>
              <FaSearch />
              <Text className={`hidden md:flow-root`} pl={3}>Search user</Text>
            </Button>
          </LeftDrawer>
        </Tooltip>
        <Text className="md:text-2xl text-lg">talk-N-express</Text>
        <div className="flex">
          <Menu>
            <MenuButton onClick={onModeClick} className="mr-2 ">
              {!darkMode?
           <MdDarkMode className="text-2xl" />:<MdOutlineLightMode className="text-2xl rounded-full"/>
              }
            </MenuButton>
          </Menu> 
          <Menu>
            <MenuButton colorScheme={`${!darkMode?'gray':'blackAlpha'}`} as={Button} rightIcon={<FaChevronDown />}>
              <Avatar size="xs" name={users?.user.name} src={users?.user.image}></Avatar>
            </MenuButton>
            <MenuList color={"black"} >
              <ProfileModal users={users}>
                <MenuItem>Profile</MenuItem>
              </ProfileModal>
              <MenuItem onClick={onLogoutClick}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>
    </>
  );
};
export default SideDrawer;
