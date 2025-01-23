import { Text, VStack, Box, Table, Thead, Tr, Th, Tbody, Td, HStack, Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, FormControl, FormLabel, Input, Menu, MenuButton, MenuItem, MenuList, Textarea } from "@chakra-ui/react";
import axios from "axios";
import { format } from 'date-fns'; 
import { useState, useEffect } from "react";
import { FaAngleLeft, FaAngleRight, FaPencilAlt, FaTrash ,FaSearch, FaSortDown, FaSortUp } from "react-icons/fa";
import '../../Styles/styles.css';

const DataEquipamento: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedLocal, setSelectedLocal] = useState<any>(null);
  const [selectedEstado, setSelectedEstado] = useState<any>(null);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [editEquipamento, setEditEquipamento] = useState<any>(null);
  const [page, setPage] = useState<number>(0);
  const [Estado, setEstado] = useState<any[]>([]);
  const [Local, setLocal] = useState<any[]>([]);
  const [Equipamentos, setEquipamento] = useState<any[]>([]);
  const itemsPerPage = 8;
  const [sortColumn, setSortColumn] = useState<string>('id_equi'); // Coluna padrão para ordenar
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc'); // Direção da ordenação

  useEffect(() => {
    const fetchEquipamentos = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/equipamento');
        const sortedData = response.data.data.sort((a: { id_equi: number; }, b: { id_equi: number; }) => a.id_equi - b.id_equi);
        setEquipamento(sortedData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchEquipamentos();
  }, []);

  useEffect(() => {
    const fetchLocals = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/local');
        const sortedData = response.data.data.sort((a: { id_loc: number; }, b: { id_loc: number; }) => a.id_loc - b.id_loc);
        setLocal(sortedData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    fetchLocals();
  }, []);

  useEffect(() => {
    const fetchEstados = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/estadosequipamento');
        const sortedData = response.data.data.sort((a: { id_estequi: number; }, b: { id_estequi: number; }) => a.id_estequi - b.id_estequi);
        setEstado(sortedData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    fetchEstados();
  }, []);

  const addEquipamento = async (novoequipamento: any) => {
    try {
      const response = await axios.post('http://localhost:3001/api/equip amento', novoequipamento);
      const novoEquipamento = response.data.data;
      setEquipamento((prev) => [...prev, novoEquipamento]);
    } catch (error) {
      console.error('Error adding equipamento:', error);
    }
  };

  const deleteEquipamento = async (id_equi: number) => {
    const confirmDelete = window.confirm("Tem certeza que deseja excluir este registro?");
    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:3001/api/equipamento/${id_equi}`);
        setEquipamento((prev) => prev.filter((equipamento) => equipamento.id_equi !== id_equi));
      } catch (error) {
        console.error('Erro ao excluir equipamento:', error);
      }
    }
  };

  const updateEquipamento = async (equipamento: any) => {
    try {
      const response = await axios.put(`http://localhost:3001/api/equipamento/${equipamento.id_equi}`, equipamento);
      if (response.data) {
        setEquipamento((prev) => prev.map(e => (e.id_equi === equipamento.id_equi ? response.data.data : e)));
      } else {
        console.error("Resposta da API não contém dados esperados:", response.data);
      }
    } catch (error) {
      console.error('Error updating equipamento:', error);
    }
  };

  const openEditModal = (equipamento: any) => {
    setEditEquipamento(equipamento);
    setEditModalOpen(true);
  };

  const handleSort = (column: string) => {
    const newDirection = (sortColumn === column && sortDirection === 'asc') ? 'desc' : 'asc';
    setSortDirection(newDirection);
    setSortColumn(column);
  };

  const filteredEquipamentos = Equipamentos.filter(equipamento => {
    const matchesSearchTerm = equipamento.tipo && equipamento.tipo.toLowerCase().includes(searchTerm.toLowerCase()); // Verificação de undefined
    const matchesLocal = selectedLocal ? equipamento.id_loc === selectedLocal.id_loc : true;
    const matchesEstado = selectedEstado ? equipamento.id_estequi === selectedEstado.id_estequi : true;
    return matchesSearchTerm && matchesLocal && matchesEstado;
  });

  const sortedEquipamentos = [...filteredEquipamentos].sort((a, b) => {
    const aValue = sortColumn === 'validade_licensa' || sortColumn === 'data_compra' || sortColumn === 'data_final' 
      ? new Date(a[sortColumn]).getTime() 
      : a[sortColumn];
    const bValue = sortColumn === 'validade_licensa' || sortColumn === 'data_compra' || sortColumn === 'data_final' 
      ? new Date(b[sortColumn]).getTime() 
      : b[sortColumn];

    return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
  });

  const pages = Math.ceil(sortedEquipamentos.length / itemsPerPage);
  const getPageItems = (items: any[], page: number, itemsPerPage: number) => {
    const start = page * itemsPerPage;
    return items.slice(start, start + itemsPerPage);
  };

  return (
    <VStack alignItems="center">
      <Box overflowX="auto" height="75vh" width="100%" overflowY="auto">
      <HStack justifyContent="flex-start" color="white" marginLeft="15%" marginRight="15%" marginTop="2%" maxH="80%" maxW="100%">
          <Input placeholder="Pesquisar por descrição" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} w="40%"/>
          <Menu>
            <MenuButton as={Button} bgColor="rgba(30, 30, 100)" color="white" w="20%">
              {selectedLocal ? selectedLocal.des_loc : "Selecione um Local"}
            </MenuButton>
            <MenuList bgColor="transparent" border="transparent" color="white">
              <MenuItem width="100%" bgColor="rgba(30, 30, 100)" onClick={() => setSelectedLocal(null)}>Selecione um Local</MenuItem>
              {Local.map(local => (
                <MenuItem width="100%" bgColor="rgba(30, 30, 100)" key={local.id_loc} onClick={() => setSelectedLocal(local)}>
                  {local.des_loc}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton as={Button} bgColor="rgba(30, 30, 100)" color="white" w="20%">
              {selectedEstado ? selectedEstado.des_est : "Selecione um Estado"}
            </MenuButton>
            <MenuList bgColor="transparent" border="transparent" color="white">
              <MenuItem width="100%" bgColor="rgba(30, 30, 100)" onClick={() => setSelectedEstado(null)}>Selecione um Estado</MenuItem>
              {Estado.map(estado => (
                <MenuItem width="100%" bgColor="rgba(30, 30, 100)" key={estado.id_estequi} onClick={() => setSelectedEstado(estado)}>
                  {estado.des_est}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
        </HStack>
        <Table color="white" marginLeft="15%" marginRight="15%" marginTop="2%" maxH="80%" maxW="70%" sx={{ tableLayout: 'fixed' }}>
          <Thead className="LineHead">
            <Tr>
            <Th color="white" onClick={() => handleSort('id_equi')} style={{ cursor: 'pointer' }}>
                <HStack spacing={1}>
                  <Text>ID</Text>
                  {sortColumn === 'id_equi' && (sortDirection === 'asc' ? <FaSortUp color="white" /> : <FaSortDown color="white" />)}
                </HStack>
              </Th>
              <Th color="white" width="15%">Tipo</Th>
              <Th color="white">Local</Th>
              <Th color="white" width="13%">Estado</Th>
              <Th color="white" width="10%">Licença</Th>
              <Th color="white" onClick={() => handleSort('validade_licensa')} style={{ cursor: 'pointer' }}>
                <HStack spacing={1}>
                  <Text>Validade da Licensa</Text>
                  {sortColumn === 'validade_licensa' && (sortDirection === 'asc' ? <FaSortUp color="white" /> : <FaSortDown color="white" />)}
                </HStack>
              </Th>
              <Th color="white" onClick={() => handleSort('data_compra')} style={{ cursor: 'pointer' }}>
                <HStack spacing={1}>
                  <Text>Data de Compra</Text>
                  {sortColumn === 'data_compra' && (sortDirection === 'asc' ? <FaSortUp color="white" /> : <FaSortDown color="white" />)}
                </HStack>
              </Th>
              <Th color="white">Data de Venda</Th>
              <Th color="white" width="10%">Ações</Th>
            </Tr>
          </Thead>
          <Tbody>
            {getPageItems(sortedEquipamentos, page, itemsPerPage).map((equipamento) => (
              <Tr className="Line" key={equipamento.id_equi}>
                <Td>{equipamento.id_equi}</Td>
                <Td>{equipamento.tipo}</Td>
                <Td>{equipamento.des_loc}</Td>
                <Td>{equipamento.des_est}</Td>
                <Td>{equipamento.licensa}</Td>
                <Td>{format(new Date(equipamento.validade_licensa), 'dd/MM/yyyy')}</Td>
                <Td>{format(new Date(equipamento.data_compra), 'dd/MM/yyyy')}</Td>
                <Td>{equipamento.data_final ? format(new Date(equipamento.data_final), 'dd/MM /yyyy') : ''}</Td>
                <Td>
                  <HStack spacing={2} justifyContent="flex-end">
                    <FaPencilAlt cursor="pointer" onClick={() => openEditModal(equipamento)} />
                    <FaTrash cursor="pointer" onClick={() => deleteEquipamento(equipamento.id_equi)} color="Red" />
                  </HStack>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
      
      <HStack marginLeft="50%" spacing={4}>
        <Box maxWidth="150%">
          <AddEquipamento addEquipamento={addEquipamento} locals={Local} estados={Estado} />
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
      <ModifyLocal
        editEquipamento={editEquipamento} 
        updateEquipamento={updateEquipamento} 
        locals={Local} 
        estados={Estado}
        onClose={() => setEditModalOpen(false)} 
        isOpen={isEditModalOpen} 
      />
    </VStack>
  );
};

const Observações: React.FC<{ equipamento: any ;}> = ({ equipamento}) => {
  const [isModalOpen, setModalOpen] = useState(false);

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  return (
    <>
        {equipamento.observações ? (
          <FaSearch onClick={openModal}/>
        ) : (
          ''
        )}

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <ModalOverlay />
        <ModalContent bgColor="rgba(170, 170, 170)" maxH="100%" maxW="40%">
          <ModalHeader>Observações</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>{equipamento.observações}</Text>
            <Button mt="2%" onClick={closeModal} bgColor="rgba(128, 128, 128, 0.8)">
              Fechar
            </Button>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

const AddEquipamento: React.FC<{ addEquipamento: (equipamento: any) => void; locals: any[],estados: any[] }> = ({ addEquipamento, locals , estados }) => {
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [formData, setFormData] = useState<{ tipo: string; id_loc: number | undefined;id_estequi: number | undefined; licensa: string;validade_licensa: string;data_compra: string;data_final1: string;observações: string;}>({
    tipo: '',
    id_loc: undefined,
    id_estequi: undefined,
    licensa: '',
    validade_licensa: '',
    data_compra: '',
    data_final1: '',
    observações: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleMenuItemClickLocal = (id: number, name: string) => {
    setFormData({ ...formData, id_loc:id});
  };
  const handleMenuItemClickEstado = (id: number, name: string) => {
    setFormData({ ...formData, id_estequi:id });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let data_final: string | null;
    if(formData.data_final1 == ""){data_final=null} else {data_final = formData.data_final1};
    if (formData.id_loc === undefined || formData.id_estequi === undefined) {
      return alert("Por favor, selecione um local e um estado.");
    }
    await addEquipamento({
      ...formData,
      data_final: data_final,
      id_loc: Number(formData.id_loc),
      id_estequi: Number(formData.id_estequi),
    });
    setAddModalOpen(false);
    setFormData({ tipo: '',id_loc: undefined,id_estequi: undefined,licensa: '',validade_licensa: '',data_compra: '',data_final1: '',observações: '',});
  };

  const openAddModal = () => {
    setAddModalOpen(true);
  };

  return (
    <Box>
      <Button onClick={openAddModal} >Adicionar Equipamento</Button>
      <Modal isOpen={isAddModalOpen} onClose={() => setAddModalOpen(false)}>
        <ModalOverlay />
        <ModalContent bgColor="rgba(30, 30, 130)" color="white" maxH="100%" maxW="40%">
          <ModalHeader>Adicionar Equipamento</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={handleSubmit}>
              <FormControl isRequired>
                <FormLabel>Tipo</FormLabel>
                <Input type="text" name="tipo" value={formData.tipo} onChange={handleChange} />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Local</FormLabel>
                  <Menu>
                    <MenuButton as={Button} width="100%" bgColor="rgba(30, 30, 100)" color="white">
                      {formData.id_loc !== undefined ? locals.find(l => l.id_loc === formData.id_loc)?.des_loc : "Selecione um Local"}
                    </MenuButton>
                    <MenuList w="311%" bgColor="transparent" border="transparent" color="white">
                      {locals.map((local) => (
                        <MenuItem width="100%" bgColor="rgba(30, 30, 100)" key={local.id_loc} onClick={() => handleMenuItemClickLocal(local.id_loc, local.des_loc)}>
                          {local.des_loc}
                        </MenuItem>
                      ))}
                    </MenuList>
                  </Menu>
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Estado</FormLabel>
                <Menu>
                  <MenuButton as={Button} width="100%" bgColor="rgba(30, 30, 100)" color="white">
                    {formData.id_estequi !== undefined ? estados.find(e => e.id_estequi === formData.id_estequi)?.des_est : "Selecione um Estado"}
                  </MenuButton>
                  <MenuList w="311%" bgColor="transparent" border="transparent" color="white">
                    {estados.map((estado) => (
                      <MenuItem width="100%" bgColor="rgba(30, 30, 100)" key={estado.id_estequi} onClick={() => handleMenuItemClickEstado(estado.id_estequi, estado.des_est)}>
                        {estado.des_est}
                      </MenuItem>
                    ))}
                  </MenuList>
                </Menu>
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Licença</FormLabel>
                <Input type="text" name="licensa" value={formData.licensa} onChange={handleChange} />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Validade da Licença</FormLabel>
                <Input type="date" name="validade_licensa" value={formData.validade_licensa.toString()} onChange={handleChange} />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Data de Compra</FormLabel>
                <Input type="date" name="data_compra" value={formData.data_compra.toString()} onChange={handleChange} />
              </FormControl>
              <FormControl>
                <FormLabel>Data Final</FormLabel>
                <Input type="date" name="data_final1" value={(formData.data_final1).toString() ?? '' } onChange={handleChange} />
              </FormControl>
              <FormControl mb="2%">
                <FormLabel>Observações</FormLabel>
                <Input type="text" name="observações" value={formData.observações} onChange={handleChange} />
              </FormControl>
              <Button type="submit" mr="2%" bgColor="rgba(30, 30, 90, 0.8)" color="white">Salvar</Button>
              <Button bgColor="rgba(30, 30, 90, 1)" color="white" onClick={() => setAddModalOpen(false)}>Cancelar</Button>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

const ModifyLocal: React.FC<{ editEquipamento: any; updateEquipamento: (equipamento: any) => void;locals: any[],estados: any[]; onClose: () => void; isOpen: boolean }> = ({ editEquipamento, updateEquipamento,locals , estados , onClose, isOpen }) => {
  const [formData, setFormData] = useState<{ tipo: string; id_loc: number | undefined;id_estequi: number | undefined; licensa: string;validade_licensa: string;data_compra: string;data_final1: string;observações: string;}>({
    tipo: '',
    id_loc: undefined,
    id_estequi: undefined,
    licensa: '',
    validade_licensa: '',
    data_compra: '',
    data_final1: '',
    observações: '',
  });

  useEffect(() => {
    if (editEquipamento) {
      setFormData({
        tipo: editEquipamento.tipo,
        id_loc: editEquipamento.id_loc,
        id_estequi: editEquipamento.id_estequi,
        licensa: editEquipamento.licensa,
        validade_licensa: editEquipamento.validade_licensa.split('T')[0],
        data_compra: editEquipamento.data_compra.split('T')[0],
        data_final1: editEquipamento.data_final ? editEquipamento.data_final.split('T')[0] : '',
        observações: editEquipamento.observações,
      });
    }
  }, [editEquipamento]);

  const handleMenuItemClickLocal = (id: number, name: string) => {
    setFormData({ ...formData, id_loc:id});
  };
  const handleMenuItemClickEstado = (id: number, name: string) => {
    setFormData({ ...formData, id_estequi:id });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let data_final: string | null;
    if(formData.data_final1 == ""){data_final=null} else {data_final = formData.data_final1};
    if (formData.id_loc === undefined || formData.id_estequi === undefined) {
      return alert("Por favor, selecione um local e um estado.");
    }
    const updatedEquipamento = {
      ...formData,
      id_equi: editEquipamento.id_equi,
      data_final: data_final,
      id_loc: Number(formData.id_loc),
      id_estequi: Number(formData.id_estequi),
    };
    try {
      await updateEquipamento(updatedEquipamento); // Adicionado tratamento de erro
      onClose(); // Fecha o modal após a atualização
    } catch (error) {
      console.error('Erro ao atualizar equipamento:', error);
      alert('Erro ao atualizar equipamento. Tente novamente.'); // Mensagem de erro
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bgColor="rgba(30, 30, 130)" color="white" maxH="100%" maxW="40%">
          <ModalHeader>Editar Equipamento</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={handleSubmit}>
              <FormControl isRequired>
                <FormLabel>Tipo</FormLabel>
                <Input type="text" name="tipo" value={formData.tipo} onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}/>
                </FormControl>
              <FormControl isRequired>
                <FormLabel>Local</FormLabel>
                  <Menu>
                    <MenuButton as={Button} width="100%" bgColor="rgba(30, 30, 100)" color="white">
                      {formData.id_loc !== undefined ? locals.find(l => l.id_loc === formData.id_loc)?.des_loc : "Selecione um Local"}
                    </MenuButton>
                    <MenuList w="311%" bgColor="transparent" border="transparent"color="white">
                      {locals.map((local) => (
                        <MenuItem width="100%" bgColor="rgba(30, 30, 100)" key={local.id_loc} onClick={() => handleMenuItemClickLocal(local.id_loc, local.des_loc)}>
                          {local.des_loc}
                        </MenuItem>
                      ))}
                    </MenuList>
                  </Menu>
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Estado</FormLabel>
                <Menu>
                  <MenuButton as={Button} width="100%" bgColor="rgba(30, 30, 100)" color="white">
                    {formData.id_estequi !== undefined ? estados.find(e => e.id_estequi === formData.id_estequi)?.des_est : "Selecione um Estado"}
                  </MenuButton>
                  <MenuList w="311%" bgColor="transparent" border="transparent"color="white">
                    {estados.map((estado) => (
                      <MenuItem width="100%" bgColor="rgba(30, 30, 100)" key={estado.id_estequi} onClick={() => handleMenuItemClickEstado(estado.id_estequi, estado.des_est)}>
                        {estado.des_est}
                      </MenuItem>
                    ))}
                  </MenuList>
                </Menu>
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Licença</FormLabel>
                <Input type="text" name="licensa" value={formData.licensa} onChange={(e) => setFormData({ ...formData, licensa: e.target.value })}/>
                </FormControl>
              <FormControl isRequired>
                <FormLabel>Validade da Licença</FormLabel>
                <Input type="date" name="validade_licensa" value={formData.validade_licensa} onChange={(e) => setFormData({ ...formData, validade_licensa: e.target.value })} />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Data de Compra</FormLabel>
                <Input type="date" name="data_compra"  value={formData.data_compra} onChange={(e) => setFormData({ ...formData, data_compra: e.target.value })} />
              </FormControl>
              <FormControl>
                <FormLabel>Data Final</FormLabel>
                <Input type="date" name="data_final1"  value={formData.data_final1} onChange={(e) => setFormData({ ...formData, data_final1: e.target.value })}/>
              </FormControl>
              <FormControl mb="2%">
                <FormLabel>Observações</FormLabel>
                <Input type="text" name="observações"  value={formData.observações} onChange={(e) => setFormData({ ...formData, observações: e.target.value })}/>
              </FormControl>
              <Button type="submit" mr="2%" bgColor="rgba(30, 30, 90, 0.8)" color="white">Salvar</Button>
              <Button bgColor="rgba(30, 30, 90, 1)" color="white" onClick={onClose}>Cancelar</Button>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
  );
};

export default DataEquipamento;