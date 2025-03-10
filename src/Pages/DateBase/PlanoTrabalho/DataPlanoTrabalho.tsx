import { useState, useEffect } from 'react';
import { VStack, Box, Table, Thead, Tbody, Tr, Th, Td, Button, HStack, Input, Text } from '@chakra-ui/react';
import { FaTrash, FaAngleLeft, FaAngleRight, FaSortDown, FaSortUp } from 'react-icons/fa';
import axios from 'axios';
import { AddPlanoTrabalhoModal } from './AddPlanoTrabalho';
import { EditPlanoTrabalhoModal } from './EditPlanoTrabalho';
import { Colaborador, Encomenda, Maquina, PlanoTrabalho } from '../../../Interfaces/interfaces';

const DataPlanoTrabalho = () => {
  const [planosTrabalho, setPlanosTrabalho] = useState<any[]>([]);
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
    setUpdateTable("");
  }, [updateTable]);

  const fetchData = async () => {
    try {
      const [planoRes, maquinaRes, encomendaRes, colaboradorRes] = await Promise.all([
        axios.get('http://localhost:3001/api/planotrabalho/'),
        axios.get('http://localhost:3001/api/maquina'),
        axios.get('http://localhost:3001/api/encomenda'),
        axios.get('http://localhost:3001/api/colaborador')
      ]);
      setPlanosTrabalho((planoRes.data as { data: PlanoTrabalho[] }).data);
      setMaquinas((maquinaRes.data as { data: Maquina[] }).data);
      setEncomendas((encomendaRes.data as { data: Encomenda[] }).data);
      setColaboradores((colaboradorRes.data as { data: Colaborador[] }).data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleSort = (column: string) => {
    const newDirection = sortColumn === column && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortDirection(newDirection);
    setSortColumn(column);
  };

  const deletePlanoTrabalho = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este plano de trabalho?')) {
      try {
        await axios.delete(`http://localhost:3001/api/planotrabalho/${id}`);
        setPlanosTrabalho(planosTrabalho.filter(plano => plano.id !== id));
      } catch (error) {
        console.error('Error deleting plano de trabalho:', error);
      }
    }
  };

  const sortedPlanos = [...planosTrabalho].sort((a, b) => {
    if (sortColumn === 'id') {
      return sortDirection === 'asc' 
        ? a.id - b.id 
        : b.id - a.id;
    }
    if (sortColumn === 'semana') {
      return sortDirection === 'asc'
        ? a.semana - b.semana
        : b.semana - a.semana;
    }
    if (sortColumn === 'quantidade') {
      return sortDirection === 'asc'
        ? a.quantidade - b.quantidade
        : b.quantidade - a.quantidade;
    }
    if (sortColumn === 'quantidade_falta') {
      return sortDirection === 'asc'
        ? a.quantidade_falta - b.quantidade_falta
        : b.quantidade_falta - a.quantidade_falta;
    }
    return 0;
  });

  const filteredPlanos = sortedPlanos.filter(plano => {
    const maquinaNome = plano.maquinas?.nome?.toLowerCase() || '';
    const colaboradorNome = plano.colaboradores?.nome?.toLowerCase() || '';
    const figuraNome = plano.encomendas?.figuras?.nome?.toLowerCase() || '';
    
    return maquinaNome.includes(searchTerm.toLowerCase()) ||
           colaboradorNome.includes(searchTerm.toLowerCase()) ||
           figuraNome.includes(searchTerm.toLowerCase()) ||
           plano.semana.toString().includes(searchTerm);
  });

  const pages = Math.ceil(filteredPlanos.length / itemsPerPage);
  const currentItems = filteredPlanos.slice(
    page * itemsPerPage,
    (page + 1) * itemsPerPage
  );

  return (
    <VStack alignItems="center">
      <Box className="TableBox">
        <Input
          placeholder="Pesquisar por máquina, colaborador, figura ou semana"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className='TableSearchInput'
        />
        <Table className="TableTable" sx={{ tableLayout: 'fixed' }}>
          <Thead className='LineHead'>
            <Tr>
              <Th width="5%" color="white" onClick={() => handleSort('id')} style={{ cursor: 'pointer' }}>
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
              <Th color="white" width="12%">Tempo Conclusão</Th>
              <Th color="white" width="12%" onClick={() => handleSort('quantidade')} style={{ cursor: 'pointer' }}>
                <HStack spacing={1}>
                  <Text>Quantidade</Text>
                  {sortColumn === 'quantidade' && (
                    sortDirection === 'asc' ? <FaSortUp /> : <FaSortDown />
                  )}
                </HStack>
              </Th>
              <Th color="white" width="7%" onClick={() => handleSort('semana')} style={{ cursor: 'pointer' }}>
                <HStack spacing={1}>
                  <Text>Semana</Text>
                  {sortColumn === 'semana' && (
                    sortDirection === 'asc' ? <FaSortUp /> : <FaSortDown />
                  )}
                </HStack>
              </Th>
              <Th color="white" width="12%" onClick={() => handleSort('quantidade_falta')} style={{ cursor: 'pointer' }}>
                <HStack spacing={1}>
                  <Text>Falta</Text>
                  {sortColumn === 'quantidade_falta' && (
                    sortDirection === 'asc' ? <FaSortUp /> : <FaSortDown />
                  )}
                </HStack>
              </Th>
              <Th color="white" width="8%">Ações</Th>
            </Tr>
          </Thead>
          <Tbody>
            {currentItems.map((plano) => (
              <Tr key={plano.id} className="Line">
                <Td>{plano.id}</Td>
                <Td>{plano.maquinas?.nome || '-'}</Td>
                <Td>#{plano.encomenda_id} - {plano.encomendas?.figuras?.nome || '-'}</Td>
                <Td>{plano.colaboradores?.nome || '-'}</Td>
                <Td>{plano.tempo_conclusao}</Td>
                <Td>{plano.quantidade}</Td>
                <Td>{plano.semana}</Td>
                <Td>{plano.quantidade_falta}</Td>
                <Td>
                  <HStack spacing={2}>
                    <EditPlanoTrabalhoModal 
                      editPlanoTrabalho={plano} 
                      setUpdateTable={setUpdateTable} 
                      maquinas={maquinas}
                      encomendas={encomendas}
                      colaboradores={colaboradores}
                    />
                    <FaTrash
                      cursor="pointer"
                      color="darkred"
                      onClick={() => deletePlanoTrabalho(plano.id)}
                    />
                  </HStack>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>

      <HStack marginLeft="50%" spacing={4}>
        <AddPlanoTrabalhoModal 
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

export default DataPlanoTrabalho;