import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, FormControl, FormLabel, Input, Button } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import axios from "axios";
import { ErrorModal } from "../../../Components/errorModal/errorModal";

interface MaquinaModalProps {
  onClose: () => void;
  editingMaquina: any;
  setUpdateTable: React.Dispatch<React.SetStateAction<any>>;
}

export const MaquinaModal: React.FC<MaquinaModalProps> = ({
  onClose,
  editingMaquina,
  setUpdateTable,
}) => {
  const [error, setError] = useState<any>(null);
  const [showError, setShowError] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    data_inicio: new Date().toISOString().split('T')[0],
    ultima_inspecao: new Date().toISOString().split('T')[0],
    proxima_inspecao: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    if (editingMaquina) {
      setFormData({
        nome: editingMaquina.nome,
        data_inicio: new Date(editingMaquina.data_inicio).toISOString().split('T')[0],
        ultima_inspecao: new Date(editingMaquina.ultima_inspecao).toISOString().split('T')[0],
        proxima_inspecao: new Date(editingMaquina.proxima_inspecao).toISOString().split('T')[0],
      });
    }
  }, [editingMaquina]);

  const handleSaveMaquina = async (formData: any) => {
    try {
      if (editingMaquina) {
        await axios.put(`/.netlify/functions/maquinas/${editingMaquina.id_maquina}`, formData);
      } else {
        await axios.post('/.netlify/functions/maquinas', formData);
      }
      setUpdateTable("handleSaveMaquina");
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
      await axios.delete(`/.netlify/functions/maquinas/${id}`);
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
    handleSaveMaquina(formData);
  };

  return (
    <Modal onClose={onClose} isOpen={true}>
      <ModalOverlay />
      <ModalContent className="TableModal">
        <ModalHeader>
          {editingMaquina ? 'Editar Máquina' : 'Nova Máquina'}
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

            <Button type="submit" className="SaveButton">
              {editingMaquina ? 'Salvar' : 'Criar'}
            </Button>
            <Button onClick={onClose} className="CancelButton">
              Cancelar
            </Button>
            {editingMaquina && (
              <Button
                onClick={() => handleDelete(editingMaquina.id_maquina)}
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