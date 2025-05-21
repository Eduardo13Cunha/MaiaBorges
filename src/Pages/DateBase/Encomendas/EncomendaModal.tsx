import { useToast, Box, Text, Menu, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, FormControl, FormLabel, Input, MenuButton, Button, MenuList, MenuItem } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { Figura, Encomenda, Cliente } from "../../../Interfaces/interfaces";
import axios from "axios";
import { FaCubes } from "react-icons/fa";
import { IconInput } from "../../../Components/ReUsable/Inputs/IconInput";
import { ErrorModal } from "../../../Components/errorModal/errorModal";

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
  const showToast = useToast(); 
  const [error,setError] = useState<any>(null);
  const [showError, setShowError] = useState(false); 
  const [formData, setFormData] = useState({
    id_figura: '',
    id_cliente: null as number | null,
    quantidade: '',
    semana: 0
  });

  useEffect(() => {
    if (selectedCell) {
      setFormData({
        id_figura: String(selectedCell.figura.id_figura),
        id_cliente: editingEncomenda?.clientes ? editingEncomenda.clientes.id_cliente : null,
        quantidade: editingEncomenda?.quantidade?.toString() || '',
        semana: selectedCell.week,
      });
    }
  }, [selectedCell, editingEncomenda]);

  const handleSaveEncomenda = async (formData: any) => {
    try {
      if (editingEncomenda) {
        await axios.put(`/.netlify/functions/encomendas/${editingEncomenda.id_encomenda}`, formData);
        showToast({
          title: "Encomenda editada com sucesso",
          description: "A encomenda foi editada com sucesso.",
          status: "success",
        });
      } else {
        await axios.post('/.netlify/functions/encomendas', formData);
        showToast({
          title: "Encomenda criada com sucesso",
          description: "A encomenda foi criada com sucesso.",
          status: "success",
        });
      }
      setUpdateTable("handleSaveEncomenda");
      onClose();
    } catch (error: any) {
      if(editingEncomenda){
        if (error?.response?.status === 400) {
          showToast({
            title: "Erro ao editar encomenda",
            description: "Não foi possível editar a encomenda Verifique o Estoque.",
            status: "error",
          });
        } else {
          showToast({
            title: "Erro ao editar encomenda",
            description: "Não foi possível editar a encomenda.",
            status: "error",
          });
        }
        setError(error)
        setShowError(true);
      }
      else{
        if (error?.response?.status === 400) {
          showToast({
            title: "Erro ao criar encomenda",
            description: "Não foi possível criar a encomenda. Verifique o Estoque.",
            status: "error",
          });
        } else {
          showToast({
            title: "Erro ao criar encomenda",
            description: "Não foi possível criar a encomenda.",
            status: "error",
          });
        }
        setError(error)
        setShowError(true);
      }
    }
  };

  const handleDelete = async (id: any) => {
    try {
      await axios.delete(`/.netlify/functions/encomendas/${id}`);
      showToast({
        title: "Encomenda eliminada com sucesso",
        description: "A encomenda foi eliminada com sucesso.",
        status: "success",
      });
      setUpdateTable("handleDelete");
      onClose();
    } catch (error) {
      showToast({
        title: "Erro ao eliminar encomenda",
        description: "Não foi possível eliminar a encomenda.",
        status: "error",
      });
      console.error('Error deleting encomenda:', error);
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
              <FormLabel>Figura</FormLabel>
              <Box cursor="default" as={Button} className='TableMenu'>
                <Text>{selectedCell?.figura.nome}</Text>
              </Box>
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Semana</FormLabel>
              <Box cursor="default" as={Button} className='TableMenu'>
                <Text>{selectedCell?.week}</Text>
              </Box>
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
              <IconInput min={0} icon={<FaCubes/>} type="number" value={formData.quantidade} onChange={(x) => setFormData({ ...formData, quantidade: x ?? ""})}/>
            </FormControl>

            <Button type="submit" className="SaveButton">{editingEncomenda ? 'Salvar' : 'Criar'}</Button>
            <Button onClick={onClose} className="CancelButton">Cancelar</Button>
            {editingEncomenda ? <Button onClick={() => handleDelete(editingEncomenda?.id_encomenda)} ml="55.4%" mt="2%" color="white" bgColor="Red">Eliminar</Button> : <></>}
          </form>
        </ModalBody>
      </ModalContent>
      {showError && (
        <ErrorModal  
          onClose2={() => setShowError(false)}
          title={error.response.data.error}
          description={error.response.data.details}/>
      )}
    </Modal>
  );
};