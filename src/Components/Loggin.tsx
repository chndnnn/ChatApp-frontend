import { FormControl, FormLabel, useBreakpointValue, useToast } from "@chakra-ui/react";
import { Input, InputGroup, InputRightElement, VStack } from "@chakra-ui/react";
import { Button } from "@chakra-ui/react";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";

interface istate {
  showPass: boolean;
}

let baseUrl = 'https://chatapp-backend-1-kwns.onrender.com'

const Loggin: React.FC = () => {
  let nav = useNavigate();
  let emailref: any = useRef("");
  let passwordref: any = useRef();
  let [state, setState] = useState<istate>({ showPass: false });
  let [loading, setloading] = useState(false);
  let [guestLoading, setGuestLoading] = useState(false);
  let toast = useToast();
  const ShowButtonColor = useBreakpointValue({ base: "white", md: "black" });

   async function onGuestloginClick(){
    setGuestLoading(true);
    let data = {
      email: "guest@gmail.com",
      password: "123456"
    };
    await axios
      .post(`${baseUrl}/chat/v1/login`, data)
      .then((res) => {
        if (res.data.status == "success") {
          let test = JSON.stringify(res.data);
          let id = res.data.user._id;
          localStorage.setItem("userInfo", test);
          nav(`/chat/${id}`);
          setloading(false);
        } else {
          toast({
            title: 'Invalid Cred.',
            status: 'error',
            duration: 9000,
            isClosable: true,
          })
          setGuestLoading(false);
        }
      })
      .catch((err) => {
        if (!data.email || !data.password) {
          toast({
            title: 'Invalid Cred.',
            status: 'error',
            duration: 9000,
            isClosable: true,
          })
          setGuestLoading(false);
        } else {
          toast({
            title: 'network issue.',
            status: 'error',
            duration: 9000,
            isClosable: true,
          })
          setGuestLoading(false);
        }
        console.log(err);
      });

  }
  
  async function onloginClick() {
    setloading(true);
    let data = {
      email: emailref.current.value,
      password: passwordref.current.value,
    };
    await axios
      .post(`${baseUrl}/chat/v1/login`, data)
      .then((res) => {
        if (res.data.status == "success") {
          let test = JSON.stringify(res.data);
          let id = res.data.user._id;
          localStorage.setItem("userInfo", test);
          nav(`/chat/${id}`);
          setloading(false);
        } else {
          toast({
            title: 'Invalid Cred.',
            status: 'error',
            duration: 9000,
            isClosable: true,
          })
          setloading(false);
        }
      })
      .catch((err) => {
        if (!data.email || !data.password) {
          toast({
            title: 'Invalid Cred.',
            status: 'error',
            duration: 9000,
            isClosable: true,
          })
          setloading(false);
        } else {
          toast({
            title: 'network issue.',
            status: 'error',
            duration: 9000,
            isClosable: true,
          })
          setloading(false);
        }
        console.log(err);
      });
  }
  return (
    <VStack spacing={1}>
      <FormControl id="email" isRequired={true}>
        <FormLabel>Email address</FormLabel>
        <Input type="text" ref={emailref} />
      </FormControl>
      <FormControl id="pass" isRequired={true}>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            type={state.showPass ? "text" : "password"}
            ref={passwordref}
          />
          <InputRightElement width={"70px"}>
            <Button
              color={ShowButtonColor}
              colorScheme="white"
              onClick={() => {
                setState((state) => ({ ...state, showPass: !state.showPass }));
              }}
            >
              {state.showPass ? "hide" : "show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <div className="flex mr-auto ">
      <Button
        colorScheme="blue"
        marginTop={"10px"}
        width={"150px"}
        onClick={onloginClick}
        isLoading={loading}
      >
        Login
      </Button>
      <Button
        colorScheme="green"
        marginTop={"10px"}
        width={"150px"}
        marginLeft={"4px"}
        isLoading={guestLoading}
        onClick={onGuestloginClick}
      >
        Guest user Login
      </Button>
      </div>
    </VStack>
  );
};

export default Loggin;
