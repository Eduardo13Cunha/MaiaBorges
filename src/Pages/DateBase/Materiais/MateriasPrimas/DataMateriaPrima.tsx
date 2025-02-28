import { Text, VStack, Box, Table, Thead, Tr, Th, Tbody, Td, HStack, Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, FormControl, FormLabel, Input, ModalFooter } from "@chakra-ui/react";
import axios from "axios";
import { useState, useEffect } from "react";
import { FaAngleLeft, FaAngleRight, FaPencilAlt, FaSortDown, FaSortUp } from "react-icons/fa";
import { FaTrash } from "react-icons/fa";
import { EditMateriaPrimaModal } from "./EditMateriasPrimas";
import { AddMateriaPrimaModal } from "./AddMateriasPrimas";

const DataMateriaPrima: React.FC = () => {
  const [UpdateTable, setUpdateTable] = useState<any>("");
  const [page, setPage] = useState<number>(0);
  const [MateriasPrimas, setMateriasPrimas] = useState<any[]>([]);
  const itemsPerPage = 8;
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [sortColumn, setSortColumn] = useState<string>('id');
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    const fetchMateriasPrimas = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/materiasprima');
        setMateriasPrimas(response.data.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchMateriasPrimas();
  }, [UpdateTable]);

  const deleteMateriaPrima = async (id: number) => {
    const confirmDelete = window.confirm("Tem certeza que deseja excluir este registro?");
    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:3001/api/materiasprima/${id}`);
        setMateriasPrimas(MateriasPrimas.filter(materiaPrima => materiaPrima.id_materiasprima !== id));
      } catch (error) {
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
          <Input placeholder="Pesquisar por Nome" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="TableSearchInput"/>
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
                  <Text>Quantidade-KG</Text>
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
                    <EditMateriaPrimaModal setUpdateTable={setUpdateTable} editMateriaPrima={materiaPrima} />
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
          <AddMateriaPrimaModal setUpdateTable={setUpdateTable} />
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
    </VStack>
  );
};

export default DataMateriaPrima;