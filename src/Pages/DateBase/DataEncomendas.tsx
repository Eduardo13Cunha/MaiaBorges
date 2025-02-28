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
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text
} from '@chakra-ui/react';
import { FaTrash, FaPencilAlt, FaAngleLeft, FaAngleRight, FaSortDown, FaSortUp } from 'react-icons/fa';
import axios from 'axios';
import { Encomenda, Figura, Cliente } from '../../Interfaces/interfaces';

const DataEncomenda: React.FC = () => {
  const [encomendas, setEncomendas] = useState<any[]>([]);
  const [figuras, setFiguras] = useState<any[]>([]);
  const [clientes, setClientes] = useState<any[]>([]);
  const [page, setPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [editEncomenda, setEditEncomenda] = useState<any>(null);
  const [sortColumn, setSortColumn] = useState<string>('id_encomenda');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const itemsPerPage = 8;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [encomendaRes, figuraRes, clienteRes] = await Promise.all([
        axios.get('http://localhost:3001/api/encomenda'),
        axios.get('http://localhost:3001/api/figura'),
        axios.get('http://localhost:3001/api/cliente')
      ]);
      setEncomendas((encomendaRes.data as { data: Encomenda[] }).data);
      setFiguras((figuraRes.data as { data: Figura[] }).data);
      setClientes((clienteRes.data as { data: Cliente[] }).data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleSort = (column: string) => {
    const newDirection = sortColumn === column && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortDirection(newDirection);
    setSortColumn(column);
  };

  const addEncomenda = async (encomenda: any) => {
    try {
      const response = await axios.post('http://localhost:3001/api/encomenda', encomenda);
      setEncomendas([...encomendas, (response.data as { data: Encomenda[] }).data]);
    } catch (error) {
      console.error('Error adding encomenda:', error);
    }
  };

  const deleteEncomenda = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir esta encomenda?')) {
      try {
        await axios.delete(`http://localhost:3001/api/encomenda/${id}`);
        setEncomendas(encomendas.filter(encomenda => encomenda.id_encomenda !== id));
      } catch (error) {
        console.error('Error deleting encomenda:', error);
      }
    }
  };

  const updateEncomenda = async (encomenda: any) => {
    try {
      const response = await axios.put(`http://localhost:3001/api/encomenda/${encomenda.id_encomenda}`, encomenda);
      setEncomendas(encomendas.map(e => e.id_encomenda === encomenda.id_encomenda ? response.data : e));
      setEditModalOpen(false);
    } catch (error) {
      console.error('Error updating encomenda:', error);
    }
  };

  const sortedEncomendas = [...encomendas].sort((a, b) => {
    if (sortColumn === 'id_encomenda') {
      return sortDirection === 'asc' 
        ? a.id_encomenda - b.id_encomenda 
        : b.id_encomenda - a.id_encomenda;
    }
    if (sortColumn === 'quantidade') {
      return sortDirection === 'asc'
        ? a.quantidade - b.quantidade
        : b.quantidade - a.quantidade;
    }
    return 0;
  });

  const filteredEncomendas = sortedEncomendas.filter(encomenda =>
    encomenda.figuras.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    encomenda.clientes.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pages = Math.ceil(filteredEncomendas.length / itemsPerPage);
  const currentItems = filteredEncomendas.slice(
    page * itemsPerPage,
    (page + 1) * itemsPerPage
  );

  return (
    <VStack alignItems="center">
      <Box className="TableBox">
        <Input
          placeholder="Pesquisar por figura ou cliente"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="TableSearchInput"
        />
        <Table className="TableTable" sx={{ tableLayout: 'fixed' }}>
          <Thead className="LineHead">
            <Tr>
              <Th color="white" onClick={() => handleSort('id_encomenda')} style={{ cursor: 'pointer' }}>
                <HStack spacing={1}>
                  <Text>ID</Text>
                  {sortColumn === 'id_encomenda' && (
                    sortDirection === 'asc' ? <FaSortUp /> : <FaSortDown />
                  )}
                </HStack>
              </Th>
              <Th color="white">Figura</Th>
              <Th color="white">Cliente</Th>
              <Th color="white" onClick={() => handleSort('quantidade')} style={{ cursor: 'pointer' }}>
                <HStack spacing={1}>
                  <Text>Quantidade</Text>
                  {sortColumn === 'quantidade' && (
                    sortDirection === 'asc' ? <FaSortUp /> : <FaSortDown />
                  )}
                </HStack>
              </Th>
              <Th color="white">Data Início</Th>
              <Th color="white">Data Fim</Th>
              <Th color="white" width="8%">Ações</Th>
            </Tr>
          </Thead>
          <Tbody>
            {currentItems.map((encomenda) => (
              <Tr key={encomenda.id_encomenda} className="Line">
                <Td>{encomenda.id_encomenda}</Td>
                <Td>{encomenda.figuras.nome}</Td>
                <Td>{encomenda.clientes.nome}</Td>
                <Td>{encomenda.quantidade}</Td>
                <Td>{new Date(encomenda.data_inicio).toLocaleDateString()}</Td>
                <Td>{new Date(encomenda.data_fim).toLocaleDateString()}</Td>
                <Td>
                  <HStack spacing={2}>
                    <FaPencilAlt
                      cursor="pointer"
                      onClick={() => {
                        setEditEncomenda(encomenda);
                        setEditModalOpen(true);
                      }}
                    />
                    <FaTrash
                      cursor="pointer"
                      color="darkred"
                      onClick={() => deleteEncomenda(encomenda.id_encomenda)}
                    />
                  </HStack>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>

      <HStack marginLeft="50%" spacing={4}>
        <AddEncomendaModal addEncomenda={addEncomenda} figuras={figuras} clientes={clientes} />
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

      <EditEncomendaModal
        isOpen={isEditModalOpen}
        onClose={() => setEditModalOpen(false)}
        encomenda={editEncomenda}
        updateEncomenda={updateEncomenda}
        figuras={figuras}
        clientes={clientes}
      />
    </VStack>
  );
};

const AddEncomendaModal = ({ 
  addEncomenda, 
  figuras, 
  clientes 
}: { 
  addEncomenda: (encomenda: any) => void;
  figuras: any[];
  clientes: any[];
}) => {
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    id_figura: '',
    id_cliente: '',
    quantidade: '',
    data_inicio: new Date().toISOString().split('T')[0],
    data_fim: new Date().toISOString().split('T')[0],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addEncomenda({
      ...formData,
      quantidade: Number(formData.quantidade),
    });
    setAddModalOpen(false);
    setFormData({
      id_figura: '',
      id_cliente: '',
      quantidade: '',
      data_inicio: new Date().toISOString().split('T')[0],
      data_fim: new Date().toISOString().split('T')[0],
    });
  };

  return (
    <>
      <Button onClick={() => setAddModalOpen(true)}>Adicionar Encomenda</Button>

      <Modal isOpen={isAddModalOpen} onClose={() => setAddModalOpen(false)}>
        <ModalOverlay />
        <ModalContent className='TableModal'>
          <ModalHeader>Adicionar Encomenda</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={handleSubmit}>
              <FormControl isRequired>
                <FormLabel>Figura</FormLabel>
                <Menu>
                  <MenuButton as={Button} className='TableMenu'>
                    {formData.id_figura ? figuras.find(f => f.id_figura === formData.id_figura)?.nome : "Selecione uma Figura"}
                  </MenuButton>
                  <MenuList className='TableMenuList'>
                    {figuras.map((figura) => (
                      <MenuItem
                        className='TableMenuItem'
                        key={figura.id_figura}
                        onClick={() => setFormData({ ...formData, id_figura: figura.id_figura })}
                      >
                        {figura.nome}
                      </MenuItem>
                    ))}
                  </MenuList>
                </Menu>
              </FormControl>

              <FormControl isRequired mt={4}>
                <FormLabel>Cliente</FormLabel>
                <Menu>
                  <MenuButton as={Button} className='TableMenu'>
                    {formData.id_cliente ? clientes.find(c => c.id_cliente === formData.id_cliente)?.nome : "Selecione um Cliente"}
                  </MenuButton>
                  <MenuList className='TableMenuList'>
                    {clientes.map((cliente) => (
                      <MenuItem
                        className='TableMenuItem'
                        key={cliente.id_cliente}
                        onClick={() => setFormData({ ...formData, id_cliente: cliente.id_cliente })}
                      >
                        {cliente.nome}
                      </MenuItem>
                    ))}
                  </MenuList>
                </Menu>
              </FormControl>

              <FormControl isRequired mt={4}>
                <FormLabel>Quantidade</FormLabel>
                <Input
                  type="number"
                  placeholder="Quantidade"
                  value={formData.quantidade}
                  onChange={(e) => setFormData({ ...formData, quantidade: e.target.value })}
                />
              </FormControl>

              <FormControl isRequired mt={4}>
                <FormLabel>Data Início</FormLabel>
                <Input
                  type="date"
                  value={formData.data_inicio}
                  onChange={(e) => setFormData({ ...formData, data_inicio: e.target.value })}
                />
              </FormControl>

              <FormControl isRequired mt={4}>
                <FormLabel>Data Fim</FormLabel>
                <Input
                  type="date"
                  value={formData.data_fim}
                  onChange={(e) => setFormData({ ...formData, data_fim: e.target.value })}
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

const EditEncomendaModal = ({
  isOpen,
  onClose,
  encomenda,
  updateEncomenda,
  figuras,
  clientes,
}: {
  isOpen: boolean;
  onClose: () => void;
  encomenda: any;
  updateEncomenda: (encomenda: any) => void;
  figuras: any[];
  clientes: any[];
}) => {
  const [formData, setFormData] = useState({
    id_figura: '',
    id_cliente: '',
    quantidade: '',
    data_inicio: '',
    data_fim: '',
  });

  useEffect(() => {
    if (encomenda) {
      setFormData({
        id_figura: encomenda.id_figura,
        id_cliente: encomenda.id_cliente,
        quantidade: encomenda.quantidade.toString(),
        data_inicio: new Date(encomenda.data_inicio).toISOString().split('T')[0],
        data_fim: new Date(encomenda.data_fim).toISOString().split('T')[0],
      });
    }
  }, [encomenda]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateEncomenda({
      ...formData,
      id_encomenda: encomenda.id_encomenda,
      quantidade: Number(formData.quantidade),
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent bgColor="rgba(30, 30, 130)" color="white">
        <ModalHeader>Editar Encomenda</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form onSubmit={handleSubmit}>
            <FormControl isRequired>
              <FormLabel>Figura</FormLabel>
              <Menu>
                <MenuButton as={Button} className='TableMenu'>
                  {formData.id_figura ? figuras.find(f => f.id_figura === formData.id_figura)?.nome : "Selecione uma Figura"}
                </MenuButton>
                <MenuList className='TableMenuList'>
                  {figuras.map((figura) => (
                    <MenuItem
                      className='TableMenuItem'
                      key={figura.id_figura}
                      onClick={() => setFormData({ ...formData, id_figura: figura.id_figura })}
                    >
                      {figura.nome}
                    </MenuItem>
                  ))}
                </MenuList>
              </Menu>
            </FormControl>

            <FormControl isRequired mt={4}>
              <FormLabel>Cliente</FormLabel>
              <Menu>
                <MenuButton as={Button} className='TableMenu'>
                  {formData.id_cliente ? clientes.find(c => c.id_cliente === formData.id_cliente)?.nome : "Selecione um Cliente"}
                </MenuButton>
                <MenuList className='TableMenuList'>
                  {clientes.map((cliente) => (
                    <MenuItem
                      className='TableMenuItem'
                      key={cliente.id_cliente}
                      onClick={() => setFormData({ ...formData, id_cliente: cliente.id_cliente })}
                    >
                      {cliente.nome}
                    </MenuItem>
                  ))}
                </MenuList>
              </Menu>
            </FormControl>

            <FormControl isRequired mt={4}>
              <FormLabel>Quantidade</FormLabel>
              <Input
                type="number"
                value={formData.quantidade}
                onChange={(e) => setFormData({ ...formData, quantidade: e.target.value })}
              />
            </FormControl>

            <FormControl isRequired mt={4}>
              <FormLabel>Data Início</FormLabel>
              <Input
                type="date"
                value={formData.data_inicio}
                onChange={(e) => setFormData({ ...formData, data_inicio: e.target.value })}
              />
            </FormControl>

            <FormControl isRequired mt={4}>
              <FormLabel>Data Fim</FormLabel>
              <Input
                type="date"
                value={formData.data_fim}
                onChange={(e) => setFormData({ ...formData, data_fim: e.target.value })}
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

export default DataEncomenda;