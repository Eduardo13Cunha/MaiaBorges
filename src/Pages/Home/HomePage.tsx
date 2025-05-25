import { useState, useEffect } from 'react';
import { Text, VStack, Box, Table, Thead, Tbody, Tr, Th, Td, useToast } from '@chakra-ui/react';
import axios from 'axios';
import Cookies from 'js-cookie';

const HomePage = () => {
  const showToast = useToast();
  const [planos, setPlano] = useState<any[]>([]);
  const userId = Cookies.get('userId');

  useEffect(() => {   
    const fetchData = async () => {
      try {
        const response = await axios.get('/.netlify/functions/planotrabalhos/dataplanotrabalho');
        console.log(response);
        const planoFiltrado=(response.data.data).filter((item: { id_colaborador: number | undefined; }) => item.id_colaborador === Number(userId));
        setPlano(planoFiltrado);

      } catch (error) {
        showToast({
          title: "Erro ao buscar dados",
          description: "Não foi possível buscar os dados.",
          status: "error",
        });
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [userId]);

  return (
    <VStack alignItems="center">
      {planos.length>0 ? (
      <Box className="TableBox" mt="5%">
        <Text fontSize="2xl" fontWeight="bold" color="text.primary.100" mb="2%">
          PLANOS DE TRABALHO ATRIBUIDOS
        </Text>
        <Table className="TableTable" sx={{ tableLayout: 'fixed' }}>
          <Thead className='LineHead'>
            <Tr>
              <Th color="white">Máquina</Th>
              <Th color="white">Encomenda</Th>
              <Th color="white">Tempo Conclusão</Th>
              <Th color="white">Quantidade</Th>
              <Th color="white">Semana</Th>
              <Th color="white">Falta</Th>
            </Tr>
          </Thead>
          <Tbody>
            {planos.map((plano) => (
              <Tr key={plano.id_planodetrabalho} className="Line">
                <Td>{plano.maquinas?.nome || '-'}</Td>
                <Td>#{plano.id_encomenda} - {plano.encomendas?.figuras?.nome || '-'}</Td>
                <Td>{plano.tempo_conclusao}</Td>
                <Td>{plano.quantidade}</Td>
                <Td>{plano.semana}</Td>
                <Td>{plano.quantidade_falta}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
      ) : (
        <Box mt="15%" color="text.primary.100">
          <Text fontWeight="bold" fontSize="4xl">Nenhum Plano de Trabalho Atribuído</Text>
        </Box>
      )}
    </VStack>
  );
};

export default HomePage;