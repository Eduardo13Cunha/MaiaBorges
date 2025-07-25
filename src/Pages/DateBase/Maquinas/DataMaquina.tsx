import { useState, useEffect } from 'react';
import { useToast, VStack,Box,Table,Thead,Tbody,Tr,Th,Td,Button,HStack,Text, Spacer} from '@chakra-ui/react';
import { FaTrash, FaAngleLeft, FaAngleRight, FaSortDown, FaSortUp, FaPencilAlt, FaSearch } from 'react-icons/fa';
import axios from 'axios';
import { MaquinaModal } from './MaquinaModal';
import { Maquina } from '../../../Interfaces/interfaces';
import { isLoggedIn, LogisticaAcess } from '../../../Routes/validation';
import { IconInput } from '../../../Components/ReUsable/Inputs/IconInput';

const DataMaquina = () => {
  const [showModal, setShowModal] = useState(false);
  const [editingMaquina, setEditingMaquina] = useState<Maquina | null>(null);
  const [UpdateTable, setUpdateTable] = useState<any>("");
  const [maquinas, setMaquinas] = useState<any[]>([]);
  const [page, setPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortColumn, setSortColumn] = useState<string>('id_maquina');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const itemsPerPage = 8;
  const showToast = useToast();

  useEffect(() => {
    const fetchMaquinas = async () => {
      try {
        const response = await axios.get('/.netlify/functions/maquinas');
        setMaquinas((response.data as { data: Maquina[] }).data);
      } catch (error) {
        showToast({
          title: "Erro ao buscar máquinas",
          description: "Não foi possível buscar as máquinas.",
          status: "error",
        });
        console.error('Error fetching maquinas:', error);
      }
    };
    
    LogisticaAcess();
    isLoggedIn();
    fetchMaquinas();
    setUpdateTable("");
  }, [UpdateTable]);
  
  const handleSort = (column: string) => {
    const newDirection = sortColumn === column && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortDirection(newDirection);
    setSortColumn(column);
  };


  const deleteMaquina = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir esta máquina?')) {
      try {
        await axios.delete(`/.netlify/functions/maquinas/${id}`);
        showToast({
          title: "Máquina excluída com sucesso",
          description: "A máquina foi excluída com sucesso.",
          status: "success",
        });
        setMaquinas(maquinas.filter(maquina => maquina.id_maquina !== id));
      } catch (error) {
        showToast({
          title: "Erro ao excluir máquina",
          description: "Não foi possível excluir a máquina.",
          status: "error",
        });
        console.error('Error deleting maquina:', error);
      }
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
        <HStack>
          <Box className="TableSearchInput" w="28%">
            <IconInput placeholder="Pesquisar por Nome" icon={<FaSearch/>} value={searchTerm} onChange={(x) => setSearchTerm(x ?? "")}/>
          </Box>
          <Spacer/>
          <Text color="text.primary.100" fontSize="larger" mt="2%" ml="2%"><strong>{currentItems.length}</strong> Itens de <strong>{maquinas.length}</strong></Text>
        </HStack>
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
                    <FaPencilAlt cursor="pointer" onClick={() => { setEditingMaquina(maquina); setShowModal(true); }}/>
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
        <Button onClick={() => { setEditingMaquina(null); setShowModal(true); }}>Adicionar Maquina</Button>
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
        <MaquinaModal
          onClose={() => setShowModal(false)}
          editingMaquina={editingMaquina}
          setUpdateTable={setUpdateTable}
        />
      )}
    </VStack>
  );
};

export default DataMaquina;