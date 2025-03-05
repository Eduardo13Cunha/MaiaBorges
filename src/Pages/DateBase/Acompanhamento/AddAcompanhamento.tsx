import { Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, FormControl, FormLabel, Input, Menu, MenuButton, MenuList, MenuItem } from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";

export const AddAcompanhamentoModal: React.FC<{ 
  setUpdateTable: React.Dispatch<React.SetStateAction<any>>;
  maquinas: any[];
  encomendas: any[];
  colaboradores: any[];
}> = ({ setUpdateTable, maquinas, encomendas, colaboradores }) => {
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    maquina_id: '',
    encomenda_id: '',
    id_colaborador: '',
    quantidade_produzida: ''
  });

  const addAcompanhamento = async (acompanhamento: any) => {
    try {
      await axios.post('http://localhost:3001/api/acompanhamento', acompanhamento);
      setUpdateTable("addAcompanhamento");
    } catch (error) {
      console.error('Error adding acompanhamento:', error);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addAcompanhamento({
      ...formData,
      quantidade_produzida: Number(formData.quantidade_produzida)
    });
    setAddModalOpen(false);
    setFormData({
      maquina_id: '',
      encomenda_id: '',
      id_colaborador: '',
      quantidade_produzida: ''
    });
  };

  return (
    <>
      <Button onClick={() => setAddModalOpen(true)}>Adicionar Acompanhamento</Button>
      <Modal isOpen={isAddModalOpen} onClose={() => setAddModalOpen(false)}>
        <ModalOverlay />
        <ModalContent className='TableModal'>
          <ModalHeader>Adicionar Acompanhamento</ModalHeader>
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
              <Button onClick={() => setAddModalOpen(false)} className="CancelButton" mt={4}>Cancelar</Button>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};