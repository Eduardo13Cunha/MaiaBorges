import { Text,VStack, Box, Table, Thead, Tr, Th, Tbody, Td, HStack, Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, FormControl, FormLabel, Input, ModalFooter, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import axios from "axios";
import { useState, useEffect } from "react";
import { FaAngleLeft, FaAngleRight ,FaPencilAlt, FaSortDown, FaSortUp } from "react-icons/fa";
import { FaTrash } from "react-icons/fa";
import '../../Styles/styles.css';

const DataColaborador: React.FC = () => {
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [editColaborador, setEditColaborador] = useState<any>(null);
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
        setColaboradores(response.data.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchColaboradores();
  }, []);

  useEffect(() => {
    const fetchTurnos = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/turno');
        setTurnos(response.data.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchTurnos();
  }, []);

  const addColaborador = async (novocolaborador: any) => {
    try {
      const response = await axios.post('http://localhost:3001/api/colaborador', novocolaborador);
      const novoColaborador = response.data.data;
      setColaboradores((prev) => [...prev, novoColaborador]);
    } catch (error) {
      console.error('Error adding colaborador:', error);
    }
  };

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

  const updateColaborador = async (colaborador: any) => {
    try {
      const response = await axios.put(`http://localhost:3001/api/colaborador/${colaborador.id_colaborador}`, colaborador);
      if (response.data) {
        setColaboradores(Colaboradores.map(c => (c.id_colaborador === colaborador.id_colaborador ? response.data : c)));
      } else {
        console.error("Resposta da API não contém dados esperados:", response.data);
      }
    } catch (error) {
      console.error('Error updating colaborador:', error);
    }
  };

  const openEditModal = (colaborador: any) => {
    setEditColaborador(colaborador);
    setEditModalOpen(true);
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
    console.log(colaborador);
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
              <Th color="white">Nome</Th>
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
                    <FaPencilAlt cursor="pointer" onClick={() => openEditModal(colaborador)} />
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
          <AddColaborador addColaborador={addColaborador} Turnos={Turnos}/>
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
      <ModifyColaborador 
        editColaborador={editColaborador} 
        updateColaborador={updateColaborador} 
        onClose={() => setEditModalOpen(false)} 
        isOpen={isEditModalOpen} 
        Turnos={Turnos}
      />
    </VStack>
  );
};

const AddColaborador: React.FC<{ addColaborador: (colaborador: any) => void;Turnos: any[] }> = ({ addColaborador , Turnos}) => {
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [formData, setFormData] = useState<{ nome: string; idade: number | undefined;data_nascimento:string; email: string; numero: number | undefined ; id_turno: number | undefined}>({
    nome: '',
    idade: undefined,
    data_nascimento: new Date().toISOString().split('T')[0],
    email: '',
    numero: undefined,
    id_turno: undefined,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    addColaborador({
      ...formData,
      idade: Number(formData.idade),
      numero: Number(formData.numero),
      id_turno: Number(formData.id_turno),
      
    });
    setAddModalOpen(false);
    setFormData({ nome: '', idade: undefined,data_nascimento : '',      email: '', numero: undefined, id_turno: undefined });
  };

  const openAddModal = () => {
    setAddModalOpen(true);
  };

  const handleMenuItemClick = (id: number, name: string) => {
    setFormData({ ...formData, id_turno: id });
  };

  return (
    <Box>
      <Button onClick={openAddModal}>Adicionar Colaborador</Button>
      <Modal isOpen={isAddModalOpen} onClose={() => setAddModalOpen(false)}>
        <ModalOverlay />
        <ModalContent className="TableModal">
          <ModalHeader>Adicionar Colaborador</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={handleSubmit}>
              <FormControl isRequired>
                <FormLabel>Nome</FormLabel>
                <Input type="text" name="nome" value={formData.nome} onChange={handleChange} />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Idade</FormLabel>
                <Input type="number" name="idade" value={formData.idade !== undefined ? formData.idade : ''} onChange={handleChange} />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Data de Nascimento</FormLabel>
                <Input type="date" name="data_nascimento" value={formData.data_nascimento !== undefined ? formData.data_nascimento : ''} onChange={handleChange} />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Email</FormLabel>
                <Input type="email" name="email" value={formData.email} onChange={handleChange} />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Número</FormLabel>
                <Input type="number" name="numero" value={formData.numero !== undefined ? formData.numero : ''} onChange={handleChange} />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Turno</FormLabel>
                <Menu>
                  <MenuButton as={Button} className="TableMenu">
                    {formData.id_turno !== undefined ? Turnos.find(t => t.id_turno === formData.id_turno)?.descricao : "Selecione um Turno"}
                  </MenuButton>
                  <MenuList className="TableMenuList">
                    {Turnos.map((turno) => (
                      <MenuItem className="TableMenuItem" key={turno.id_turno} onClick={() => handleMenuItemClick(turno.id_turno, turno.des)}>
                        {turno.descricao}
                      </MenuItem>
                    ))}
                  </MenuList>
                </Menu>
              </FormControl>
              <Button type="submit" className="SaveButton">Salvar</Button>
              <Button onClick={() => setAddModalOpen(false )} className="CancelButton">Cancelar</Button>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

const ModifyColaborador: React.FC<{ editColaborador: any; updateColaborador: (colaborador: any) => void; onClose: () => void; isOpen: boolean; Turnos:any[] }> = ({ editColaborador, updateColaborador, onClose, isOpen ,Turnos }) => {
  const [formData, setFormData] = useState<{ nome: string; idade: number; email: string; numero: number; id_turno: number }>({
    nome: '',
    idade: 0,
    email: '',
    numero: 0,
    id_turno: 0,
  });

  useEffect(() => {
    if (editColaborador) {
      setFormData({
        nome: editColaborador.nome,
        idade: editColaborador.idade,
        email: editColaborador.email,
        numero: editColaborador.numero,
        id_turno: editColaborador.id_turno,
      });
    }
  }, [editColaborador]);

  const handleMenuItemClick = (id: number) => {
    setFormData({ ...formData, id_turno: id });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const updatedColaborador = {
      ...formData,
      id_colaborador: editColaborador.id_colaborador,
      idade: Number(formData.idade),
      numero: Number(formData.numero),
      id_turno: Number(formData.id_turno),
    };
    await updateColaborador(updatedColaborador);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent className="TableModal">
        <ModalHeader>Editar Colaborador</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form onSubmit={handleSubmit}>
            <FormControl isRequired>
              <FormLabel>Nome</FormLabel>
              <Input type="text" name="nome" value={formData.nome} onChange={(e) => setFormData({ ...formData, nome: e.target.value })} />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Idade</FormLabel>
              <Input type="number" name="idade" value={formData.idade} onChange={(e) => setFormData({ ...formData, idade: Number(e.target.value) })} />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Email</FormLabel>
              <Input type="email" name="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Número</FormLabel>
              <Input type="number" name="numero" value={formData.numero} onChange={(e) => setFormData({ ...formData, numero: Number(e.target.value) })} />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Turno</FormLabel>
              <Menu>
                <MenuButton as={Button} className="TableMenu">
                  {formData.id_turno !== undefined ? Turnos.find(t => t.id_turno === formData.id_turno)?.descricao : "Selecione um Turno"}
                </MenuButton>
                <MenuList className="TableMenuList">
                  {Turnos.map((turno) => (
                    <MenuItem className="TableMenuItem" key={turno.id_turno} onClick={() => handleMenuItemClick(turno.id_turno)}>
                      {turno.descricao}
                    </MenuItem>
                  ))}
                </MenuList>
              </Menu>
            </FormControl>
            <Button type="submit" className="SaveButton">Editar</Button>
            <Button onClick={onClose} className="CancelButton">Cancelar</Button>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default DataColaborador;