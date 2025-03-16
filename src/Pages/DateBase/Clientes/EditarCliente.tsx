import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, FormControl, FormLabel, Input, Button, Box } from "@chakra-ui/react";
import axios from "axios";
import { useState, useEffect } from "react";
import { FaPencilAlt } from "react-icons/fa";

export const EditClienteModal: React.FC<{ setUpdateTable:React.Dispatch<React.SetStateAction<any>>; editCliente: any;}> = ({ setUpdateTable, editCliente }) => {
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [formData, setFormData] = useState({
      nome: '',
      email: '',
      numero: '',
    });

    const updateCliente = async (cliente: any) => {
        try {
          await axios.put(`/.netlify/functions/clientes/${cliente.id_cliente}`, cliente);
          setUpdateTable("updateCliente");
          setEditModalOpen(false);
        } catch (error) {
          console.error('Error updating cliente:', error);
        }
      };
  
    useEffect(() => {
      if (editCliente) {
        setFormData({
          nome: editCliente.nome,
          email: editCliente.email,
          numero: editCliente.numero,
        });
      }
    }, [editCliente]);
  
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      updateCliente({ ...editCliente, ...formData });
    };
  
    return (
    <Box>
        <FaPencilAlt cursor="pointer" onClick={() => {setEditModalOpen(true);}}/>
      <Modal isOpen={isEditModalOpen} onClose={() => {setEditModalOpen(false);}}>
        <ModalOverlay />
        <ModalContent className='TableModal'>
          <ModalHeader>Editar Cliente</ModalHeader>
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
              <Button type="submit" className="SaveButton">Editar</Button>
              <Button onClick={() => {setEditModalOpen(false);}} className="CancelButton">Cancelar</Button>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
      </Box>
    );
  };