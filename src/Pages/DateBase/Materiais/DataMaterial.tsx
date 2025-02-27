
import { HStack } from '@chakra-ui/react';
import DataMateriaPrima from './MateriasPrimas/DataMateriaPrima';
import DataCorante from './Corantes/DataCorante';

const DataColaborador: React.FC = () => {
  return (
    <HStack width="95%" height="100%" maxW="100%" maxH="100%">
        <DataMateriaPrima/>
        <DataCorante/>
    </HStack>
  );
};

export default DataColaborador;