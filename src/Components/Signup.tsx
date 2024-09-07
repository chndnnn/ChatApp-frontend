import {
  Input,
  InputGroup,
  InputRightElement,
  VStack,
  useBreakpointValue,
} from "@chakra-ui/react";
import { FormControl, FormLabel } from "@chakra-ui/react";
import { Button } from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { ToastContainer, toast } from "react-toastify";

interface iState {
  profilePic: string;
  showPass: boolean;
}
interface iProp {
  onToggle: any;
}

let baseUrl = 'https://chatapp-backend-1-kwns.onrender.com'

const Signup: React.FC<iProp> = ({ onToggle }) => {
  let emailref: any = useRef();
  let name: any = useRef();
  let passwordref: any = useRef();
  let Confirmpasswordref: any = useRef();
  let [state, setState] = useState<iState>({ profilePic: "", showPass: false });
  const ShowButtonColor = useBreakpointValue({ base: "white", md: "black" });
  const [imgurl, setimgurl] = useState();
  let [loading, setLoading] = useState(false);
  let [showImage, setShowImage] = useState(false);
  function onSigUpClick() {
    let data = {
      name: name.current.value,
      email: emailref.current.value,
      password: passwordref.current.value,
      image: imgurl,
    };
    if (passwordref.current.value !== Confirmpasswordref.current.value) {
      return toast.error("password and confirmpassword doesnt match", {
        containerId: "B",
      });
    }

    axios
      .post(`${baseUrl}/chat/v1/signup`, data)
      .then((res: any) => {
        if (res.data.status === "success") {
          toast.success("Signup Successfull!!", {
            containerId: "B",
          });
          onToggle();
        } else {
          toast.error(res.response.data.message, {
            containerId: "B",
          });
        }
      })
      .catch((err: any) => {
        console.log(err);
        toast.error(err.response.data.message, {
          containerId: "B",
        });
      });
  }

  useEffect(() => {
    if (state.profilePic) {
      saveImage();
    }
  }, [state.profilePic]);
  function handleImageChange(e: any) {
    let file = e.target.files[0] || "";
    setState((prev) => ({
      ...prev,
      profilePic: file,
    }));
  }

  async function saveImage() {
    setLoading(true);
    const data = new FormData();
    data.append("file", state.profilePic);
    data.append("upload_preset", "ChatApp");
    data.append("cloud_name", "depf0vje1");
    try {
      await axios
        .post("https://api.cloudinary.com/v1_1/depf0vje1/image/upload", data)
        .then((res) => {
          setimgurl(res.data["secure_url"]);
          setLoading(false);
        });
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <>
      <VStack
        spacing={1}
        zIndex={showImage && imgurl ? "-1" : ""}
        opacity={showImage && imgurl ? "0.5" : "1"}
      >
        <FormControl id="email" isRequired={true}>
          <FormLabel>Email address</FormLabel>
          <Input type="text" ref={emailref} />
        </FormControl>
        <FormControl id="name" isRequired={true}>
          <FormLabel>Name</FormLabel>
          <Input type="text" ref={name} />
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
                  setState((state) => ({
                    ...state,
                    showPass: !state.showPass,
                  }));
                }}
              >
                {state.showPass ? "hide" : "show"}
              </Button>
            </InputRightElement>
          </InputGroup>
        </FormControl>
        <FormControl id="Confirmpass" isRequired={true}>
          <FormLabel>Confirm Password</FormLabel>
          <InputGroup>
            <Input
              type={state.showPass ? "text" : "password"}
              ref={Confirmpasswordref}
            />
            <InputRightElement width={"70px"}>
              <Button
                color={ShowButtonColor}
                colorScheme="white"
                onClick={() => {
                  setState((state) => ({
                    ...state,
                    showPass: !state.showPass,
                  }));
                }}
              >
                {state.showPass ? "hide" : "show"}
              </Button>
            </InputRightElement>
          </InputGroup>
        </FormControl>
        <FormControl id="image">
          <FormLabel>Profile Image</FormLabel>
          <InputGroup>
            <Input
              type="file"
              p={1.5}
              accept="image/*"
              onChange={handleImageChange}
            />
            <InputRightElement
              onClick={() => {
                setShowImage((prev) => !prev);
              }}
            >
              {imgurl ? (
                <img src={imgurl} alt="" className="rounded-full" />
              ) : (
                ""
              )}
            </InputRightElement>
          </InputGroup>
        </FormControl>
        <Button
          colorScheme="blue"
          marginRight={"auto"}
          height={"30px"}
          marginTop={"8px"}
          width={"150px"}
          onClick={onSigUpClick}
          isLoading={loading}
        >
          Signup
        </Button>
        <ToastContainer containerId={"B"} position="top-center" />
        {/* <div className="absolute inset-0 bg-black opactiy-10"></div> */}
      </VStack>
      {showImage && imgurl ? (
        <div className="absolute flex justify-center items-center top-10 md:ml-auto md:h-[400px] w-[300px] h-[300px] md:w-[400px] bg-blue-200 z-10 opacity-100 overflow-hidden rounded-full">
          <img src={imgurl} className="h-[80%] w-[80%]"></img>
        </div>
      ) : (
        ""
      )}
    </>
  );
};

export default Signup;
