import React, { useState, useEffect, useCallback } from 'react';
import {Box,Button,Grid,GridItem,Text,HStack,useToast,Tooltip} from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { EncomendaModal } from './EncomendaModal';
import { IoMdAdd } from 'react-icons/io';
import axios from 'axios';
import { Cliente, Encomenda, Figura } from '../../../Interfaces/interfaces';

const DataEncomenda: React.FC = () => {
  const [UpdateTable, setUpdateTable] = useState<any>("");
  const [showModal, setShowModal] = useState(false);
  const [encomendas, setEncomendas] = useState<Encomenda[]>([]);
  const [figuras, setFiguras] = useState<Figura[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [selectedCell, setSelectedCell] = useState<{figura: Figura, week: number} | null>(null);
  const [editingEncomenda, setEditingEncomenda] = useState<Encomenda | null>(null);
  const [currentWeekStart, setCurrentWeekStart] = useState(0);
  const toast = useToast();

  const fetchData = useCallback( async() => {
    try {
      const [encomendaRes, figuraRes, clienteRes] = await Promise.all([
        axios.get('/.netlify/functions/encomendas'),
        axios.get('/.netlify/functions/figuras'),
        axios.get('/.netlify/functions/clientes')
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
  }, [toast]);

  useEffect(() => {
    fetchData();
    setUpdateTable("");
  }, [UpdateTable,fetchData]);

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
        return Math.min(39, prev + 13);
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
          isDisabled={currentWeekStart === 0}/>
        <Text color="white" fontSize="xl" fontWeight="bold">
          Semanas {currentWeekStart + 1} - {currentWeekStart + 13}
        </Text>
        <Button 
          onClick={() => navigateWeeks('next')} 
          rightIcon={<ChevronRightIcon />}
          isDisabled={currentWeekStart >= 39}/>
      </HStack>

      <Grid templateColumns={`auto repeat(13, 1fr)`}>
        {/* Header row with week numbers */}
        <GridItem className="GridHead" p={2}>
          <Text color="white">Figuras</Text>
        </GridItem>
        {currentWeeks.map(week => (
          <GridItem className="GridHead" key={week} p={2} px={4}>
            <Text color="white" textAlign="center">
              Semana {week}
            </Text>
          </GridItem>
        ))}

        {/* Grid rows */}
        {figuras && figuras.map(figura => (
          <React.Fragment key={figura.id_figura}>
            <GridItem className='Line' p={2} py={5}>
              <Text color="white">{figura.nome}</Text>
            </GridItem>
            {currentWeeks.map(week => {
              const encomenda = getEncomendaForCell(figura.id_figura, week);
              return (
                <GridItem
                  key={week}
                  className={encomenda ? "GridItemWith" : "GridItem"}
                  p={2}
                  onClick={() => handleCellClick(figura, week)}
                  _hover={{ boxShadow: "0 0 10px rgba(0, 0, 0, 0.5)" }}
                >
                  {encomenda ? (
                    <Tooltip label={`Cliente: ${encomenda.clientes?.nome}\nQuantidade: ${encomenda.quantidade}`}>
                      <Text fontSize="sm" textAlign="center" >
                        {encomenda.clientes.nome}
                        <br/>
                        {encomenda.quantidade} unidades
                      </Text>
                    </Tooltip>
                  ) : (
                    <Box my="10%" mx="35%">
                      <IoMdAdd fontSize={"150%"}/>
                    </Box>
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
          setUpdateTable={setUpdateTable}
        />
      )}
    </Box>
  );
};



export default DataEncomenda;