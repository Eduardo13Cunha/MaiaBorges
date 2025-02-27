import { Box, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, FormControl, FormLabel, Input, Button } from "@chakra-ui/react";
import axios from "axios";
import { useState, useEffect } from "react";
import { FaPencilAlt } from "react-icons/fa";

export const EditMateriaPrimaModal: React.FC<{ editMateriaPrima: any; setUpdateTable:React.Dispatch<React.SetStateAction<any>> }> = ({ editMateriaPrima, setUpdateTable }) => {
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [formData, setFormData] = useState<{ nome: string; quantidade: number }>({
      nome: '',
      quantidade: 0,
    });

  const updateMateriaPrima = async (materiaPrima: any) => {
    try {
      await axios.put(`http://localhost:3001/api/materiasprima/${materiaPrima.id_materiasprima}`, materiaPrima);
      setUpdateTable("updateMateriaPrima");
    } catch (error) {
      console.error('Error updating materia prima:', error);
    }
  };
  
    useEffect(() => {
      if (editMateriaPrima) {
        setFormData({
          nome: editMateriaPrima.nome,
          quantidade: editMateriaPrima.quantidade,
        });
      }
    }, [editMateriaPrima]);
  
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const updatedMateriaPrima = {
        ...formData,
        id_materiasprima: editMateriaPrima.id_materiasprima,
        quantidade: Number(formData.quantidade),
      };
      await updateMateriaPrima(updatedMateriaPrima);
      setEditModalOpen(false);
    };
  
    return (
    <Box>
      <FaPencilAlt cursor="pointer" onClick={() => {setEditModalOpen(true);}}/>
      <Modal isOpen={isEditModalOpen} onClose={() => setEditModalOpen(false)}>
        <ModalOverlay />
        <ModalContent className="TableModal">
          <ModalHeader>Editar Materia Prima</ModalHeader>
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
              <Button onClick={() => setEditModalOpen(false)} className="CancelButton">Cancelar</Button>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
    );
  };