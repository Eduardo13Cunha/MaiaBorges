import { useState, useEffect } from 'react';
import {VStack,Box,Input,Button,Menu,MenuButton,MenuItem,MenuList,Table,Tbody,Td,Th,Thead,Tr} from '@chakra-ui/react';
import axios from 'axios';
import { Acompanhamento, Colaborador, PlanoTrabalho, Turno } from '../../../Interfaces/interfaces';

const DataAcompanhamento = () => {
  const [turnos, setTurnos] = useState<any[]>([]);
  const [selectedTurno, setSelectedTurno] = useState<Turno | null>(null);
  const [colaboradores, setColaboradores] = useState<Colaborador[]>([]);
  const [planosTrabalho, setPlanosTrabalho] = useState<PlanoTrabalho[]>([]);
  const [producaoValues, setProducaoValues] = useState<{[key: string]: string}>({});

  useEffect(() => {
    fetchTurnos();
  }, []);

  useEffect(() => {
    if (selectedTurno) {
      fetchColaboradoresByTurno(selectedTurno.id_turno);
    }
  }, [selectedTurno]);

  const fetchTurnos = async () => {
    try {
      const response = await axios.get('/.netlify/functions/turnos');
      const data = response.data as { data: Acompanhamento[] };
      setTurnos(data.data);
    } catch (error) {
      console.error('Error fetching turnos:', error);
    }
  };

  const fetchColaboradoresByTurno = async (turnoId: number) => {
    try {
      const response = await axios.get('/.netlify/functions/colaboradores');
      const data = response.data as { data: Colaborador[] };
      const colaboradoresTurno = data.data.filter(
        (col: Colaborador) => col.id_turno === turnoId
      );
      setColaboradores(colaboradoresTurno);

      // Fetch planos de trabalho for these colaboradores
      const planosResponse = await axios.get('/.netlify/functions/planotrabalhos');
      const planosColaboradores = (planosResponse.data as { data: PlanoTrabalho[] }).data.filter(
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
      Object.entries(producaoValues).map(([planoId, quantidade]) => {

        const plano = planosTrabalho.find(p => p.id === Number(planoId));

        console.log(planosTrabalho.find(p => p.id === Number(planoId)));

        return axios.post('/.netlify/functions/acompanhamentos', {
          planotrabalho_id: planoId,
          maquina_id: plano?.maquina_id,
          encomenda_id: plano?.encomenda_id,
          id_colaborador: plano?.id_colaborador,
          quantidade_produzida: Number(quantidade)
        });
      });
      // Reset form
      setProducaoValues({});
      alert('Acompanhamentos salvos com sucesso!');
    } catch (error) {
      console.error('Error saving acompanhamentos:', error);
      alert('Erro ao salvar acompanhamentos');
    }
  };

  return (
    <VStack alignItems="center">
      <Box className="TableBox">
        <Menu> 
          <MenuButton as={Button} mt="2%" ml="15%" mr="41.3%" className="TableSearchMenuButton" >
                {selectedTurno ? selectedTurno.descricao : "Selecione um Turno"}
          </MenuButton>
          <MenuList className="TableSearchMenuList">
                <MenuItem className="TableSearchMenuItem" onClick={() => setSelectedTurno(null)}>Selecione um Turno</MenuItem>
            {turnos.map(turno => (
              <MenuItem className="TableSearchMenuItem" key={turno.id_turno} onClick={() => setSelectedTurno(turno)}>
                {turno.descricao}
              </MenuItem>
            ))}
          </MenuList>
        </Menu>
        <Button className='SaveButton' onClick={handleSave} isDisabled={Object.values(producaoValues).every(v => !v)}>Salvar Acompanhamentos</Button>
        <Table className="TableTable" sx={{ tableLayout: 'fixed' }}>
          <Thead className="LineHead">
            <Tr>
              <Th color="white">Colaborador</Th>
              <Th color="white">Encomenda</Th>
              <Th color="white">Máquina</Th>
              <Th color="white">Quantidade Produzida</Th>
            </Tr>
          </Thead>
          <Tbody>
            {colaboradores.length > 0 && 
              planosTrabalho.map((plano: any) => (
              <Tr className="Line" key={plano.id}>
                <Td>{plano.colaboradores.nome}</Td>
                <Td>{plano.encomendas.figuras.nome}</Td>
                <Td>{plano.maquinas.nome}</Td>
                <Td>
                  <Input
                    type="number"
                    value={producaoValues[plano.id] || ''}
                    onChange={(e) => handleProducaoChange(String(plano.id), e.target.value)}
                    placeholder="Quantidade"
                  />
                </Td>
              </Tr>
              ))
            }
          </Tbody>
        </Table>
      </Box>
    </VStack>
  );
};

export default DataAcompanhamento;