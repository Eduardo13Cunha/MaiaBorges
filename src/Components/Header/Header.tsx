import { useEffect, useState } from 'react';
import { Box, HStack, Img, Menu, MenuButton, MenuItem, MenuList, Link } from '@chakra-ui/react';
import Cookies from 'js-cookie';
import MaiaBorgesLogo from '../../Assets/MaiaBorgesLogoPequena.png';

export default function Header() {
    const [userName, setName] = useState<string | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const storedName = Cookies.get('userName');
        const storedIsLoggedIn = Cookies.get('IsLoggedIn');
        if (storedName) {
            setName(storedName);
            setIsAuthenticated(storedIsLoggedIn==='true');
        }
    }, []);

    const handleLogout = () => {
        setName(null);
        Cookies.remove('userName'); // Remove os cookies ao fazer logout
        Cookies.remove('userEmail');
        Cookies.remove('userNumber');
        Cookies.remove('userId');
        window.location.href = '/';
    };

    return (
        <Box bg="bg.header.100" color="text.header.100" fontSize="120%" p={4} h="8vh">
            <HStack maxW="100%" justifyContent="space-between" alignItems="center">
                <HStack as={Link} href={isAuthenticated ? "/HomePage2" : undefined} cursor="pointer" width="15%" textDecor="none">
                    <Img src={MaiaBorgesLogo} maxH="15%" maxW="15%" ></Img>
                    <Box display={{ md: 'flex' }} textDecor="none">
                        <strong>Maia Borges Manager</strong>
                    </Box>
                </HStack>
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
                            <MenuButton width="80%" as={Box} cursor="pointer">
                                <strong>{isAuthenticated ? userName : ''}</strong>
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
        </Box>
    );
}