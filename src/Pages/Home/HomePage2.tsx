import React, { useEffect, useState } from 'react';
import { VStack, Box, FormControl, FormLabel, Input, Button, Textarea, Heading, Menu, MenuButton, MenuItem, MenuList, Img, HStack, Text } from "@chakra-ui/react";
import axios from "axios";
import Cookies from 'js-cookie';

const ProfilePage: React.FC = () => {
  const [userData, setUserData] = useState<any>({});

  useEffect(() => {
    // Recuperar dados pessoais dos cookies
    const userName = Cookies.get('userName'); // Exemplo de cookie
    const userEmail = Cookies.get('userEmail'); // Exemplo de cookie
    const userNumber = Cookies.get('userNumber'); // Exemplo de cookie

    // Definir os dados do usuário no estado
    setUserData({
      name: userName,
      email: userEmail,
      number: userNumber,
    });
  }, []);

  return (
    <>
      <HStack display="flex" minW="90%" mr="10%" ml="10%" alignItems="flex-start">
        <Box minW="50%" mt={0}>
          <InsertTicket />
        </Box>
        <VStack minW="50%" spacing={4} mr="50%" padding={5} color="white" align="stretch">
          <Heading>Dados Pessoais</Heading>
          <Text fontSize="130%"><strong>Nome:</strong></Text>
          <Text fontSize="110%">{userData.name}</Text>
          <Text fontSize="130%"><strong>Email:</strong></Text>
          <Text fontSize="110%">{userData.email}</Text>
          <Text fontSize="130%"><strong>Number:</strong></Text>
          <Text fontSize="110%">{userData.number}</Text>
        </VStack>
      </HStack>
    </>
  );
}

const InsertTicket: React.FC = () => {
  const [Prioridade, setPrioridade] = useState<any[]>([]);
  const userId = Cookies.get('userId');
  const initialFormData = {
    des_tar: '',
    id_user: userId,
    id_pri: undefined,
    data_inicio: new Date().toISOString().split('T')[0],
    data_acaba: '',
    id_esttar: 3,
  };
  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    const fetchEstados = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/prioridadetarefa');
        const sortedData = response.data.data.sort((a: { id_pri: number; }, b: { id_pri: number; }) => a.id_pri - b.id_pri);
        setPrioridade(sortedData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    fetchEstados();
  }, []);

  const handleMenuItemClickPrioridade = (id: any, name: string) => {
    setFormData({ ...formData, id_pri: id });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/api/tarefa', formData);
      console.log('Ticket criado com sucesso:', response.data);
      setFormData(initialFormData);
    } catch (error) {
      console.error('Erro ao criar ticket:', error);
    }
 };

  return (
    <VStack width="90%" color="white" spacing={4} align="stretch" mr="50%" padding={5}>
      <Heading> Criar Ticket </Heading>
      <Box>
        <form onSubmit={handleSubmit}>
          <FormControl isRequired>
            <FormLabel fontSize="130%"><strong>Descrição</strong></FormLabel>
            <Textarea name="des_tar" value={formData.des_tar} onChange={handleChange} />
          </FormControl>
          <FormControl isRequired>
            <FormLabel fontSize="130%"><strong>Prioridade</strong></FormLabel>
            <Menu>
              <MenuButton as={Button} width="50%" bgColor="rgba(30, 30, 100)" color="white">
                {formData.id_pri !== undefined ? Prioridade.find(p => p.id_pri === formData.id_pri)?.des_pri : "Selecione uma Prioridade"}
              </MenuButton>
              <MenuList bgColor="transparent" border="transparent" color="white">
                {Prioridade.map((prioridade) => (
                  <MenuItem width="100%" bgColor="rgba(30, 30, 100)" key={prioridade.id_pri} onClick={() => handleMenuItemClickPrioridade(prioridade.id_pri, prioridade.des_pri)}>
                    {prioridade.des_pri}
                  </MenuItem>
                ))}
              </MenuList>
            </Menu>
          </FormControl>
          <FormControl width="30%" isRequired>
            <FormLabel fontSize="130%"><strong>Data de Início</strong></FormLabel>
            <Input type="date" name="data_inicio" value={formData.data_inicio} onChange={handleChange} />
          </FormControl>
          <FormControl width="30%">
            <FormLabel fontSize="130%"><strong>Data Final</strong></FormLabel>
            <Input type="date" name="data_acaba" value={formData.data_acaba} onChange={handleChange} />
          </FormControl>
          <Button fontSize="130%" w="30%" color="white" bg="mediumBlue" _hover={{ bg: "blue.600", transform: "scale(1.05)" }} type="submit" mt={4}>Criar Ticket</Button>
        </form>
      </Box>
    </VStack>
  );
};

export default ProfilePage;