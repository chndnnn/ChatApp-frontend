import {
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  Input,
  Button,
  Box,
  Stack,
} from "@chakra-ui/react";
import axios from "axios";
import React, {ReactNode, useEffect, useState } from "react";
import { chatState } from "../chatContext/ChatssProvider";
import DisplayAllSearchedUser from "./DisplayAllSearchedUser";
import { Skeleton } from "@chakra-ui/react";
import { toast, ToastContainer } from "react-toastify";

interface LeftDrawerProps {
  children: ReactNode;
}

let baseUrl = 'https://chatapp-backend-1-kwns.onrender.com'

const LeftDrawer: React.FC<LeftDrawerProps> = ({ children }) => {
  const { users } = chatState();
  let [searchedUSer, setSearchedUser] = useState();
  let [searchedUserlist, setSearchedUserlist] = useState([]);
  let [loading, setLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  function onInputChange(e: any) {
    setSearchedUser(e.target.value);
  }

  useEffect(() => {
    searchUsers();
  }, []);

  function searchUsers(user = "") {
    setLoading(true);
    let config = {
      headers: {
        Authorization: `Bearer ${users?.token}`,
      },
    };

    axios
      .get(`${baseUrl}/chat/v1/?search=${user}`, config)
      .then((res) => {
        setSearchedUserlist(res.data.getAlluser);
        setLoading(false);
      }).catch(()=>{
        toast.error("Invalid credentials",{
          containerId:"leftDrawer",
          autoClose: 2000,
          draggable: true,
          closeOnClick: true,
        })
        setLoading(false);
      })

    }


  function onGoClick() {
    searchUsers(searchedUSer);
  }

  return (
    <>
      <span onClick={onOpen}>{children}</span>
      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
        <DrawerCloseButton />
          <DrawerHeader>Search Users</DrawerHeader>

          <DrawerBody>
            <Box display="flex">
              <Input placeholder="Type here..." onChange={onInputChange} />
              <Button onClick={onGoClick}>Go</Button>
            </Box>
            <Box display="flex" flexDirection="column">
              {loading ? (
                <Stack>
                  <Skeleton height="20px" className="mt-2" />
                  <Skeleton height="20px" />
                  <Skeleton height="20px" />
                  <Skeleton height="20px" />
                  <Skeleton height="20px" />
                  <Skeleton height="20px" />
                  <Skeleton height="20px" />
                  <Skeleton height="20px" />
                  <Skeleton height="20px" />
                  <Skeleton height="20px" />
                  <Skeleton height="20px" />
                  <Skeleton height="20px" />
                  <Skeleton height="20px" />
                  <Skeleton height="20px" />
                  <Skeleton height="20px" />
                </Stack>
              ) : (<>
                <ToastContainer
                containerId="leftDrawer"
                closeOnClick={true}
                position="top-right"
              />
                <DisplayAllSearchedUser allUserData={searchedUserlist} onUserclick={onClose} />
                </>
              )}
            </Box>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default LeftDrawer;
