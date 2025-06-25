import { useState, useEffect } from 'react';
import { useToast, VStack, Box, Table, Thead, Tbody, Tr, Th, Td, Button, HStack, Text, Spacer } from '@chakra-ui/react';
import { FaTrash, FaAngleLeft, FaArrowRight, FaAngleRight, FaSortDown, FaSortUp, FaPencilAlt, FaSearch } from 'react-icons/fa';
import axios from 'axios';
import { Observações } from './MaterialFigura';
import { Corante, Figura, MateriaPrima } from '../../../Interfaces/interfaces';
import { FiguraModal } from './FiguraModal';
import { isLoggedIn, LogisticaAcess } from '../../../Routes/validation';
import { IconInput } from '../../../Components/ReUsable/Inputs/IconInput';

const DataFigura = () => { 
  const [showModal, setShowModal] = useState(false);
  const [editingFigura, setEditingFigura] = useState<Figura | null>(null);
  const [figuras, setFiguras] = useState<any[]>([]);
  const [materiasPrimas, setMateriasPrimas] = useState<any[]>([]);
  const [corantes, setCorantes] = useState<any[]>([]);
  const [page, setPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [UpdateTable, setUpdateTable] = useState<any>("");
  const [sortColumn, setSortColumn] = useState<string>('id_figura');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const itemsPerPage = 8;
  const showToast = useToast();  

  useEffect(() => {
    LogisticaAcess();
    isLoggedIn();
    fetchData();
    setUpdateTable("");
  }, [UpdateTable]);

  const fetchData = async () => {
    try {
      const [figuraRes, materiaPrimaRes, coranteRes] = await Promise.all([
        axios.get('/.netlify/functions/figuras'),
        axios.get('/.netlify/functions/materiasprimas'),
        axios.get('/.netlify/functions/corantes')
      ]);
      setFiguras((figuraRes.data as { data: Figura[] }).data);
      setMateriasPrimas((materiaPrimaRes.data as { data: MateriaPrima[] }).data);
      setCorantes((coranteRes.data as { data: Corante[] }).data);
    } catch (error) {
      showToast({
        title: "Erro ao carregar dados",
        description: "Não foi possível carregar as figuras.",
        status: "error",
      });
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
        await axios.delete(`/.netlify/functions/figuras/${id}`);
        showToast({
          title: "Figura excluída com sucesso",
          description: "A figura foi excluída com sucesso.",
          status: "success",
        });
        setFiguras(figuras.filter(figura => figura.id_figura !== id));
      } catch (error) {
        showToast({
          title: "Erro ao excluir figura",
          description: "Não foi possível excluir a figura.",
          status: "error",
        });
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
        <HStack>
          <Box className="TableSearchInput" w="28%">
            <IconInput placeholder="Pesquisar por Nome ou Referência" icon={<FaSearch/>} value={searchTerm} onChange={(x) => setSearchTerm(x ?? "")}/>
          </Box>
          <Spacer/>
          <Text color="text.primary.100" fontSize="larger" mt="2%" ml="2%"><strong>{currentItems.length}</strong> Itens de <strong>{figuras.length}</strong></Text>
        </HStack>
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
                  <Box display="flex" flexDirection="row" alignItems="center">
                    <Text>Tempo Ciclo</Text>
                    <FaArrowRight fontSize="80%"/>
                    <Text>(P/h)</Text>
                  </Box>
                  {sortColumn === 'tempo_ciclo' && (
                    sortDirection === 'asc' ? <FaSortUp /> : <FaSortDown />
                  )}
                </HStack>
              </Th>
              <Th color="white">Material</Th>
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
                <Td alignItems="center" cursor="pointer" justifyContent="center"><Observações figura={figura}/></Td>
                <Td>
                  <HStack spacing={2}>
                    <FaPencilAlt cursor="pointer" onClick={() => { setEditingFigura(figura); setShowModal(true); }}/>
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
        <Button onClick={() => { setEditingFigura(null); setShowModal(true); }}>Adicionar Figura</Button>
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
        <FiguraModal
          onClose={() => setShowModal(false)}
          editingFigura={editingFigura}
          materiasPrimas={materiasPrimas}
          corantes={corantes}
          setUpdateTable={setUpdateTable}
        />
      )}
    </VStack>
  );
};

export default DataFigura;