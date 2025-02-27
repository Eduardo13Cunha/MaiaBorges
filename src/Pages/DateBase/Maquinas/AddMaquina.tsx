import { Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, FormControl, FormLabel, Input } from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";

export const AddMaquinaModal: React.FC<{ setUpdateTable:React.Dispatch<React.SetStateAction<any>>;}> = ({ setUpdateTable }) => {
    const [isAddModalOpen, setAddModalOpen] = useState(false);
    const [formData, setFormData] = useState({
      nome: '',
      data_inicio: new Date().toISOString().split('T')[0],
      ultima_inspecao: new Date().toISOString().split('T')[0],
      proxima_inspecao: new Date().toISOString().split('T')[0],
    });


  const addMaquina = async (maquina: any) => {
    try {
      await axios.post('http://localhost:3001/api/maquina', maquina);
      setUpdateTable("addMaquina");
    } catch (error) {
      console.error('Error adding maquina:', error);
    }
  };
  
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      addMaquina(formData);
      setAddModalOpen(false);
      setFormData({
        nome: '',
        data_inicio: new Date().toISOString().split('T')[0],
        ultima_inspecao: new Date().toISOString().split('T')[0],
        proxima_inspecao: new Date().toISOString().split('T')[0],
      });
    };
  
    return (
      <>
        <Button onClick={() => setAddModalOpen(true)}>Adicionar Máquina</Button>
        <Modal isOpen={isAddModalOpen} onClose={() => setAddModalOpen(false)}>
          <ModalOverlay />
          <ModalContent className='TableModal'>
            <ModalHeader>Adicionar Máquina</ModalHeader>
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
                <Button type="submit" className="SaveButton">Salvar</Button>
                <Button onClick={() => setAddModalOpen(false )} className="CancelButton">Cancelar</Button>
              </form>
            </ModalBody>
          </ModalContent>
        </Modal>
      </>
    );
  };