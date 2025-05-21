import {
  Box,
  ChakraProvider,
  Spacer,
} from "@chakra-ui/react"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import { AnimatePresence } from 'framer-motion';
import LoginPage from "./Pages/Home/LoginPage"
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
import HistoricoPage from "./Pages/DateBase/Historico/HistoricoData";
import HomePage from "./Pages/Home/HomePage";
import PerfilPage from "./Pages/Home/PerfilPage";
import theme from "./Themes/themes";

export const App = () => (
  <ChakraProvider theme={theme}>
    <Box w="100%" h="100%" maxW="100%" maxH="100%">
      <Header/>
      <Body>
        <BrowserRouter>
          <AnimatePresence exitBeforeEnter></AnimatePresence>
          <Routes>
            <Route path="/" element={<LoginPage/>}/>
            <Route path="/DataColaborador" element={<DataColaborador/>}/>
            <Route path="/DataMaquina" element={<DataMaquina/>}/>
            <Route path="/DataEncomendas" element={<DataEncomendas/>}/>
            <Route path="/DataFigura" element={<DataFigura/>}/>
            <Route path="/DataCliente" element={<DataCliente/>}/>
            <Route path="/DataMaterial" element={<DataMaterial/>}/>
            <Route path="/DataAcompanhamento" element={<DataAcompanhamento/>}/>
            <Route path="/DataPlanoTrabalho" element={<DataPlanoTrabalho/>}/>
            <Route path="/HomePage" element={<HomePage/>}/>
            <Route path="/PerfilPage" element={<PerfilPage/>}/>
            <Route path="/Historico" element={<HistoricoPage/>}/>
          </Routes>
        </BrowserRouter>
        <Spacer h="100%"/>
        <Footer/>
      </Body>
    </Box>
  </ChakraProvider>
)
