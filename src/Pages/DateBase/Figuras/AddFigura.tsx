import { Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, FormControl, FormLabel, Input, Menu, MenuButton, MenuList, MenuItem, Box, HStack} from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";
import { FaTrash } from "react-icons/fa";

export const AddFiguraModal: React.FC<{ setUpdateTable:React.Dispatch<React.SetStateAction<any>>;materiasPrimas:any[];corantes:any[]}> = ({ setUpdateTable ,materiasPrimas,corantes}) => {
    const [MeasureMateriaPrima, setMeasureMateriaPrima] = useState("KG");
    const [MeasureCorante, setMeasureCorante] = useState('G');
    const [isAddModalOpen, setAddModalOpen] = useState(false);
    const [formData, setFormData] = useState({
      referencia: '',
      nome: '',
      tempo_ciclo: '',
      id_materiasprima: '',
      quantidade_materia_prima: '',
      corantes: [] as { id_corante: string; quantidade_corante: string }[],
    });

    const addFigura = async (figura: any) => {
        try {
          await axios.post('/.netlify/functions/figuras', figura);
          setUpdateTable("addFigura");
        } catch (error) {
          console.error('Error adding figura:', error);
        }
      };
  
    const handleAddCorante = () => {
      setFormData({
        ...formData,
        corantes: [...formData.corantes, { id_corante: '', quantidade_corante: '' }],
      });
    };
  
    const handleCoranteChange = (index: number, field: string, value: string) => {
      const newCorantes = [...formData.corantes];
      newCorantes[index] = { ...newCorantes[index], [field]: value };
      setFormData({ ...formData, corantes: newCorantes });
    };
  
    const handleRemoveCorante = (index: number) => {
      const newCorantes = formData.corantes.filter((_, i) => i !== index);
      setFormData({ ...formData, corantes: newCorantes });
    };
  
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if(MeasureCorante === "MG"){
        formData.corantes = formData.corantes.map(c => ({
          ...c,
          quantidade_corante: (Number(c.quantidade_corante) / 1000).toString(),
        }));
      }
      if(MeasureMateriaPrima === "G"){
        formData.quantidade_materia_prima = (Number(formData.quantidade_materia_prima) / 1000).toString();
      }
      addFigura({
        ...formData,
        tempo_ciclo: Number(formData.tempo_ciclo),
        quantidade_materia_prima: Number(formData.quantidade_materia_prima),
        corantes: formData.corantes.map(c => ({
          ...c,
          quantidade_corante: Number(c.quantidade_corante),
        })),
      });
      setAddModalOpen(false);
      setFormData({
        referencia: '',
        nome: '',
        tempo_ciclo: '',
        id_materiasprima: '',
        quantidade_materia_prima: '',
        corantes: [],
      });
    };
  
    return (
      <>
        <Button onClick={() => setAddModalOpen(true)}>Adicionar Figura</Button>
        <Modal isOpen={isAddModalOpen} onClose={() => setAddModalOpen(false)}>
          <ModalOverlay />
          <ModalContent className='TableModal'>
            <ModalHeader>Adicionar Figura</ModalHeader>
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
                        materiasPrimas.find(m => m.id_materiasprima === formData.id_materiasprima)?.nome : "Selecione uma Matéria Prima"}
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
                      <MenuButton as={Button} className='TableMenuCorante' minW="8%" display="flex" justifyContent="center" alignItems="center">{MeasureMateriaPrima}</MenuButton>
                      <MenuList className='TableMenuList'>
                        <MenuItem className='TableMenuItem' maxW="20%" isDisabled={MeasureMateriaPrima === "KG"} onClick={() => { setMeasureMateriaPrima("KG"); setFormData({ ...formData, quantidade_materia_prima: (Number(formData.quantidade_materia_prima) / 1000).toString() }); }}>Kg</MenuItem>
                        <MenuItem className='TableMenuItem' maxW="20%" isDisabled={MeasureMateriaPrima === "G"} onClick={() => { setMeasureMateriaPrima("G"); setFormData({ ...formData, quantidade_materia_prima: (Number(formData.quantidade_materia_prima) * 1000).toString() });}}>G</MenuItem>
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
                                onClick={() => handleCoranteChange(index, 'id_corante', c.id_corante)}
                              >
                                {c.nome}
                              </MenuItem>
                            ))}
                          </MenuList>
                        </Menu>
                        <Input min={0}
                        placeholder="Quantidade"
                        value={corante.quantidade_corante}
                        onChange={(e) => handleCoranteChange(index, 'quantidade_corante', e.target.value)}
                        />
                        <Menu>
                          <MenuButton as={Button} className='TableMenuCorante' minW="8%" display="flex" justifyContent="center" alignItems="center">{MeasureCorante}</MenuButton>
                          <MenuList className='TableMenuList'>
                            <MenuItem className='TableMenuItem' maxW="20%" isDisabled={MeasureCorante === "G"} onClick={() => { setMeasureCorante("G"); handleCoranteChange(index, 'quantidade_corante', (Number(corante.quantidade_corante) / 1000).toString()); }}>G</MenuItem>
                            <MenuItem className='TableMenuItem' maxW="20%" isDisabled={MeasureCorante === "MG"} onClick={() => { setMeasureCorante("MG"); handleCoranteChange(index, 'quantidade_corante', (Number(corante.quantidade_corante) * 1000).toString()); }}>Mg</MenuItem>
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
                <Button type="submit" className="SaveButton">Salvar</Button>
                <Button onClick={() => setAddModalOpen(false )} className="CancelButton">Cancelar</Button>
              </form>
            </ModalBody>
          </ModalContent>
        </Modal>
      </>
    );
  };