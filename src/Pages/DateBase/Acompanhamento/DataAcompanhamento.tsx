import { useState, useEffect } from 'react';
import {
  VStack,
  Box,
  FormControl,
  FormLabel,
  Select,
  Grid,
  GridItem,
  Input,
  Button,
  Text,
  Flex
} from '@chakra-ui/react';
import axios from 'axios';
import React from 'react';

const DataAcompanhamento = () => {
  const [turnos, setTurnos] = useState<any[]>([]);
  const [selectedTurno, setSelectedTurno] = useState<string>('');
  const [colaboradores, setColaboradores] = useState<any[]>([]);
  const [planosTrabalho, setPlanosTrabalho] = useState<any[]>([]);
  const [producaoValues, setProducaoValues] = useState<{[key: string]: string}>({});

  useEffect(() => {
    fetchTurnos();
  }, []);

  useEffect(() => {
    if (selectedTurno) {
      fetchColaboradoresByTurno(selectedTurno);
    }
  }, [selectedTurno]);

  const fetchTurnos = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/turno');
      setTurnos(response.data.data);
    } catch (error) {
      console.error('Error fetching turnos:', error);
    }
  };

  const fetchColaboradoresByTurno = async (turnoId: string) => {
    try {
      const response = await axios.get('http://localhost:3001/api/colaborador');
      const colaboradoresTurno = response.data.data.filter(
        (col: any) => col.id_turno === turnoId
      );
      setColaboradores(colaboradoresTurno);

      // Fetch planos de trabalho for these colaboradores
      const planosResponse = await axios.get('http://localhost:3001/api/planotrabalho');
      const planosColaboradores = planosResponse.data.data.filter(
        (plano: any) => colaboradoresTurno.some(
          (col: any) => col.id_colaborador === plano.id_colaborador
        )
      );
      setPlanosTrabalho(planosColaboradores);

      // Initialize producao values
      const initialValues: {[key: string]: string} = {};
      planosColaboradores.forEach((plano: any) => {
        initialValues[plano.id] = '';
      });
      setProducaoValues(initialValues);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleProducaoChange = (planoId: string, value: string) => {
    setProducaoValues(prev => ({
      ...prev,
      [planoId]: value
    }));
  };

  const handleSave = async () => {
    try {
      // Create acompanhamento records for each plano
      const promises = Object.entries(producaoValues).map(([planoId, quantidade]) => {
        if (!quantidade) return null;

        const plano = planosTrabalho.find(p => p.id === planoId);
        if (!plano) return null;

        return axios.post('http://localhost:3001/api/acompanhamento', {
          maquina_id: plano.maquina_id,
          encomenda_id: plano.encomenda_id,
          id_colaborador: plano.id_colaborador,
          quantidade_produzida: Number(quantidade)
        });
      });

      await Promise.all(promises.filter(Boolean));

      // Reset form
      setProducaoValues({});
      alert('Acompanhamentos salvos com sucesso!');
    } catch (error) {
      console.error('Error saving acompanhamentos:', error);
      alert('Erro ao salvar acompanhamentos');
    }
  };

  return (
    <VStack spacing={6} align="stretch" p={6}>
      <FormControl>
        <FormLabel>Selecione o Turno</FormLabel>
        <Select
          value={selectedTurno}
          onChange={(e) => setSelectedTurno(e.target.value)}
          placeholder="Selecione um turno"
        >
          {turnos.map(turno => (
            <option key={turno.id_turno} value={turno.id_turno}>
              {turno.descricao}
            </option>
          ))}
        </Select>
      </FormControl>

      {colaboradores.length > 0 && (
        <Box borderWidth={1} borderRadius="lg" p={4}>
          <Grid templateColumns="repeat(3, 1fr)" gap={6}>
            <GridItem colSpan={1}>
              <Text fontWeight="bold">Colaborador</Text>
            </GridItem>
            <GridItem colSpan={1}>
              <Text fontWeight="bold">Plano de Trabalho</Text>
            </GridItem>
            <GridItem colSpan={1}>
              <Text fontWeight="bold">Quantidade Produzida</Text>
            </GridItem>

            {planosTrabalho.map(plano => (
              <React.Fragment key={plano.id}>
                <GridItem colSpan={1}>
                  <Text>{plano.colaboradores?.nome}</Text>
                </GridItem>
                <GridItem colSpan={1}>
                  <Text>
                    {plano.maquinas?.nome} - {plano.encomendas?.figuras?.nome}
                  </Text>
                </GridItem>
                <GridItem colSpan={1}>
                  <Input
                    type="number"
                    value={producaoValues[plano.id] || ''}
                    onChange={(e) => handleProducaoChange(plano.id, e.target.value)}
                    placeholder="Quantidade"
                  />
                </GridItem>
              </React.Fragment>
            ))}
          </Grid>

          <Flex justify="flex-end" mt={4}>
            <Button
              colorScheme="blue"
              onClick={handleSave}
              isDisabled={Object.values(producaoValues).every(v => !v)}
            >
              Salvar Acompanhamentos
            </Button>
          </Flex>
        </Box>
      )}
    </VStack>
  );
};

export default DataAcompanhamento;