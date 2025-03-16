import { Box, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, FormControl, FormLabel, Input, Button } from "@chakra-ui/react";
import axios from "axios";
import { useState, useEffect } from "react";
import { FaPencilAlt } from "react-icons/fa";

export const EditMaquinaModal: React.FC<{ setUpdateTable:React.Dispatch<React.SetStateAction<any>>; editMaquina: any;}> = ({ setUpdateTable, editMaquina }) => {
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [formData, setFormData] = useState({
    nome: '',
    data_inicio: '',
    ultima_inspecao: '',
    proxima_inspecao: '',
  });

  const updateMaquina = async (maquina: any) => {
    try {
      await axios.put(`/.netlify/functions/maquinas/${maquina.id_maquina}`, maquina);
      setUpdateTable("updateMaquina");
      setEditModalOpen(false);
    } catch (error) {
      console.error('Error updating maquina:', error);
    }
  };

  useEffect(() => {
    if (editMaquina) {
      setFormData({
        nome: editMaquina.nome,
        data_inicio: new Date(editMaquina.data_inicio).toISOString().split('T')[0],
        ultima_inspecao: new Date(editMaquina.ultima_inspecao).toISOString().split('T')[0],
        proxima_inspecao: new Date(editMaquina.proxima_inspecao).toISOString().split('T')[0],
      });
    }
  }, [editMaquina]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMaquina({
      ...formData,
      id_maquina: editMaquina.id_maquina,
    });
  };

  return (
    <Box>
    <FaPencilAlt cursor="pointer" onClick={() => {setEditModalOpen(true);}}/>
    <Modal isOpen={isEditModalOpen} onClose={() => {setEditModalOpen(false);}}>
      <ModalOverlay />
      <ModalContent className='TableModal'>
        <ModalHeader>Editar Máquina</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form onSubmit={handleSubmit}>
            <FormControl isRequired>
              <FormLabel>Nome</FormLabel>
              <Input
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              />
            </FormControl>

            <FormControl isRequired mt={4}>
              <FormLabel>Data de Início</FormLabel>
              <Input
                type="date"
                value={formData.data_inicio}
                onChange={(e) => setFormData({ ...formData, data_inicio: e.target.value })}
              />
            </FormControl>

            <FormControl isRequired mt={4}>
              <FormLabel>Última Inspeção</FormLabel>
              <Input
                type="date"
                value={formData.ultima_inspecao}
                onChange={(e) => setFormData({ ...formData, ultima_inspecao: e.target.value })}
              />
            </FormControl>

            <FormControl isRequired mt={4}>
              <FormLabel>Próxima Inspeção</FormLabel>
              <Input
                type="date"
                value={formData.proxima_inspecao}
                onChange={(e) => setFormData({ ...formData, proxima_inspecao: e.target.value })}
              />
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