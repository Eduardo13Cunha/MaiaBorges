import { Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, FormControl, FormLabel, Input } from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";

export const AddClienteModal: React.FC<{ setUpdateTable:React.Dispatch<React.SetStateAction<any>>;}> = ({ setUpdateTable}) => {
    const [isAddModalOpen, setAddModalOpen] = useState(false);
    const [formData, setFormData] = useState({
      nome: '',
      email: '',
      numero: '',
    });


    const addCliente = async (cliente: any) => {
        try {
        await axios.post('/.netlify/functions/clientes', cliente);
        setUpdateTable("addCliente");
        } catch (error) {
        console.error('Error adding cliente:', error);
        }
    };
    
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      addCliente(formData);
      setAddModalOpen(false);
      setFormData({ nome: '', email: '', numero: '' });
    };
  
    return (
      <>
        <Button onClick={() => setAddModalOpen(true)}>Adicionar Cliente</Button>
  
        <Modal isOpen={isAddModalOpen} onClose={() => setAddModalOpen(false)}>
          <ModalOverlay />
          <ModalContent className='TableModal'>
            <ModalHeader>Adicionar Cliente</ModalHeader>
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
                  <FormLabel>Email</FormLabel>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </FormControl>
                <FormControl isRequired mt={4}>
                  <FormLabel>Número</FormLabel>
                  <Input
                    value={formData.numero}
                    onChange={(e) => setFormData({ ...formData, numero: e.target.value })}
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