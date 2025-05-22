import { useToast, Menu, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, FormControl, FormLabel, MenuButton, Button, MenuList, MenuItem } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import axios from "axios";
import { CancelButton } from "../../../Components/ReUsable/Buttons/CancelButton";
import { DeleteButton } from "../../../Components/ReUsable/Buttons/DeleteButton";
import { SaveButton, CreateButton } from "../../../Components/ReUsable/Buttons/SaveButton";

interface PlanoTrabalhoModalProps {
  onClose: () => void;
  editingPlanoTrabalho: any;
  maquinas: any[];
  encomendas: any[];
  colaboradores: any[];
  setUpdateTable: React.Dispatch<React.SetStateAction<any>>;
}

export const PlanoTrabalhoModal: React.FC<PlanoTrabalhoModalProps> = ({
  onClose,
  editingPlanoTrabalho,
  maquinas,
  encomendas,
  colaboradores,
  setUpdateTable,
}) => {
  const showToast = useToast();
  const [formData, setFormData] = useState({
    id_maquina: editingPlanoTrabalho?.id_maquina || '',
    id_encomenda: editingPlanoTrabalho?.id_encomenda || '',
    id_colaborador: editingPlanoTrabalho?.id_colaborador || '',
    tempo_conclusao: '',
    quantidade: '',
    semana: '',
    quantidade_falta: ''
  });

  useEffect(() => {
    if (formData.id_encomenda) {
      const selectedEncomenda = encomendas.find(e => e.id_encomenda === formData.id_encomenda);
      if (selectedEncomenda) {
        const weekNumber = selectedEncomenda.semana;
        const quantidade = selectedEncomenda.quantidade;

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
  }, [formData.id_encomenda, encomendas]);

  const handleSavePlanoTrabalho = async (formData: any) => {
    try {
      if (editingPlanoTrabalho) {
        await axios.put(`/.netlify/functions/planotrabalhos/${editingPlanoTrabalho.id}`, formData);
        showToast({
          title: "Plano de Trabalho editado com sucesso",
          description: "O plano de trabalho foi editado com sucesso.",
          status: "success",
        });
      } else {
        await axios.post('/.netlify/functions/planotrabalhos', formData);
        showToast({
          title: "Plano de Trabalho criado com sucesso",
          description: "O plano de trabalho foi criado com sucesso.",
          status: "success",
        });
      }
      setUpdateTable("handleSavePlanoTrabalho");
      onClose();
    } catch (error) {
      if (editingPlanoTrabalho) {
        showToast({
          title: "Erro ao editar plano de trabalho",
          description: "Não foi possível editar o plano de trabalho.",
          status: "error",
        });
        console.error('Error editing plano de trabalho:', error);
      } else {
        showToast({
          title: "Erro ao criar plano de trabalho",
          description: "Não foi possível criar o plano de trabalho.",
          status: "error",
        });
        console.error('Error creating plano de trabalho:', error);
      }
    }
  };

  const handleDelete = async (id: any) => {
    try {
      await axios.delete(`/.netlify/functions/planotrabalhos/${id}`);
      showToast({
        title: "Plano de Trabalho eliminado com sucesso",
        description: "O plano de trabalho foi eliminado com sucesso.",
        status: "success",
      });
      setUpdateTable("handleDelete");
      onClose();
    } catch (error) {
      showToast({
        title: "Erro ao eliminar plano de trabalho",
        description: "Não foi possível eliminar o plano de trabalho.",
        status: "error",  
      });
      console.error('Error deleting plano de trabalho:', error);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSavePlanoTrabalho({
      ...formData,
      quantidade: Number(formData.quantidade),
      semana: Number(formData.semana),
      quantidade_falta: Number(formData.quantidade_falta),
    });
  };

  return (
    <Modal onClose={onClose} isOpen={true}>
      <ModalOverlay />
      <ModalContent className="TableModal">
        <ModalHeader>
          {editingPlanoTrabalho ? 'Editar Plano de Trabalho' : 'Novo Plano de Trabalho'}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form onSubmit={handleSubmit}>
            <FormControl isRequired mt={4}>
              <FormLabel>Máquina</FormLabel>
              <Menu>
                <MenuButton as={Button} className='TableMenu'>
                  {formData.id_maquina ? 
                    maquinas.find(m => m.id_maquina === formData.id_maquina)?.nome : 
                    "Selecione uma Máquina"}
                </MenuButton>
                <MenuList className='TableMenuList'>
                  {maquinas.map((maquina) => (
                    <MenuItem
                      className='TableMenuItem'
                      key={maquina.id_maquina}
                      onClick={() => setFormData({ ...formData, id_maquina: maquina.id_maquina })}
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
                  {formData.id_encomenda ? 
                    `#${formData.id_encomenda} - ${encomendas.find(e => e.id_encomenda === formData.id_encomenda)?.figuras?.nome || ""}` : 
                    "Selecione uma Encomenda"}
                </MenuButton>
                <MenuList className='TableMenuList'>
                  {encomendas.map((encomenda) => (
                    <MenuItem
                      className='TableMenuItem'
                      key={encomenda.id_encomenda}
                      onClick={() => setFormData({ ...formData, id_encomenda: encomenda.id_encomenda })}
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
            {editingPlanoTrabalho ? <SaveButton type="submit"/> : <CreateButton type="submit"/>}
            <CancelButton onClick={onClose}/>
            {editingPlanoTrabalho && (
              <DeleteButton onClick={() => handleDelete(editingPlanoTrabalho.id_planotrabalho)}/>
            )}
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};