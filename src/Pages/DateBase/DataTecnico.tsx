import { Text,VStack, Box, Table, Thead, Tr, Th, Tbody, Td, HStack, Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, FormControl, FormLabel, Input, ModalFooter } from "@chakra-ui/react";
import axios from "axios";
import { useState, useEffect } from "react";
import { FaAngleLeft, FaAngleRight ,FaPencilAlt, FaSortDown, FaSortUp } from "react-icons/fa";
import { FaTrash } from "react-icons/fa";

const DataTecnico: React.FC = () => {
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [editTecnico, setEditTecnico] = useState<any>(null);
  const [page, setPage] = useState<number>(0);
  const [tecnicos, setTecnicos] = useState<any[]>([]);
  const itemsPerPage = 8;
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [sortColumn, setSortColumn] = useState<string>('idade');
  const [searchTerm, setSearchTerm] = useState<string>('');

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

  const addTecnico = async (novotecnico: any) => {
    try {
      const response = await axios.post('http://localhost:3001/api/tecnicos', novotecnico);
      const novoTecnico = response.data.data;
      setTecnicos((prev) => [...prev, novoTecnico]);
    } catch (error) {
      console.error('Error adding tecnico:', error);
    }
  };

  const deleteTecnico = async (id: number) => {
    const confirmDelete = window.confirm("Tem certeza que deseja excluir este registro?");
    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:3001/api/tecnicos/${id}`);
        setTecnicos(tecnicos.filter(tecnico => tecnico.id_tec !== id));
      } catch (error) {
        console.error('Error deleting tecnico:', error);
      }
    }
  };

  const updateTecnico = async (tecnico: any) => {
    try {
      const response = await axios.put(`http://localhost:3001/api/tecnicos/${tecnico.id_tec}`, tecnico);
      if (response.data) {
        setTecnicos(tecnicos.map(t => (t.id_tec === tecnico.id_tec ? response.data : t)));
      } else {
        console.error("Resposta da API não contém dados esperados:", response.data);
      }
    } catch (error) {
      console.error('Error updating tecnico:', error);
    }
  };

  const openEditModal = (tecnico: any) => {
    setEditTecnico(tecnico);
    setEditModalOpen(true);
  };

  const handleSort = (column: string) => {
    const newDirection = (sortColumn === column && sortDirection === 'asc') ? 'desc' : 'asc';
    setSortDirection(newDirection);
    setSortColumn(column);
  };

  const sortedTecnicos = [...tecnicos].sort((a, b) => {
    if (sortColumn === 'idade') {
      return sortDirection === 'asc' ? a.idade - b.idade : b.idade - a.idade;
    } else if (sortColumn === 'id_tec') {
      return sortDirection === 'asc' ? a.id_tec - b.id_tec : b.id_tec - a.id_tec;
    }
    return 0;
  });

  // Filtrar técnicos com base no termo de pesquisa
  const filteredTecnicos = sortedTecnicos.filter(tecnico =>
    tecnico.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pages = Math.ceil(filteredTecnicos.length / itemsPerPage);

  const getPageItems = (items: any[], page: number, itemsPerPage: number) => {
    const start = page * itemsPerPage;
    return items.slice(start, start + itemsPerPage);
  };

  return (
    <VStack alignItems="center">
      <Box overflowX="auto" height="75vh" width="100%" overflowY="auto">
        <Input placeholder="Pesquisar por Nome" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} marginLeft="15%" marginRight="15%" marginTop ="2%" maxH="80%" maxW="28%" color="white"/>
        <Table color="white" marginLeft="15%" marginRight="15%" marginTop ="2%" maxH="80%" maxW="70%" sx={{ tableLayout: 'fixed' }}>
          <Thead className="LineHead">
            <Tr>
              <Th color="white" width="7.5%" onClick={() => handleSort('id_tec')} style={{ cursor: 'pointer' }}>
                <HStack spacing={1}>
                  <Text>ID</Text>
                  {sortColumn === 'id_tec' && (sortDirection === 'asc' ? <FaSortUp color="white" /> : <FaSortDown color="white" />)}
                </HStack>
              </Th>
              <Th color="white">Nome</Th>
              <Th color="white" width="10%" onClick={() => handleSort('idade')} style={{ cursor: 'pointer' }}>
                <HStack spacing={1}>
                  <Text>Idade</Text>
                  {sortColumn === 'idade' && (sortDirection === 'asc' ? <FaSortUp color="white" /> : <FaSortDown color="white" />)}
                </HStack>
              </Th>
              <Th color="white">Email</Th>
              <Th color="white">Numero</Th>
              <Th color="white" width="7.5%">Ações</Th>
            </Tr>
          </Thead>
          <Tbody>
            {getPageItems(filteredTecnicos, page, itemsPerPage).map((tecnico) => (
              <Tr className="Line" key={tecnico.id_tec}>
                <Td>{tecnico.id_tec}</Td>
                <Td>{tecnico.nome}</Td>
                <Td>{tecnico.idade}</Td>
                <Td>{tecnico.email}</Td>
                <Td>{tecnico.numero}</Td>
                <Td>
                  <HStack spacing={2} justifyContent="flex-end">
                    <FaPencilAlt cursor="pointer" onClick={() => openEditModal(tecnico)} />
                    <FaTrash cursor="pointer" onClick={() => deleteTecnico(tecnico.id_tec)} color="darkred" />
                  </HStack>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>

      <HStack marginLeft="50%" spacing={4}>
        <Box maxWidth="150%">
          <AddTecnico addTecnico={addTecnico} />
        </Box>
        <HStack w="100%" justifyContent="flex-end">
          <Button onClick={() => setPage(page === 0 ? 0 : page - 1)} disabled={page === 0}>
            <FaAngleLeft />
          </Button>
          <Button onClick={() => setPage(page === pages - 1 ? pages - 1 : page + 1)} disabled={page === pages - 1}>
            <FaAngleRight />
          </Button>
        </HStack>
      </HStack>
      <ModifyTecnico 
        editTecnico={editTecnico} 
        updateTecnico={updateTecnico} 
        onClose={() => setEditModalOpen(false)} 
        isOpen={isEditModalOpen} 
      />
    </VStack>
  );
};

const AddTecnico: React.FC<{ addTecnico: (tecnico: any) => void }> = ({ addTecnico }) => {
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [formData, setFormData] = useState<{ nome: string; idade: number | undefined; email: string; numero: number | undefined }>({
    nome: '',
    idade: undefined,
    email: '',
    numero: undefined,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    addTecnico({
      ...formData,
      idade: Number(formData.idade),
      numero: Number(formData.numero),
    });
    setAddModalOpen(false);
    setFormData({ nome: '', idade: undefined, email: '', numero: undefined,});
  };

  const openAddModal = () => {
    setAddModalOpen(true);
  };

  return (
    <Box>
      <Button onClick={openAddModal}>Adicionar técnico</Button>
      <Modal isOpen={isAddModalOpen} onClose={() => setAddModalOpen(false)}>
        <ModalOverlay />
        <ModalContent bgColor="rgba(30, 30, 130)" color="white" maxH="100%" maxW="40%" mt="5.7%">
          <ModalHeader>Adicionar Técnico</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={handleSubmit}>
              <FormControl isRequired>
                <FormLabel>Nome</FormLabel>
                <Input type="text" name="nome" value={formData.nome} onChange={handleChange} />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Idade</FormLabel>
                <Input type="number" name="idade" value={formData.idade !== undefined ? formData.idade : ''} onChange={handleChange} />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Email</FormLabel>
                <Input type="email" name="email" value={formData.email} onChange={handleChange} />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Número</FormLabel>
                <Input type="number" name="numero" value={formData.numero !== undefined ? formData.numero : ''} onChange={handleChange} />
              </FormControl>
              <Button type="submit" mr="2%" mt="2%" bgColor="rgba(30, 30, 90, 0.8)" color="white">Salvar</Button>
              <Button onClick={() => setAddModalOpen(false )} mt="2%" bgColor="rgba(30, 30, 90, 1)" color="white">Cancelar</Button>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

const ModifyTecnico: React.FC<{ editTecnico: any; updateTecnico: (tecnico: any) => void; onClose: () => void; isOpen: boolean }> = ({ editTecnico, updateTecnico, onClose, isOpen }) => {
  const [formData, setFormData] = useState<{ nome: string; idade: number; email: string; numero: number }>({
    nome: '',
    idade: 0,
    email: '',
    numero: 0,
  });

  useEffect(() => {
    if (editTecnico) {
      setFormData({
        nome: editTecnico.nome,
        idade: editTecnico.idade,
        email: editTecnico.email,
        numero: editTecnico.numero,
      });
    }
  }, [editTecnico]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const updatedTecnico = {
      ...formData,
      id_tec: editTecnico.id_tec,
      idade: Number(formData.idade),
      numero: Number(formData.numero),
    };
    await updateTecnico(updatedTecnico);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent bgColor="rgba(30, 30, 130)" color="white" maxH="100%" maxW="40%" mt="5.7%">
        <ModalHeader>Editar Técnico</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form onSubmit={handleSubmit}>
            <FormControl isRequired>
              <FormLabel>Nome</FormLabel>
              <Input type="text" name="nome" value={formData.nome} onChange={(e) => setFormData({ ...formData, nome: e.target.value })} />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Idade</FormLabel>
              <Input type="number" name="idade" value={formData.idade} onChange={(e) => setFormData({ ...formData, idade: Number(e.target.value) })} />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Email</FormLabel>
              <Input type="email" name="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Número</FormLabel>
              <Input type="number" name="numero" value={formData.numero} onChange={(e) => setFormData({ ...formData, numero: Number(e.target.value) })} />
            </FormControl>
            <Button type="submit" mr="2%" mt="2%" bgColor="rgba(30, 30, 90, 0.8)" color="white">Editar</Button>
            <Button onClick={onClose} mt="2%" bgColor="rgba(30, 30, 90, 1)" color="white">Cancelar</Button>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default DataTecnico;