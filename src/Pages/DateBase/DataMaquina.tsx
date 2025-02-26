import React, { useState, useEffect } from 'react';
import {
  VStack,
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  HStack,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Text
} from '@chakra-ui/react';
import { FaTrash, FaPencilAlt, FaAngleLeft, FaAngleRight, FaSortDown, FaSortUp } from 'react-icons/fa';
import axios from 'axios';

const DataMaquina = () => {
  const [maquinas, setMaquinas] = useState<any[]>([]);
  const [page, setPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [editMaquina, setEditMaquina] = useState<any>(null);
  const [sortColumn, setSortColumn] = useState<string>('id_maquina');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const itemsPerPage = 8;

  useEffect(() => {
    fetchMaquinas();
  }, []);

  const fetchMaquinas = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/maquina');
      setMaquinas(response.data.data);
    } catch (error) {
      console.error('Error fetching maquinas:', error);
    }
  };

  const handleSort = (column: string) => {
    const newDirection = sortColumn === column && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortDirection(newDirection);
    setSortColumn(column);
  };

  const addMaquina = async (maquina: any) => {
    try {
      const response = await axios.post('http://localhost:3001/api/maquina', maquina);
      setMaquinas([...maquinas, response.data.data]);
    } catch (error) {
      console.error('Error adding maquina:', error);
    }
  };

  const deleteMaquina = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir esta máquina?')) {
      try {
        await axios.delete(`http://localhost:3001/api/maquina/${id}`);
        setMaquinas(maquinas.filter(maquina => maquina.id_maquina !== id));
      } catch (error) {
        console.error('Error deleting maquina:', error);
      }
    }
  };

  const updateMaquina = async (maquina: any) => {
    try {
      const response = await axios.put(`http://localhost:3001/api/maquina/${maquina.id_maquina}`, maquina);
      setMaquinas(maquinas.map(m => m.id_maquina === maquina.id_maquina ? response.data : m));
      setEditModalOpen(false);
    } catch (error) {
      console.error('Error updating maquina:', error);
    }
  };

  const sortedMaquinas = [...maquinas].sort((a, b) => {
    if (sortColumn === 'id_maquina') {
      return sortDirection === 'asc' 
        ? a.id_maquina - b.id_maquina 
        : b.id_maquina - a.id_maquina;
    } else {
      const aValue = sortColumn === 'data_inicio' || sortColumn === 'ultima_inspecao' || sortColumn === 'proxima_inspecao' 
        ? new Date(a[sortColumn]).getTime() 
        : a[sortColumn];
      const bValue = sortColumn === 'data_inicio' || sortColumn === 'ultima_inspecao' || sortColumn === 'proxima_inspecao' 
        ? new Date(b[sortColumn]).getTime() 
        : b[sortColumn];
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    }
    return 0;
  });

  const filteredMaquinas = sortedMaquinas.filter(maquina =>
    maquina.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pages = Math.ceil(filteredMaquinas.length / itemsPerPage);
  const currentItems = filteredMaquinas.slice(
    page * itemsPerPage,
    (page + 1) * itemsPerPage
  );

  return (
    <VStack alignItems="center">
      <Box className="TableBox">
        <Input
          placeholder="Pesquisar por nome"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="TableSearchInput"
        />
        <Table className="TableTable" sx={{ tableLayout: 'fixed' }}>
          <Thead className='LineHead'>
            <Tr>
              <Th color="white" onClick={() => handleSort('id_maquina')} style={{ cursor: 'pointer' }}>
                <HStack spacing={1}>
                  <Text>ID</Text>
                  {sortColumn === 'id_maquina' && (
                    sortDirection === 'asc' ? <FaSortUp /> : <FaSortDown />
                  )}
                </HStack>
              </Th>
              <Th color="white">Nome</Th>
              <Th color="white" onClick={() => handleSort('data_inicio')} style={{ cursor: 'pointer' }}>
                <HStack spacing={1}>
                  <Text>Data de Inicio</Text>
                  {sortColumn === 'data_inicio' && (sortDirection === 'asc' ? <FaSortUp color="white" /> : <FaSortDown color="white" />)}
                </HStack>
              </Th>
              <Th color="white" onClick={() => handleSort('ultima_inspecao')} style={{ cursor: 'pointer' }}>
                <HStack spacing={1}>
                  <Text>Ultima Inspeção</Text>
                  {sortColumn === 'ultima_inspecao' && (sortDirection === 'asc' ? <FaSortUp color="white" /> : <FaSortDown color="white" />)}
                </HStack>
              </Th>
              <Th color="white" onClick={() => handleSort('proxima_inspecao')} style={{ cursor: 'pointer' }}>
                <HStack spacing={1}>
                  <Text>Próxima Inspeção</Text>
                  {sortColumn === 'proxima_inspecao' && (sortDirection === 'asc' ? <FaSortUp color="white" /> : <FaSortDown color="white" />)}
                </HStack>
              </Th>
              <Th color="white" width="8%">Ações</Th>
            </Tr>
          </Thead>
          <Tbody>
            {currentItems.map((maquina) => (
              <Tr key={maquina.id_maquina} className="Line">
                <Td>{maquina.id_maquina}</Td>
                <Td>{maquina.nome}</Td>
                <Td>{new Date(maquina.data_inicio).toLocaleDateString()}</Td>
                <Td>{new Date(maquina.ultima_inspecao).toLocaleDateString()}</Td>
                <Td>{new Date(maquina.proxima_inspecao).toLocaleDateString()}</Td>
                <Td>
                  <HStack spacing={2}>
                    <FaPencilAlt
                      cursor="pointer"
                      onClick={() => {
                        setEditMaquina(maquina);
                        setEditModalOpen(true);
                      }}
                    />
                    <FaTrash
                      cursor="pointer"
                      color="darkred"
                      onClick={() => deleteMaquina(maquina.id_maquina)}
                    />
                  </HStack>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>

      <HStack marginLeft="50%" spacing={4}>
        <AddMaquinaModal addMaquina={addMaquina} />
        <Button
          onClick={() => setPage(Math.max(0, page - 1))}
          disabled={page === 0}
        >
          <FaAngleLeft />
        </Button>
        <Button
          onClick={() => setPage(Math.min(pages - 1, page + 1))}
          disabled={page === pages - 1}
        >
          <FaAngleRight />
        </Button>
      </HStack>

      <EditMaquinaModal
        isOpen={isEditModalOpen}
        onClose={() => setEditModalOpen(false)}
        maquina={editMaquina}
        updateMaquina={updateMaquina}
      />
    </VStack>
  );
};

const AddMaquinaModal = ({ addMaquina }: { addMaquina: (maquina: any) => void }) => {
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    data_inicio: new Date().toISOString().split('T')[0],
    ultima_inspecao: new Date().toISOString().split('T')[0],
    proxima_inspecao: new Date().toISOString().split('T')[0],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addMaquina(formData);
    setAddModalOpen(false);
    setFormData({
      nome: '',
      data_inicio: new Date().toISOString().split('T')[0],
      ultima_inspecao: new Date().toISOString().split('T')[0],
      proxima_inspecao: new Date().toISOString().split('T')[0],
    });
  };

  return (
    <>
      <Button onClick={() => setAddModalOpen(true)}>Adicionar Máquina</Button>

      <Modal isOpen={isAddModalOpen} onClose={() => setAddModalOpen(false)}>
        <ModalOverlay />
        <ModalContent className='TableModal'>
          <ModalHeader>Adicionar Máquina</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={handleSubmit}>
              <FormControl isRequired>
                <FormLabel>Nome</FormLabel>
                <Input
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                />
              </FormControl>

              <FormControl isRequired mt={4}>
                <FormLabel>Data de Início</FormLabel>
                <Input
                  type="date"
                  value={formData.data_inicio}
                  onChange={(e) => setFormData({ ...formData, data_inicio: e.target.value })}
                />
              </FormControl>

              <FormControl isRequired mt={4}>
                <FormLabel>Última Inspeção</FormLabel>
                <Input
                  type="date"
                  value={formData.ultima_inspecao}
                  onChange={(e) => setFormData({ ...formData, ultima_inspecao: e.target.value })}
                />
              </FormControl>

              <FormControl isRequired mt={4}>
                <FormLabel>Próxima Inspeção</FormLabel>
                <Input
                  type="date"
                  value={formData.proxima_inspecao}
                  onChange={(e) => setFormData({ ...formData, proxima_inspecao: e.target.value })}
                />
              </FormControl>
              <Button type="submit" className="SaveButton">Salvar</Button>
              <Button onClick={() => setAddModalOpen(false )} className="CancelButton">Cancelar</Button>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

const EditMaquinaModal = ({
  isOpen,
  onClose,
  maquina,
  updateMaquina,
}: {
  isOpen: boolean;
  onClose: () => void;
  maquina: any;
  updateMaquina: (maquina: any) => void;
}) => {
  const [formData, setFormData] = useState({
    nome: '',
    data_inicio: '',
    ultima_inspecao: '',
    proxima_inspecao: '',
  });

  useEffect(() => {
    if (maquina) {
      setFormData({
        nome: maquina.nome,
        data_inicio: new Date(maquina.data_inicio).toISOString().split('T')[0],
        ultima_inspecao: new Date(maquina.ultima_inspecao).toISOString().split('T')[0],
        proxima_inspecao: new Date(maquina.proxima_inspecao).toISOString().split('T')[0],
      });
    }
  }, [maquina]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMaquina({
      ...formData,
      id_maquina: maquina.id_maquina,
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent className='TableModal'>
        <ModalHeader>Editar Máquina</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form onSubmit={handleSubmit}>
            <FormControl isRequired>
              <FormLabel>Nome</FormLabel>
              <Input
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              />
            </FormControl>

            <FormControl isRequired mt={4}>
              <FormLabel>Data de Início</FormLabel>
              <Input
                type="date"
                value={formData.data_inicio}
                onChange={(e) => setFormData({ ...formData, data_inicio: e.target.value })}
              />
            </FormControl>

            <FormControl isRequired mt={4}>
              <FormLabel>Última Inspeção</FormLabel>
              <Input
                type="date"
                value={formData.ultima_inspecao}
                onChange={(e) => setFormData({ ...formData, ultima_inspecao: e.target.value })}
              />
            </FormControl>

            <FormControl isRequired mt={4}>
              <FormLabel>Próxima Inspeção</FormLabel>
              <Input
                type="date"
                value={formData.proxima_inspecao}
                onChange={(e) => setFormData({ ...formData, proxima_inspecao: e.target.value })}
              />
            </FormControl>

            
            <Button type="submit" className="SaveButton">Editar</Button>
              <Button onClick={onClose} className="CancelButton">Cancelar</Button>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default DataMaquina;