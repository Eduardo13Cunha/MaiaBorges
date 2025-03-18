import React, { useEffect, useState } from 'react';
import { Text, Box, Button, HStack, Img, VStack, IconButton, Textarea } from "@chakra-ui/react";
import MaiaBorgesLogo from '../../Assets/MaiaBorgesLogoGrande.png';
import { FaGlobe } from 'react-icons/fa';
import axios from 'axios';
import Cookies from 'js-cookie';

const HomePage: React.FC = () => {
  const [sugestao, setSugestao] = useState('');

  useEffect(() => {
      const storedName = Cookies.get('userName');
      if (storedName) {
        window.location.href = '/HomePage2';
      }
  }, []);

  const handleSubmit = async () => {
    if (sugestao !== "") {
      try {
          await axios.post('/.netlify/functions/email/send-email', { sugestao });
          alert('Sugestão enviada com sucesso!');
          setSugestao('');
      } catch (error) {
          console.error('Erro ao enviar a sugestão:', error);
          alert('Erro ao enviar a sugestão. Tente novamente.');
      }
    } else { alert("Sugestão Vazia")};
  };

  return (
    <>
      <Box
        width="98%"
        p={8}
      >
        <Box display="flex" justifyContent="center" minW="100%">
        <Img
            width="20%"
            src={MaiaBorgesLogo}
            alt="IT Park Manager Logo"
            borderRadius="md"
        />
        </Box>
      </Box>
      <HStack
        color="white"
        width="95%"
        borderRadius="5vh" // Bordas arredondadas
        boxShadow="md" // Sombra para profundidade
        bg="gray.900"
        fontFamily=""
        display="flex"
        alignItems="flex-start"
        justifyContent="space-between"
        p={8}
      >
        <VStack spacing={8} mt={8}>
          <Text minW="100%" fontSize="120%" maxW="20%">
                Este site será utilizado para realizar um PAP(Prova de Aptidão Profissonal)
          </Text>
          <HStack fontSize="140%" minW="100%" alignSelf="left">
            <IconButton
                as="a"
                href="https://rauldoria.pt"
                icon={<FaGlobe />}
                aria-label="Website"
                colorScheme="black"
                size="150%"
            />
            <Text>Raul Dória</Text>
          </HStack>
          
        </VStack>

          {/* Caixa de Feedback */}
          <VStack color="white" alignItems="flex-start" spacing={4} width="50%">
              <Text fontSize="2xl" fontWeight="bold">Deixe a sua Sugestão</Text>
              <Textarea placeholder="Escreva sua sugestão aqui..." size="lg" value={sugestao} onChange={(e) => setSugestao(e.target.value)}/>
              <Button color="white" bg="mediumBlue" _hover={{ bg: "blue.600", transform: "scale(1.05)" }} onClick={handleSubmit}>Enviar</Button>
          </VStack>
      </HStack>
    </>
  );
}

export default HomePage;