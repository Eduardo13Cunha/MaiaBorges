import { useState, useEffect } from 'react';
import { useToast, VStack,Box,Input,Button,Menu,MenuButton,MenuItem,MenuList,Table,Tbody,Td,Th,Thead,Tr} from '@chakra-ui/react';
import axios from 'axios';
import { Colaborador, PlanoTrabalho, Turno } from '../../../Interfaces/interfaces';
import { isLoggedIn } from '../../../Routes/validation';
import { IconInput } from '../../../Components/ReUsable/Inputs/IconInput';
import { FaCubes } from 'react-icons/fa';

const DataAcompanhamento = () => {
  const [turnos, setTurnos] = useState<any[]>([]);
  const [selectedTurno, setSelectedTurno] = useState<Turno | null>(null);
  const [colaboradores, setColaboradores] = useState<Colaborador[]>([]);
  const [planosTrabalho, setPlanosTrabalho] = useState<PlanoTrabalho[]>([]);
  const [producaoValues, setProducaoValues] = useState<{[key: string]: string}>({});
  const showToast = useToast();

  useEffect(() => {
    isLoggedIn();
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
      const data = (response.data as { data: Turno[] }).data.filter(turno => turno.id_turno !== 4);
      setTurnos(data);
    } catch (error) {
      showToast({
        title: "Erro ao carregar dados",
        description: "Não foi possível carregar os turnos.",
        status: "error",
      });
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

      const planosResponse = await axios.get('/.netlify/functions/planotrabalhos/dataplanotrabalho');
      const planosColaboradores = (planosResponse.data as { data: PlanoTrabalho[] }).data.filter(
        (plano: any) => colaboradoresTurno.some(
          (col: any) => col.id_colaborador === plano.id_colaborador
        )
      );
      setPlanosTrabalho(planosColaboradores);

      const initialValues: {[key: string]: string} = {};
      planosColaboradores.forEach((plano: any) => {
        initialValues[plano.id_planodetrabalho] = '';
      });
      setProducaoValues(initialValues);
    } catch (error) {
      showToast({
        title: "Erro ao carregar dados",
        description: "Não foi possível carregar os Dados dos Acompanhamentos.",
        status: "error",
      });
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
      Object.entries(producaoValues).map(([id_planodetrabalho, quantidade]) => {

        const plano = planosTrabalho.find(p => p.id_planodetrabalho === Number(id_planodetrabalho));

        return axios.post('/.netlify/functions/acompanhamentos', {
          id_planodetrabalho: plano?.id_planodetrabalho,
          id_maquina: plano?.id_maquina,
          id_encomenda: plano?.id_encomenda,
          id_colaborador: plano?.id_colaborador,
          quantidade_produzida: Number(quantidade),
          dia_hora: new Date().toISOString(),
        });
      });
      setProducaoValues({});
      showToast({
        title: 'Acompanhamentos Salvos',
        description: 'Acompanhamentos salvos com sucesso!',
        status: 'success',
      });
    } catch (error: any) {
      if (error?.response?.status === 400) {
        showToast({
          title: 'Erro a Salvar',
          description: 'Erro na Base de Dados.',
          status: 'error',
        });
      }
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
              <Th color="text.primary.100">Colaborador</Th>
              <Th color="text.primary.100">Encomenda</Th>
              <Th color="text.primary.100">Máquina</Th>
              <Th color="text.primary.100">Quantidade Produzida</Th>
            </Tr>
          </Thead>
          <Tbody>
            {colaboradores.length > 0 && 
              planosTrabalho.map((plano: any) => (
              <Tr className="Line" key={plano.id_planodetrabalho}>
                <Td>{plano.colaboradores.nome}</Td>
                <Td>#{plano.encomendas.id_encomenda} - {plano.encomendas.figuras.nome}</Td>
                <Td>{plano.maquinas.nome}</Td>
                <Td>
                  <IconInput min={0} icon={<FaCubes/>} type="number" value={producaoValues[plano.id_planodetrabalho]} onChange={(x) => handleProducaoChange(String(plano.id_planodetrabalho), x ?? "")}/>
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