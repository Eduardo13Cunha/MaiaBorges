import { VStack, Box, Table, Thead, Tr, Th, Tbody, Td, HStack, Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, FormControl, FormLabel, Input, ModalFooter, Menu, MenuButton, MenuItem, MenuList, Select } from "@chakra-ui/react";
import axios from "axios";
import { useState, useEffect } from "react";
import { FaAngleLeft, FaAngleRight, FaPencilAlt, FaTrash } from "react-icons/fa";

const DataLocal: React.FC = () => {
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [editLocal, setEditLocal] = useState<any>(null);
  const [page, setPage] = useState<number>(0);
  const [Local, setLocal] = useState<any[]>([]);
  const [tecnicos, setTecnicos] = useState<any[]>([]);
  const itemsPerPage = 8;
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedTecnico, setSelectedTecnico] = useState<any>(null);

  useEffect(() => {
    const fetchTecnicos = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/tecnicos');
        setTecnicos(response.data.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchTecnicos();
  }, []);

  useEffect(() => {
    const fetchLocals = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/local');
        const sortedData = response.data.data.sort((a: { id_loc: number; }, b: { id_loc: number; }) => a.id_loc - b.id_loc);
        setLocal(sortedData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    fetchLocals();
  }, []);

  const addLocal = async (novolocal: any) => {
    try {
      const response = await axios.post('http://localhost:3001/api/local', novolocal);
      const novoLocal = response.data.data;
      setLocal((prev) => [...prev, novoLocal]);
    } catch (error) {
      console.error('Error adding Local:', error);
    }
  };

  const deleteLocal = async (id_loc: number) => {
    const confirmDelete = window.confirm("Tem certeza que deseja excluir este registro?");
    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:3001/api/local/${id_loc}`);
        setLocal((prev) => prev.filter((local) => local.id_loc !== id_loc));
      } catch (error) {
        console.error('Erro ao excluir local:', error);
      }
    }
  };

  const updateLocal = async (local: any) => {
    try {
      const response = await axios.put(`http://localhost:3001/api/local/${local.id_loc}`, local);
      if (response.data) {
        setLocal(Local.map(l => (l.id_loc === local.id_loc ? response.data : l)));
      } else {
        console.error("Resposta da API não contém dados esperados:", response.data);
      }
    } catch (error) {
      console.error('Error updating local:', error);
    }
  };

  const openEditModal = (local: any) => {
    setEditLocal(local);
    setEditModalOpen(true);
  };

  // Filtrar locais com base no termo de pesquisa e no técnico selecionado
  const filteredLocals = Local.filter(local => {
    const matchesSearchTerm = local.des_loc.toLowerCase().includes (searchTerm.toLowerCase());
    const matchesTecnico = selectedTecnico ? local.id_tec === selectedTecnico.id_tec : true;
    return matchesSearchTerm && matchesTecnico;
  });

  const pages = Math.ceil(filteredLocals.length / itemsPerPage);

  const getPageItems = (items: any[], page: number, itemsPerPage: number) => {
    const start = page * itemsPerPage;
    return items.slice(start, start + itemsPerPage);
  };

  return (
    <VStack alignItems="center">
      <Box overflowX="auto" height="75vh" width="100%" overflowY="auto">
        <HStack justifyContent="flex-start" color="white" marginLeft="15%" marginRight="15%" marginTop="2%" maxH="80%" maxW="100%">
          <Input placeholder="Pesquisar por descrição" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} w="40%"/>
          <Menu>
            <MenuButton as={Button} bgColor="rgba(30, 30, 100)" color="white" w="20%">
              {selectedTecnico ? selectedTecnico.nome : "Selecione um Técnico"}
            </MenuButton>
            <MenuList bgColor="transparent" border="transparent" color="white">
              <MenuItem width="100%" bgColor="rgba(30, 30, 100)" onClick={() => setSelectedTecnico(null)}>Selecione um Técnico</MenuItem>
              {tecnicos.map(tecnico => (
                <MenuItem width="100%" bgColor="rgba(30, 30, 100)" key={tecnico.id_tec} onClick={() => setSelectedTecnico(tecnico)}>
                  {tecnico.nome}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
        </HStack>
        <Table color="white" marginLeft="15%" marginRight="15%" marginTop="2%" maxH="80%" maxW="70%" sx={{ tableLayout: 'fixed' }}>
          <Thead className="LineHead">
            <Tr>
              <Th color="white" width="7.5%">ID</Th>
              <Th color="white">Descrição</Th>
              <Th color="white">Técnico</Th>
              <Th color="white" width="7.5%">Ações</Th>
            </Tr>
          </Thead>
          <Tbody>
            {getPageItems(filteredLocals, page, itemsPerPage).map((local) => (
              <Tr className="Line" key={local.id_loc}>
                <Td>{local.id_loc}</Td>
                <Td>{local.des_loc}</Td>
                <Td>{local.nome}</Td>
                <Td>
                  <HStack spacing={2} justifyContent="flex-end">
                    <FaPencilAlt cursor="pointer" onClick={() => openEditModal(local)} />
                    <FaTrash cursor="pointer" onClick={() => deleteLocal(local.id_loc)} color="darkred" />
                  </HStack>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>

      <HStack marginLeft="50%" spacing={4}>
        <Box maxWidth="150%">
          <AddLocal addLocal={addLocal} tecnicos={tecnicos} />
        </Box>
        <HStack w="100%" justifyContent="flex-end">
          <Button bgColor="white" color="black" onClick={() => setPage(page === 0 ? 0 : page - 1)} disabled={page === 0}>
            <FaAngleLeft />
          </Button>
          <Button bgColor="white" color="black" onClick={() => setPage(page === pages - 1 ? pages - 1 : page + 1)} disabled={page === pages - 1}>
            <FaAngleRight />
          </Button>
        </HStack>
      </HStack>
      <ModifyLocal
        editLocal={editLocal}
        updateLocal={updateLocal}
        tecnicos={tecnicos}
        onClose={() => setEditModalOpen(false)}
        isOpen={isEditModalOpen}
      />
    </VStack>
  );
};

const AddLocal: React.FC<{ addLocal: (local: any) => void; tecnicos: any[] }> = ({ addLocal, tecnicos }) => {
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [formData, setFormData] = useState<{ des_loc: string; id_tec: number | undefined; }>({
    des_loc: '',
    id_tec: undefined,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleMenuItemClick = (id: number, name: string) => {
    setFormData({ ...formData, id_tec: id });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await addLocal({
      ...formData,
      id_tec: Number(formData.id_tec),
    });
    setAddModalOpen(false);
    setFormData({ des_loc: '', id_tec: undefined });
  };

  const openAddModal = () => {
    setAddModalOpen(true);
  };

  return (
    <Box>
      <Button onClick={openAddModal} bgColor="white" color="black" >Adicionar Local</Button>
      <Modal isOpen={isAddModalOpen} onClose={() => setAddModalOpen(false)}>
        <ModalOverlay />
        <ModalContent bgColor="rgba(30, 30, 130)" color="white" maxH="100%" maxW="40%" mt="5.7%">
          <ModalHeader>Adicionar Local</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={handleSubmit}>
              <FormControl isRequired>
                <FormLabel>Descrição</FormLabel>
                <Input 
                  type="text" 
                  name="des_loc" 
                  value={formData.des_loc} 
                  onChange={handleChange} 
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Técnico</FormLabel>
                <Menu>
                  <MenuButton as={Button} width="100%"  bgColor="rgba(30, 30, 100)" color="white">
                    {formData.id_tec !== undefined ? tecnicos.find(t => t.id_tec === formData.id_tec)?.nome : "Selecione um Técnico"}
                  </MenuButton>
                  <MenuList w="311%" bgColor="transparent" border="transparent" color="white">
                    {tecnicos.map((tecnico) => (
                      <MenuItem width="100%" bgColor="rgba(30, 30, 100)" key={tecnico.id_tec} onClick={() => handleMenuItemClick(tecnico.id_tec, tecnico.nome)}>
                        {tecnico.nome}
                      </MenuItem>
                    ))}
                  </MenuList>
                </Menu>
              </FormControl>
              <Button type="submit" mr="2%" mt="2%"  bgColor="rgba(30, 30, 90, 0.8)" color="white">Salvar</Button>
              <Button onClick={() => setAddModalOpen(false)} mt="2%"  bgColor="rgba(30, 30, 90, 1)" color="white">Cancelar</Button>
            </form>
          </ModalBody>
          <ModalFooter />
        </ModalContent>
      </Modal>
    </Box>
  );
};

const ModifyLocal: React.FC<{ editLocal: any; updateLocal: (local: any) => void;tecnicos: any[]; onClose: () => void; isOpen: boolean }> = ({ editLocal, updateLocal,tecnicos, onClose, isOpen }) => {
  const [formData, setFormData] = useState<{ des_loc: string; id_tec: number | undefined; }>({
    des_loc: '',
    id_tec: undefined,
  });

  useEffect(() => {
    if (editLocal) {
      setFormData({
        des_loc: editLocal.des_loc,
        id_tec: editLocal.id_tec,
      });
    }
  }, [editLocal]);

  const handleMenuItemClick = (id: number) => {
    setFormData({ ...formData, id_tec: id });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const updatedLocal = {
      ...formData,
      id_loc: editLocal.id_loc,
      id_tec: Number(formData.id_tec),
    };
    await updateLocal(updatedLocal);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent bgColor="rgba(30, 30, 130)" color="white" maxH="100%" maxW="40%" mt="5.7%">
        <ModalHeader>Editar Local</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form onSubmit={handleSubmit}>
          <FormLabel>Descrição</FormLabel>
            <FormControl isRequired>
              <Input type="text" name="des_loc" value={formData.des_loc} onChange={(e) => setFormData({ ...formData, des_loc: e.target.value })}/>
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Técnico</FormLabel>
              <Menu>
                <MenuButton as={Button} width="100%" bgColor="rgba(30, 30, 100)" color="white">
                {formData.id_tec !== undefined ? tecnicos.find(t => t.id_tec === formData.id_tec)?.nome : "Selecione um Técnico"}
                </MenuButton>
                <MenuList w="311%" bgColor="transparent" border="transparent" color="white">
                  {tecnicos.map((tecnico) => (
                    <MenuItem width="100%" bgColor="rgba(30, 30, 100)" key={tecnico.id_tec} onClick={() => handleMenuItemClick(tecnico.id_tec)}>
                      {tecnico.nome}
                    </MenuItem>
                  ))}
                </MenuList>
              </Menu>
            </FormControl>
            <Button type="submit" mr="2%" mt="2%" bgColor="rgba(30, 30, 90, 0.8)" color="white">Editar</Button>
            <Button onClick={onClose} mt="2%" bgColor="rgba(30, 30, 90, 1)" color="white">Cancelar</Button>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default DataLocal;