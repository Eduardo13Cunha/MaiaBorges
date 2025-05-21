import { useToast, Text, VStack, Box, Table, Thead, Tr, Th, Tbody, Td, HStack, Button, Input } from "@chakra-ui/react";
import axios from "axios";
import { useState, useEffect } from "react";
import { FaAngleLeft, FaArrowRight, FaAngleRight, FaSortDown, FaSortUp, FaPencilAlt, FaSearch } from "react-icons/fa";
import { FaTrash } from "react-icons/fa";
import { MateriaPrima } from "../../../../Interfaces/interfaces";
import { MateriaPrimaModal } from "./MateriasPrimasModal";
import { IconInput } from "../../../../Components/ReUsable/Inputs/IconInput";

const DataMateriaPrima: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [editingMateriaPrima, setEditingMateriaPrima] = useState<MateriaPrima | null>(null);
  const [UpdateTable, setUpdateTable] = useState<any>("");
  const [page, setPage] = useState<number>(0);
  const [MateriasPrimas, setMateriasPrimas] = useState<any[]>([]);
  const itemsPerPage = 8;
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [sortColumn, setSortColumn] = useState<string>('id');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const showToast = useToast();

  useEffect(() => {
    const fetchMateriasPrimas = async () => {
      try {
        const response = await axios.get('/.netlify/functions/materiasprimas');
        setMateriasPrimas((response.data as { data: MateriaPrima[] }).data);
      } catch (error) {
        showToast({
          title: "Erro ao carregar dados",
          description: "Não foi possível carregar as matérias-primas.",
          status: "error",
        });
        console.error('Error fetching data:', error);
      }
    };

    fetchMateriasPrimas();
    setUpdateTable("");
  }, [UpdateTable]);

  const deleteMateriaPrima = async (id: number) => {
    const confirmDelete = window.confirm("Tem certeza que deseja excluir este registro?");
    if (confirmDelete) {
      try {
        await axios.delete(`/.netlify/functions/materiasprimas/${id}`);
        showToast({
          title: "Matéria Prima excluída com sucesso",
          description: "A matéria prima foi excluída com sucesso.",
          status: "success",
        });
        setMateriasPrimas(MateriasPrimas.filter(materiaPrima => materiaPrima.id_materiasprima !== id));
      } catch (error) {
        showToast({
          title: "Erro ao excluir matéria prima",
          description: "Não foi possível excluir a matéria prima.",
          status: "error",
        });
        console.error('Error deleting materia prima:', error);
      }
    }
  };

  const handleSort = (column: string) => {
    const newDirection = (sortColumn === column && sortDirection === 'asc') ? 'desc' : 'asc';
    setSortDirection(newDirection);
    setSortColumn(column);
  };

  const sortedMateriasPrimas = [...MateriasPrimas].sort((a, b) => {
    if (sortColumn === 'id_materiasprima') {
      return sortDirection === 'asc' ? a.id_materiasprima - b.id_materiasprima : b.id_materiasprima - a.id_materiasprima;
    } else if (sortColumn === 'quantidade') {
      return sortDirection === 'asc' ? a.quantidade - b.quantidade : b.quantidade - a.quantidade;
    }
    return 0;
  });

  const filteredMateriasPrimas = sortedMateriasPrimas.filter(materiaPrima => {
    const matchesSearchTerm = materiaPrima.nome.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearchTerm;
  });

  const pages = Math.ceil(filteredMateriasPrimas.length / itemsPerPage);

  const getPageItems = (items: any[], page: number, itemsPerPage: number) => {
    const start = page * itemsPerPage;
    return items.slice(start, start + itemsPerPage);
  };

  return (
    <VStack alignItems="center">
      <Box className="TableBox" width="130%">
        <HStack>
          <Box className="TableSearchInput">
            <IconInput placeholder="Pesquisar por Nome" icon={<FaSearch/>} value={searchTerm} onChange={(x) => setSearchTerm(x ?? "")}/>
          </Box>          
          <Text color="white" fontSize="200%" mt="2%" ml="1%">Materias Primas</Text>
        </HStack>
        <Table color="white" marginLeft="15%" marginRight="15%" marginTop="2%" maxH="80%" maxW="70%" sx={{ tableLayout: 'fixed' }}>
          <Thead className="LineHead">
            <Tr>
              <Th color="white" width="10%" onClick={() => handleSort('id_materiasprima')} style={{ cursor: 'pointer' }}>
                <HStack spacing={1}>
                  <Text>ID</Text>
                  {sortColumn === 'id_materiasprima' && (sortDirection === 'asc' ? <FaSortUp color="white" /> : <FaSortDown color="white" />)}
                </HStack>
              </Th>
              <Th color="white">Nome</Th>
              <Th color="white" onClick={() => handleSort('quantidade')} style={{ cursor: 'pointer' }}>
                <HStack spacing={1}>
                  <Box display="flex" flexDirection="row" alignItems="center">
                    <Text>Quantidade</Text>
                    <FaArrowRight fontSize="80%"/>
                    <Text>KG</Text>
                  </Box>
                  {sortColumn === 'quantidade' && (sortDirection === 'asc' ? <FaSortUp color="white" /> : <FaSortDown color="white" />)}
                </HStack>
              </Th>
              <Th color="white" width="15%">Ações</Th>
            </Tr>
          </Thead>
          <Tbody>
            {getPageItems(filteredMateriasPrimas, page, itemsPerPage).map((materiaPrima) => (
              <Tr className="Line" key={materiaPrima.id_materiasprima}>
                <Td>{materiaPrima.id_materiasprima}</Td>
                <Td>{materiaPrima.nome}</Td>
                <Td>{materiaPrima.quantidade}</Td>
                <Td>
                  <HStack spacing={2} justifyContent="flex-end">
                    <FaPencilAlt cursor="pointer" onClick={() => { setEditingMateriaPrima(materiaPrima); setShowModal(true); }}/>
                    <FaTrash cursor="pointer" onClick={() => deleteMateriaPrima(materiaPrima.id_materiasprima)} color="darkred" />
                  </HStack>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>

      <HStack marginLeft="50%" spacing={4}>
        <Box maxWidth="150%">
          <Button onClick={() => { setEditingMateriaPrima(null); setShowModal(true); }}>Adicionar Matéria Prima</Button>
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
        <MateriaPrimaModal
          onClose={() => setShowModal(false)}
          editingMateriaPrima={editingMateriaPrima}
          setUpdateTable={setUpdateTable}
        />
      )}
    </VStack>
  );
};

export default DataMateriaPrima;