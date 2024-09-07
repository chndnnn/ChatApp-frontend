import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import Signup from "../Components/Signup";
import Loggin from "../Components/Loggin";
import { useBreakpointValue } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const Homepage: React.FC = () => {
  let [index, setIndex] = useState(0);
  const tabColor = useBreakpointValue({ base: "white", md: "black" });
  let navigate = useNavigate();

  useEffect(() => {
    let user;
    try {
      user = JSON.parse(localStorage.getItem("userInfo") || "");
    } catch (err) {
      console.log(err);
    }
    if (user) {
      navigate("/chat/:id");
    }
  }, [navigate]);

  function toggleTab(): any {
    setIndex(0);
  }
  return (
    <div className="h-[100vh] w-[100%]  md:bg-[url('./ChatBackground.jpg')] bg-[url('./mobChatBg.avif')] bg-no-repeat bg-center bg-cover">
      <div className="absolute inset-0 bg-black opacity-60 md:opacity-0"></div>
      <div className="md:absolute md:top-5 md:left-5 w:[90%] md:w-[50%] flex flex-col">
        <div className="h-[60px] w-[100%] md:bg-white flex justify-center items-center rounded">
          <h1 className="text-4xl text-white font-sans text-white md:text-black z-10 ">
            talk-N-express
          </h1>
        </div>

        <div className="flex-grow md:bg-white mt-5 rounded p-[5px] md:text-black text-white">
          <Tabs
            variant="soft-rounded"
            index={index}
            onChange={(index) => setIndex(index)}
          >
            <TabList>
              <Tab width="50%" color={tabColor}>
                Login
              </Tab>
              <Tab width="50%" color={tabColor}>
                Sign-Up
              </Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <Loggin />
              </TabPanel>
              <TabPanel>
                <Signup onToggle={toggleTab} />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
