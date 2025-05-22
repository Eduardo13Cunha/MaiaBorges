import React, { useState, useEffect } from 'react';
import { Box, Flex, useToast } from '@chakra-ui/react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { ContactosForm } from './ContactosForms';
import { isLoggedIn } from '../../../Routes/validation';
import { PerfilForms } from './PerfilForms';

const PerfilPage: React.FC = () => {
  const [profile, setProfile] = useState<any | null>(null);
  const [editingProfile, setEditingProfile] = useState<any | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const toast = useToast();

  useEffect(() => {
    isLoggedIn();
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const userId = Cookies.get('userId');
      const response = await axios.get(`/.netlify/functions/colaboradores/perfil/${userId}`);
      setProfile(response.data.data);
      setEditingProfile(response.data.data);
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

  const handleChange = (field: string, value: string) => {
    setEditingProfile((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleSaveProfile = async () => {
    try {
      await axios.put(`/.netlify/functions/colaboradores/${editingProfile.id_colaborador}`, editingProfile);  
      Cookies.set('userName', editingProfile.nome);
      toast({
        title: "Perfil atualizado",
        description: "Suas informações foram atualizadas com sucesso.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setIsEditing(false);
    } catch (error) {
      toast({
        title: "Erro ao atualizar perfil",
        description: "Não foi possível atualizar suas informações.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    editingProfile ? (
      <Flex width="80%" mt="3%">
        <Box width="35%">
          <PerfilForms
            profile={profile}
            editingProfile={editingProfile}
            setEditingProfile={setEditingProfile}
            isEditing={isEditing}
            handleChange={handleChange}
            handleSaveProfile={handleSaveProfile} 
            setIsEditing={setIsEditing}          
          />
        </Box>
        <Box width="65%" ml="5%">
          <ContactosForm />
        </Box>
      </Flex>
    ) : null
  );
};

export default PerfilPage;
