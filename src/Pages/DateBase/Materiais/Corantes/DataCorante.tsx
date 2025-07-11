import { useToast, Text, VStack, Box, Table, Thead, Tr, Th, Tbody, Td, HStack, Button, Spacer } from "@chakra-ui/react";
import axios from "axios";
import { useState, useEffect } from "react";
import { FaAngleLeft, FaAngleRight, FaArrowRight, FaPencilAlt, FaSearch, FaSortDown, FaSortUp } from "react-icons/fa";
import { FaTrash } from "react-icons/fa";
import { Corante } from "../../../../Interfaces/interfaces";
import { CoranteModal } from "./CoranteModal";
import { IconInput } from "../../../../Components/ReUsable/Inputs/IconInput";

const DataCorante: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [editingCorante, setEditingCorante] = useState<Corante | null>(null);
  const [UpdateTable, setUpdateTable] = useState<any>("");
  const [page, setPage] = useState<number>(0);
  const [Corantes, setCorantes] = useState<any[]>([]);
  const itemsPerPage = 8;
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [sortColumn, setSortColumn] = useState<string>('id_corante');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const showToast = useToast();

  useEffect(() => {
    const fetchCorantes = async () => {
      try {
        const response = await axios.get('/.netlify/functions/corantes');
        setCorantes((response.data as { data: Corante[] }).data);
      } catch (error) {
        showToast({
          title: "Erro ao carregar dados",
          description: "Não foi possível carregar os corantes.",
          status: "error",
        });
        console.error('Error fetching data:', error);
      }
    };

    fetchCorantes();
    setUpdateTable("");
  }, [UpdateTable]);

  const deleteCorante = async (id: number) => {
    const confirmDelete = window.confirm("Tem certeza que deseja excluir este registro?");
    if (confirmDelete) {
      try {
        await axios.delete(`/.netlify/functions/corantes/${id}`);
        showToast({
          title: "Corante excluído com sucesso",
          description: "O corante foi excluído com sucesso.",
          status: "success",
        });
        setCorantes(Corantes.filter(corante => corante.id_corante !== id));
      } catch (error) {
        showToast({
          title: "Erro ao excluir corante",
          description: "Não foi possível excluir o corante.",
          status: "error",
        });
        console.error('Error deleting corante:', error);
      }
    }
  };

  const handleSort = (column: string) => {
    const newDirection = (sortColumn === column && sortDirection === 'asc') ? 'desc' : 'asc';
    setSortDirection(newDirection);
    setSortColumn(column);
  };

  const sortedCorantes = [...Corantes].sort((a, b) => {
    if (sortColumn === 'id_corante') {
      return sortDirection === 'asc' ? a.id_corante - b.id_corante : b.id_corante - a.id_corante;
    } else if (sortColumn === 'quantidade') {
      return sortDirection === 'asc' ? a.quantidade - b.quantidade : b.quantidade - a.quantidade;
    }
    return 0;
  });

  const filteredCorantes = sortedCorantes.filter(corante => {
    const matchesSearchTerm = corante.nome.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearchTerm;
  });

  const pages = Math.ceil(filteredCorantes.length / itemsPerPage);

  const getPageItems = (items: any[], page: number, itemsPerPage: number) => {
    const start = page * itemsPerPage;
    return items.slice(start, start + itemsPerPage);
  };

  return (
    <VStack alignItems="center">
      <Box className="TableBox" width="130%">
        <HStack ml="15%" w="70%">
          <Box className="TableSearchInput">
            <IconInput placeholder="Pesquisar por Nome" icon={<FaSearch/>} value={searchTerm} onChange={(x) => setSearchTerm(x ?? "")}/>
          </Box>
          <Text color="white" fontSize="200%" mt="2%" ml="4%">Corantes</Text>
          <Spacer/>
          <Text color="text.primary.100" fontSize="larger" mt="2%" ml="2%"><strong>{filteredCorantes.length}</strong> Itens de <strong>{Corantes.length}</strong></Text>
        </HStack>
        <Table color="white" marginLeft="15%" marginRight="15%" marginTop="2%" maxH="80%" maxW="70%" sx={{ tableLayout: 'fixed' }}>
          <Thead className="LineHead">
            <Tr>
              <Th color="white" width="10%" onClick={() => handleSort('id_corante')} style={{ cursor: 'pointer' }}>
                <HStack spacing={1}>
                  <Text>ID</Text>
                  {sortColumn === 'id_corante' && (sortDirection === 'asc' ? <FaSortUp color="white" /> : <FaSortDown color="white" />)}
                </HStack>
              </Th>
              <Th color="white">Nome</Th>
              <Th color="white" onClick={() => handleSort('quantidade')} style={{ cursor: 'pointer' }}>
                <HStack spacing={1}>
                <Box display="flex" flexDirection="row" alignItems="center">
                  <Text>Quantidade</Text>
                  <FaArrowRight fontSize="80%"/>
                  <Text>G</Text>
                </Box>
                    {sortColumn === 'quantidade' && (sortDirection === 'asc' ? <FaSortUp color="white" /> : <FaSortDown color="white" />)}
                </HStack>
              </Th>
              <Th color="white" width="15%">Ações</Th>
            </Tr>
          </Thead>
          <Tbody>
            {getPageItems(filteredCorantes, page, itemsPerPage).map((corante) => (
              <Tr className="Line" key={corante.id_corante}>
                <Td>{corante.id_corante}</Td>
                <Td>{corante.nome}</Td>
                <Td>{corante.quantidade}</Td>
                <Td>
                  <HStack spacing={2} justifyContent="flex-end">
                    <FaPencilAlt cursor="pointer" onClick={() => { setEditingCorante(corante); setShowModal(true); }}/>
                    <FaTrash cursor="pointer" onClick={() => deleteCorante(corante.id_corante)} color="darkred" />
                  </HStack>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>

      <HStack marginLeft="50%" spacing={4}>
        <Box maxWidth="150%">
          <Button onClick={() => { setEditingCorante(null); setShowModal(true); }}>Adicionar Corante</Button>
        </Box>
        <HStack w="100%" justifyContent="flex-end">
          <Button onClick={() => setPage(page === 0 ? 0 : page - 1)} disabled={page === 0}>
            <FaAngleLeft />
          </Button>
          <Button onClick={() => setPage(page === pages - 1 ? pages - 1 : page + 1)} disabled={page === pages - 1}>
            <FaAngleRight />
          </Button>
        </HStack>
      </HStack>
      {showModal && (
        <CoranteModal
          onClose={() => setShowModal(false)}
          editingCorante={editingCorante}
          setUpdateTable={setUpdateTable}
        />
      )}
    </VStack>
  );
};

export default DataCorante;