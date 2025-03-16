import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, FormControl, FormLabel, Menu, MenuButton, Button, MenuList, MenuItem, Box } from "@chakra-ui/react";
import axios from "axios";
import { useState, useEffect } from "react";
import { FaPencilAlt } from "react-icons/fa";

export const EditPlanoTrabalhoModal: React.FC<{ 
  setUpdateTable: React.Dispatch<React.SetStateAction<any>>;
  editPlanoTrabalho: any;
  maquinas: any[];
  encomendas: any[];
  colaboradores: any[];
}> = ({ setUpdateTable, editPlanoTrabalho, maquinas, encomendas, colaboradores }) => {

  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    maquina_id: editPlanoTrabalho.maquina_id,
    encomenda_id: editPlanoTrabalho.encomenda_id,
    id_colaborador: editPlanoTrabalho.id_colaborador,
  });

  const updatePlanoTrabalho = async (planoTrabalho: any) => {
    try {
      await axios.put(`/.netlify/functions/planotrabalhos/${planoTrabalho.id}`, planoTrabalho);
      setUpdateTable("updatePlanoTrabalho");
    } catch (error) {
      console.error('Error updating plano de trabalho:', error);
    }
  };

 
  useEffect(() => {
    if (formData.encomenda_id) {
      const selectedEncomenda = encomendas.find(e => e.id_encomenda === formData.encomenda_id);
      if (selectedEncomenda) {
        const weekNumber = selectedEncomenda.semana;
        const quantidade = selectedEncomenda.quantidade;

        //Calculo para o tempo Estimado
        const tempoCiclo = selectedEncomenda.figuras.tempo_ciclo;
        const tempoEstimado = quantidade / tempoCiclo;

        const horas = Math.floor(tempoEstimado);
        const minutos = Math.floor((tempoEstimado - horas) * 60);
        const segundos = Math.round(((tempoEstimado - horas) * 60 - minutos) * 60);
        
        setFormData(prev => ({
          ...prev,
          quantidade: selectedEncomenda.quantidade.toString(),
          quantidade_falta: selectedEncomenda.quantidade.toString(),
          semana: weekNumber.toString(),
          tempo_conclusao: `${String(horas).padStart(2, '0')}:${String(minutos).padStart(2, '0')}:${String(segundos).padStart(2, '0')}`
        }));
      }
    }
  }, [formData.encomenda_id, encomendas]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updatePlanoTrabalho({
      ...formData,
      id: editPlanoTrabalho.id,
    });
    setEditModalOpen(false);
  };

  return (
    <Box>
      <FaPencilAlt cursor="pointer" onClick={() => setEditModalOpen(true)} />
      <Modal isOpen={isEditModalOpen} onClose={() => setEditModalOpen(false)}>
        <ModalOverlay />
        <ModalContent className='TableModal'>
          <ModalHeader>Editar Plano de Trabalho</ModalHeader>
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
              <Button type="submit" className="SaveButton" mt={4}>Salvar</Button>
              <Button onClick={() => setEditModalOpen(false)} className="CancelButton" mt={4}>Cancelar</Button>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};