import React, { useState, useEffect } from 'react';
import { useToast, Text,VStack,Box,Table,Thead,Tbody,Tr,Th,Td, Button,HStack, Spacer } from '@chakra-ui/react';
import { FaTrash, FaAngleLeft, FaAngleRight, FaSortDown, FaSortUp, FaPencilAlt, FaSearch } from 'react-icons/fa';
import axios from 'axios';
import { Cliente } from '../../../Interfaces/interfaces';
import { ClienteModal } from './ClienteModal';
import { ComercialAcess, isLoggedIn } from '../../../Routes/validation';
import { IconInput } from '../../../Components/ReUsable/Inputs/IconInput';

const DataCliente: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [editingCliente, setEditingCliente] = useState<Cliente | null>(null);
  const [UpdateTable, setUpdateTable] = useState<any>("");
  const [clientes, setClientes] = useState<any[]>([]);
  const [page, setPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [sortColumn, setSortColumn] = useState<string>('id');
  const itemsPerPage = 8;
  const showToast = useToast();  

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const response = await axios.get('/.netlify/functions/clientes');
        setClientes((response.data as { data: Cliente[] }).data);
      } catch (error) {
        showToast({
          title: "Erro ao carregar dados",
          description: "Não foi possível carregar os clientes.",
          status: "error",
        });
        console.error('Error fetching clientes:', error);
      }
    };

    ComercialAcess();
    isLoggedIn();
    fetchClientes();
    setUpdateTable("");
  }, [UpdateTable]);

  const deleteCliente = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este cliente?')) {
      try {
        await axios.delete(`/.netlify/functions/clientes/${id}`);
        setClientes(clientes.filter(cliente => cliente.id_cliente !== id));
        showToast({
          title: "Cliente eliminado com sucesso",
          description: "O cliente foi eliminado com sucesso.",
          status: "success",
        });
      } catch (error) {
        showToast({
          title: "Erro ao eliminar o cliente",
          description: "Não foi possível eliminar o cliente.",
          status: "error",
        });
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
        <HStack>
          <Box className="TableSearchInput" w="28%">
            <IconInput placeholder="Pesquisar por Nome" icon={<FaSearch/>} value={searchTerm} onChange={(x) => setSearchTerm(x ?? "")}/>
          </Box> 
          <Spacer/>
          <Text color="text.primary.100" fontSize="larger" mt="2%"><strong>{currentItems.length}</strong> Itens de <strong>{clientes.length}</strong></Text>
        </HStack>
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
                    <FaPencilAlt cursor="pointer" onClick={() => { setEditingCliente(cliente); setShowModal(true); }}/>
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
        <Button onClick={() => { setEditingCliente(null); setShowModal(true); }}>Adicionar Cliente</Button>
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
      {showModal && (
        <ClienteModal
          onClose={() => setShowModal(false)}
          editingCliente={editingCliente}
          setUpdateTable={setUpdateTable}
        />
      )}
    </VStack>
  );
};

export default DataCliente;