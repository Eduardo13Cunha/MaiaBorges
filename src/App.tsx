import {
  Box,
  ChakraProvider,
  Spacer,
  theme,
} from "@chakra-ui/react"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import { AnimatePresence, motion } from 'framer-motion';
import HomePage from "./Pages/Home/HomePage"
import HomePage2 from "./Pages/Home/HomePage2"
import Header from "./Components/Header/Header"
import Body from "./Components/Body/Body"
import Footer from "./Components/Footer/Footer"
import DataEquipamento from "./Pages/DateBase/DataEquipamento"
import DataTecnico from "./Pages/DateBase/DataTecnico"
import DataLocal from "./Pages/DateBase/DataLocal"
import DataFornecedor from "./Pages/DateBase/DataFornecedores";
import DataTicket from "./Pages/DateBase/DataTicket";

export const App = () => (
  <ChakraProvider theme={theme}>
    <Box w="100%" h="100%" maxW="100%" maxH="100%">
      <Header/>
      <Body>
        <BrowserRouter>
          <AnimatePresence exitBeforeEnter></AnimatePresence>
          <Routes>
            <Route path="/" element={<HomePage/>}/>
            <Route path="/DataEquipamento" element={<DataEquipamento/>}/>
            <Route path="/DataTecnico" element={<DataTecnico/>}/>
            <Route path="/DataLocal" element={<DataLocal/>}/>
            <Route path="/DataFornecedor" element={<DataFornecedor/>}/>
            <Route path="/DataTicket" element={<DataTicket/>}/>
            <Route path="/HomePage2" element={<HomePage2/>}/>
          </Routes>
        </BrowserRouter>
        <Spacer h="100%"/>
        <Footer/>
      </Body>
    </Box>
  </ChakraProvider>
)
