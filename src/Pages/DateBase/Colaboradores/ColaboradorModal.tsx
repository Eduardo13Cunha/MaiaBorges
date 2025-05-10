import { Menu, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, FormControl, FormLabel, Input, MenuButton, Button, MenuList, MenuItem } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import axios from "axios";
import { ErrorModal } from "../../../Components/errorModal/errorModal";

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
  const [error, setError] = useState<any>(null);
  const [showError, setShowError] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    idade: '',
    data_nascimento: new Date().toISOString().split('T')[0],
    email: '',
    numero: '',
    id_turno: null as number | null,
  });

  useEffect(() => {
    if (editingColaborador) {
      setFormData({
        nome: editingColaborador.nome,
        idade: editingColaborador.idade.toString(),
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
      } else {
        await axios.post('/.netlify/functions/colaboradores', formData);
      }
      setUpdateTable("handleSaveColaborador");
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
      await axios.delete(`/.netlify/functions/colaboradores/${id}`);
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
    handleSaveColaborador({
      ...formData,
      idade: Number(formData.idade),
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
              <Input
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              />
            </FormControl>

            <FormControl isRequired mt={4}>
              <FormLabel>Idade</FormLabel>
              <Input
                type="number"
                value={formData.idade}
                onChange={(e) => setFormData({ ...formData, idade: e.target.value })}
              />
            </FormControl>

            <FormControl isRequired mt={4}>
              <FormLabel>Data de Nascimento</FormLabel>
              <Input
                type="date"
                value={formData.data_nascimento}
                onChange={(e) => setFormData({ ...formData, data_nascimento: e.target.value })}
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
                type="number"
                value={formData.numero}
                onChange={(e) => setFormData({ ...formData, numero: e.target.value })}
              />
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

            <Button type="submit" className="SaveButton">
              {editingColaborador ? 'Salvar' : 'Criar'}
            </Button>
            <Button onClick={onClose} className="CancelButton">
              Cancelar
            </Button>
            {editingColaborador && (
              <Button
                onClick={() => handleDelete(editingColaborador.id_colaborador)}
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