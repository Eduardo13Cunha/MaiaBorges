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
        Cookies.remove('userName');
        Cookies.remove('IsLoggedIn');
        Cookies.remove('roleId');
        Cookies.remove('userId');
        window.location.href = '/';
    };

    return (
        <>
        {isAuthenticated ? (
        <Box bg="bg.header.100" color="text.header.100" fontSize="120%" p={4} h="8vh">
            <HStack maxW="100%" justifyContent="space-between" alignItems="center">
                <HStack as={Link} href={"/HomePage"} cursor="pointer" width="15%" textDecor="none">
                    <Img src={MaiaBorgesLogo} maxH="15%" maxW="15%" ></Img>
                    <Box display={{ md: 'flex' }} textDecor="none">
                        <strong>Maia Borges Manager</strong>
                    </Box>
                </HStack>
                <HStack display={{ base: 'none', md: 'flex' }} spacing="3%" width="70%" alignItems="center">
                    <Menu> 
                        <MenuButton ml="5%" className="MenuHeader" borderRadius="md">Recursos</MenuButton>
                        <MenuList className="MenuHeaderList">
                            <MenuItem as={Link} className="MenuHeaderItem" href="/DataColaborador">Colaboradores</MenuItem>
                            <MenuItem as={Link} className="MenuHeaderItem" href="/DataMaterial">Material</MenuItem>
                            <MenuItem as={Link} className="MenuHeaderItem" href="/DataMaquina">Maquinas</MenuItem>
                            <MenuItem as={Link} className="MenuHeaderItem" href="/DataFigura">Figuras</MenuItem>
                        </MenuList>
                    </Menu>
                    <Menu> 
                        <MenuButton className="MenuHeader" borderRadius="md">Operações</MenuButton>
                        <MenuList className="MenuHeaderList">
                            <MenuItem as={Link} className="MenuHeaderItem" href="/DataEncomendas">Encomendas</MenuItem>
                            <MenuItem as={Link} className="MenuHeaderItem" href="/DataPlanoTrabalho">Plano de Trabalho</MenuItem>
                            <MenuItem as={Link} className="MenuHeaderItem" href="/DataAcompanhamento">Acompanhamento</MenuItem>
                        </MenuList>
                    </Menu>
                    <a className="MenuItem" href="/DataCliente">Clientes</a>
                    <a className="MenuItem" href="/Historico">Históricos</a>
                </HStack>
                <Box fontSize="120%" width="13%">
                    <HStack cursor="pointer">
                        <Menu>
                            <MenuButton width="80%" as={Box} cursor="pointer">
                                <strong>{userName}</strong>
                            </MenuButton>
                            <MenuList bg="transparent" borderColor="transparent">
                                <MenuItem className="MenuHeader" as={Link} href="/Perfil" _focus={{ boxShadow: '0 8px 32px 0 rgba( 0, 0, 0, 0.37 )' }}>Perfil</MenuItem>
                                <MenuItem className="MenuHeader" as={Link} href="/Contacts" _focus={{ boxShadow: '0 8px 32px 0 rgba( 0, 0, 0, 0.37 )' }}>Contactos</MenuItem>
                                <MenuItem className="MenuHeader" color="red" onClick={handleLogout} _focus={{ boxShadow: '0 8px 32px 0 rgba( 0, 0, 0, 0.37 )' }}>Log Out</MenuItem>
                            </MenuList>
                        </Menu>
                    </HStack>
                </Box>
            </HStack>
        </Box>
    ) : (
        <Box bg="bg.primary.100" h="8vh"></Box>
    )}
    </>
    );
}