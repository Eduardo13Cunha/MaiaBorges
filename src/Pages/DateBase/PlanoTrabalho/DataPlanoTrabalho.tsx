import { useState, useEffect } from 'react';
import { VStack, Box, Table, Thead, Tbody, Tr, Th, Td, Button, HStack, Input, Text, Menu, MenuButton, MenuList, MenuItem, useToast } from '@chakra-ui/react';
import { FaTrash, FaAngleLeft, FaAngleRight, FaSortDown, FaSortUp, FaPencilAlt, FaSearch } from 'react-icons/fa';
import axios from 'axios';
import { Colaborador, Encomenda, Maquina, PlanoTrabalho } from '../../../Interfaces/interfaces';
import { isLoggedIn } from '../../../Routes/validation';
import { PlanoTrabalhoModal } from './PlanoTrabalhoModal';
import { IconInput } from '../../../Components/ReUsable/Inputs/IconInput';

const DataPlanoTrabalho = () => {
  const [showModal, setShowModal] = useState(false);
  const [editingPlanoTrabalho, setEditingPlanoTrabalho] = useState<PlanoTrabalho | null>(null);
  const [planosTrabalho, setPlanosTrabalho] = useState<any[]>([]);
  const [maquinas, setMaquinas] = useState<any[]>([]);
  const [encomendas, setEncomendas] = useState<any[]>([]);
  const [colaboradores, setColaboradores] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchFilter, setSearchFilter] = useState('figura');
  const [updateTable, setUpdateTable] = useState<any>("");
  const [sortColumn, setSortColumn] = useState<string>('id');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState(0);
  const showToast = useToast();
  const itemsPerPage = 8;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [planoRes, maquinaRes, encomendaRes, colaboradorRes] = await Promise.all([
          axios.get('/.netlify/functions/planotrabalhos/dataplanotrabalho'),
          axios.get('/.netlify/functions/maquinas'),
          axios.get('/.netlify/functions/encomendas'),
          axios.get('/.netlify/functions/colaboradores')
        ]);
        setPlanosTrabalho((planoRes.data as { data: PlanoTrabalho[] }).data);
        setMaquinas((maquinaRes.data as { data: Maquina[] }).data);
        setEncomendas((encomendaRes.data as { data: Encomenda[] }).data);
        setColaboradores((colaboradorRes.data as { data: Colaborador[] }).data);
      } catch (error) {
        showToast({
          title: "Erro ao carregar dados",
          description: "Não foi possível carregar os dados necessários.",
          status: "error",
        });
        console.error('Error fetching data:', error);
      }
    };

    isLoggedIn();
    fetchData();
  }, [updateTable]);

  const handleSort = (column: string) => {
    const newDirection = sortColumn === column && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortDirection(newDirection);
    setSortColumn(column);
  };

  const deletePlanoTrabalho = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este plano de trabalho?')) {
      try {
        await axios.delete(`/.netlify/functions/planotrabalhos/${id}`);
        setPlanosTrabalho(planosTrabalho.filter(plano => plano.id !== id));
        showToast({
          title: 'Plano de Trabalho Eliminado',
          description: 'Plano de trabalho eliminado com sucesso!',
          status: 'success',
        });
      } catch (error) {
        showToast({
          title: 'Erro ao eliminar plano de trabalho',
          description: 'Não foi possível eliminar o plano de trabalho!',
          status: 'error',
        });
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
    const termo = searchTerm.toLowerCase();
  
    switch (searchFilter) {
      case 'maquina':
        return plano.maquinas?.nome?.toLowerCase().includes(termo);
      case 'colaborador':
        return plano.colaboradores?.nome?.toLowerCase().includes(termo);
      case 'figura':
        return plano.encomendas?.figuras?.nome?.toLowerCase().includes(termo);
      case 'semana':
        return plano.semana.toString().includes(termo);
      default:
        return true;
    }
  });
  

  const pages = Math.ceil(filteredPlanos.length / itemsPerPage);
  const currentItems = filteredPlanos.slice(
    page * itemsPerPage,
    (page + 1) * itemsPerPage
  );

  return (
    <VStack alignItems="center">
      <Box className="TableBox">
        <HStack>
          <Box className="TableSearchInput" w="28%">
            <IconInput placeholder={"Pesquisar por "+searchFilter} icon={<FaSearch/>} value={searchTerm} onChange={(x) => setSearchTerm(x ?? "")}/>
          </Box> 
          <Menu> 
            <MenuButton mt="2%" as={Button} className="TableSearchMenuButton" borderRadius="md">Filtrar por {searchFilter}</MenuButton>
            <MenuList className="TableSearchMenuList">
                <MenuItem className="TableSearchMenuItem" onClick={() => setSearchFilter('maquina')}>Máquina</MenuItem>
                <MenuItem className="TableSearchMenuItem" onClick={() => setSearchFilter('colaborador')}>Colaborador</MenuItem>
                <MenuItem className="TableSearchMenuItem" onClick={() => setSearchFilter('figura')}>Figura</MenuItem>
                <MenuItem className="TableSearchMenuItem" onClick={() => setSearchFilter('semana')}>Semana</MenuItem>
            </MenuList>
          </Menu>
        </HStack>
        <Table className="TableTable" sx={{ tableLayout: 'fixed' }}>
          <Thead className='LineHead'>
            <Tr>
              <Th width="7%" color="white" onClick={() => handleSort('id')} style={{ cursor: 'pointer' }}>
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
                <Td>{plano.id_planodetrabalho}</Td>
                <Td>{plano.maquinas?.nome || '-'}</Td>
                <Td>#{plano.id_encomenda} - {plano.encomendas?.figuras?.nome || '-'}</Td>
                <Td>{plano.colaboradores?.nome || '-'}</Td>
                <Td>{plano.tempo_conclusao}</Td>
                <Td>{plano.quantidade}</Td>
                <Td>{plano.semana}</Td>
                <Td>{plano.quantidade_falta}</Td>
                <Td>
                  <HStack spacing={2}>
                    <FaPencilAlt cursor="pointer" onClick={() => { setEditingPlanoTrabalho(plano); setShowModal(true); }}/>
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
        <Button onClick={() => { setEditingPlanoTrabalho(null); setShowModal(true); }}>Adicionar Plano de Trabalho</Button>
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
        <PlanoTrabalhoModal
          onClose={() => setShowModal(false)}
          editingPlanoTrabalho={editingPlanoTrabalho}
          maquinas={maquinas}
          encomendas={encomendas}
          colaboradores={colaboradores}
          setUpdateTable={setUpdateTable}
        />
      )}
    </VStack>
  );
};

export default DataPlanoTrabalho;