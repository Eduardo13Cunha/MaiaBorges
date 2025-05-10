import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, FormControl, FormLabel, Input, Button } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import axios from "axios";
import { ErrorModal } from "../../../../Components/errorModal/errorModal";

interface MateriaPrimaModalProps {
  onClose: () => void;
  editingMateriaPrima: any;
  setUpdateTable: React.Dispatch<React.SetStateAction<any>>;
}

export const MateriaPrimaModal: React.FC<MateriaPrimaModalProps> = ({
  onClose,
  editingMateriaPrima,
  setUpdateTable,
}) => {
  const [error, setError] = useState<any>(null);
  const [showError, setShowError] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    quantidade: 0,
  });

  useEffect(() => {
    if (editingMateriaPrima) {
      setFormData({
        nome: editingMateriaPrima.nome,
        quantidade: editingMateriaPrima.quantidade,
      });
    }
  }, [editingMateriaPrima]);

  const handleSaveMateriaPrima = async (formData: any) => {
    try {
      if (editingMateriaPrima) {
        await axios.put(`/.netlify/functions/materiasprimas/${editingMateriaPrima.id_materiasprima}`, formData);
      } else {
        await axios.post('/.netlify/functions/materiasprimas', formData);
      }
      setUpdateTable("handleSaveMateriaPrima");
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
      await axios.delete(`/.netlify/functions/materiasprimas/${id}`);
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
    handleSaveMateriaPrima({
      ...formData,
      quantidade: Number(formData.quantidade),
    });
  };

  return (
    <Modal onClose={onClose} isOpen={true}>
      <ModalOverlay />
      <ModalContent className="TableModal">
        <ModalHeader>
          {editingMateriaPrima ? 'Editar Matéria Prima' : 'Nova Matéria Prima'}
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
              <FormLabel>Quantidade - KiloGramas</FormLabel>
              <Input
                type="number"
                value={formData.quantidade}
                onChange={(e) => setFormData({ ...formData, quantidade: Number(e.target.value) })}
              />
            </FormControl>

            <Button type="submit" className="SaveButton">
              {editingMateriaPrima ? 'Salvar' : 'Criar'}
            </Button>
            <Button onClick={onClose} className="CancelButton">
              Cancelar
            </Button>
            {editingMateriaPrima && (
              <Button
                onClick={() => handleDelete(editingMateriaPrima.id_materiasprima)}
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