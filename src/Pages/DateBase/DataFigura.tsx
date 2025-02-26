import React, { useState, useEffect } from 'react';
import {
  VStack,
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  HStack,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  NumberInput,
  NumberInputField,
} from '@chakra-ui/react';
import { FaTrash, FaPencilAlt, FaAngleLeft, FaAngleRight, FaSortDown, FaSortUp, FaSearch } from 'react-icons/fa';
import axios from 'axios';

const DataFigura = () => {
  const [figuras, setFiguras] = useState<any[]>([]);
  const [materiasPrimas, setMateriasPrimas] = useState<any[]>([]);
  const [corantes, setCorantes] = useState<any[]>([]);
  const [page, setPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [editFigura, setEditFigura] = useState<any>(null);
  const [sortColumn, setSortColumn] = useState<string>('id_figura');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const itemsPerPage = 8;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [figuraRes, materiaPrimaRes, coranteRes] = await Promise.all([
        axios.get('http://localhost:3001/api/figura'),
        axios.get('http://localhost:3001/api/materiasprima'),
        axios.get('http://localhost:3001/api/corante')
      ]);
      setFiguras(figuraRes.data.data);
      setMateriasPrimas(materiaPrimaRes.data.data);
      setCorantes(coranteRes.data.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleSort = (column: string) => {
    const newDirection = sortColumn === column && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortDirection(newDirection);
    setSortColumn(column);
  };

  const addFigura = async (figura: any) => {
    try {
      const response = await axios.post('http://localhost:3001/api/figura', figura);
      setFiguras([...figuras, response.data.data]);
    } catch (error) {
      console.error('Error adding figura:', error);
    }
  };

  const deleteFigura = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir esta figura?')) {
      try {
        await axios.delete(`http://localhost:3001/api/figura/${id}`);
        setFiguras(figuras.filter(figura => figura.id_figura !== id));
      } catch (error) {
        console.error('Error deleting figura:', error);
      }
    }
  };

  const updateFigura = async (figura: any) => {
    try {
      const response = await axios.put(`http://localhost:3001/api/figura/${figura.id_figura}`, figura);
      setFiguras(figuras.map(f => f.id_figura === figura.id_figura ? response.data : f));
      setEditModalOpen(false);
    } catch (error) {
      console.error('Error updating figura:', error);
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
        <Input
          placeholder="Pesquisar por nome ou referência"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className='TableSearchInput'
        />
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
                  <Text>Tempo Ciclo-(P/h)</Text>
                  {sortColumn === 'tempo_ciclo' && (
                    sortDirection === 'asc' ? <FaSortUp /> : <FaSortDown />
                  )}
                </HStack>
              </Th>
              <Th color="white">Matérial</Th>
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
                <Td alignItems="center" justifyContent="center"><Observações figura={figura}/></Td>
                <Td>
                  <HStack spacing={2}>
                    <FaPencilAlt
                      cursor="pointer"
                      onClick={() => {
                        setEditFigura(figura);
                        setEditModalOpen(true);
                      }}
                    />
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
        <AddFiguraModal 
          addFigura={addFigura} 
          materiasPrimas={materiasPrimas}
          corantes={corantes}
        />
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

      <EditFiguraModal
        isOpen={isEditModalOpen}
        onClose={() => setEditModalOpen(false)}
        figura={editFigura}
        updateFigura={updateFigura}
        materiasPrimas={materiasPrimas}
        corantes={corantes}
      />
    </VStack>
  );
};

const Observações: React.FC<{ figura: any ;}> = ({ figura}) => {
  const [isModalOpen, setModalOpen] = useState(false);

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };
  console.log(figura);

  return (
    <>
        {figura ? (
          <FaSearch onClick={openModal}/>
        ) : (
          ''
        )}

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <ModalOverlay />
        <ModalContent className='TableModal'>
          <ModalHeader>Observações</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
          <Table className="TableTable" sx={{ tableLayout: 'fixed' }}>
            <Thead className='LineHead'>
              <Tr>
                <Th color="white" fontSize="60%">Material</Th>
                <Th color="white" fontSize="60%">Quantidade</Th>
              </Tr>
            </Thead>
            <Tbody>
              <Tr className='Line'>
                <Td>{figura.materias_primas.nome}</Td>
                <Td>{figura.quantidade_materia_prima}</Td>
              </Tr>
            </Tbody>
            <Thead className='LineHead'>
              <Tr>
                <Th color="white" fontSize="60%">Corante</Th>
                <Th color="white" fontSize="60%">Quantidade</Th>
              </Tr>
            </Thead>
            <Tbody>
              {figura.figura_corantes.map((corante:any) => (
              <Tr className='Line'>
                <Td>{corante.corantes.nome}</Td>
                <Td>{corante.quantidade_corante}</Td>
              </Tr>
              ))}
            </Tbody>
          </Table>
            <Button onClick={() => setModalOpen(false)} className="CancelButton">Fechar</Button>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

const AddFiguraModal = ({ 
  addFigura, 
  materiasPrimas,
  corantes
}: { 
  addFigura: (figura: any) => void;
  materiasPrimas: any[];
  corantes: any[];
}) => {
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    referencia: '',
    nome: '',
    tempo_ciclo: '',
    id_materiasprima: '',
    quantidade_materia_prima: '',
    corantes: [] as { id_corante: string; quantidade_corante: string }[],
  });

  const handleAddCorante = () => {
    setFormData({
      ...formData,
      corantes: [...formData.corantes, { id_corante: '', quantidade_corante: '' }],
    });
  };

  const handleCoranteChange = (index: number, field: string, value: string) => {
    const newCorantes = [...formData.corantes];
    newCorantes[index] = { ...newCorantes[index], [field]: value };
    setFormData({ ...formData, corantes: newCorantes });
  };

  const handleRemoveCorante = (index: number) => {
    const newCorantes = formData.corantes.filter((_, i) => i !== index);
    setFormData({ ...formData, corantes: newCorantes });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addFigura({
      ...formData,
      tempo_ciclo: Number(formData.tempo_ciclo),
      quantidade_materia_prima: Number(formData.quantidade_materia_prima),
      corantes: formData.corantes.map(c => ({
        ...c,
        quantidade_corante: Number(c.quantidade_corante),
      })),
    });
    setAddModalOpen(false);
    setFormData({
      referencia: '',
      nome: '',
      tempo_ciclo: '',
      id_materiasprima: '',
      quantidade_materia_prima: '',
      corantes: [],
    });
  };

  return (
    <>
      <Button onClick={() => setAddModalOpen(true)}>Adicionar Figura</Button>

      <Modal isOpen={isAddModalOpen} onClose={() => setAddModalOpen(false)}>
        <ModalOverlay />
        <ModalContent className='TableModal'>
          <ModalHeader>Adicionar Figura</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={handleSubmit}>
              <FormControl isRequired>
                <FormLabel>Referência</FormLabel>
                <Input
                  value={formData.referencia}
                  onChange={(e) => setFormData({ ...formData, referencia: e.target.value })}
                />
              </FormControl>

              <FormControl isRequired mt={4}>
                <FormLabel>Nome</FormLabel>
                <Input
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                />
              </FormControl>

              <FormControl isRequired mt={4}>
                <FormLabel>Tempo de Ciclo</FormLabel>
                <Input
                  type="number"
                  value={formData.tempo_ciclo}
                  onChange={(e) => setFormData({ ...formData, tempo_ciclo: e.target.value })}
                />
              </FormControl>

              <FormControl isRequired mt={4}>
                <FormLabel>Matéria Prima</FormLabel>
                <Menu>
                  <MenuButton as={Button} className='TableMenu'>
                    {formData.id_materiasprima ? 
                      materiasPrimas.find(m => m.id_materiasprima === formData.id_materiasprima)?.nome : "Selecione uma Matéria Prima"}
                  </MenuButton>
                  <MenuList className='TableMenuList'>
                    {materiasPrimas.map((materiaPrima) => (
                      <MenuItem
                        className='TableMenuItem'
                        key={materiaPrima.id_materiasprima}
                        onClick={() => setFormData({ ...formData, id_materiasprima: materiaPrima.id_materiasprima })}
                      >
                        {materiaPrima.nome}
                      </MenuItem>
                    ))}
                  </MenuList>
                </Menu>
              </FormControl>

              <FormControl isRequired mt={4}>
                <FormLabel>Quantidade de Matéria Prima</FormLabel>
                <Input
                  type="number"
                  value={formData.quantidade_materia_prima}
                  onChange={(e) => setFormData({ ...formData, quantidade_materia_prima: e.target.value })}
                />
              </FormControl>

              <FormControl mt={4}>
                <FormLabel>Corantes</FormLabel>
                {formData.corantes.map((corante, index) => (
                  <Box key={index} mt={2}>
                    <HStack>
                      <Menu>
                        <MenuButton as={Button} className='TableMenuCorante' minW="45%">
                          {corante.id_corante ? 
                            corantes.find(c => c.id_corante === corante.id_corante)?.nome : 
                            "Selecione um Corante"}
                        </MenuButton>
                        <MenuList className='TableMenuList'>
                          {corantes.map((c) => (
                            <MenuItem
                              className='TableMenuItem'
                              key={c.id_corante}
                              onClick={() => handleCoranteChange(index, 'id_corante', c.id_corante)}
                            >
                              {c.nome}
                            </MenuItem>
                          ))}
                        </MenuList>
                      </Menu>
                      <NumberInput min={0}>
                        <NumberInputField

                          placeholder="Quantidade"
                          value={corante.quantidade_corante}
                          onChange={(e) => handleCoranteChange(index, 'quantidade_corante', e.target.value)}
                        />
                      </NumberInput>
                      <Button onClick={() => handleRemoveCorante(index)} className='TableMenuCorante'>
                        Remover
                      </Button>
                    </HStack>
                  </Box>
                ))}
                <Button onClick={handleAddCorante} className='TableMenu' mt="2%">
                  Adicionar Corante
                </Button>
              </FormControl>
              <Button type="submit" className="SaveButton">Salvar</Button>
              <Button onClick={() => setAddModalOpen(false )} className="CancelButton">Cancelar</Button>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

const EditFiguraModal = ({
  isOpen,
  onClose,
  figura,
  updateFigura,
  materiasPrimas,
  corantes,
}: {
  isOpen: boolean;
  onClose: () => void;
  figura: any;
  updateFigura: (figura: any) => void;
  materiasPrimas: any[];
  corantes: any[];
}) => {
  const [formData, setFormData] = useState({
    referencia: '',
    nome: '',
    tempo_ciclo: '',
    id_materiasprima: '',
    quantidade_materia_prima: '',
    corantes: [] as { id_corante: string; quantidade_corante: string }[],
  });

  useEffect(() => {
    if (figura) {
      setFormData({
        referencia: figura.referencia,
        nome: figura.nome,
        tempo_ciclo: figura.tempo_ciclo.toString(),
        id_materiasprima: figura.id_materiasprima,
        quantidade_materia_prima: figura.quantidade_materia_prima.toString(),
        corantes: figura.figura_corantes.map((fc: any) => ({
          id_corante: fc.corantes.id_corante,
          quantidade_corante: fc.quantidade_corante.toString(),
        })) || [],
      });
      console.log(formData.corantes);
    }
  }, [figura]);

  const handleAddCorante = () => {
    setFormData({
      ...formData,
      corantes: [...formData.corantes, { id_corante: '', quantidade_corante: '' }],
    });
  };

  const handleCoranteChange = (index: number, field: string, value: string) => {
    const newCorantes = [...formData.corantes];
    newCorantes[index] = { ...newCorantes[index], [field]: value };
    setFormData({ ...formData, corantes: newCorantes });
  };

  const handleRemoveCorante = (index: number) => {
    const newCorantes = formData.corantes.filter((_, i) => i !== index);
    setFormData({ ...formData, corantes: newCorantes });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFigura({
      ...formData,
      id_figura: figura.id_figura,
      tempo_ciclo: Number(formData.tempo_ciclo),
      quantidade_materia_prima: Number(formData.quantidade_materia_prima),
      corantes: formData.corantes.map(c => ({
        ...c,
        quantidade_corante: Number(c.quantidade_corante),
      })),
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent className='TableModal'>
        <ModalHeader>Editar Figura</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form onSubmit={handleSubmit}>
            <FormControl isRequired>
              <FormLabel>Referência</FormLabel>
              <Input
                value={formData.referencia}
                onChange={(e) => setFormData({ ...formData, referencia: e.target.value })}
              />
            </FormControl>

            <FormControl isRequired mt={4}>
              <FormLabel>Nome</FormLabel>
              <Input
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              />
            </FormControl>

            <FormControl isRequired mt={4}>
              <FormLabel>Tempo de Ciclo</FormLabel>
              <Input
                type="number"
                value={formData.tempo_ciclo}
                onChange={(e) => setFormData({ ...formData, tempo_ciclo: e.target.value })}
              />
            </FormControl>

            <FormControl isRequired mt={4}>
              <FormLabel>Matéria Prima</FormLabel>
              <Menu>
                <MenuButton as={Button} className='TableMenu'>
                  {formData.id_materiasprima ? 
                    materiasPrimas.find(m => m.id_materiasprima === formData.id_materiasprima)?.nome : 
                    "Selecione uma Matéria Prima"}
                </MenuButton>
                <MenuList className='TableMenuList'>
                  {materiasPrimas.map((materiaPrima) => (
                    <MenuItem
                      className='TableMenuItem'
                      key={materiaPrima.id_materiasprima}
                      onClick={() => setFormData({ ...formData, id_materiasprima: materiaPrima.id_materiasprima })}
                    >
                      {materiaPrima.nome}
                    </MenuItem>
                  ))}
                </MenuList>
              </Menu>
            </FormControl>

            <FormControl isRequired mt={4}>
              <FormLabel>Quantidade de Matéria Prima</FormLabel>
              <Input
                type="number"
                value={formData.quantidade_materia_prima}
                onChange={(e) => setFormData({ ...formData, quantidade_materia_prima: e.target.value })}
              />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Corantes</FormLabel>
              {formData.corantes.map((corante, index) => (
                <Box key={index} mt={2}>
                  <HStack>
                    <Menu>
                      <MenuButton as={Button} className='TableMenuCorante' minW="45%">
                        {corantes.find(c => c.id_corante === corante.id_corante)?.nome ?? "Selecione um Corante"}
                      </MenuButton>
                      <MenuList className='TableMenuList'>
                        {corantes.map((c) => (
                          <MenuItem
                            className='TableMenuItem'
                            key={c.id_corante}
                            onClick={() => handleCoranteChange(index, 'id_corante', c.id_corante)}
                          >
                            {c.nome}
                          </MenuItem>
                        ))}
                      </MenuList>
                    </Menu>
                    <NumberInput min={0}>
                      <NumberInputField
                      placeholder="Quantidade"
                      value={Number(corante.quantidade_corante)}
                      onChange={(e) => {
                        handleCoranteChange(index, 'quantidade_corante', e.target.value);
                      }}
                      />
                    </NumberInput>
                    <Button onClick={() => handleRemoveCorante(index)} className='TableMenuCorante'>
                      Remover
                    </Button>
                  </HStack>
                </Box>
              ))}
              <Button onClick={handleAddCorante} className='TableMenu' mt="2%">
                Adicionar Corante
              </Button>
            </FormControl>
            <Button type="submit" className="SaveButton">Editar</Button>
            <Button onClick={onClose} className="CancelButton">Cancelar</Button>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default DataFigura;