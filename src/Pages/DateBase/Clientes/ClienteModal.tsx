import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, FormControl, FormLabel, Input, Button } from "@chakra-ui/react";
import { useState } from "react";
import axios from "axios";
import { ErrorModal } from "../../../Components/errorModal/errorModal";

interface ClienteModalProps {
  onClose: () => void;
  editingCliente: any;
  setUpdateTable: React.Dispatch<React.SetStateAction<any>>;
}

export const ClienteModal: React.FC<ClienteModalProps> = ({
  onClose,
  editingCliente,
  setUpdateTable,
}) => {
  const [error, setError] = useState<any>(null);
  const [showError, setShowError] = useState(false);
  const [formData, setFormData] = useState({
    nome: editingCliente?.nome || '',
    email: editingCliente?.email || '',
    numero: editingCliente?.numero || '',
  });

  const handleSaveCliente = async (formData: any) => {
    try {
      if (editingCliente) {
        await axios.put(`/.netlify/functions/clientes/${editingCliente.id_cliente}`, formData);
      } else {
        await axios.post('/.netlify/functions/clientes', formData);
      }
      setUpdateTable("handleSaveCliente");
      onClose();
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setError(error);
        setShowError(true);
      } else {
        alert('An unexpected error occurred');
      }
    }
  };

  const handleDelete = async (id: any) => {
    try {
      await axios.delete(`/.netlify/functions/clientes/${id}`);
      setUpdateTable("handleDelete");
      onClose();
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setError(error);
        setShowError(true);
      } else {
        alert('An unexpected error occurred');
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSaveCliente(formData);
  };

  return (
    <Modal onClose={onClose} isOpen={true}>
      <ModalOverlay />
      <ModalContent className="TableModal">
        <ModalHeader>
          {editingCliente ? 'Editar Cliente' : 'Novo Cliente'}
        </ModalHeader>
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
            <Button type="submit" className="SaveButton">
              {editingCliente ? 'Salvar' : 'Criar'}
            </Button>
            <Button onClick={onClose} className="CancelButton">
              Cancelar
            </Button>
            {editingCliente && (
              <Button
                onClick={() => handleDelete(editingCliente.id_cliente)}
                ml="55.4%"
                mt="2%"
                color="white"
                bgColor="Red"
              >
                Eliminar
              </Button>
            )}
          </form>
          {showError && (
            <ErrorModal
              onClose2={() => setShowError(false)}
              title={error.response.data.error}
              description={error.response.data.details}
            />
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};