import { useEffect, useState } from 'react';
import { Box, HStack, Img, Menu, MenuButton, MenuItem, MenuList, Link, Spacer } from '@chakra-ui/react';
import Cookies from 'js-cookie';
import MaiaBorgesLogo from '../../Assets/MaiaBorgesLogoPequena.png';

export default function Header() {
    const [userName, setName] = useState<string | null>(null);
    const [roleId, setRoleId] = useState<number | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const storedName = Cookies.get('userName');
        const storedIsLoggedIn = Cookies.get('IsLoggedIn');
        const storedRoleId = Cookies.get('roleId');
        if (storedName) {
            setName(storedName);
            setIsAuthenticated(storedIsLoggedIn === 'true');
            setRoleId(storedRoleId !== undefined ? Number(storedRoleId) : null);
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
            <HStack maxW="100%" alignItems="center">
                <HStack as={Link} href={"/HomePage"} cursor="pointer" width="15%" textDecor="none">
                    <Img src={MaiaBorgesLogo} maxH="15%" maxW="15%" ></Img>
                    <Box display={{ md: 'flex' }} textDecor="none">
                        <strong>Maia Borges Manager</strong>
                    </Box>
                </HStack>
                <HStack ml="5%" display={{ base: 'none', md: 'flex' }} spacing="3%" width="65%" alignItems="center">
                    {(roleId !== 6 && roleId !== 3) && (<>
                    <Menu> 
                        <MenuButton className="MenuHeader" borderRadius="md">Recursos</MenuButton>
                        <MenuList className="MenuHeaderList">
                            {(roleId !== 3 && roleId !== 4 && roleId !== 6) && (<MenuItem as={Link} className="MenuHeaderItem" href="/DataColaborador">Colaboradores</MenuItem>)}
                            {(roleId !== 3 && roleId !== 5 && roleId !== 6) && (<>
                            <MenuItem as={Link} className="MenuHeaderItem" href="/DataMaterial">Material</MenuItem>
                            <MenuItem as={Link} className="MenuHeaderItem" href="/DataMaquina">Maquinas</MenuItem>
                            <MenuItem as={Link} className="MenuHeaderItem" href="/DataFigura">Figuras</MenuItem>
                            </>)}
                        </MenuList>
                    </Menu>
                    </>)}
                    {(roleId !== 4 && roleId !== 5) && (<>
                    <Menu> 
                        <MenuButton className="MenuHeader" borderRadius="md">Operações</MenuButton>
                        <MenuList className="MenuHeaderList">
                            {(roleId === 1 || roleId === 2 || roleId === 3) && (<MenuItem as={Link} className="MenuHeaderItem" href="/DataEncomendas">Encomendas</MenuItem>)}
                            {(roleId === 1 || roleId === 2) && ( <MenuItem as={Link} className="MenuHeaderItem" href="/DataPlanoTrabalho">Plano de Trabalho</MenuItem>)}
                            {(roleId === 1 || roleId === 2 || roleId === 6) && ( <MenuItem as={Link} className="MenuHeaderItem" href="/DataAcompanhamento">Acompanhamento</MenuItem>)}
                        </MenuList>
                    </Menu>
                    </>)}
                    {(roleId !== 4 && roleId !== 5 && roleId !== 6) && (<a className="MenuItem" href="/DataCliente">Clientes</a>)}
                    {(roleId === 1 || roleId === 2) && (<a className="MenuItem" href="/Historico">Históricos</a>)}
                </HStack>
                <Spacer/>
                <Box fontSize="120%" mr="2%">
                    <HStack cursor="pointer">
                        <Menu>
                            <MenuButton as={Box} cursor="pointer">
                                <strong>{userName}</strong>
                            </MenuButton>
                            <MenuList bg="transparent" borderColor="transparent">
                                <MenuItem className="MenuHeader" as={Link} href="/PerfilPage" _focus={{ boxShadow: '0 8px 32px 0 rgba( 0, 0, 0, 0.37 )' }}>Perfil</MenuItem>
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