import { useToast, Text,VStack, Box, Table, Thead, Tr, Th, Tbody, Td, HStack, Button, Input, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import axios from "axios";
import { useState, useEffect } from "react";
import { FaSearch, FaTrash, FaAngleLeft, FaAngleRight , FaPencilAlt, FaSortDown, FaSortUp } from "react-icons/fa";
import { Colaborador, Turno } from "../../../Interfaces/interfaces";
import { ColaboradorModal } from "./ColaboradorModal";
import { isLoggedIn } from "../../../Routes/validation";
import { IconInput } from "../../../Components/ReUsable/Inputs/IconInput";

const DataColaborador: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [editingColaborador, setEditingColaborador] = useState<Colaborador | null>(null);
  const [UpdateTable, setUpdateTable] = useState<any>("");
  const [page, setPage] = useState<number>(0);
  const [Colaboradores, setColaboradores] = useState<any[]>([]);
  const [Turnos, setTurnos] = useState<any[]>([]);
  const itemsPerPage = 8;
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [sortColumn, setSortColumn] = useState<string>('id');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedTurno, setSelectedTurno] = useState<any>(null);
  const showToast = useToast();  

  useEffect(() => {
    const fetchColaboradores = async () => {
      try {
        const response = await axios.get('/.netlify/functions/colaboradores');
        setColaboradores((response.data as { data: Colaborador[] }).data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    isLoggedIn();
    fetchColaboradores();
    setUpdateTable("");
  }, [UpdateTable]);

  useEffect(() => {
    const fetchTurnos = async () => {
      try {
        const response = await axios.get('/.netlify/functions/turnos');
        setTurnos((response.data as { data: Turno[] }).data);
      } catch (error) {
        showToast({
          title: "Erro ao carregar dados",
          description: "Não foi possível carregar os turnos.",
          status: "error",
        });
        console.error('Error fetching data:', error);
      }
    };

    fetchTurnos();
  }, []);

  const deleteColaborador = async (id: number) => {
    const confirmDelete = window.confirm("Tem certeza que deseja excluir este registro?");
    if (confirmDelete) {
      try {
        await axios.delete(`/.netlify/functions/colaboradores/${id}`);
        setColaboradores(Colaboradores.filter(colaborador => colaborador.id_colaborador !== id));
        showToast({
          title: "Colaborador eliminado com sucesso",
          description: "O colaborador foi eliminado com sucesso.",
          status: "success",
        });
      } catch (error) {
        showToast({
          title: "Erro ao eliminar o colaborador",
          description: "Não foi possível eliminar o colaborador.",
          status: "error",
        });
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
        <HStack>
          <Box className="TableSearchInput" w="28%">
            <IconInput placeholder="Pesquisar por Nome" icon={<FaSearch/>} value={searchTerm} onChange={(x) => setSearchTerm(x ?? "")}/>
          </Box>        
          <Menu> 
          <MenuButton as={Button} className="TableSearchMenuButton" mt="2%" >
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
        </HStack>
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
              <Th color="white" width="12%">Número</Th>
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
                    <FaPencilAlt cursor="pointer" onClick={() => { setEditingColaborador(colaborador); setShowModal(true); }}/>
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
          <Button onClick={() => { setEditingColaborador(null); setShowModal(true); }}>Adicionar Colaborador</Button>
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
        <ColaboradorModal
          onClose={() => setShowModal(false)}
          editingColaborador={editingColaborador}
          turnos={Turnos}
          setUpdateTable={setUpdateTable}
        />
      )}
    </VStack>
  );
};

export default DataColaborador;