import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, FormControl, FormLabel, Input, Menu, MenuButton, Button, MenuList, MenuItem, Box } from "@chakra-ui/react";
import axios from "axios";
import { useState, useEffect } from "react";
import { FaPencilAlt } from "react-icons/fa";

export const ModifyColaborador: React.FC<{ setUpdateTable:React.Dispatch<React.SetStateAction<any>>; editColaborador: any; Turnos:any[] }> = ({ setUpdateTable, editColaborador,Turnos }) => {
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [formData, setFormData] = useState<{ nome: string; idade: number; email: string; numero: number; id_turno: number }>({
      nome: '',
      idade: 0,
      email: '',
      numero: 0,
      id_turno: 0,
    });

    const updateColaborador = async (colaborador: any) => {
        try {
        const response = await axios.put(`http://localhost:3001/api/colaborador/${colaborador.id_colaborador}`, colaborador);
        if (response.data) {
            setUpdateTable("updateColaborador");
        } else {
            console.error("Resposta da API não contém dados esperados:", response.data);
        }
        } catch (error) {
        console.error('Error updating colaborador:', error);
        }
    };
  
    useEffect(() => {
      if (editColaborador) {
        setFormData({
          nome: editColaborador.nome,
          idade: editColaborador.idade,
          email: editColaborador.email,
          numero: editColaborador.numero,
          id_turno: editColaborador.id_turno,
        });
      }
    }, [editColaborador]);

    const handleMenuItemClick = (id: number) => {
      setFormData({ ...formData, id_turno: id });
    };
  
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const updatedColaborador = {
        ...formData,
        id_colaborador: editColaborador.id_colaborador,
        idade: Number(formData.idade),
        numero: Number(formData.numero),
        id_turno: Number(formData.id_turno),
      };
      await updateColaborador(updatedColaborador);
      setEditModalOpen(false);
    };
  
    return (
    <Box>
      <FaPencilAlt cursor="pointer" onClick={() => setEditModalOpen(true)} />
      <Modal isOpen={isEditModalOpen} onClose={() => setEditModalOpen(false)}>
        <ModalOverlay />
        <ModalContent className="TableModal">
          <ModalHeader>Editar Colaborador</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={handleSubmit}>
              <FormControl isRequired>
                <FormLabel>Nome</FormLabel>
                <Input type="text" name="nome" value={formData.nome} onChange={(e) => setFormData({ ...formData, nome: e.target.value })} />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Idade</FormLabel>
                <Input type="number" name="idade" value={formData.idade} onChange={(e) => setFormData({ ...formData, idade: Number(e.target.value) })} />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Email</FormLabel>
                <Input type="email" name="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Número</FormLabel>
                <Input type="number" name="numero" value={formData.numero} onChange={(e) => setFormData({ ...formData, numero: Number(e.target.value) })} />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Turno</FormLabel>
                <Menu>
                  <MenuButton as={Button} className="TableMenu">
                    {formData.id_turno !== undefined ? Turnos.find(t => t.id_turno === formData.id_turno)?.descricao : "Selecione um Turno"}
                  </MenuButton>
                  <MenuList className="TableMenuList">
                    {Turnos.map((turno) => (
                      <MenuItem className="TableMenuItem" key={turno.id_turno} onClick={() => handleMenuItemClick(turno.id_turno)}>
                        {turno.descricao}
                      </MenuItem>
                    ))}
                  </MenuList>
                </Menu>
              </FormControl>
              <Button type="submit" className="SaveButton">Editar</Button>
              <Button onClick={() => setEditModalOpen(false)} className="CancelButton">Cancelar</Button>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
      </Box>
    );
  };