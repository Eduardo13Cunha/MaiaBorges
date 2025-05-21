import React, { useState, useEffect } from 'react';
import { HStack, VStack, useToast } from '@chakra-ui/react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { isLoggedIn } from '../../Routes/validation';
import { IconInput } from '../../Components/ReUsable/Inputs/IconInput';
import { FaPen } from 'react-icons/fa';

const PerfilPage: React.FC = () => {
  const [profile, setProfile] = useState<any | null>(null);
  const [Nome, setNome] = useState<string>("Eduardo");
  const toast = useToast();

  useEffect(() => {
    isLoggedIn();
    const fetchProfile = async () => {
      try {
        const userId = Cookies.get('userId');
        const response = await axios.get(`/.netlify/functions/colaboradores/perfil/${userId}`);
        setProfile(response.data.data);
        console.log(profile);
      } catch (error) {
        toast({
          title: "Erro ao carregar perfil",
          description: "Não foi possível carregar os dados do perfil.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    };

    fetchProfile();
  }, [toast]);

  return (
    <HStack>
      <VStack>
        <IconInput value={Nome} icon={<FaPen/>} />
          
      </VStack>
    </HStack>
  );
};

export default PerfilPage;