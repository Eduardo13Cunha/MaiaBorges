import { Menu, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, FormControl, FormLabel, Input, MenuButton, Button, MenuList, MenuItem } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { Figura, Encomenda, Cliente } from "../../../Interfaces/interfaces";
import axios from "axios";

interface EncomendaModalProps {
  onClose: () => void;
  selectedCell: { figura: Figura; week: number } | null;
  editingEncomenda: Encomenda | null;
  clientes: Cliente[];
  setUpdateTable:React.Dispatch<React.SetStateAction<any>>;
}

export const EncomendaModal: React.FC<EncomendaModalProps> = ({
  onClose,
  selectedCell,
  editingEncomenda,
  clientes,
  setUpdateTable,
}) => {
  const [formData, setFormData] = useState({
    id_figura: '',
    id_cliente: null as number | null,
    quantidade: '',
    semana: 0
  });

  useEffect(() => {
    if (selectedCell) {
      console.log(editingEncomenda);
      setFormData({
        id_figura: String(selectedCell.figura.id_figura),
        id_cliente: editingEncomenda?.clientes ? editingEncomenda.clientes.id_cliente : null,
        quantidade: editingEncomenda?.quantidade?.toString() || '',
        semana: selectedCell.week,
      });
    }
  }, [selectedCell, editingEncomenda]);

  const handleSaveEncomenda = async (formData: any) => {
    console.log(formData);
    try {
      if (editingEncomenda) {
        await axios.put(`http://localhost:3001/api/encomenda/${editingEncomenda.id_encomenda}`, formData);
      } else {
        await axios.post('http://localhost:3001/api/encomenda', formData);
      }
      setUpdateTable("handleSaveEncomenda");
      onClose();
    } catch (error) {
      console.error('Error saving encomenda:', error);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSaveEncomenda({
      ...formData,
      quantidade: Number(formData.quantidade),
      semana: Number(formData.semana)
    });
  };

  return (
    <Modal onClose={onClose} isOpen={true}>
      <ModalOverlay />
      <ModalContent className="TableModal">
        <ModalHeader>
          {editingEncomenda ? 'Editar Encomenda' : 'Nova Encomenda'}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form onSubmit={handleSubmit}>
            <FormControl>
              <FormLabel><strong>Figura</strong> - {selectedCell?.figura.nome}</FormLabel>
              <FormLabel><strong>Semana</strong> - {selectedCell?.week}</FormLabel>
            </FormControl>

            <FormControl isRequired mt={4}>
              <FormLabel>Cliente</FormLabel>
              <Menu>
                <MenuButton as={Button} className='TableMenu'>
                  {formData.id_cliente && clientes
                    ? clientes.find(c => c.id_cliente === formData.id_cliente)?.nome
                    : "Selecione um Cliente"}
                </MenuButton>
                <MenuList className="TableMenuList">
                  {clientes && clientes.map(cliente => (
                    <MenuItem className="TableMenuItem"
                      key={cliente.id_cliente}
                      onClick={() => setFormData({ ...formData, id_cliente: cliente.id_cliente })}
                    >
                      {cliente.nome}
                    </MenuItem>
                  ))}
                </MenuList>
              </Menu>
            </FormControl>

            <FormControl isRequired mt={4}>
              <FormLabel>Quantidade</FormLabel>
              <Input
                type="number"
                value={formData.quantidade}
                onChange={(e) => setFormData({ ...formData, quantidade: e.target.value })}
              />
            </FormControl>

            <Button type="submit" className="SaveButton">{editingEncomenda ? 'Salvar' : 'Criar'}</Button>
            <Button onClick={onClose} className="CancelButton">Cancelar</Button>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};