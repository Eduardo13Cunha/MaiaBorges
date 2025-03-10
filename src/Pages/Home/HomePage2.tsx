import { useState, useEffect } from 'react';
import { VStack, Box, Table, Thead, Tbody, Tr, Th, Td, Input } from '@chakra-ui/react';
import axios from 'axios';
import Cookies from 'js-cookie';

const DataPlanoTrabalho = () => {
  const [planos, setPlano] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const userId = Cookies.get('userId');

  useEffect(() => {   
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/planotrabalho');
        const planoFiltrado=(response.data.data).filter((item: { id_colaborador: number | undefined; }) => item.id_colaborador === Number(userId));
        setPlano(planoFiltrado);

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [userId]);

  return (
    <VStack alignItems="center">
      {planos.length>0 && (
      <Box className="TableBox">
        <Input
          placeholder="Pesquisar por máquina, colaborador, figura ou semana"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className='TableSearchInput'
        />
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
              <Tr key={plano.id} className="Line">
                <Td>{plano.maquinas?.nome || '-'}</Td>
                <Td>{plano.encomendas?.figuras?.nome || '-'}</Td>
                <Td>{plano.tempo_conclusao}</Td>
                <Td>{plano.quantidade}</Td>
                <Td>{plano.semana}</Td>
                <Td>{plano.quantidade_falta}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
      )}
    </VStack>
  );
};

export default DataPlanoTrabalho;