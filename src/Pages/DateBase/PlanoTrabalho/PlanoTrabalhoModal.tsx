import { Menu, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, FormControl, FormLabel, MenuButton, Button, MenuList, MenuItem } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import axios from "axios";
import { ErrorModal } from "../../../Components/errorModal/errorModal";

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
  const [error, setError] = useState<any>(null);
  const [showError, setShowError] = useState(false);
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
      } else {
        await axios.post('/.netlify/functions/planotrabalhos', formData);
      }
      setUpdateTable("handleSavePlanoTrabalho");
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
      await axios.delete(`/.netlify/functions/planotrabalhos/${id}`);
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

            <Button type="submit" className="SaveButton">
              {editingPlanoTrabalho ? 'Salvar' : 'Criar'}
            </Button>
            <Button onClick={onClose} className="CancelButton">
              Cancelar
            </Button>
            {editingPlanoTrabalho && (
              <Button
                onClick={() => handleDelete(editingPlanoTrabalho.id)}
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