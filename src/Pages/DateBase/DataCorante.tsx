import { Text, VStack, Box, Table, Thead, Tr, Th, Tbody, Td, HStack, Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, FormControl, FormLabel, Input, ModalFooter } from "@chakra-ui/react";
import axios from "axios";
import { useState, useEffect } from "react";
import { FaAngleLeft, FaAngleRight, FaPencilAlt, FaSortDown, FaSortUp } from "react-icons/fa";
import { FaTrash } from "react-icons/fa";

const DataCorante: React.FC = () => {
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [editCorante, setEditCorante] = useState<any>(null);
  const [page, setPage] = useState<number>(0);
  const [Corantes, setCorantes] = useState<any[]>([]);
  const itemsPerPage = 8;
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [sortColumn, setSortColumn] = useState<string>('id_corante');
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    const fetchCorantes = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/corante');
        setCorantes(response.data.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchCorantes();
  }, []);

  const addCorante = async (novocorante: any) => {
    try {
      const response = await axios.post('http://localhost:3001/api/corante', novocorante);
      const novoCorante = response.data.data;
      setCorantes((prev) => [...prev, novoCorante]);
    } catch (error) {
      console.error('Error adding corante:', error);
    }
  };

  const deleteCorante = async (id: number) => {
    const confirmDelete = window.confirm("Tem certeza que deseja excluir este registro?");
    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:3001/api/corante/${id}`);
        setCorantes(Corantes.filter(corante => corante.id_corante !== id));
      } catch (error) {
        console.error('Error deleting corante:', error);
      }
    }
  };

  const updateCorante = async (corante: any) => {
    try {
      const response = await axios.put(`http://localhost:3001/api/corante/${corante.id_corante}`, corante);
      if (response.data) {
        setCorantes(Corantes.map(c => (c.id_corante === corante.id_corante ? response.data : c)));
      } else {
        console.error("Resposta da API não contém dados esperados:", response.data);
      }
    } catch (error) {
      console.error('Error updating corante:', error);
    }
  };

  const openEditModal = (corante: any) => {
    setEditCorante(corante);
    setEditModalOpen(true);
  };

  const handleSort = (column: string) => {
    const newDirection = (sortColumn === column && sortDirection === 'asc') ? 'desc' : 'asc';
    setSortDirection(newDirection);
    setSortColumn(column);
  };

  const sortedCorantes = [...Corantes].sort((a, b) => {
    if (sortColumn === 'id_corante') {
      return sortDirection === 'asc' ? a.id_corante - b.id_corante : b.id_corante - a.id_corante;
    } else if (sortColumn === 'quantidade') {
      return sortDirection === 'asc' ? a.quantidade - b.quantidade : b.quantidade - a.quantidade;
    }
    return 0;
  });

  const filteredCorantes = sortedCorantes.filter(corante => {
    const matchesSearchTerm = corante.nome.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearchTerm;
  });

  const pages = Math.ceil(filteredCorantes.length / itemsPerPage);

  const getPageItems = (items: any[], page: number, itemsPerPage: number) => {
    const start = page * itemsPerPage;
    return items.slice(start, start + itemsPerPage);
  };

  return (
    <VStack alignItems="center">
      <Box className="TableBox" width="130%">
        <Input placeholder="Pesquisar por Nome" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="TableSearchInput"/>
        <Table className="TableTable" sx={{ tableLayout: 'fixed' }}>
          <Thead className="LineHead">
            <Tr>
              <Th color="white" width="10%" onClick={() => handleSort('id_corante')} style={{ cursor: 'pointer' }}>
                <HStack spacing={1}>
                  <Text>ID</Text>
                  {sortColumn === 'id_corante' && (sortDirection === 'asc' ? <FaSortUp color="white" /> : <FaSortDown color="white" />)}
                </HStack>
              </Th>
              <Th color="white">Nome</Th>
              <Th color="white" onClick={() => handleSort('quantidade')} style={{ cursor: 'pointer' }}>
                <HStack spacing={1}>
                  <Text>Quantidade-G</Text>
                  {sortColumn === 'quantidade' && (sortDirection === 'asc' ? <FaSortUp color="white" /> : <FaSortDown color="white" />)}
                </HStack>
              </Th>
              <Th color="white" width="12%">Ações</Th>
            </Tr>
          </Thead>
          <Tbody>
            {getPageItems(filteredCorantes, page, itemsPerPage).map((corante) => (
              <Tr className="Line" key={corante.id_corante}>
                <Td>{corante.id_corante}</Td>
                <Td>{corante.nome}</Td>
                <Td>{corante.quantidade}</Td>
                <Td>
                  <HStack spacing={2} justifyContent="flex-end">
                    <FaPencilAlt cursor="pointer" onClick={() => openEditModal(corante)} />
                    <FaTrash cursor="pointer" onClick={() => deleteCorante(corante.id_corante)} color="darkred" />
                  </HStack>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>

      <HStack marginLeft="50%" spacing={4}>
        <Box maxWidth="150%">
          <AddCorante addCorante={addCorante} />
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
      <ModifyCorante
        editCorante={editCorante}
        updateCorante={updateCorante}
        onClose={() => setEditModalOpen(false)}
        isOpen={isEditModalOpen}
      />
    </VStack>
  );
};

const AddCorante: React.FC<{ addCorante: (corante: any) => void }> = ({ addCorante }) => {
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [formData, setFormData] = useState<{ nome: string; quantidade: number }>({
    nome: '',
    quantidade: 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    addCorante({
      ...formData,
      quantidade: Number(formData.quantidade),
    });
    setAddModalOpen(false);
    setFormData({ nome: '', quantidade: 0 });
  };

  const openAddModal = () => {
    setAddModalOpen(true);
  };

  return (
    <Box>
      <Button onClick={openAddModal}>Adicionar Corante</Button>
      <Modal isOpen={isAddModalOpen} onClose={() => setAddModalOpen(false)}>
        <ModalOverlay />
        <ModalContent className="TableModal">
          <ModalHeader>Adicionar Corante</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={handleSubmit}>
              <FormControl isRequired>
                <FormLabel>Nome</FormLabel>
                <Input type="text" name="nome" value={formData.nome} onChange={handleChange} />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Quantidade</FormLabel>
                <Input type="number" name="quantidade" value={formData.quantidade} onChange={handleChange} />
              </FormControl>
            <Button type="submit" className="SaveButton">Salvar</Button>
            <Button onClick={() => setAddModalOpen(false )}  className="CancelButton">Cancelar</Button>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

const ModifyCorante: React.FC<{ editCorante: any; updateCorante: (corante: any) => void; onClose: () => void; isOpen: boolean }> = ({ editCorante, updateCorante, onClose, isOpen }) => {
  const [formData, setFormData] = useState<{ nome: string; quantidade: number }>({
    nome: '',
    quantidade: 0,
  });

  useEffect(() => {
    if (editCorante) {
      setFormData({
        nome: editCorante.nome,
        quantidade: editCorante.quantidade,
      });
    }
  }, [editCorante]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const updatedCorante = {
      ...formData,
      id_corante: editCorante.id_corante,
      quantidade: Number(formData.quantidade),
    };
    await updateCorante(updatedCorante);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent className="TableModal">
        <ModalHeader>Editar Corante</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form onSubmit={handleSubmit}>
            <FormControl isRequired>
              <FormLabel>Nome</FormLabel>
              <Input type="text" name="nome" value={formData.nome} onChange={(e) => setFormData({ ...formData, nome: e.target.value })} />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Quantidade</FormLabel>
              <Input type="number" name="quantidade" value={formData.quantidade} onChange={(e) => setFormData({ ...formData, quantidade: Number(e.target.value) })} />
            </FormControl>
            <Button type="submit" className="SaveButton">Editar</Button>
            <Button onClick={onClose} className="CancelButton">Cancelar</Button>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default DataCorante;