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
  Text,
  NumberInput,
  NumberInputField,
} from '@chakra-ui/react';
import { FaTrash, FaPencilAlt, FaAngleLeft, FaAngleRight, FaSortDown, FaSortUp, FaSearch } from 'react-icons/fa';
import axios from 'axios';
import { AddFiguraModal } from './AddFigura';
import { EditFiguraModal } from './EditFigura';
import { Observações } from './MaterialFigura';

const DataFigura = () => {
  const [figuras, setFiguras] = useState<any[]>([]);
  const [materiasPrimas, setMateriasPrimas] = useState<any[]>([]);
  const [corantes, setCorantes] = useState<any[]>([]);
  const [page, setPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [UpdateTable, setUpdateTable] = useState<any>("");  const [editFigura, setEditFigura] = useState<any>(null);
  const [sortColumn, setSortColumn] = useState<string>('id_figura');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const itemsPerPage = 8;

  useEffect(() => {
    fetchData();
  }, [UpdateTable]);

  const fetchData = async () => {
    try {
      const [figuraRes, materiaPrimaRes, coranteRes] = await Promise.all([
        axios.get('http://localhost:3001/api/figura'),
        axios.get('http://localhost:3001/api/materiasprima'),
        axios.get('http://localhost:3001/api/corante')
      ]);
      setFiguras(figuraRes.data.data);
      setMateriasPrimas(materiaPrimaRes.data.data);
      setCorantes(coranteRes.data.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleSort = (column: string) => {
    const newDirection = sortColumn === column && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortDirection(newDirection);
    setSortColumn(column);
  };

  const deleteFigura = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir esta figura?')) {
      try {
        await axios.delete(`http://localhost:3001/api/figura/${id}`);
        setFiguras(figuras.filter(figura => figura.id_figura !== id));
      } catch (error) {
        console.error('Error deleting figura:', error);
      }
    }
  };

  const sortedFiguras = [...figuras].sort((a, b) => {
    if (sortColumn === 'id_figura') {
      return sortDirection === 'asc' 
        ? a.id_figura - b.id_figura 
        : b.id_figura - a.id_figura;
    }
    if (sortColumn === 'tempo_ciclo') {
      return sortDirection === 'asc'
        ? a.tempo_ciclo - b.tempo_ciclo
        : b.tempo_ciclo - a.tempo_ciclo;
    }
    return 0;
  });

  const filteredFiguras = sortedFiguras.filter(figura =>
    figura.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    figura.referencia.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pages = Math.ceil(filteredFiguras.length / itemsPerPage);
  const currentItems = filteredFiguras.slice(
    page * itemsPerPage,
    (page + 1) * itemsPerPage
  );

  return (
    <VStack alignItems="center">
      <Box className="TableBox">
        <Input
          placeholder="Pesquisar por nome ou referência"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className='TableSearchInput'
        />
        <Table className="TableTable" sx={{ tableLayout: 'fixed' }}>
          <Thead className='LineHead'>
            <Tr>
              <Th color="white" onClick={() => handleSort('id_figura')} style={{ cursor: 'pointer' }}>
                <HStack spacing={1}>
                  <Text>ID</Text>
                  {sortColumn === 'id_figura' && (
                    sortDirection === 'asc' ? <FaSortUp /> : <FaSortDown />
                  )}
                </HStack>
              </Th>
              <Th color="white">Referência</Th>
              <Th color="white">Nome</Th>
              <Th color="white" onClick={() => handleSort('tempo_ciclo')} style={{ cursor: 'pointer' }}>
                <HStack spacing={1}>
                  <Text>Tempo Ciclo-(P/h)</Text>
                  {sortColumn === 'tempo_ciclo' && (
                    sortDirection === 'asc' ? <FaSortUp /> : <FaSortDown />
                  )}
                </HStack>
              </Th>
              <Th color="white">Matérial</Th>
              <Th color="white" width="8%">Ações</Th>
            </Tr>
          </Thead>
          <Tbody>
            {currentItems.map((figura) => (
              <Tr key={figura.id_figura} className="Line">
                <Td>{figura.id_figura}</Td>
                <Td>{figura.referencia}</Td>
                <Td>{figura.nome}</Td>
                <Td>{figura.tempo_ciclo}</Td>
                <Td alignItems="center" justifyContent="center"><Observações figura={figura}/></Td>
                <Td>
                  <HStack spacing={2}>
                    <EditFiguraModal editFigura={figura} setUpdateTable={setUpdateTable} materiasPrimas={materiasPrimas} corantes={corantes}/>
                    <FaTrash
                      cursor="pointer"
                      color="darkred"
                      onClick={() => deleteFigura(figura.id_figura)}
                    />
                  </HStack>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>

      <HStack marginLeft="50%" spacing={4}>
        <AddFiguraModal 
          setUpdateTable={setUpdateTable} 
          materiasPrimas={materiasPrimas}
          corantes={corantes}
        />
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

export default DataFigura;