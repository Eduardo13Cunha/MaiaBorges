import { useEffect, useState } from 'react';
import { Box, HStack, Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, FormControl, FormLabel, Input, Img, Menu, MenuButton, MenuItem, MenuList, Link, VStack } from '@chakra-ui/react';
import axios from 'axios';
import Cookies from 'js-cookie';
import MaiaBorgesLogo from '../../Assets/MaiaBorgesLogoPequena.png';
import MaiaBorgesLogoGrande from '../../Assets/MaiaBorgesLogoGrande.png';
import { Colaborador } from '../../Interfaces/interfaces';

export default function Header() {
    const [isLoginModalOpen, setLoginModalOpen] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [userName, setName] = useState<string | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const storedName = Cookies.get('userName');
        if (storedName) {
            setName(storedName);
            setIsAuthenticated(true);
        }
    }, []);

    const handleLogin = async () => {
        try {
            const response = await axios.post('/.backendDataBase/server/api/auth/utilizadores', { email, password });
            if (response.status === 200) {
                const user = (response.data as { data: Colaborador }).data;
                setName(user.nome); // Armazena o nome do utilizador
                setIsAuthenticated(true); // Atualiza o estado de autenticação
                setLoginModalOpen(false);
                setEmail('');
                setPassword('');

                Cookies.set('userName', user.nome);
                Cookies.set('userEmail', user.email);
                Cookies.set('userNumber', user.numero);
                Cookies.set('userId', user.id_colaborador.toString());
                window.location.href = '/HomePage2';
            } else {
                alert('Login falhou. Verifique suas credenciais.');
            }
        } catch (error) {
            console.error('Erro ao fazer login:', error);
            alert('Erro ao fazer login. Tente novamente.');
        }
    };

    const handleLogout = () => {
        setName(null);
        setIsAuthenticated(false);
        Cookies.remove('userName'); // Remove os cookies ao fazer logout
        Cookies.remove('userEmail');
        Cookies.remove('userNumber');
        Cookies.remove('userId');
        window.location.href = '/';
    };

    return (
        <Box bg="white" color="rgba(84, 99, 172)" fontSize="120%" p={4} h="8vh">
            <HStack maxW="100%" justifyContent="space-between" alignItems="center">
                {isAuthenticated ? (
                <HStack as={Link} href="/HomePage2" cursor="pointer" width="15%" textDecor="none">
                    <Img src={MaiaBorgesLogo} maxH="15%" maxW="15%" ></Img>
                    <Box display={{ md: 'flex' }} textDecor="none">
                        <strong>Maia Borges Manager</strong>
                    </Box>
                </HStack>
                ) : (
                <HStack width="15%">
                    <Img src={MaiaBorgesLogo} maxH="15%" maxW="15%"></Img>
                    <Box display={{ md: 'flex' }}>
                        <strong>Maia Borges Manager</strong>
                    </Box>
                </HStack>    
                )}
                {isAuthenticated && (
                    <HStack display={{ base: 'none', md: 'flex' }} width="70%" spacing="3%" alignItems="center" justifyContent="center">
                        <a className="MenuItem" href="/DataColaborador" >Colaboradores</a>
                        <a className="MenuItem" href="/DataCliente" >Clientes</a>
                        <a className="MenuItem" href="/DataMaterial" >Material</a>
                        <a className="MenuItem" href="/DataFigura" >Figuras</a>
                        <a className="MenuItem" href="/DataMaquina" >Maquinas</a>
                        <a className="MenuItem" href="/DataEncomendas" >Encomendas</a>
                        <a className="MenuItem" href="/DataAcompanhamento" >Acompanhamento</a>
                        <a className="MenuItem" href="/DataPlanoTrabalho" >Plano de Trabalho</a>
                    </HStack>
                )}
                <Box fontSize="120%" width="13%">
                    <HStack cursor="pointer">
                        <Menu>
                            <MenuButton width="80%" as={Box} cursor="pointer" onClick={() => isAuthenticated ? null : setLoginModalOpen(true)}>
                                <strong>{isAuthenticated ? userName : 'Login'}</strong>
                            </MenuButton>
                            {isAuthenticated && (
                                <MenuList bg="transparent" borderColor="transparent">
                                    <MenuItem className="MenuItem" color="red" onClick={handleLogout} _focus={{ boxShadow: '0 8px 32px 0 rgba( 0, 0, 0, 0.37 )' }}>Log Out</MenuItem>
                                </MenuList>
                            )}
                        </Menu>
                    </HStack>
                </Box>
            </HStack>
            <Modal isOpen={isLoginModalOpen} onClose={() => setLoginModalOpen(false)}>
                <ModalOverlay />
                <ModalContent className='TableModal'>
                    <ModalHeader alignSelf="center">
                    <VStack alignSelf="center">
                        <Img src={MaiaBorgesLogoGrande} maxH="40%" maxW="40%" />
                    </VStack>
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <FormControl>
                            <FormLabel><strong>Email</strong></FormLabel>
                            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                        </FormControl>
                        <FormControl mt={4}>
                            <FormLabel><strong>Palavra-Passe</strong></FormLabel>
                            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                        </FormControl>
                        <Button className='SaveButton' onClick={handleLogin}>
                            Entrar
                        </Button>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </Box>
    );
}