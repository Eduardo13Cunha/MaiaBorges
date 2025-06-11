import React, { useState } from 'react';
import { VStack, Text, Box, Button, Textarea, useToast } from '@chakra-ui/react';
import { FaPaperPlane } from 'react-icons/fa';
import axios from 'axios';
import Cookies from 'js-cookie';

export const ContactosForm: React.FC = () => {
  const [message, setMessage] = useState('');
  const toast = useToast();

  const handleSubmit = async () => {
    if (!message.trim()) {
      toast({
        title: "Campo vazio",
        description: "Por favor, escreva uma mensagem antes de enviar.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      const userName = Cookies.get('userName');
      const userId = Cookies.get('userId');
      await axios.post('/.netlify/functions/email/send-email', { userName, userId, sugestao: message });
      setMessage('');
      toast({
        title: "Mensagem enviada",
        description: "Sua mensagem foi enviada com sucesso.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Erro ao enviar",
        description: "Não foi possível enviar sua mensagem. Tente novamente.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box>
      <Text fontSize="2xl" fontWeight="bold" color="text.primary.100" mb="2%">
        CONTACTE_NOS ATRAVÉS DO EMAIL
      </Text>
      <VStack spacing={4} align="stretch">
        <Textarea
          color="text.primary.100"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Escreva sua mensagem aqui..."
          h="150px"
          _hover={{ bg: 'indigo.500/50' }}
          _focus={{ bg: 'indigo.500/60' }}
        />
        <Box width="100%" justifyContent="flex-end" display="flex">
          <Button
            leftIcon={<FaPaperPlane />}
            onClick={handleSubmit}          
            className="SaveButton"
          >
            Enviar
          </Button>
        </Box>
      </VStack>
    </Box>
  );
};