import {Box,VStack,Img,FormControl,FormLabel,Input,Button,Heading,HStack,Spacer} from "@chakra-ui/react";
import { useState } from "react";
import MaiaBorgesLogoGrande from "../../Assets/MaiaBorgesLogoGrande.png";
import Cookies from "js-cookie";
import { Colaborador } from "../../Interfaces/interfaces";
import axios from "axios";
import PasswordInput from "../../Components/ReUsable/Inputs/PasswordInput";
import { useCustomToast } from "../../Components/Toaster/toaster";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const showToast = useCustomToast();

  const handleLogin = async () => {
      try {
          const response = await axios.post('/.netlify/functions/auth', { email, password });
          
          if (response.status === 200) {
              const user = (response.data as { data: Colaborador }).data;

              Cookies.set('userName', user.nome);
              Cookies.set('IsLoggedIn', true.toString());
              Cookies.set('userId', user.id_colaborador.toString());
              window.location.href = '/HomePage2';
          } else if (response.status === 401) {
              
          }
      } catch (error: any) {
          if (email === "" || password === "") {
            showToast({
              title: 'Preencha todos os campos',
              description: 'Por favor, preencha todos os campos obrigatórios.',
              status: 'error',
            });
          } else if (error?.response?.status === 404) {
            showToast({
              title: 'Email inválido',
              description: 'Verifique se o email está correto.',
              status: 'error',
            });
          } else if (error?.response?.status === 401) {
            showToast({
              title: 'Password inválida',
              description: 'Verifique se a password está correta.',
              status: 'error',
            });
          }
      }
  };

  return (
      <Box
        p={8}
        bg="white"
        borderRadius="xl"
        boxShadow="lg"
        w="100%"
        maxW="400px"
        className="TableModal"
      >
        <VStack spacing={6}>
          <HStack>
            <Heading as="h1" textAlign="center">
              Iniciar Sessão
            </Heading>
            <Spacer />
            <Img src={MaiaBorgesLogoGrande} maxH="20%" maxW="20%" />
          </HStack>
          <FormControl>
            <FormLabel>
              <strong>Email</strong>
            </FormLabel>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </FormControl>

          <FormControl>
            <FormLabel>
              <strong>Palavra-Passe</strong>
            </FormLabel>
            <PasswordInput password={password} setPassword={setPassword}/>
          </FormControl>

          <Button
            colorScheme="teal"
            width="full"
            className="SaveButton"
            onClick={handleLogin}
          >
            Entrar
          </Button>
        </VStack>
      </Box>
  );
};

export default LoginPage;
