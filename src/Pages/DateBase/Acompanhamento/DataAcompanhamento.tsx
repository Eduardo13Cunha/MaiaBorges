import { useState, useEffect } from 'react';
import { VStack, Box, Table, Thead, Tbody, Tr, Th, Td, Button, HStack, Input, Text } from '@chakra-ui/react';
import { FaTrash, FaAngleLeft, FaAngleRight, FaSortDown, FaSortUp } from 'react-icons/fa';
import axios from 'axios';
import { AddAcompanhamentoModal } from './AddAcompanhamento';
import { EditAcompanhamentoModal } from './EditAcompanhamento';

const DataAcompanhamento = () => {
  const [acompanhamentos, setAcompanhamentos] = useState<any[]>([]);
  const [maquinas, setMaquinas] = useState<any[]>([]);
  const [encomendas, setEncomendas] = useState<any[]>([]);
  const [colaboradores, setColaboradores] = useState<any[]>([]);
  const [page, setPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [updateTable, setUpdateTable] = useState<any>("");
  const [sortColumn, setSortColumn] = useState<string>('id');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const itemsPerPage = 8;

  useEffect(() => {
    fetchData();
  }, [updateTable]);

  const fetchData = async () => {
    try {
      const [acompanhamentoRes, maquinaRes, encomendaRes, colaboradorRes] = await Promise.all([
        axios.get('http://localhost:3001/api/acompanhamento'),
        axios.get('http://localhost:3001/api/maquina'),
        axios.get('http://localhost:3001/api/encomenda'),
        axios.get('http://localhost:3001/api/colaborador')
      ]);
      setAcompanhamentos((acompanhamentoRes.data as { data: any[] }).data);
      setMaquinas((maquinaRes.data as { data: any[] }).data);
      setEncomendas((encomendaRes.data as { data: any[] }).data);
      setColaboradores((colaboradorRes.data as { data: any[] }).data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleSort = (column: string) => {
    const newDirection = sortColumn === column && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortDirection(newDirection);
    setSortColumn(column);
  };

  const deleteAcompanhamento = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este acompanhamento?')) {
      try {
        await axios.delete(`http://localhost:3001/api/acompanhamento/${id}`);
        setAcompanhamentos(acompanhamentos.filter(acompanhamento => acompanhamento.id !== id));
      } catch (error) {
        console.error('Error deleting acompanhamento:', error);
      }
    }
  };

  const sortedAcompanhamentos = [...acompanhamentos].sort((a, b) => {
    if (sortColumn === 'id') {
      return sortDirection === 'asc' 
        ? a.id - b.id 
        : b.id - a.id;
    }
    if (sortColumn === 'quantidade_produzida') {
      return sortDirection === 'asc'
        ? a.quantidade_produzida - b.quantidade_produzida
        : b.quantidade_produzida - a.quantidade_produzida;
    }
    return 0;
  });

  const filteredAcompanhamentos = sortedAcompanhamentos.filter(acompanhamento => {
    const maquinaNome = acompanhamento.maquinas?.nome?.toLowerCase() || '';
    const colaboradorNome = acompanhamento.colaboradores?.nome?.toLowerCase() || '';
    const figuraNome = acompanhamento.encomendas?.figuras?.nome?.toLowerCase() || '';
    
    return maquinaNome.includes(searchTerm.toLowerCase()) ||
           colaboradorNome.includes(searchTerm.toLowerCase()) ||
           figuraNome.includes(searchTerm.toLowerCase());
  });

  const pages = Math.ceil(filteredAcompanhamentos.length / itemsPerPage);
  const currentItems = filteredAcompanhamentos.slice(
    page * itemsPerPage,
    (page + 1) * itemsPerPage
  );

  return (
    <VStack alignItems="center">
      <Box className="TableBox">
        <Input
          placeholder="Pesquisar por máquina, colaborador ou figura"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className='TableSearchInput'
        />
        <Table className="TableTable" sx={{ tableLayout: 'fixed' }}>
          <Thead className='LineHead'>
            <Tr>
              <Th color="white" onClick={() => handleSort('id')} style={{ cursor: 'pointer' }}>
                <HStack spacing={1}>
                  <Text>ID</Text>
                  {sortColumn === 'id' && (
                    sortDirection === 'asc' ? <FaSortUp /> : <FaSortDown />
                  )}
                </HStack>
              </Th>
              <Th color="white">Máquina</Th>
              <Th color="white">Encomenda</Th>
              <Th color="white">Colaborador</Th>
              <Th color="white" onClick={() => handleSort('quantidade_produzida')} style={{ cursor: 'pointer' }}>
                <HStack spacing={1}>
                  <Text>Quantidade Produzida</Text>
                  {sortColumn === 'quantidade_produzida' && (
                    sortDirection === 'asc' ? <FaSortUp /> : <FaSortDown />
                  )}
                </HStack>
              </Th>
              <Th color="white" width="8%">Ações</Th>
            </Tr>
          </Thead>
          <Tbody>
            {currentItems.map((acompanhamento) => (
              <Tr key={acompanhamento.id} className="Line">
                <Td>{acompanhamento.id}</Td>
                <Td>{acompanhamento.maquinas?.nome || '-'}</Td>
                <Td>#{acompanhamento.encomenda_id} - {acompanhamento.encomendas?.figuras?.nome || '-'}</Td>
                <Td>{acompanhamento.colaboradores?.nome || '-'}</Td>
                <Td>{acompanhamento.quantidade_produzida}</Td>
                <Td>
                  <HStack spacing={2}>
                    <EditAcompanhamentoModal 
                      editAcompanhamento={acompanhamento} 
                      setUpdateTable={setUpdateTable} 
                      maquinas={maquinas}
                      encomendas={encomendas}
                      colaboradores={colaboradores}
                    />
                    <FaTrash
                      cursor="pointer"
                      color="darkred"
                      onClick={() => deleteAcompanhamento(acompanhamento.id)}
                    />
                  </HStack>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>

      <HStack marginLeft="50%" spacing={4}>
        <AddAcompanhamentoModal 
          setUpdateTable={setUpdateTable} 
          maquinas={maquinas}
          encomendas={encomendas}
          colaboradores={colaboradores}
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

export default DataAcompanhamento;