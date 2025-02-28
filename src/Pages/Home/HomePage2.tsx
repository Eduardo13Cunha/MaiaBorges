import React, { useEffect, useState } from 'react';
import { VStack, Heading, HStack, Text } from "@chakra-ui/react";
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
};

export default ProfilePage;