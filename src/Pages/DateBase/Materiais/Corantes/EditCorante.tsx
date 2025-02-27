import { Box, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, FormControl, FormLabel, Input, Button } from "@chakra-ui/react";
import axios from "axios";
import { useState, useEffect } from "react";
import { FaPencilAlt } from "react-icons/fa";

export const EditCoranteModal: React.FC<{ editCorante: any; setUpdateTable:React.Dispatch<React.SetStateAction<any>>;}> = ({ editCorante, setUpdateTable}) => {
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [formData, setFormData] = useState<{ nome: string; quantidade: number }>({
    nome: '',
    quantidade: 0,
  });

  const updateCorante = async (corante: any) => {
    try {
      await axios.put(`http://localhost:3001/api/corante/${corante.id_corante}`, corante);
      setUpdateTable("updateCorante");
    } catch (error) {
      console.error('Error updating corante:', error);
    }
  };

  useEffect(() => {
    if (editCorante) {
      setFormData({
        nome: editCorante.nome,
        quantidade: editCorante.quantidade,
      });
    }
  }, [editCorante]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const updatedCorante = {
      ...formData,
      id_corante: editCorante.id_corante,
      quantidade: Number(formData.quantidade),
    };
    await updateCorante(updatedCorante);
    setEditModalOpen(false);
  };

  return (<Box>
    <FaPencilAlt cursor="pointer" onClick={() => {setEditModalOpen(true);}}/>
    <Modal isOpen={isEditModalOpen} onClose={() => {setEditModalOpen(false);}}>
      <ModalOverlay />
      <ModalContent className="TableModal">
        <ModalHeader>Editar Corante</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form onSubmit={handleSubmit}>
            <FormControl isRequired>
              <FormLabel>Nome</FormLabel>
              <Input type="text" name="nome" value={formData.nome} onChange={(e) => setFormData({ ...formData, nome: e.target.value })} />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Quantidade</FormLabel>
              <Input type="number" name="quantidade" value={formData.quantidade} onChange={(e) => setFormData({ ...formData, quantidade: Number(e.target.value) })} />
            </FormControl>
            <Button type="submit" className="SaveButton">Editar</Button>
            <Button onClick={() => {setEditModalOpen(false);}} className="CancelButton">Cancelar</Button>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
    </Box>
  );
};