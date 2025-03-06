import { Menu, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, FormControl, FormLabel, Input, MenuButton, Button, MenuList, MenuItem } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { Figura, Encomenda, Cliente } from "../../../Interfaces/interfaces";
import axios from "axios";

interface EncomendaModalProps {
  onClose: () => void;
  selectedCell: { figura: Figura; week: number } | null;
  editingEncomenda: Encomenda | null;
  clientes: Cliente[];
}

export const EncomendaModal: React.FC<EncomendaModalProps> = ({
  onClose,
  selectedCell,
  editingEncomenda,
  clientes,
}) => {
  const [formData, setFormData] = useState({
    id_figura: '',
    id_cliente: '',
    quantidade: '',
    semana: 0
  });

  useEffect(() => {
    if (selectedCell) {
      setFormData({
        id_figura: String(selectedCell.figura.id_figura),
        id_cliente: editingEncomenda?.clientes ? String(editingEncomenda.clientes) : '',
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
      <ModalContent>
        <ModalHeader>
          {editingEncomenda ? 'Editar Encomenda' : 'Nova Encomenda'}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form onSubmit={handleSubmit}>
            <FormControl isRequired>
              <FormLabel>Figura</FormLabel>
              <Input
                value={selectedCell?.figura.nome || ''}
                isReadOnly
              />
            </FormControl>

            <FormControl isRequired mt={4}>
              <FormLabel>Cliente</FormLabel>
              <Menu>
                <MenuButton as={Button}>
                  {formData.id_cliente && clientes
                    ? clientes.find(c => String(c.id_cliente) === formData.id_cliente)?.nome
                    : "Selecione um Cliente"}
                </MenuButton>
                <MenuList>
                  {clientes && clientes.map(cliente => (
                    <MenuItem
                      key={cliente.id_cliente}
                      onClick={() => setFormData({ ...formData, id_cliente: String(cliente.id_cliente) })}
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

            <FormControl isRequired mt={4}>
              <FormLabel>Semana</FormLabel>
              <Input
                type="number"
                value={formData.semana}
                isReadOnly
              />
            </FormControl>
            <Button type="submit" colorScheme="blue" mt={4} w="full">
              {editingEncomenda ? 'Atualizar' : 'Criar'}
            </Button>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};