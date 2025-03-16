import { Box, Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, FormControl, FormLabel, Input, Menu, MenuButton, MenuList, MenuItem } from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";

export const AddColaborador: React.FC<{ setUpdateTable:React.Dispatch<React.SetStateAction<any>> , Turnos: any[] }> = ({ setUpdateTable , Turnos}) => {
    const [isAddModalOpen, setAddModalOpen] = useState(false);
    const [formData, setFormData] = useState<{ nome: string; idade: number | undefined;data_nascimento:string; email: string; numero: number | undefined ; id_turno: number | undefined}>({
      nome: '',
      idade: undefined,
      data_nascimento: new Date().toISOString().split('T')[0],
      email: '',
      numero: undefined,
      id_turno: undefined,
    });

    const addColaborador = async (novocolaborador: any) => {
        try {
          await axios.post('/.netlify/functions/colaboradores', novocolaborador);
          setUpdateTable("addColaborador");
        } catch (error) {
          console.error('Error adding colaborador:', error);
        }
      };
  
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
    };
  
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      addColaborador({
        ...formData,
        idade: Number(formData.idade),
        numero: Number(formData.numero),
        id_turno: Number(formData.id_turno),
    });
      setAddModalOpen(false);
      setFormData({ nome: '', idade: undefined,data_nascimento : '',      email: '', numero: undefined, id_turno: undefined });
    };
  
    const handleMenuItemClick = (id: number, name: string) => {
      setFormData({ ...formData, id_turno: id });
    };
  
    return (
      <Box>
        <Button onClick={() => setAddModalOpen(true)}>Adicionar Colaborador</Button>
        <Modal isOpen={isAddModalOpen} onClose={() => setAddModalOpen(false)}>
          <ModalOverlay />
          <ModalContent className="TableModal">
            <ModalHeader>Adicionar Colaborador</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <form onSubmit={handleSubmit}>
                <FormControl isRequired>
                  <FormLabel>Nome</FormLabel>
                  <Input type="text" name="nome" value={formData.nome} onChange={handleChange} />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Idade</FormLabel>
                  <Input type="number" name="idade" value={formData.idade !== undefined ? formData.idade : ''} onChange={handleChange} />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Data de Nascimento</FormLabel>
                  <Input type="date" name="data_nascimento" value={formData.data_nascimento !== undefined ? formData.data_nascimento : ''} onChange={handleChange} />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Email</FormLabel>
                  <Input type="email" name="email" value={formData.email} onChange={handleChange} />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Número</FormLabel>
                  <Input type="number" name="numero" value={formData.numero !== undefined ? formData.numero : ''} onChange={handleChange} />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Turno</FormLabel>
                  <Menu>
                    <MenuButton as={Button} className="TableMenu">
                      {formData.id_turno !== undefined ? Turnos.find(t => t.id_turno === formData.id_turno)?.descricao : "Selecione um Turno"}
                    </MenuButton>
                    <MenuList className="TableMenuList">
                      {Turnos.map((turno) => (
                        <MenuItem className="TableMenuItem" key={turno.id_turno} onClick={() => handleMenuItemClick(turno.id_turno, turno.des)}>
                          {turno.descricao}
                        </MenuItem>
                      ))}
                    </MenuList>
                  </Menu>
                </FormControl>
                <Button type="submit" className="SaveButton">Salvar</Button>
                <Button onClick={() => setAddModalOpen(false )} className="CancelButton">Cancelar</Button>
              </form>
            </ModalBody>
          </ModalContent>
        </Modal>
      </Box>
    );
  };