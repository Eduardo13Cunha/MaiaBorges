import { useToast, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, FormControl, FormLabel, Input, Button } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import axios from "axios";
import { FaBalanceScale, FaUser } from "react-icons/fa";
import { IconInput } from "../../../../Components/ReUsable/Inputs/IconInput";

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
  const showToast = useToast();
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
        showToast({
          title: "Matéria Prima atualizada com sucesso",
          description: "A matéria prima foi atualizada com sucesso.",
          status: "success",
        });
      } else {
        await axios.post('/.netlify/functions/materiasprimas', formData);
        showToast({
          title: "Matéria Prima criada com sucesso",
          description: "A matéria prima foi criada com sucesso.",
          status: "success",
        });
      }
      setUpdateTable("handleSaveMateriaPrima");
      onClose();
    } catch (error) {
      if (editingMateriaPrima) {
        showToast({
          title: "Erro ao atualizar matéria prima",
          description: "Não foi possível atualizar a matéria prima.",
          status: "error",
        });
      } else {
        showToast({
          title: "Erro ao criar matéria prima",
          description: "Não foi possível criar a matéria prima.",
          status: "error",
        });
      }
    }
  };

  const handleDelete = async (id: any) => {
    try {
      await axios.delete(`/.netlify/functions/materiasprimas/${id}`);
      showToast({
        title: "Matéria Prima excluída com sucesso",
        description: "A matéria prima foi excluída com sucesso.",
        status: "success",
      });
      setUpdateTable("handleDelete");
      onClose();
    } catch (error) {
      showToast({
        title: "Erro ao excluir matéria prima",
        description: "Não foi possível excluir a matéria prima.",
        status: "error",
      });
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
              <IconInput value={formData.nome} icon={<FaUser />} onChange={(x) => setFormData({ ...formData, nome: x ?? "" })} />
            </FormControl>

            <FormControl isRequired mt={4}>
              <FormLabel>Quantidade - KiloGramas</FormLabel>
              <IconInput min={0} icon={<FaBalanceScale/>} type="number" value={formData.quantidade} onChange={(x) => setFormData({ ...formData, quantidade: Number(x) ?? 0 })}/>
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
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};