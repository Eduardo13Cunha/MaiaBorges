import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, FormControl, FormLabel, Input, Menu, MenuButton, Button, MenuList, MenuItem, Box } from "@chakra-ui/react";
import axios from "axios";
import { useState, useEffect } from "react";
import { FaPencilAlt } from "react-icons/fa";

export const EditAcompanhamentoModal: React.FC<{ 
  setUpdateTable: React.Dispatch<React.SetStateAction<any>>;
  editAcompanhamento: any;
  maquinas: any[];
  encomendas: any[];
  colaboradores: any[];
}> = ({ setUpdateTable, editAcompanhamento, maquinas, encomendas, colaboradores }) => {
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    maquina_id: '',
    encomenda_id: '',
    id_colaborador: '',
    quantidade_produzida: ''
  });

  const updateAcompanhamento = async (acompanhamento: any) => {
    try {
      await axios.put(`http://localhost:3001/api/acompanhamento/${acompanhamento.id}`, acompanhamento);
      setUpdateTable("updateAcompanhamento");
    } catch (error) {
      console.error('Error updating acompanhamento:', error);
    }
  };

  useEffect(() => {
    if (editAcompanhamento) {
      setFormData({
        maquina_id: editAcompanhamento.maquina_id,
        encomenda_id: editAcompanhamento.encomenda_id,
        id_colaborador: editAcompanhamento.id_colaborador,
        quantidade_produzida: editAcompanhamento.quantidade_produzida.toString()
      });
    }
  }, [editAcompanhamento]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateAcompanhamento({
      ...formData,
      id: editAcompanhamento.id,
      quantidade_produzida: Number(formData.quantidade_produzida)
    });
    setEditModalOpen(false);
  };

  return (
    <Box>
      <FaPencilAlt cursor="pointer" onClick={() => setEditModalOpen(true)} />
      <Modal isOpen={isEditModalOpen} onClose={() => setEditModalOpen(false)}>
        <ModalOverlay />
        <ModalContent className='TableModal'>
          <ModalHeader>Editar Acompanhamento</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={handleSubmit}>
              <FormControl isRequired mt={4}>
                <FormLabel>Máquina</FormLabel>
                <Menu>
                  <MenuButton as={Button} className='TableMenu'>
                    {formData.maquina_id ? 
                      maquinas.find(m => m.id_maquina === formData.maquina_id)?.nome : 
                      "Selecione uma Máquina"}
                  </MenuButton>
                  <MenuList className='TableMenuList'>
                    {maquinas.map((maquina) => (
                      <MenuItem
                        className='TableMenuItem'
                        key={maquina.id_maquina}
                        onClick={() => setFormData({ ...formData, maquina_id: maquina.id_maquina })}
                      >
                        {maquina.nome}
                      </MenuItem>
                    ))}
                  </MenuList>
                </Menu>
              </FormControl>

              <FormControl isRequired mt={4}>
                <FormLabel>Encomenda</FormLabel>
                <Menu>
                  <MenuButton as={Button} className='TableMenu'>
                    {formData.encomenda_id ? 
                      `#${formData.encomenda_id} - ${encomendas.find(e => e.id_encomenda === formData.encomenda_id)?.figuras?.nome || ""}` : 
                      "Selecione uma Encomenda"}
                  </MenuButton>
                  <MenuList className='TableMenuList'>
                    {encomendas.map((encomenda) => (
                      <MenuItem
                        className='TableMenuItem'
                        key={encomenda.id_encomenda}
                        onClick={() => setFormData({ ...formData, encomenda_id: encomenda.id_encomenda })}
                      >
                        #{encomenda.id_encomenda} - {encomenda.figuras?.nome || ""}
                      </MenuItem>
                    ))}
                  </MenuList>
                </Menu>
              </FormControl>

              <FormControl isRequired mt={4}>
                <FormLabel>Colaborador</FormLabel>
                <Menu>
                  <MenuButton as={Button} className='TableMenu'>
                    {formData.id_colaborador ? 
                      colaboradores.find(c => c.id_colaborador === formData.id_colaborador)?.nome : 
                      "Selecione um Colaborador"}
                  </MenuButton>
                  <MenuList className='TableMenuList'>
                    {colaboradores.map((colaborador) => (
                      <MenuItem
                        className='TableMenuItem'
                        key={colaborador.id_colaborador}
                        onClick={() => setFormData({ ...formData, id_colaborador: colaborador.id_colaborador })}
                      >
                        {colaborador.nome}
                      </MenuItem>
                    ))}
                  </MenuList>
                </Menu>
              </FormControl>

              <FormControl isRequired mt={4}>
                <FormLabel>Quantidade Produzida</FormLabel>
                <Input
                  type="number"
                  value={formData.quantidade_produzida}
                  onChange={(e) => setFormData({ ...formData, quantidade_produzida: e.target.value })}
                />
              </FormControl>

              <Button type="submit" className="SaveButton" mt={4}>Salvar</Button>
              <Button onClick={() => setEditModalOpen(false)} className="CancelButton" mt={4}>Cancelar</Button>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};