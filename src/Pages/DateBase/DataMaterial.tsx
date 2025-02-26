
import { HStack } from '@chakra-ui/react';
import '../../Styles/styles.css';
import DataMateriaPrima from './DataMateriaPrima';
import DataCorante from './DataCorante';

const DataColaborador: React.FC = () => {
  return (
    <HStack >
        <DataMateriaPrima/>
        <DataCorante/>
    </HStack>
  );
};

export default DataColaborador;