import { useToast, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, FormControl, FormLabel, Input, Button } from "@chakra-ui/react";
import { useState } from "react";
import axios from "axios";
import { IconInput } from "../../../Components/ReUsable/Inputs/IconInput";
import { FaUser, FaPhone } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { CreateButton, SaveButton } from "../../../Components/ReUsable/Buttons/SaveButton";
import { CancelButton } from "../../../Components/ReUsable/Buttons/CancelButton";
import { DeleteButton } from "../../../Components/ReUsable/Buttons/DeleteButton";

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
  const showToast = useToast();  
  const [formData, setFormData] = useState({
    nome: editingCliente?.nome || '',
    email: editingCliente?.email || '',
    numero: editingCliente?.numero || '',
  });

  const handleSaveCliente = async (formData: any) => {
    try {
      if (editingCliente) {
        await axios.put(`/.netlify/functions/clientes/${editingCliente.id_cliente}`, formData);
        showToast({
          title: "Cliente editado com sucesso",
          description: "O cliente foi editado com sucesso.",
          status: "success",
        });
      } else {
        await axios.post('/.netlify/functions/clientes', formData);
        showToast({
          title: "Cliente criado com sucesso",
          description: "O cliente foi criado com sucesso.",
          status: "success",
        });
      }
      setUpdateTable("handleSaveCliente");
      onClose();
    } catch (error) {
      if (editingCliente) {
        showToast({
          title: "Erro ao editar cliente",
          description: "Não foi possível editar o cliente.",
          status: "error",
        });
        console.error('Error editing cliente:', error);
      } else {
        showToast({
          title: "Erro ao criar cliente",
          description: "Não foi possível criar o cliente.",
          status: "error",
        });
        console.error('Error creating cliente:', error);
      }
    }
  };

  const handleDelete = async (id: any) => {
    try {
      await axios.delete(`/.netlify/functions/clientes/${id}`);
      showToast({
        title: "Cliente eliminado com sucesso",
        description: "O cliente foi eliminado com sucesso.",
        status: "success",
      });
      setUpdateTable("handleDelete");
      onClose();
    } catch (error) {
      showToast({
        title: "Erro ao eliminar cliente",
        description: "Não foi possível eliminar o cliente.",
        status: "error",
      });
      console.error('Error deleting cliente:', error);
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
              <IconInput value={formData.nome} icon={<FaUser />} onChange={(x) => setFormData({ ...formData, nome: x ?? "" })} />
            </FormControl>
            <FormControl isRequired mt={4}>
              <FormLabel>Email</FormLabel>
              <IconInput value={formData.email} icon={<MdEmail />} onChange={(x) => setFormData({ ...formData, email: x ?? "" })} />
            </FormControl>
            <FormControl isRequired mt={4}>
              <FormLabel>Número</FormLabel>
              <IconInput type="number" value={formData.numero.toString()} icon={<FaPhone />} onChange={(x) => setFormData({ ...formData, numero: x ?? "" })} />  
            </FormControl>
            {editingCliente ? <SaveButton type="submit"/> : <CreateButton type="submit"/>}
            <CancelButton onClick={onClose}/>
            {editingCliente && (
              <DeleteButton onClick={() => handleDelete(editingCliente.id_cliente)}/>
            )}
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};