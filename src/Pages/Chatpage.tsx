import { Box } from "@chakra-ui/react";
import { chatState } from "../chatContext/ChatssProvider";
import SideDrawer from "../Components/SideDrawer";
import Mychats from "../Components/Mychats";
import MyChatBox from "../Components/MyChatBox";

const Chatpage: React.FC = () => {
  let { users } = chatState();
  return (
    <div className="w-[100%] h-[100vh]">
      {users && <SideDrawer />}
      <Box display="flex">
        {users && <Mychats />}
        {users && <MyChatBox />}
      </Box>
    </div>
  );
};

export default Chatpage;
