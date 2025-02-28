import { useEffect, useState } from 'react';
import axios from 'axios';
import { Corante, MateriaPrima } from '../../../Interfaces/interfaces';
import { HStack } from '@chakra-ui/react';
import DataCorante from './Corantes/DataCorante';
import DataMateriaPrima from './MateriasPrimas/DataMateriaPrima';

const DataColaborador: React.FC = () => {
  const [word, setWord] = useState("");
  const [isFirstTime, setIsFirstTime] = useState(true);
  const [lowStockMateriasprima, setLowStockMateriasprima] = useState<MateriaPrima[]>([]);
  const [lowStockCorantes, setLowStockCorantes] = useState<Corante[]>([]);
  const limiteMateriasprima = 15000;
  const limiteCorantes = 15000;

  const fetchCorantes = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/corante');
      const corantesBaixos = response.data.data.filter((item: Corante) => item.quantidade < limiteCorantes);
      setLowStockCorantes(corantesBaixos); 
    } catch (error) {
      console.error('Erro ao buscar dados dos corantes:', error);
    }
  };

  const fetchMateriasPrimas = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/materiasprima');
      const materiasPrimasBaixas = response.data.data.filter((item: MateriaPrima) => item.quantidade < limiteMateriasprima);
      setLowStockMateriasprima(materiasPrimasBaixas); 
    } catch (error) {
      console.error('Erro ao buscar dados das matérias-primas:', error);
    }
  };

  const limitCheck = async () => {
    try {
      console.log('Dados enviados:', {
        lowItemsCorantes: lowStockCorantes,
        lowItemsMateriasPrimas: lowStockMateriasprima
      });

      await axios.post('http://localhost:3001/api/alert-email', {
        lowItemsCorantes: lowStockCorantes,
        lowItemsMateriasPrimas: lowStockMateriasprima
      });

      console.log('Dados enviados com sucesso!');
    } catch (error) {
      console.error('Erro ao enviar os dados para o backend:', error);
    }
  };

  useEffect(() => {
    fetchCorantes();
    fetchMateriasPrimas();
    setWord("primeira")
  }, []); 

  useEffect(() => {
    if (isFirstTime && (lowStockCorantes.length > 0 || lowStockMateriasprima.length > 0)) {
      limitCheck();
      setIsFirstTime(false);
    }
  }, [word && (lowStockCorantes || lowStockMateriasprima)]);

  return (
    <HStack width="95%" height="100%" maxW="100%" maxH="100%">
      <DataMateriaPrima/>
      <DataCorante/>
    </HStack>
  );
};

export default DataColaborador;
