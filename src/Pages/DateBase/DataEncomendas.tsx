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
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Grid,
  GridItem,
  Text,
  Tooltip
} from '@chakra-ui/react';
import { format, getWeek, startOfYear, addWeeks } from 'date-fns';
import axios from 'axios';

const DataEncomenda: React.FC = () => {
  const [encomendas, setEncomendas] = useState<any[]>([]);
  const [figuras, setFiguras] = useState<any[]>([]);
  const [clientes, setClientes] = useState<any[]>([]);
  const [selectedCell, setSelectedCell] = useState<{figura: any, week: number} | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEncomenda, setEditingEncomenda] = useState<any>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [encomendaRes, figuraRes, clienteRes] = await Promise.all([
        axios.get('http://localhost:3001/api/encomenda'),
        axios.get('http://localhost:3001/api/figura'),
        axios.get('http://localhost:3001/api/cliente')
      ]);
      setEncomendas(encomendaRes.data.data);
      setFiguras(figuraRes.data.data);
      setClientes(clienteRes.data.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // Generate weeks array
  const weeks = Array.from({ length: 52 }, (_, i) => i + 1);

  // Get encomendas for a specific figura and week
  const getEncomendaForCell = (figuraId: string, week: number) => {
    return encomendas.find(e => {
      const encomendaWeek = getWeek(new Date(e.data_inicio));
      return e.id_figura === figuraId && encomendaWeek === week;
    });
  };

  const handleCellClick = (figura: any, week: number) => {
    const existingEncomenda = getEncomendaForCell(figura.id_figura, week);
    setSelectedCell({ figura, week });
    setEditingEncomenda(existingEncomenda);
    setIsModalOpen(true);
  };

  const handleSaveEncomenda = async (formData: any) => {
    try {
      if (editingEncomenda) {
        // Update existing encomenda
        await axios.put(`http://localhost:3001/api/encomenda/${editingEncomenda.id_encomenda}`, formData);
      } else {
        // Create new encomenda
        await axios.post('http://localhost:3001/api/encomenda', formData);
      }
      fetchData();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving encomenda:', error);
    }
  };

  return (
    <Box overflowX="auto" p={4}>
      <Grid templateColumns={`auto repeat(${weeks.length}, minmax(100px, 1fr))`} gap={1}>
        {/* Header row with week numbers */}
        <GridItem bg="gray.700" p={2}>
          <Text color="white" fontWeight="bold">Figuras</Text>
        </GridItem>
        {weeks.map(week => (
          <GridItem key={week} bg="gray.700" p={2}>
            <Text color="white" fontWeight="bold" textAlign="center">
              Semana {week}
            </Text>
          </GridItem>
        ))}

        {/* Grid rows */}
        {figuras.map(figura => (
          <React.Fragment key={figura.id_figura}>
            <GridItem bg="gray.100" p={2}>
              <Text fontWeight="bold">{figura.nome}</Text>
            </GridItem>
            {weeks.map(week => {
              const encomenda = getEncomendaForCell(figura.id_figura, week);
              return (
                <GridItem
                  key={week}
                  bg={encomenda ? "blue.100" : "white"}
                  border="1px"
                  borderColor="gray.200"
                  p={2}
                  cursor="pointer"
                  onClick={() => handleCellClick(figura, week)}
                  _hover={{ bg: "gray.50" }}
                >
                  {encomenda && (
                    <Tooltip label={`Cliente: ${encomenda.clientes?.nome}\nQuantidade: ${encomenda.quantidade}`}>
                      <Text fontSize="sm" textAlign="center">
                        {encomenda.quantidade} unidades
                      </Text>
                    </Tooltip>
                  )}
                </GridItem>
              );
            })}
          </React.Fragment>
        ))}
      </Grid>

      {/* Add/Edit Encomenda Modal */}
      <EncomendaModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedCell={selectedCell}
        editingEncomenda={editingEncomenda}
        clientes={clientes}
        onSave={handleSaveEncomenda}
      />
    </Box>
  );
};

interface EncomendaModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCell: { figura: any; week: number } | null;
  editingEncomenda: any;
  clientes: any[];
  onSave: (formData: any) => void;
}

const EncomendaModal: React.FC<EncomendaModalProps> = ({
  isOpen,
  onClose,
  selectedCell,
  editingEncomenda,
  clientes,
  onSave
}) => {
  const [formData, setFormData] = useState({
    id_figura: '',
    id_cliente: '',
    quantidade: '',
    data_inicio: '',
    data_fim: ''
  });

  useEffect(() => {
    if (selectedCell) {
      const startDate = addWeeks(startOfYear(new Date()), selectedCell.week - 1);
      const endDate = addWeeks(startDate, 1);
      
      setFormData({
        id_figura: selectedCell.figura.id_figura,
        id_cliente: editingEncomenda?.id_cliente || '',
        quantidade: editingEncomenda?.quantidade?.toString() || '',
        data_inicio: format(startDate, 'yyyy-MM-dd'),
        data_fim: format(endDate, 'yyyy-MM-dd')
      });
    }
  }, [selectedCell, editingEncomenda]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      quantidade: Number(formData.quantidade)
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {editingEncomenda ? 'Editar Encomenda' : 'Nova Encomenda'}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form onSubmit={handleSubmit}>
            <FormControl isRequired>
              <FormLabel>Figura</FormLabel>
              <Input
                value={selectedCell?.figura.nome || ''}
                isReadOnly
              />
            </FormControl>

            <FormControl isRequired mt={4}>
              <FormLabel>Cliente</FormLabel>
              <Menu>
                <MenuButton as={Button}>
                  {formData.id_cliente
                    ? clientes.find(c => c.id_cliente === formData.id_cliente)?.nome
                    : "Selecione um Cliente"}
                </MenuButton>
                <MenuList>
                  {clientes.map(cliente => (
                    <MenuItem
                      key={cliente.id_cliente}
                      onClick={() => setFormData({ ...formData, id_cliente: cliente.id_cliente })}
                    >
                      {cliente.nome}
                    </MenuItem>
                  ))}
                </MenuList>
              </Menu>
            </FormControl>

            <FormControl isRequired mt={4}>
              <FormLabel>Quantidade</FormLabel>
              <Input
                type="number"
                value={formData.quantidade}
                onChange={(e) => setFormData({ ...formData, quantidade: e.target.value })}
              />
            </FormControl>

            <FormControl isRequired mt={4}>
              <FormLabel>Data Início</FormLabel>
              <Input
                type="date"
                value={formData.data_inicio}
                onChange={(e) => setFormData({ ...formData, data_inicio: e.target.value })}
              />
            </FormControl>

            <FormControl isRequired mt={4}>
              <FormLabel>Data Fim</FormLabel>
              <Input
                type="date"
                value={formData.data_fim}
                onChange={(e) => setFormData({ ...formData, data_fim: e.target.value })}
              />
            </FormControl>

            <Button type="submit" colorScheme="blue" mt={4}>
              {editingEncomenda ? 'Atualizar' : 'Criar'}
            </Button>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default DataEncomenda;