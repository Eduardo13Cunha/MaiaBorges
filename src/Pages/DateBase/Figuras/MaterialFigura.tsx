import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, Table, Thead, Tr, Th, Tbody, Td, Button } from "@chakra-ui/react";
import { useState } from "react";
import { FaSearch } from "react-icons/fa";

export const Observações: React.FC<{ figura: any ;}> = ({ figura}) => {
  const [isModalOpen, setModalOpen] = useState(false);

  return (
    <>
        {figura ? (
          <FaSearch onClick={() => {setModalOpen(true);}}/>
        ) : (
          ''
        )}

      <Modal isOpen={isModalOpen} onClose={() => {setModalOpen(false);}}>
        <ModalOverlay />
        <ModalContent className='TableModal'>
          <ModalHeader>Observações</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
          <Table className="TableTable" sx={{ tableLayout: 'fixed' }}>
            <Thead className='LineHead'>
              <Tr>
                <Th color="white" fontSize="60%">Material</Th>
                <Th color="white" fontSize="60%">Quantidade</Th>
              </Tr>
            </Thead>
            <Tbody>
              <Tr className='Line'>
                <Td>{figura.materias_primas.nome}</Td>
                <Td>{figura.quantidade_materia_prima}</Td>
              </Tr>
            </Tbody>
            <Thead className='LineHead'>
              <Tr>
                <Th color="white" fontSize="60%">Corante</Th>
                <Th color="white" fontSize="60%">Quantidade</Th>
              </Tr>
            </Thead>
            <Tbody>
              {figura.figura_corantes.map((corante:any) => (
              <Tr className='Line'>
                <Td>{corante.corantes.nome}</Td>
                <Td>{corante.quantidade_corante}</Td>
              </Tr>
              ))}
            </Tbody>
          </Table>
            <Button onClick={() => setModalOpen(false)} className="CancelButton">Fechar</Button>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};