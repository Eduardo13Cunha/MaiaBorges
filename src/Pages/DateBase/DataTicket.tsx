import { Text, VStack, Box, Table, Thead, Tr, Th, Tbody, Td, HStack, Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, FormControl, FormLabel, Input, Menu, MenuButton, MenuItem, MenuList, Textarea } from "@chakra-ui/react";
import axios from "axios";
import { format } from 'date-fns'; 
import { useState, useEffect } from "react";
import { FaAngleLeft, FaAngleRight, FaPencilAlt, FaTrash ,FaSearch, FaSortDown, FaSortUp } from "react-icons/fa";
import '../../Styles/styles.css';

const DataTicket: React.FC = () => {
  const [selectedEstado, setSelectedEstado] = useState<any>(null);
  const [selectedPrioridade, setSelectedPrioridade] = useState<any>(null);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedDescription, setSelectedDescription] = useState('');
  const [editTarefa, setEditTarefa] = useState<any>(null);
  const [page, setPage] = useState<number>(0);
  const [Estado, setEstado] = useState<any[]>([]);
  const [Prioridade, setPrioridade] = useState<any[]>([]);
  const [Tarefas, setTarefa] = useState<any[]>([]);
  const itemsPerPage = 8;
  const [sortColumn, setSortColumn] = useState<string>('id_tar'); // Coluna padrão para ordenar
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc'); // Direção da ordenação

  useEffect(() => {
    const fetchTarefas = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/tarefa');
        const sortedData = response.data.data.sort((a: { id_tar: number; }, b: { id_tar: number; }) => a.id_tar - b.id_tar);
        setTarefa(sortedData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchTarefas();
  }, []);

  useEffect(() => {
    const fetchEstados = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/estadostarefa');
        const sortedData = response.data.data.sort((a: { id_esttar: number; }, b: { id_esttar: number; }) => a.id_esttar - b.id_esttar);
        setEstado(sortedData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    fetchEstados();
  }, []);

  useEffect(() => {
    const feetchPrioridade = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/prioridadetarefa');
        const sortedData = response.data.data.sort((a: { id_pri: number; }, b: { id_pri: number; }) => a.id_pri - b.id_pri);
        setPrioridade(sortedData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    feetchPrioridade();
  }, []);

  const updateTarefa = async (tarefa: any) => {
    try {
      const response = await axios.put(`http://localhost:3001/api/tarefa/${tarefa.id_tar}`, tarefa);
      if (response.data) {
        setTarefa((prev) => prev.map(t => (t.id_tar === tarefa.id_tar ? response.data.data : t)));
      } else {
        console.error("Resposta da API não contém dados esperados:", response.data);
      }
    } catch (error) {
      console.error('Error updating tarefa:', error);
    }
  };

  const openEditModal = (tarefa: any) => {
    setEditTarefa(tarefa);
    setEditModalOpen(true);
  };

  const openModal = (description: string) => {
    setSelectedDescription(description);
    setModalOpen(true);
  };

  const handleSort = (column: string) => {
    const newDirection = (sortColumn === column && sortDirection === 'asc') ? 'desc' : 'asc';
    setSortDirection(newDirection);
    setSortColumn(column);
  };

  const filteredEquipamentos = Tarefas.filter(tarefa => {
    const matchesEstado = selectedEstado ? tarefa.id_esttar === selectedEstado.id_esttar : true;
    const matchesPrioridade = selectedPrioridade ? tarefa.id_pri === selectedPrioridade.id_pri : true;
    return matchesEstado && matchesPrioridade;
  });

  const sortedEquipamentos = [...filteredEquipamentos].sort((a, b) => {
    const aValue = sortColumn === 'data_inicio' || sortColumn === 'data_acaba' 
      ? new Date(a[sortColumn]).getTime() 
      : a[sortColumn];
    const bValue = sortColumn === 'data_inicio' || sortColumn === 'data_acaba' 
      ? new Date(b[sortColumn]).getTime() 
      : b[sortColumn];

    return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
  });

  const pages = Math.ceil(sortedEquipamentos.length / itemsPerPage);
  const getPageItems = (items: any[], page: number, itemsPerPage: number) => {
    const start = page * itemsPerPage;
    return items.slice(start, start + itemsPerPage);
  };

  return (
    <VStack alignItems="center">
      <Box overflowX="auto" height="75vh" width="100%" overflowY="auto">
      <HStack justifyContent="flex-start" color="white" marginLeft="15%" marginRight="15%" marginTop="2%" maxH="80%" maxW="100%">
          <Menu>
            <MenuButton as={Button} bgColor="rgba(30, 30, 100)" color="white" w="20%">
              {selectedEstado ? selectedEstado.des_esttar : "Selecione um Estado"}
            </MenuButton>
            <MenuList bgColor="transparent" border="transparent" color="white">
              <MenuItem width="100%" bgColor="rgba(30, 30, 100)" onClick={() => setSelectedEstado(null)}>Selecione um Estado</MenuItem>
              {Estado.map(estado => (
                <MenuItem width="100%" bgColor="rgba(30, 30, 100)" key={estado.id_esttar} onClick={() => setSelectedEstado(estado)}>
                  {estado.des_esttar}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton as={Button} bgColor="rgba(30, 30, 100)" color="white" w="20%">
              {selectedPrioridade ? selectedPrioridade.des_pri : "Selecione um Prioridade"}
            </MenuButton>
            <MenuList bgColor="transparent" border="transparent" color="white">
              <MenuItem width="100%" bgColor="rgba(30, 30, 100)" onClick={() => setSelectedPrioridade(null)}>Selecione uma Prioridade</MenuItem>
              {Prioridade.map(prioridade => (
                <MenuItem width="100%" bgColor="rgba(30, 30, 100)" key={prioridade.id_pri} onClick={() => setSelectedPrioridade(prioridade)}>
                  {prioridade.des_pri}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
        </HStack>
        <Table color="white" marginLeft="15%" marginRight="15%" marginTop="2%" maxH="80%" maxW="70%" sx={{ tableLayout: 'fixed' }}>
          <Thead className="LineHead">
            <Tr>
            <Th width="7%" color="white" onClick={() => handleSort('id_tar')} style={{ cursor: 'pointer' }}>
                <HStack spacing={1}>
                  <Text>ID</Text>
                  {sortColumn === 'id_tar' && (sortDirection === 'asc' ? <FaSortUp color="white" /> : <FaSortDown color="white" />)}
                </HStack>
              </Th>
              <Th color="white">Descrição</Th>
              <Th color="white" width="15%">Utilizador</Th>
              <Th width="13%" color="white" onClick={() => handleSort('data_inicio')} style={{ cursor: 'pointer' }}>
                <HStack spacing={1}>
                  <Text>Data de Inicio</Text>
                  {sortColumn === 'data_inicio' && (sortDirection === 'asc' ? <FaSortUp color="white" /> : <FaSortDown color="white" />)}
                </HStack>
              </Th>
              <Th width="13%" color="white" onClick={() => handleSort('data_acaba')} style={{ cursor: 'pointer' }}>
                <HStack spacing={1}>
                  <Text>Data Final</Text>
                  {sortColumn === 'data_acaba' && (sortDirection === 'asc' ? <FaSortUp color="white" /> : <FaSortDown color="white" />)}
                </HStack>
              </Th>
              <Th color="white" width="13%">Estado</Th>
              <Th color="white" width="13%">Prioridade</Th>
              <Th color="white" width="9%">Ações</Th>
            </Tr>
          </Thead>
          <Tbody>
            {getPageItems(sortedEquipamentos, page, itemsPerPage).map((tarefa) => (
              <Tr className="Line" key={tarefa.id_tar}>
                <Td>{tarefa.id_tar}</Td>
                <Td className="truncated" onClick={() => openModal(tarefa.des_tar)}>{tarefa.des_tar}</Td>
                <Td>{tarefa.nome}</Td>
                <Td>{format(new Date(tarefa.data_inicio), 'dd/MM/yyyy')}</Td>
                <Td>{tarefa.data_acaba ? format(new Date(tarefa.data_acaba), 'dd/MM /yyyy') : ''}</Td>
                <Td>{tarefa.des_esttar}</Td>
                <Td>{tarefa.des_pri}</Td>
                <Td>
                  <HStack spacing={2} justifyContent="flex-end">
                    <FaPencilAlt cursor="pointer" onClick={() => openEditModal(tarefa)} />
                  </HStack>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
      
      <HStack marginLeft="50%" spacing={4}>
        <HStack w="100%" justifyContent="flex-end">
          <Button onClick={() => setPage(page === 0 ? 0 : page - 1)} disabled={page === 0}>
            <FaAngleLeft />
          </Button>
          <Button onClick={() => setPage(page === pages - 1 ? pages - 1 : page + 1)} disabled={page === pages - 1}>
            <FaAngleRight />
          </Button>
        </HStack>
      </HStack>
      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
        <ModalOverlay />
        <ModalContent bgColor="rgba(30, 30, 130)" color="white" maxH="100%" maxW="40%">
          <ModalHeader>Descrição Completa</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>{selectedDescription}</Text>
          </ModalBody>
        </ModalContent>
      </Modal>
      <ModifyTarefa
        editTarefa={editTarefa} 
        updateTarefa={updateTarefa} 
        estados={Estado}
        onClose={() => setEditModalOpen(false)} 
        isOpen={isEditModalOpen} 
      />
    </VStack>
  );
};

const ModifyTarefa: React.FC<{ editTarefa: any; updateTarefa: (tarefa: any) => void; estados: any[]; onClose: () => void; isOpen: boolean }> = ({ editTarefa, updateTarefa, estados, onClose, isOpen }) => {
  const [formData, setFormData] = useState<{ id_esttar: number | undefined ,data_acaba1: string, }>({
    id_esttar: undefined,
    data_acaba1:"",
  });

  useEffect(() => {
    if (editTarefa) {
      setFormData({
        id_esttar: editTarefa.id_esttar,
        data_acaba1: editTarefa.data_acaba ? editTarefa.data_acaba.split('T')[0] : '',
      });
    }
  }, [editTarefa]);

  const handleMenuItemClickEstado = (id: number) => {
    setFormData({ ...formData, id_esttar: id });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let data_acaba: string | null;
    if(formData.data_acaba1 == ""){data_acaba=null} else {data_acaba = formData.data_acaba1};
    if (formData.id_esttar === undefined) {
      return alert("Por favor, selecione um estado.");
    }
    const updatedTarefa = {
      id_tar: editTarefa.id_tar,
      id_esttar: formData.id_esttar,
      data_acaba : data_acaba
    };
    try {
      await updateTarefa(updatedTarefa);
      onClose();
    } catch (error) {
      console.error('Erro ao atualizar tarefa:', error);
      alert('Erro ao atualizar tarefa. Tente novamente.');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent bgColor="rgba(30, 30, 130)" color="white" maxH="100%" maxW="40%">
        <ModalHeader>Editar Estado da Tarefa</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form onSubmit={handleSubmit}>
            <FormControl isRequired>
              <FormLabel>Estado</FormLabel>
              <Menu>
                <MenuButton as={Button} width="100%" bgColor="rgba(30, 30, 100)" color="white">
                  {formData.id_esttar !== undefined ? estados.find(e => e.id_esttar === formData.id_esttar)?.des_esttar : "Selecione um Estado"}
                </MenuButton>
                <MenuList w="311%" bgColor="transparent" border="transparent" color="white">
                  {estados.map((estado) => (
                    <MenuItem width="100%" bgColor="rgba(30, 30, 100)" key={estado.id_esttar} onClick={() => handleMenuItemClickEstado(estado.id_esttar)}>
                      {estado.des_esttar}
                    </MenuItem>
                  ))}
                </MenuList>
              </Menu>
            </FormControl>
            <FormControl>
                <FormLabel>Data de Final</FormLabel>
                <Input type="date" name="data_acaba1"  value={formData.data_acaba1} onChange={(e) => setFormData({ ...formData, data_acaba1: e.target.value })}/>
              </FormControl>
            <Button type="submit" mr="2%" bgColor="rgba(30, 30, 90, 0.8)" color="white">Salvar</Button>
            <Button bgColor="rgba(30, 30, 90, 1)" color="white" onClick={onClose}>Cancelar</Button>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default DataTicket;