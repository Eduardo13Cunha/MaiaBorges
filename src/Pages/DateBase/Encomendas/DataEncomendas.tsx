import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Grid,
  GridItem,
  Text,
  HStack,
  useToast,
  Tooltip
} from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { EncomendaModal } from './EncomendaModal';
import axios from 'axios';
import { Cliente, Encomenda, Figura } from '../../../Interfaces/interfaces';

const DataEncomenda: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [encomendas, setEncomendas] = useState<Encomenda[]>([]);
  const [figuras, setFiguras] = useState<Figura[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [selectedCell, setSelectedCell] = useState<{figura: Figura, week: number} | null>(null);
  const [editingEncomenda, setEditingEncomenda] = useState<Encomenda | null>(null);
  const [currentWeekStart, setCurrentWeekStart] = useState(0);
  const toast = useToast();

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
      
      setEncomendas(encomendaRes.data.data || []);
      setFiguras(figuraRes.data.data || []);
      setClientes(clienteRes.data.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Erro ao carregar dados",
        description: "Não foi possível carregar os dados necessários.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const getEncomendaForCell = (figuraId: number, week: number) => {
    return encomendas.find(e => e.figuras.id_figura === figuraId && e.semana === week);
  };

  const handleCellClick = (figura: Figura, week: number) => {
    const existingEncomenda = getEncomendaForCell(figura.id_figura, week);
    setSelectedCell({ figura, week });
    setEditingEncomenda(existingEncomenda || null);
    setShowModal(true);
  };

  const navigateWeeks = (direction: 'prev' | 'next') => {
    setCurrentWeekStart(prev => {
      if (direction === 'prev') {
        return Math.max(0, prev - 13);
      } else {
        return Math.min(48, prev + 13);
      }
    });
  };

  const currentWeeks = Array.from({ length: 13 }, (_, i) => currentWeekStart + i + 1);

  return (
    <Box overflowX="auto" p={4}>
      <HStack justify="center" mb={4} spacing={4}>
        <Button 
          onClick={() => navigateWeeks('prev')} 
          leftIcon={<ChevronLeftIcon />}
          isDisabled={currentWeekStart === 0}
        >
          Semanas Anteriores
        </Button>
        <Text fontSize="xl" fontWeight="bold">
          Semanas {currentWeekStart + 1} - {currentWeekStart + 13}
        </Text>
        <Button 
          onClick={() => navigateWeeks('next')} 
          rightIcon={<ChevronRightIcon />}
          isDisabled={currentWeekStart >= 48}
        >
          Próximas Semanas
        </Button>
      </HStack>

      <Grid templateColumns={`auto repeat(13, 1fr)`} gap={1}>
        {/* Header row with week numbers */}
        <GridItem bg="gray.700" p={2}>
          <Text color="white" fontWeight="bold">Figuras</Text>
        </GridItem>
        {currentWeeks.map(week => (
          <GridItem key={week} bg="gray.700" p={2}>
            <Text color="white" fontWeight="bold" textAlign="center">
              Semana {week}
            </Text>
          </GridItem>
        ))}

        {/* Grid rows */}
        {figuras && figuras.map(figura => (
          <React.Fragment key={figura.id_figura}>
            <GridItem bg="gray.100" p={2}>
              <Text fontWeight="bold">{figura.nome}</Text>
            </GridItem>
            {currentWeeks.map(week => {
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
                      <Text fontSize="sm" textAlign="center" >
                        {encomenda.clientes.nome}
                        <br/>
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
      {showModal && (
        <EncomendaModal
          selectedCell={selectedCell}
          editingEncomenda={editingEncomenda}
          clientes={clientes}
          onClose={() => setShowModal(false)} // Add an onClose to close the modal
        />
      )}
    </Box>
  );
};



export default DataEncomenda;