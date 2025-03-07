import { Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, FormControl, FormLabel, Input, Menu, MenuButton, MenuList, MenuItem } from "@chakra-ui/react";
import axios from "axios";
import { interval } from "date-fns";
import { useState, useEffect } from "react";

export const AddPlanoTrabalhoModal: React.FC<{ 
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
    tempo_conclusao: '',
    quantidade: '',
    semana: '',
    quantidade_falta: ''
  });

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

        const tempoFormatado = `${String(horas).padStart(2, '0')}:${String(minutos).padStart(2, '0')}:${String(segundos).padStart(2, '0')}`;
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

  const addPlanoTrabalho = async (planoTrabalho: any) => {
    try {
      await axios.post('http://localhost:3001/api/planotrabalho', planoTrabalho);
      setUpdateTable("addPlanoTrabalho");
    } catch (error) {
      console.error('Error adding plano de trabalho:', error);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addPlanoTrabalho({
      ...formData,
      quantidade: Number(formData.quantidade),
      semana: Number(formData.semana),
      quantidade_falta: Number(formData.quantidade_falta),
    });
    setAddModalOpen(false);
    setFormData({
      maquina_id: '',
      encomenda_id: '',
      id_colaborador: '',
      tempo_conclusao: '',
      quantidade: '',
      semana: '',
      quantidade_falta: ''
    });
  };

  return (
    <>
      <Button onClick={() => setAddModalOpen(true)}>Adicionar Plano de Trabalho</Button>
      <Modal isOpen={isAddModalOpen} onClose={() => setAddModalOpen(false)}>
        <ModalOverlay />
        <ModalContent className='TableModal'>
          <ModalHeader>Adicionar Plano de Trabalho</ModalHeader>
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
              <Button onClick={() => setAddModalOpen(false)} className="CancelButton" mt={4}>Cancelar</Button>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};