import { useToast, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, FormControl, FormLabel, Input, Button } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import axios from "axios";
import { IconInput } from "../../../../Components/ReUsable/Inputs/IconInput";
import { FaBalanceScale, FaUser } from "react-icons/fa";

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
  const showToast= useToast();
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
        showToast({
          title: "Corante editado com sucesso",
          description: "O corante foi editado com sucesso.",
          status: "success",
        });
      } else {
        await axios.post('/.netlify/functions/corantes', formData);
        showToast({
          title: "Corante criado com sucesso",
          description: "O corante foi criado com sucesso.",
          status: "success",
        });
      }
      setUpdateTable("handleSaveCorante");
      onClose();
    } catch (error) {
      if(editingCorante) {
        showToast({
          title: "Erro ao editar corante",
          description: "Não foi possível editar o corante.",
          status: "error",
        });
      } else {
        showToast({
          title: "Erro ao criar corante",
          description: "Não foi possível criar o corante.",
          status: "error",
        });
      }
    }
  };

  const handleDelete = async (id: any) => {
    try {
      await axios.delete(`/.netlify/functions/corantes/${id}`);
      showToast({
        title: "Corante eliminado com sucesso",
        description: "O corante foi eliminado com sucesso.",
        status: "success",
      });
      setUpdateTable("handleDelete");
      onClose();
    } catch (error) {
      showToast({
        title: "Erro ao eliminar corante",
        description: "Não foi possível eliminar o corante.",
        status: "error",
      });
      console.error('Error deleting corante:', error);
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
              <IconInput value={formData.nome} icon={<FaUser />} onChange={(x) => setFormData({ ...formData, nome: x ?? "" })} />
            </FormControl>

            <FormControl isRequired mt={4}>
              <FormLabel>Quantidade - Gramas</FormLabel>
              <IconInput min={0} icon={<FaBalanceScale/>} type="number" value={formData.quantidade} onChange={(x) => setFormData({ ...formData, quantidade: Number(x) ?? 0 })}/>
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
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};