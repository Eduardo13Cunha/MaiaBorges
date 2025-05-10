import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, FormControl, FormLabel, Input, Button } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import axios from "axios";
import { ErrorModal } from "../../../../Components/errorModal/errorModal";

interface CoranteModalProps {
  onClose: () => void;
  editingCorante: any;
  setUpdateTable: React.Dispatch<React.SetStateAction<any>>;
}

export const CoranteModal: React.FC<CoranteModalProps> = ({
  onClose,
  editingCorante,
  setUpdateTable,
}) => {
  const [error, setError] = useState<any>(null);
  const [showError, setShowError] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    quantidade: 0,
  });

  useEffect(() => {
    if (editingCorante) {
      setFormData({
        nome: editingCorante.nome,
        quantidade: editingCorante.quantidade,
      });
    }
  }, [editingCorante]);

  const handleSaveCorante = async (formData: any) => {
    try {
      if (editingCorante) {
        await axios.put(`/.netlify/functions/corantes/${editingCorante.id_corante}`, formData);
      } else {
        await axios.post('/.netlify/functions/corantes', formData);
      }
      setUpdateTable("handleSaveCorante");
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
      await axios.delete(`/.netlify/functions/corantes/${id}`);
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
    handleSaveCorante({
      ...formData,
      quantidade: Number(formData.quantidade),
    });
  };

  return (
    <Modal onClose={onClose} isOpen={true}>
      <ModalOverlay />
      <ModalContent className="TableModal">
        <ModalHeader>
          {editingCorante ? 'Editar Corante' : 'Novo Corante'}
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
              <FormLabel>Quantidade - Gramas</FormLabel>
              <Input
                type="number"
                value={formData.quantidade}
                onChange={(e) => setFormData({ ...formData, quantidade: Number(e.target.value) })}
              />
            </FormControl>

            <Button type="submit" className="SaveButton">
              {editingCorante ? 'Salvar' : 'Criar'}
            </Button>
            <Button onClick={onClose} className="CancelButton">
              Cancelar
            </Button>
            {editingCorante && (
              <Button
                onClick={() => handleDelete(editingCorante.id_corante)}
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