import React from 'react';
import {Table,Modal,ModalOverlay,ModalContent,ModalHeader,ModalBody,ModalCloseButton,Text,Button,ModalFooter,Icon,Tbody,Td,Th,Thead,Tr} from '@chakra-ui/react';
import { XCircle } from 'lucide-react';

interface ErrorModalProps {
  onClose2: () => void;
  title: string;
  description: {
    [key: string]: any;
  };
}

export const ErrorModal: React.FC<ErrorModalProps> = ({
  onClose2,
  title,
  description
}) => {

  return (
    <Modal isOpen={true} onClose={onClose2} isCentered>
      <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(10px)"/>
      <ModalContent className='TableModal' minW="50%">
        <ModalHeader display="flex" alignItems="center" gap={3}>
          <Icon as={XCircle} color="red.500" boxSize={6} />
          <Text>{title}</Text>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Table className="TableTable" sx={{ tableLayout: 'fixed' }}>
            <Thead className='LineHead'>
              <Tr>
                <Th color="white" fontSize="60%">Tipo</Th>
                <Th color="white" fontSize="60%">Material</Th>
                <Th color="white" fontSize="60%">Disponível</Th>
                <Th color="white" fontSize="60%">Necessário</Th>
              </Tr>
            </Thead>
            <Tbody>
              {description.filter((materiaprima: any) => materiaprima.tipo === "Materia Prima").map((materiaprima: any) => (
                <Tr className='Line'>
                  <Td>{materiaprima.tipo}</Td>
                  <Td>{materiaprima.id}</Td>
                  <Td>{materiaprima.disponivel} KG</Td>
                  <Td>{materiaprima.necessario} KG</Td>
                </Tr>
              ))}
              {description.filter((corante: any) => corante.tipo === "Corante").map((corante: any) => (
                <Tr className='Line'>
                  <Td>{corante.tipo}</Td>
                  <Td>{corante.id}</Td>
                  <Td>{corante.disponivel} G</Td>
                  <Td>{corante.necessario} G</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </ModalBody>

        <ModalFooter>
          <Button onClick={onClose2} className='CancelButton'>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};