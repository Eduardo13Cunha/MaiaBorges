import { useToast, Box, Menu, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, FormControl, FormLabel, Input, MenuButton, Button, MenuList, MenuItem, HStack } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import axios from "axios";
import { FaFingerprint, FaTrash, FaPencilAlt, FaClock, FaBalanceScale } from "react-icons/fa";
import { IconInput } from "../../../Components/ReUsable/Inputs/IconInput";
import { CancelButton } from "../../../Components/ReUsable/Buttons/CancelButton";
import { DeleteButton } from "../../../Components/ReUsable/Buttons/DeleteButton";
import { SaveButton, CreateButton } from "../../../Components/ReUsable/Buttons/SaveButton";

interface FiguraModalProps {
  onClose: () => void;
  editingFigura: any;
  materiasPrimas: any[];
  corantes: any[];
  setUpdateTable: React.Dispatch<React.SetStateAction<any>>;
}

export const FiguraModal: React.FC<FiguraModalProps> = ({
  onClose,
  editingFigura,
  materiasPrimas,
  corantes,
  setUpdateTable,
}) => {
  const showToast = useToast();
  const [MeasureMateriaPrima, setMeasureMateriaPrima] = useState("KG");
  const [formData, setFormData] = useState({
    referencia: '',
    nome: '',
    tempo_ciclo: '',
    id_materiasprima: '',
    quantidade_materia_prima: '',
    corantes: [] as { id_corante: string; quantidade_corante: string; measure: string; }[],
  });

  useEffect(() => {
    if (editingFigura) {
      setFormData({
        referencia: editingFigura.referencia,
        nome: editingFigura.nome,
        tempo_ciclo: editingFigura.tempo_ciclo.toString(),
        id_materiasprima: editingFigura.id_materiasprima,
        quantidade_materia_prima: editingFigura.quantidade_materia_prima.toString(),
        corantes: editingFigura.figura_corantes?.map((fc: any) => ({
          id_corante: fc.corantes.id_corante,
          quantidade_corante: fc.quantidade_corante.toString(),
          measure: fc.corantes.measure,
        })) || [],
      });
    }
  }, [editingFigura]);

  const handleSaveFigura = async (formData: any) => {
    try {
      if (editingFigura) {
        await axios.put(`/.netlify/functions/figuras/${editingFigura.id_figura}`, formData);
        showToast({
          title: "Figura editada com sucesso",
          description: "A figura foi editada com sucesso.",
          status: "success",
        });
      } else {
        await axios.post('/.netlify/functions/figuras', formData);
        showToast({
          title: "Figura criada com sucesso",
          description: "A figura foi criada com sucesso.",
          status: "success",
        });
      }
      setUpdateTable("handleSaveFigura");
      onClose();
    } catch (error) {
      if (editingFigura) {
        showToast({
          title: "Erro ao editar figura",
          description: "Não foi possível editar a figura.",
          status: "error",
        });
      } else {
        showToast({
          title: "Erro ao criar figura",
          description: "Não foi possível criar a figura.",
          status: "error",
        });
      }
    }
  };

  const handleDelete = async (id: any) => {
    try {
      await axios.delete(`/.netlify/functions/figuras/${id}`);
      showToast({
        title: "Figura eliminada com sucesso",
        description: "A figura foi eliminada com sucesso.", 
        status: "success",
      });
      setUpdateTable("handleDelete");
      onClose();
    } catch (error) {
      showToast({
        title: "Erro ao eliminar figura",
        description: "Não foi possível eliminar a figura.",
        status: "error",
      });
      console.error('Error deleting figura:', error);
    }
  };

  const handleAddCorante = () => {
    setFormData({
      ...formData,
      corantes: [...formData.corantes, { id_corante: '', quantidade_corante: '', measure: 'G' }],
    });
  };

  const handleCoranteChange = (index: number, field: string, value: string, measure: string) => {
    const newCorantes = [...formData.corantes];
    newCorantes[index] = { ...newCorantes[index], [field]: value, measure: measure };
    setFormData({ ...formData, corantes: newCorantes });
  };

  const handleRemoveCorante = (index: number) => {
    const newCorantes = formData.corantes.filter((_, i) => i !== index);
    setFormData({ ...formData, corantes: newCorantes });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.corantes.some(corante => corante.measure === "MG")) {
      formData.corantes = formData.corantes.map(c => ({
        ...c,
        quantidade_corante: (Number(c.quantidade_corante) / 1000).toString(),
      }));
    }
    if (MeasureMateriaPrima === "G") {
      formData.quantidade_materia_prima = (Number(formData.quantidade_materia_prima) / 1000).toString();
    }
    handleSaveFigura({
      ...formData,
      tempo_ciclo: Number(formData.tempo_ciclo),
      quantidade_materia_prima: Number(formData.quantidade_materia_prima),
      corantes: formData.corantes.map(c => ({
        ...c,
        quantidade_corante: Number(c.quantidade_corante),
      })),
    });
  };

  return (
    <Modal onClose={onClose} isOpen={true}>
      <ModalOverlay />
      <ModalContent className="TableModal">
        <ModalHeader>
          {editingFigura ? 'Editar Figura' : 'Nova Figura'}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form onSubmit={handleSubmit}>
            <FormControl isRequired>
              <FormLabel>Referência</FormLabel>
              <IconInput icon={<FaFingerprint/>} value={formData.referencia} onChange={(x) => setFormData({ ...formData, referencia:x ?? ""})}/>
            </FormControl>

            <FormControl isRequired mt={4}>
              <FormLabel>Nome</FormLabel>
              <IconInput icon={<FaPencilAlt/>} value={formData.nome} onChange={(x) => setFormData({ ...formData, nome:x ?? ""})}/>
            </FormControl>

            <FormControl isRequired mt={4}>
              <FormLabel>Tempo de Ciclo</FormLabel>
              <IconInput icon={<FaClock />} type="number" value={formData.tempo_ciclo} onChange={(x) => setFormData({ ...formData, tempo_ciclo:x ?? ""})}/>
            </FormControl>

            <FormControl isRequired mt={4}>
              <FormLabel>Matéria Prima</FormLabel>
              <Menu>
                <MenuButton as={Button} className='TableMenu'>
                  {formData.id_materiasprima ? 
                    materiasPrimas.find(m => m.id_materiasprima === formData.id_materiasprima)?.nome : 
                    "Selecione uma Matéria Prima"}
                </MenuButton>
                <MenuList className='TableMenuList'>
                  {materiasPrimas.map((materiaPrima) => (
                    <MenuItem
                      className='TableMenuItem'
                      key={materiaPrima.id_materiasprima}
                      onClick={() => setFormData({ ...formData, id_materiasprima: materiaPrima.id_materiasprima })}
                    >
                      {materiaPrima.nome}
                    </MenuItem>
                  ))}
                </MenuList>
              </Menu>
            </FormControl>

            <FormControl isRequired mt={4}>
              <FormLabel>Quantidade de Matéria Prima</FormLabel>
              <HStack>
                <IconInput min={0} icon={<FaBalanceScale/>} type="number" value={formData.quantidade_materia_prima} onChange={(x) => setFormData({ ...formData, quantidade_materia_prima: x ?? ""})}/>
                <Menu>
                  <MenuButton as={Button} className='TableMenuCorante' minW="8%" display="flex" justifyContent="center" alignItems="center">
                    {MeasureMateriaPrima}
                  </MenuButton>
                  <MenuList className='TableMenuList'>
                    <MenuItem 
                      className='TableMenuItem' 
                      maxW="20%" 
                      isDisabled={MeasureMateriaPrima === "KG"} 
                      onClick={() => { 
                        setMeasureMateriaPrima("KG"); 
                        setFormData({ 
                          ...formData, 
                          quantidade_materia_prima: (Number(formData.quantidade_materia_prima) / 1000).toString() 
                        }); 
                      }}
                    >
                      KG
                    </MenuItem>
                    <MenuItem 
                      className='TableMenuItem' 
                      maxW="20%" 
                      isDisabled={MeasureMateriaPrima === "G"} 
                      onClick={() => { 
                        setMeasureMateriaPrima("G"); 
                        setFormData({ 
                          ...formData, 
                          quantidade_materia_prima: (Number(formData.quantidade_materia_prima) * 1000).toString() 
                        });
                      }}
                    >
                      G
                    </MenuItem>
                  </MenuList>
                </Menu>
              </HStack>
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Corantes</FormLabel>
              {formData.corantes.map((corante, index) => (
                <Box key={index} mt={2}>
                  <HStack>
                    <Menu>
                      <MenuButton as={Button} className='TableMenuCorante' minW="45%">
                        {corante.id_corante ? 
                          corantes.find(c => c.id_corante === corante.id_corante)?.nome : 
                          "Selecione um Corante"}
                      </MenuButton>
                      <MenuList className='TableMenuList'>
                        {corantes.map((c) => (
                          <MenuItem
                            className='TableMenuItem'
                            key={c.id_corante}
                            onClick={() => handleCoranteChange(index, 'id_corante', c.id_corante, corante.measure)}
                          >
                            {c.nome}
                          </MenuItem>
                        ))}
                      </MenuList>
                    </Menu>
                    <IconInput min={0} icon={<FaBalanceScale/>} type="number" value={corante.quantidade_corante} onChange={(x) => handleCoranteChange(index, 'quantidade_corante', x ?? "", corante.measure)}/>
                    <Menu>
                      <MenuButton as={Button} className='TableMenuCorante' minW="8%" display="flex" justifyContent="center" alignItems="center">
                        {corante.measure || "G"}
                      </MenuButton>
                      <MenuList className='TableMenuList'>
                        <MenuItem 
                          className='TableMenuItem' 
                          maxW="20%" 
                          isDisabled={corante.measure ? (corante.measure === "G") : (true)} 
                          onClick={() => { 
                            handleCoranteChange(
                              index, 
                              'quantidade_corante', 
                              (Number(corante.quantidade_corante) / 1000).toString(),
                              'G'
                            );
                          }}
                        >
                          G
                        </MenuItem>
                        <MenuItem 
                          className='TableMenuItem' 
                          maxW="20%" 
                          isDisabled={corante.measure === "MG"} 
                          onClick={() => { 
                            handleCoranteChange(
                              index, 
                              'quantidade_corante', 
                              (Number(corante.quantidade_corante) * 1000).toString(),
                              'MG'
                            ); 
                          }}
                        >
                          Mg
                        </MenuItem>
                      </MenuList>
                    </Menu>
                    <Button onClick={() => handleRemoveCorante(index)} className='TableMenuCorante'>
                      <FaTrash/>
                    </Button>
                  </HStack>
                </Box>
              ))}
              <Button onClick={handleAddCorante} className='TableMenu' mt="2%">
                Adicionar Corante
              </Button>
            </FormControl>
            {editingFigura ? <SaveButton type="submit"/> : <CreateButton type="submit"/>}
            <CancelButton onClick={onClose}/>
            {editingFigura && (
              <DeleteButton onClick={() => handleDelete(editingFigura.id_figura)}/>
            )}
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};