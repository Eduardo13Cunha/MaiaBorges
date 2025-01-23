import { VStack, Box, Table, Thead, Tr, Th, Tbody, Td, HStack, Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, FormControl, FormLabel, Input, ModalFooter } from "@chakra-ui/react";
import axios from "axios";
import { useState, useEffect } from "react";
import { FaAngleLeft, FaAngleRight ,FaPencilAlt } from "react-icons/fa";
import { FaTrash } from "react-icons/fa";


const DataFornecedor: React.FC = () => {
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [editFornecedor, setEditFornecedor] = useState<any>(null); // Estado para o técnico a ser editado
  const [page, setPage] = useState<number>(0);
  const [fornecedores, setFornecedores] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const itemsPerPage = 8;

  useEffect(() => {
    const fetchFornecedores = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/fornecedor');
        setFornecedores(response.data.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchFornecedores();
  }, []);

  const addFornecedor = async (novofornecedor: any) => {
    try {
      const response = await axios.post('http://localhost:3001/api/fornecedor', novofornecedor);
      const novoFornecedor = response.data.data;
      setFornecedores((prev) => [...prev, novoFornecedor]);
    } catch (error) {
      console.error('Error adding fornecedor:', error);
    }
  };

  const deleteFornecedor = async (id: number) => {
    const confirmDelete = window.confirm("Tem certeza que deseja excluir este registro?");
    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:3001/api/fornecedor/${id}`);
        setFornecedores(fornecedores.filter(fornecedor => fornecedor.id_for !== id));
      } catch (error) {
        console.error('Error deleting fornecedor:', error);
      }
    }
  };

  const updateFornecedor = async (fornecedor: any) => {
    try {
      const response = await axios.put(`http://localhost:3001/api/fornecedor/${fornecedor.id_for}`, fornecedor);
      if (response.data) {
        // Atualiza o estado com os dados do técnico atualizado
        setFornecedores(fornecedores.map(f => (f.id_for === fornecedor.id_for ? response.data : f)));
      } else {
        console.error("Resposta da API não contém dados esperados:", response.data);
      }
    } catch (error) {
      console.error('Error updating fornecedor:', error);
    }
  };

  const openEditModal = (fornecedor: any) => {
    setEditFornecedor(fornecedor);
    setEditModalOpen(true);
  };

  const filteredFornecedores = fornecedores.filter(fornecedor =>
    fornecedor.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pages = Math.ceil(filteredFornecedores.length / itemsPerPage);

  const getPageItems = (items: any[], page: number, itemsPerPage: number) => {
    const start = page * itemsPerPage;
    return items.slice(start, start + itemsPerPage);
  };

  return (
    <VStack alignItems="center">
      <Box overflowX="auto" height="75vh" width="100%" overflowY="auto">
      <Input placeholder="Pesquisar por Nome" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} marginLeft="15%" marginRight="15%" marginTop ="2%" maxH="80%" maxW="28%" color="white"/>
        <Table color="white" marginLeft="15%" marginRight="15%" marginTop="2%" maxH="80%" maxW="70%" sx={{ tableLayout: 'fixed' }}>
          <Thead className="LineHead">
            <Tr>
              <Th color="white" width="7.5%">ID</Th>
              <Th color="white">Nome</Th>
              <Th color="white" width="10%">Email</Th>
              <Th color="white">Numero</Th>
              <Th color="white">Contribuinte</Th>
              <Th color="white" width="7.5%">Ações</Th>
            </Tr>
          </Thead>
          <Tbody>
            {getPageItems(filteredFornecedores, page, itemsPerPage).map((fornecedor) => (
              <Tr className="Line" key={fornecedor.id_for}>
                <Td>{fornecedor.id_for}</Td>
                <Td>{fornecedor.nome}</Td>
                <Td>{fornecedor.email}</Td>
                <Td>{fornecedor.numero}</Td>
                <Td>{fornecedor.n_contribuinte}</Td>
                <Td>
                  <HStack spacing={2}>
                    <FaPencilAlt onClick={() => openEditModal(fornecedor)}/>
                    <FaTrash onClick={() => deleteFornecedor(fornecedor.id_for)} color="darkred"/>
                  </HStack>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>

      <HStack marginLeft="50%" spacing={4}>
        <Box maxWidth="150%">
          <AddFornecedor addFornecedor={addFornecedor} />
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
      <ModifyFornecedor 
        editFornecedor={editFornecedor} 
        updateFornecedor={updateFornecedor} 
        onClose={() => setEditModalOpen(false)} 
        isOpen={isEditModalOpen} 
      />
    </VStack>
  );
};

const AddFornecedor: React.FC<{ addFornecedor: (fornecedor: any) => void }> = ({ addFornecedor }) => {
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [formData, setFormData] = useState<{ nome: string; email: string; numero: number | undefined; n_contribuinte: string }>({
    nome: '',
    email: '',
    numero: undefined,
    n_contribuinte: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    addFornecedor({
      ...formData,
      numero: Number(formData.numero),
    });
    setAddModalOpen(false);
    setFormData({ nome: '', email: '', numero: undefined,n_contribuinte: '',});
  };

  const openAddModal = () => {
    setAddModalOpen(true);
  };

  return (
    <Box>
      <Button onClick={openAddModal}>Adicionar fornecedor</Button>
      <Modal isOpen={isAddModalOpen} onClose={() => setAddModalOpen(false)}>
        <ModalOverlay />
        <ModalContent bgColor="rgba(30, 30, 130)" color="white" maxH="100%" maxW="40%" mt="5.7%">
          <ModalHeader>Adicionar fornecedor</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={handleSubmit}>
              <FormControl isRequired>
                <FormLabel>Nome</FormLabel>
                <Input type="text" name="nome" value={formData.nome} onChange={handleChange} />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Email</FormLabel>
                <Input type="email" name="email" value={formData.email} onChange={handleChange} />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Número</FormLabel>
                <Input type="number" name="numero" value={formData.numero !== undefined ? formData.numero : ''} onChange={handleChange} />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Contribuinte</FormLabel>
                <Input type="number" name="n_contribuinte" value={formData.n_contribuinte} onChange={handleChange} />
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

const ModifyFornecedor: React.FC<{ editFornecedor: any; updateFornecedor: (fornecedor: any) => void; onClose: () => void; isOpen: boolean }> = ({ editFornecedor, updateFornecedor, onClose, isOpen }) => {
    const [formData, setFormData] = useState<{ nome: string; email: string; numero: number | undefined; n_contribuinte: string }>({
        nome: '',
        email: '',
        numero: undefined,
        n_contribuinte: '',
    });

  useEffect(() => {
    if (editFornecedor) {
      setFormData({
        nome: editFornecedor.nome,
        email: editFornecedor.email,
        numero: editFornecedor.numero,
        n_contribuinte: editFornecedor.n_contribuinte,
      });
    }
  }, [editFornecedor]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const updatedFornecedor = {
      ...formData,
      id_for: editFornecedor.id_for,
      numero: Number(formData.numero),
    };
    await updateFornecedor(updatedFornecedor);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent bgColor="rgba(30, 30, 130)" color="white" maxH="100%" maxW="40%" mt="5.7%">
        <ModalHeader>Editar Fornecedor</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form onSubmit={handleSubmit}>
            <FormControl isRequired>
              <FormLabel>Nome</FormLabel>
              <Input type="text" name="nome" value={formData.nome} onChange={(e) => setFormData({ ...formData, nome: e.target.value })} />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Email</FormLabel>
              <Input type="email" name="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Número</FormLabel>
              <Input type="number" name="numero" value={formData.numero} onChange={(e) => setFormData({ ...formData, numero: Number(e.target.value)})} />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Contribuinte</FormLabel>
              <Input type="number" name="n_contribuinte" value={formData.n_contribuinte} onChange={(e) => setFormData({ ...formData, n_contribuinte: e.target.value })} />
            </FormControl>
            <Button type="submit" mr="2%" mt="2%" bgColor="rgba(30, 30, 90, 0.8)" color="white">Editar</Button>
            <Button onClick={onClose} mt="2%" bgColor="rgba(30, 30, 90, 1)" color="white">Cancelar</Button>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default DataFornecedor;