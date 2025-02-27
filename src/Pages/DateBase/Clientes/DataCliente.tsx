import React, { useState, useEffect } from 'react';
import {Text,VStack,Box,Table,Thead,Tbody,Tr,Th,Td, Button,HStack,Input, Modal,ModalOverlay,ModalContent, ModalHeader,ModalBody,ModalCloseButton,FormControl,FormLabel,} from '@chakra-ui/react';
import { FaTrash, FaPencilAlt, FaAngleLeft, FaAngleRight, FaSortDown, FaSortUp } from 'react-icons/fa';
import axios from 'axios';
import { EditClienteModal } from './EditarCliente';
import { AddClienteModal } from './AddCliente';

const DataCliente: React.FC = () => {
  const [UpdateTable, setUpdateTable] = useState<any>("");
  const [clientes, setClientes] = useState<any[]>([]);
  const [page, setPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [sortColumn, setSortColumn] = useState<string>('id');
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [editCliente, setEditCliente] = useState<any>(null);
  const itemsPerPage = 8;

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/cliente');
        setClientes(response.data.data);
      } catch (error) {
        console.error('Error fetching clientes:', error);
      }
    };

    fetchClientes();
  }, [UpdateTable]);

  const deleteCliente = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este cliente?')) {
      try {
        await axios.delete(`http://localhost:3001/api/cliente/${id}`);
        setClientes(clientes.filter(cliente => cliente.id_cliente !== id));
      } catch (error) {
        console.error('Error deleting cliente:', error);
      }
    }
  };

  const handleSort = (column: string) => {
    const newDirection = (sortColumn === column && sortDirection === 'asc') ? 'desc' : 'asc';
    setSortDirection(newDirection);
    setSortColumn(column);
  };

  const filteredClientes = clientes.filter(cliente =>
    cliente.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedClientes = [...filteredClientes].sort((a, b) => {
    if (sortColumn === 'id_cliente') {
      return sortDirection === 'asc' ? a.id_cliente - b.id_cliente : b.id_cliente - a.id_cliente;
    }
    return 0;
  });

  const pages = Math.ceil(filteredClientes.length / itemsPerPage);
  const currentItems = sortedClientes.slice(
    page * itemsPerPage,
    (page + 1) * itemsPerPage
  );

  return (
    <VStack alignItems="center">
      <Box className='TableBox'>
        <Input
          placeholder="Pesquisar por nome"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className='TableSearchInput'
        />
        <Table className='TableTable' sx={{ tableLayout: 'fixed' }}>
          <Thead className="LineHead">
            <Tr>
              <Th color="white" width="7.5%" onClick={() => handleSort('id_cliente')} style={{ cursor: 'pointer' }}>
                <HStack spacing={1}>
                  <Text>ID</Text>
                  {sortColumn === 'id_cliente' && (sortDirection === 'asc' ? <FaSortUp color="white" /> : <FaSortDown color="white" />)}
                </HStack>
              </Th>
              <Th color="white">Nome</Th>
              <Th color="white">Email</Th>
              <Th color="white">Número</Th>
              <Th color="white" width="8%">Ações</Th>
            </Tr>
          </Thead>
          <Tbody>
            {currentItems.map((cliente) => (
              <Tr className="Line" key={cliente.id_cliente}>
                <Td>{cliente.id_cliente}</Td>
                <Td>{cliente.nome}</Td>
                <Td>{cliente.email}</Td>
                <Td>{cliente.numero}</Td>
                <Td>
                  <HStack spacing={2}>
                    <EditClienteModal editCliente={cliente} setUpdateTable={setUpdateTable}/>
                    <FaTrash 
                      cursor="pointer"
                      color="darkred"
                      onClick={() => deleteCliente(cliente.id_cliente)}
                    />
                  </HStack>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
«
      <HStack marginLeft="50%" spacing={4}>
        <AddClienteModal  setUpdateTable={setUpdateTable} />
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
    </VStack>
  );
};

export default DataCliente;