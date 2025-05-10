import { Box, Menu, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, FormControl, FormLabel, Input, MenuButton, Button, MenuList, MenuItem, HStack } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import axios from "axios";
import { ErrorModal } from "../../../Components/errorModal/errorModal";
import { FaTrash } from "react-icons/fa";

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
  const [error, setError] = useState<any>(null);
  const [showError, setShowError] = useState(false);
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
      } else {
        await axios.post('/.netlify/functions/figuras', formData);
      }
      setUpdateTable("handleSaveFigura");
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
      await axios.delete(`/.netlify/functions/figuras/${id}`);
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
              <Input
                value={formData.referencia}
                onChange={(e) => setFormData({ ...formData, referencia: e.target.value })}
              />
            </FormControl>

            <FormControl isRequired mt={4}>
              <FormLabel>Nome</FormLabel>
              <Input
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              />
            </FormControl>

            <FormControl isRequired mt={4}>
              <FormLabel>Tempo de Ciclo</FormLabel>
              <Input
                type="number"
                value={formData.tempo_ciclo}
                onChange={(e) => setFormData({ ...formData, tempo_ciclo: e.target.value })}
              />
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
                <Input
                  type="number"
                  value={formData.quantidade_materia_prima}
                  onChange={(e) => setFormData({ ...formData, quantidade_materia_prima: e.target.value })}
                />
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
                    <Input
                      min={0}
                      placeholder="Quantidade"
                      value={corante.quantidade_corante}
                      onChange={(e) => handleCoranteChange(index, 'quantidade_corante', e.target.value, corante.measure)}
                    />
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

            <Button type="submit" className="SaveButton">
              {editingFigura ? 'Salvar' : 'Criar'}
            </Button>
            <Button onClick={onClose} className="CancelButton">
              Cancelar
            </Button>
            {editingFigura && (
              <Button
                onClick={() => handleDelete(editingFigura.id_figura)}
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