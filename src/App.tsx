import {
  Box,
  ChakraProvider,
  Spacer,
  theme,
} from "@chakra-ui/react"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import { AnimatePresence } from 'framer-motion';
import HomePage from "./Pages/Home/HomePage"
import HomePage2 from "./Pages/Home/HomePage2"
import Header from "./Components/Header/Header"
import Body from "./Components/Body/Body"
import Footer from "./Components/Footer/Footer"
import DataCliente from "./Pages/DateBase/Clientes/DataCliente";
import DataColaborador from "./Pages/DateBase/Colaboradores/DataColaborador";
import DataMaquina from "./Pages/DateBase/Maquinas/DataMaquina";
import DataEncomendas from "./Pages/DateBase/Encomendas/DataEncomendas";
import DataFigura from "./Pages/DateBase/Figuras/DataFigura";
import DataMaterial from "./Pages/DateBase/Materiais/DataMaterial";
import DataAcompanhamento from "./Pages/DateBase/Acompanhamento/DataAcompanhamento";
import DataPlanoTrabalho from "./Pages/DateBase/PlanoTrabalho/DataPlanoTrabalho";

export const App = () => (
  <ChakraProvider theme={theme}>
    <Box w="100%" h="100%" maxW="100%" maxH="100%">
      <Header/>
      <Body>
        <BrowserRouter>
          <AnimatePresence exitBeforeEnter></AnimatePresence>
          <Routes>
            <Route path="/" element={<HomePage/>}/>
            <Route path="/DataColaborador" element={<DataColaborador/>}/>
            <Route path="/DataMaquina" element={<DataMaquina/>}/>
            <Route path="/DataEncomendas" element={<DataEncomendas/>}/>
            <Route path="/DataFigura" element={<DataFigura/>}/>
            <Route path="/DataCliente" element={<DataCliente/>}/>
            <Route path="/DataMaterial" element={<DataMaterial/>}/>
            <Route path="/DataAcompanhamento" element={<DataAcompanhamento/>}/>
            <Route path="/DataPlanoTrabalho" element={<DataPlanoTrabalho/>}/>
            <Route path="/HomePage2" element={<HomePage2/>}/>
          </Routes>
        </BrowserRouter>
        <Spacer h="100%"/>
        <Footer/>
      </Body>
    </Box>
  </ChakraProvider>
)
