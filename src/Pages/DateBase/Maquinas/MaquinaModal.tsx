import { useToast, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, FormControl, FormLabel, Input, Button } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import axios from "axios";
import { IconInput } from "../../../Components/ReUsable/Inputs/IconInput";
import { FaUser, FaCalendarAlt } from "react-icons/fa";

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
  const showToast = useToast();
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
        showToast({
          title: "Máquina atualizada com sucesso",
          description: "A máquina foi atualizada com sucesso.",
          status: "success",
        });
      } else {
        await axios.post('/.netlify/functions/maquinas', formData);
        showToast({
          title: "Máquina criada com sucesso",
          description: "A máquina foi criada com sucesso.",
          status: "success",
        });
      }
      setUpdateTable("handleSaveMaquina");
      onClose();
    } catch (error) {
      if (editingMaquina) {
        showToast({
          title: "Erro ao atualizar máquina",
          description: "Não foi possível atualizar a máquina.",
          status: "error",
        });
      } else {
        showToast({
          title: "Erro ao criar máquina",
          description: "Não foi possível criar a máquina.",
          status: "error",
        });
      }
    }
  };

  const handleDelete = async (id: any) => {
    try {
      await axios.delete(`/.netlify/functions/maquinas/${id}`);
      showToast({
        title: "Máquina excluída com sucesso",
        description: "A máquina foi excluída com sucesso.",
        status: "success",
      });
      setUpdateTable("handleDelete");
      onClose();
    } catch (error) {
      showToast({
        title: "Erro ao excluir máquina",
        description: "Não foi possível excluir a máquina.",
        status: "error",
      });
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
              <IconInput value={formData.nome} icon={<FaUser />} onChange={(x) => setFormData({ ...formData, nome: x ?? "" })} />
            </FormControl>

            <FormControl isRequired mt={4}>
              <FormLabel>Data de Início</FormLabel>
              <IconInput type="date" value={formData.data_inicio} icon={<FaCalendarAlt />} onChange={(x) => setFormData({ ...formData, data_inicio: x ?? "" })} />
            </FormControl>

            <FormControl isRequired mt={4}>
              <FormLabel>Última Inspeção</FormLabel>
              <IconInput type="date" value={formData.ultima_inspecao} icon={<FaCalendarAlt />} onChange={(x) => setFormData({ ...formData, ultima_inspecao: x ?? "" })} />
            </FormControl>

            <FormControl isRequired mt={4}>
              <FormLabel>Próxima Inspeção</FormLabel>
              <IconInput type="date" value={formData.proxima_inspecao} icon={<FaCalendarAlt />} onChange={(x) => setFormData({ ...formData, proxima_inspecao: x ?? "" })} />
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
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};