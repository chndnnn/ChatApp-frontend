import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Homepage from "./Pages/Homepage";
import Chatpage from "./Pages/Chatpage";
import ChatssProvider from "./chatContext/ChatssProvider.tsx";

function App() {

  return (
    <ChakraProvider>
      <BrowserRouter>
        <ChatssProvider>
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/chat/:id" element={<Chatpage />} />
          </Routes>
        </ChatssProvider>
      </BrowserRouter>
    </ChakraProvider>
  );
}

export default App;
