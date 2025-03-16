import { Box, Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, FormControl, FormLabel, Input } from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";

export const AddMateriaPrimaModal: React.FC<{ setUpdateTable:React.Dispatch<React.SetStateAction<any>>}> = ({ setUpdateTable }) => {
    const [isAddModalOpen, setAddModalOpen] = useState(false);
    const [formData, setFormData] = useState<{ nome: string; quantidade: number }>({
      nome: '',
      quantidade: 0,
    });

  const addMateriaPrima = async (novamateriaPrima: any) => {
    try {
      await axios.post('/.netlify/functions/materiasprimas', novamateriaPrima);
      setUpdateTable("addMateriaPrima");
      window.location.reload();
    } catch (error) {
      console.error('Error adding materia prima:', error);
    }
  };
  
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
    };
  
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      addMateriaPrima({
        ...formData,
        quantidade: Number(formData.quantidade),
      });
      setAddModalOpen(false);
      setFormData({ nome: '', quantidade: 0 });
    };
  
    return (
      <Box>
        <Button onClick={() => setAddModalOpen(true)}>Adicionar Materia Prima</Button>
        <Modal isOpen={isAddModalOpen} onClose={() => setAddModalOpen(false)}>
          <ModalOverlay />
          <ModalContent className="TableModal">
            <ModalHeader>Adicionar Materia Prima</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <form onSubmit={handleSubmit}>
                <FormControl isRequired>
                  <FormLabel>Nome</FormLabel>
                  <Input type="text" name="nome" value={formData.nome} onChange={handleChange} />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Quantidade - KiloGramas</FormLabel>
                  <Input type="number" name="quantidade" value={formData.quantidade} onChange={handleChange} />
                </FormControl>
                <Button type="submit" className="SaveButton">Salvar</Button>
                <Button onClick={() => setAddModalOpen(false)} className="CancelButton">Cancelar</Button>
              </form>
            </ModalBody>
          </ModalContent>
        </Modal>
      </Box>
    );
  };