import { useToast, Menu, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, FormControl, FormLabel, Input, MenuButton, Button, MenuList, MenuItem } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import axios from "axios";
import { IconInput } from "../../../Components/ReUsable/Inputs/IconInput";
import { FaUser, FaCalendarAlt, FaPhone, FaBabyCarriage } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { CancelButton } from "../../../Components/ReUsable/Buttons/CancelButton";
import { DeleteButton } from "../../../Components/ReUsable/Buttons/DeleteButton";
import { SaveButton, CreateButton } from "../../../Components/ReUsable/Buttons/SaveButton";

interface ColaboradorModalProps {
  onClose: () => void;
  editingColaborador: any;
  turnos: any[];
  setUpdateTable: React.Dispatch<React.SetStateAction<any>>;
}

export const ColaboradorModal: React.FC<ColaboradorModalProps> = ({
  onClose,
  editingColaborador,
  turnos,
  setUpdateTable,
}) => {    
  const showToast = useToast();  
  const [formData, setFormData] = useState({
    nome: '',
    data_nascimento: new Date().toISOString().split('T')[0],
    email: '',
    numero: '',
    id_turno: null as number | null,
  });

  useEffect(() => {
    if (editingColaborador) {
      setFormData({
        nome: editingColaborador.nome,
        data_nascimento: editingColaborador.data_nascimento,
        email: editingColaborador.email,
        numero: editingColaborador.numero.toString(),
        id_turno: editingColaborador.id_turno,
      });
    }
  }, [editingColaborador]);

  const handleSaveColaborador = async (formData: any) => {
    try {
      if (editingColaborador) {
        await axios.put(`/.netlify/functions/colaboradores/${editingColaborador.id_colaborador}`, formData);
        showToast({
          title: "Colaborador editado com sucesso",
          description: "O colaborador foi editado com sucesso.",
          status: "success",
        });
      } else {
        await axios.post('/.netlify/functions/colaboradores', formData);
        showToast({
          title: "Colaborador criado com sucesso",
          description: "O colaborador foi criado com sucesso.",
          status: "success",
        });
      }
      setUpdateTable("handleSaveColaborador");
      onClose();
    } catch (error) {
      if (editingColaborador) {
        showToast({
          title: "Erro ao editar colaborador",
          description: "Não foi possível editar o colaborador.",
          status: "error",
        });
        console.error('Error editing colaborador:', error);
      } else {
        showToast({
          title: "Erro ao criar colaborador",
          description: "Não foi possível criar o colaborador.",
          status: "error",
        });
        console.error('Error creating colaborador:', error);
      }
    }
  };

  const handleDelete = async (id: any) => {
    try {
      await axios.delete(`/.netlify/functions/colaboradores/${id}`);
      showToast({
        title: "Colaborador eliminado com sucesso",
        description: "O colaborador foi eliminado com sucesso.",
        status: "success",
      });
      setUpdateTable("handleDelete");
      onClose();
    } catch (error) {
      showToast({
        title: "Erro ao eliminar colaborador",
        description: "Não foi possível eliminar o colaborador.",
        status: "error",
      });
      console.error('Error deleting colaborador:', error);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSaveColaborador({
      ...formData,
      numero: Number(formData.numero),
    });
  };

  return (
    <Modal onClose={onClose} isOpen={true}>
      <ModalOverlay />
      <ModalContent className="TableModal">
        <ModalHeader>
          {editingColaborador ? 'Editar Colaborador' : 'Novo Colaborador'}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form onSubmit={handleSubmit}>
            <FormControl isRequired>
              <FormLabel>Nome</FormLabel>
              <IconInput value={formData.nome} icon={<FaUser />} onChange={(x) => setFormData({ ...formData, nome: x ?? "" })} />
            </FormControl>

            <FormControl isRequired mt={4}>
              <FormLabel>Data de Nascimento</FormLabel>
              <IconInput type="date" value={formData.data_nascimento} icon={<FaCalendarAlt />} onChange={(x) => setFormData({ ...formData, data_nascimento: x ?? "" })} />
            </FormControl>

            <FormControl isRequired mt={4}>
              <FormLabel>Email</FormLabel>
              <IconInput value={formData.email} icon={<MdEmail />} onChange={(x) => setFormData({ ...formData, email: x ?? "" })} />
            </FormControl>

            <FormControl isRequired mt={4}>
              <FormLabel>Número</FormLabel>
              <IconInput type="number" value={formData.numero.toString()} icon={<FaPhone />} onChange={(x) => setFormData({ ...formData, numero: x ?? "" })} />  
            </FormControl>

            <FormControl isRequired mt={4}>
              <FormLabel>Turno</FormLabel>
              <Menu>
                <MenuButton as={Button} className="TableMenu">
                  {formData.id_turno ? 
                    turnos.find(t => t.id_turno === formData.id_turno)?.descricao : 
                    "Selecione um Turno"}
                </MenuButton>
                <MenuList className="TableMenuList">
                  {turnos.map((turno) => (
                    <MenuItem
                      className="TableMenuItem"
                      key={turno.id_turno}
                      onClick={() => setFormData({ ...formData, id_turno: turno.id_turno })}
                    >
                      {turno.descricao}
                    </MenuItem>
                  ))}
                </MenuList>
              </Menu>
            </FormControl>
            {editingColaborador ? <SaveButton type="submit"/> : <CreateButton type="submit"/>}
            <CancelButton onClick={onClose}/>
            {editingColaborador && (
              <DeleteButton onClick={() => handleDelete(editingColaborador.id_colaborador)}/>
            )}
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};