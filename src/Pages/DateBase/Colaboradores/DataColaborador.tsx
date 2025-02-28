import { Text,VStack, Box, Table, Thead, Tr, Th, Tbody, Td, HStack, Button, Input, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import axios from "axios";
import { useState, useEffect } from "react";
import { FaAngleLeft, FaAngleRight , FaSortDown, FaSortUp } from "react-icons/fa";
import { FaTrash } from "react-icons/fa";
import '../../../Styles/styles.css';
import { ModifyColaborador } from "./EditColaborador";
import { AddColaborador } from "./AddColaborador";
import { Colaborador, Turno } from "../../../Interfaces/interfaces";

const DataColaborador: React.FC = () => {
  const [UpdateTable, setUpdateTable] = useState<any>("");
  const [page, setPage] = useState<number>(0);
  const [Colaboradores, setColaboradores] = useState<any[]>([]);
  const [Turnos, setTurnos] = useState<any[]>([]);
  const itemsPerPage = 8;
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [sortColumn, setSortColumn] = useState<string>('id');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedTurno, setSelectedTurno] = useState<any>(null);

  useEffect(() => {
    const fetchColaboradores = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/colaborador');
        setColaboradores((response.data as { data: Colaborador[] }).data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchColaboradores();
  }, [UpdateTable]);

  useEffect(() => {
    const fetchTurnos = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/turno');
        setTurnos((response.data as { data: Turno[] }).data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchTurnos();
  }, []);

  const deleteColaborador = async (id: number) => {
    const confirmDelete = window.confirm("Tem certeza que deseja excluir este registro?");
    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:3001/api/colaborador/${id}`);
        setColaboradores(Colaboradores.filter(colaborador => colaborador.id_colaborador !== id));
      } catch (error) {
        console.error('Error deleting colaborador:', error);
      }
    }
  };

  const handleSort = (column: string) => {
    const newDirection = (sortColumn === column && sortDirection === 'asc') ? 'desc' : 'asc';
    setSortDirection(newDirection);
    setSortColumn(column);
  };

  const sortedColaboradores = [...Colaboradores].sort((a, b) => {
    if (sortColumn === 'idade') {
      return sortDirection === 'asc' ? a.idade - b.idade : b.idade - a.idade;
    } else if (sortColumn === 'id_colaborador') {
      return sortDirection === 'asc' ? a.id_colaborador - b.id_colaborador : b.id_colaborador - a.id_colaborador;
    }
    return 0;
  });

  const filteredColaboradores = sortedColaboradores.filter(colaborador => {
    const matchesSearchTerm = colaborador.nome?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTurno = selectedTurno ? colaborador.id_turno === selectedTurno.id_turno : true;
    return matchesSearchTerm && matchesTurno;
});
 
  const pages = Math.ceil(filteredColaboradores.length / itemsPerPage);

  const getPageItems = (items: any[], page: number, itemsPerPage: number) => {
    const start = page * itemsPerPage;
    return items.slice(start, start + itemsPerPage);
  };

  return (
    <VStack alignItems="center">
      <Box className="TableBox">
        <Input className="TableSearchInput" placeholder="Pesquisar por Nome" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}/>
        <Menu> 
          <MenuButton as={Button} className="TableSearchMenuButton" >
            {selectedTurno ? selectedTurno.descricao : "Selecione um Turno"}
          </MenuButton>
          <MenuList className="TableSearchMenuList">
            <MenuItem className="TableSearchMenuItem" onClick={() => setSelectedTurno(null)}>Selecione um Turno</MenuItem>
            {Turnos.map(turno => (
              <MenuItem className="TableSearchMenuItem" key={turno.id_turno} onClick={() => setSelectedTurno(turno)}>
                {turno.descricao}
              </MenuItem>
            ))}
          </MenuList>
        </Menu>
        <Table className="TableTable" sx={{ tableLayout: 'fixed' }}>
          <Thead className="LineHead">
            <Tr>
              <Th color="white" width="7.5%" onClick={() => handleSort('id_colaborador')} style={{ cursor: 'pointer' }}>
                <HStack spacing={1}>
                  <Text>ID</Text>
                  {sortColumn === 'id_colaborador' && (sortDirection === 'asc' ? <FaSortUp color="white" /> : <FaSortDown color="white" />)}
                </HStack>
              </Th>
              <Th color="white" width="20%">Nome</Th>
              <Th color="white" width="10%" onClick={() => handleSort('idade')} style={{ cursor: 'pointer' }}>
                <HStack spacing={1}>
                  <Text>Idade</Text>
                  {sortColumn === 'idade' && (sortDirection === 'asc' ? <FaSortUp color="white" /> : <FaSortDown color="white" />)}
                </HStack>
              </Th>
              <Th color="white">Email</Th>
              <Th color="white" width="12%">Numero</Th>
              <Th color="white" width="10%">Turno</Th>
              <Th color="white" width="8%">Ações</Th>
            </Tr>
          </Thead>
          <Tbody>
            {getPageItems(filteredColaboradores, page, itemsPerPage).map((colaborador) => (
              <Tr className="Line" key={colaborador.id_colaborador}>
                <Td>{colaborador.id_colaborador}</Td>
                <Td>{colaborador.nome}</Td>
                <Td>{colaborador.idade}</Td>
                <Td>{colaborador.email}</Td>
                <Td>{colaborador.numero}</Td>
                <Td>{colaborador.turnos.descricao}</Td>
                <Td>
                  <HStack spacing={2} justifyContent="flex-end">
                    <ModifyColaborador setUpdateTable={setUpdateTable} editColaborador={colaborador} Turnos={Turnos}/>
                    <FaTrash cursor="pointer" onClick={() => deleteColaborador(colaborador.id_colaborador)} color="darkred" />
                  </HStack>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>

      <HStack marginLeft="50%" spacing={4}>
        <Box maxWidth="150%">
          <AddColaborador setUpdateTable={setUpdateTable} Turnos={Turnos}/>
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

export default DataColaborador;