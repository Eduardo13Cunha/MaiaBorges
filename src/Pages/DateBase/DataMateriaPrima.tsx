import { Text, VStack, Box, Table, Thead, Tr, Th, Tbody, Td, HStack, Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, FormControl, FormLabel, Input, ModalFooter } from "@chakra-ui/react";
import axios from "axios";
import { useState, useEffect } from "react";
import { FaAngleLeft, FaAngleRight, FaPencilAlt, FaSortDown, FaSortUp } from "react-icons/fa";
import { FaTrash } from "react-icons/fa";

const DataMateriaPrima: React.FC = () => {
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [editMateriaPrima, setEditMateriaPrima] = useState<any>(null);
  const [page, setPage] = useState<number>(0);
  const [MateriasPrimas, setMateriasPrimas] = useState<any[]>([]);
  const itemsPerPage = 8;
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [sortColumn, setSortColumn] = useState<string>('id');
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    const fetchMateriasPrimas = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/materiasprima');
        setMateriasPrimas(response.data.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchMateriasPrimas();
  }, []);

  const addMateriaPrima = async (novamateriaPrima: any) => {
    try {
      const response = await axios.post('http://localhost:3001/api/materiasprima', novamateriaPrima);
      const novaMateriaPrima = response.data.data;
      setMateriasPrimas((prev) => [...prev, novaMateriaPrima]);
    } catch (error) {
      console.error('Error adding materia prima:', error);
    }
  };

  const deleteMateriaPrima = async (id: number) => {
    const confirmDelete = window.confirm("Tem certeza que deseja excluir este registro?");
    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:3001/api/materiasprima/${id}`);
        setMateriasPrimas(MateriasPrimas.filter(materiaPrima => materiaPrima.id_materiasprima !== id));
      } catch (error) {
        console.error('Error deleting materia prima:', error);
      }
    }
  };

  const updateMateriaPrima = async (materiaPrima: any) => {
    try {
      const response = await axios.put(`http://localhost:3001/api/materiasprima/${materiaPrima.id_materiasprima}`, materiaPrima);
      if (response.data) {
        setMateriasPrimas(MateriasPrimas.map(c => (c.id_materiasprima === materiaPrima.id_materiasprima ? response.data : c)));
      } else {
        console.error("Resposta da API não contém dados esperados:", response.data);
      }
    } catch (error) {
      console.error('Error updating materia prima:', error);
    }
  };

  const openEditModal = (materiaPrima: any) => {
    setEditMateriaPrima(materiaPrima);
    setEditModalOpen(true);
  };

  const handleSort = (column: string) => {
    const newDirection = (sortColumn === column && sortDirection === 'asc') ? 'desc' : 'asc';
    setSortDirection(newDirection);
    setSortColumn(column);
  };

  const sortedMateriasPrimas = [...MateriasPrimas].sort((a, b) => {
    if (sortColumn === 'id_materiasprima') {
      return sortDirection === 'asc' ? a.id_materiasprima - b.id_materiasprima : b.id_materiasprima - a.id_materiasprima;
    } else if (sortColumn === 'quantidade') {
      return sortDirection === 'asc' ? a.quantidade - b.quantidade : b.quantidade - a.quantidade;
    }
    return 0;
  });

  const filteredMateriasPrimas = sortedMateriasPrimas.filter(materiaPrima => {
    const matchesSearchTerm = materiaPrima.nome.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearchTerm;
  });

  const pages = Math.ceil(filteredMateriasPrimas.length / itemsPerPage);

  const getPageItems = (items: any[], page: number, itemsPerPage: number) => {
    const start = page * itemsPerPage;
    return items.slice(start, start + itemsPerPage);
  };

  return (
    <VStack alignItems="center">
      <Box className="TableBox" width="130%">
        <Input placeholder="Pesquisar por Nome" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="TableSearchInput"/>
        <Table color="white" marginLeft="15%" marginRight="15%" marginTop="2%" maxH="80%" maxW="70%" sx={{ tableLayout: 'fixed' }}>
          <Thead className="LineHead">
            <Tr>
              <Th color="white" width="10%" onClick={() => handleSort('id_materiasprima')} style={{ cursor: 'pointer' }}>
                <HStack spacing={1}>
                  <Text>ID</Text>
                  {sortColumn === 'id_materiasprima' && (sortDirection === 'asc' ? <FaSortUp color="white" /> : <FaSortDown color="white" />)}
                </HStack>
              </Th>
              <Th color="white">Nome</Th>
              <Th color="white" onClick={() => handleSort('quantidade')} style={{ cursor: 'pointer' }}>
                <HStack spacing={1}>
                  <Text>Quantidade-KG</Text>
                  {sortColumn === 'quantidade' && (sortDirection === 'asc' ? <FaSortUp color="white" /> : <FaSortDown color="white" />)}
                </HStack>
              </Th>
              <Th color="white" width="12%">Ações</Th>
            </Tr>
          </Thead>
          <Tbody>
            {getPageItems(filteredMateriasPrimas, page, itemsPerPage).map((materiaPrima) => (
              <Tr className="Line" key={materiaPrima.id_materiasprima}>
                <Td>{materiaPrima.id_materiasprima}</Td>
                <Td>{materiaPrima.nome}</Td>
                <Td>{materiaPrima.quantidade}</Td>
                <Td>
                  <HStack spacing={2} justifyContent="flex-end">
                    <FaPencilAlt cursor="pointer" onClick={() => openEditModal(materiaPrima)} />
                    <FaTrash cursor="pointer" onClick={() => deleteMateriaPrima(materiaPrima.id_materiasprima)} color="darkred" />
                  </HStack>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>

      <HStack marginLeft="50%" spacing={4}>
        <Box maxWidth="150%">
          <AddMateriaPrima addMateriaPrima={addMateriaPrima} />
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
      <ModifyMateriaPrima
        editMateriaPrima={editMateriaPrima}
        updateMateriaPrima={updateMateriaPrima}
        onClose={() => setEditModalOpen(false)}
        isOpen={isEditModalOpen}
      />
    </VStack>
  );
};

const AddMateriaPrima: React.FC<{ addMateriaPrima: (materiaPrima: any) => void }> = ({ addMateriaPrima }) => {
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
    addMateriaPrima({
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
      <Button onClick={openAddModal}>Adicionar Materia Prima</Button>
      <Modal isOpen={isAddModalOpen} onClose={() => setAddModalOpen(false)}>
        <ModalOverlay />
        <ModalContent className="TableModal">
          <ModalHeader>Adicionar Materia Prima</ModalHeader>
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
              <Button onClick={() => setAddModalOpen(false)} className="CancelButton">Cancelar</Button>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

const ModifyMateriaPrima: React.FC<{ editMateriaPrima: any; updateMateriaPrima: (materiaPrima: any) => void; onClose: () => void; isOpen: boolean }> = ({ editMateriaPrima, updateMateriaPrima, onClose, isOpen }) => {
  const [formData, setFormData] = useState<{ nome: string; quantidade: number }>({
    nome: '',
    quantidade: 0,
  });

  useEffect(() => {
    if (editMateriaPrima) {
      setFormData({
        nome: editMateriaPrima.nome,
        quantidade: editMateriaPrima.quantidade,
      });
    }
  }, [editMateriaPrima]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const updatedMateriaPrima = {
      ...formData,
      id_materiasprima: editMateriaPrima.id_materiasprima,
      quantidade: Number(formData.quantidade),
    };
    await updateMateriaPrima(updatedMateriaPrima);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent className="TableModal">
        <ModalHeader>Editar Materia Prima</ModalHeader>
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

export default DataMateriaPrima;