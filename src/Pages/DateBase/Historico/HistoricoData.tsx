import { Text, VStack, Box, Table, Thead, Tr, Th, Tbody, Td, HStack, Button, Input, Menu, MenuButton, MenuItem, MenuList, Tabs, TabList, TabPanels, TabPanel, Tab } from "@chakra-ui/react";
import axios from "axios";
import { useState, useEffect } from "react";
import { FaAngleLeft, FaAngleRight, FaSortDown, FaSortUp } from "react-icons/fa";

const HistoricoPage: React.FC = () => {
  const [page, setPage] = useState<number>(0);
  const [planoTrabalhos, setPlanoTrabalhos] = useState<any[]>([]);
  const [acompanhamentos, setAcompanhamentos] = useState<any[]>([]);
  const [figuras, setFiguras] = useState<any[]>([]);
  const [colaboradores, setColaboradores] = useState<any[]>([]);
  const [maquinas, setMaquinas] = useState<any[]>([]);
  const [encomendas, setEncomendas] = useState<any[]>([]);
  const itemsPerPage = 8;
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedFigura, setSelectedFigura] = useState<any>(null);
  const [selectedColaborador, setSelectedColaborador] = useState<any>(null);
  const [selectedMaquina, setSelectedMaquina] = useState<any>(null);
  const [selectedEncomenda, setSelectedEncomenda] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [planoTrabalhosRes, acompanhamentosRes, figurasRes, colaboradoresRes, maquinasRes, encomendasRes] = await Promise.all([
          axios.get('/.netlify/functions/planotrabalhos/historicoplanotrabalho'),
          axios.get('/.netlify/functions/acompanhamentos'),
          axios.get('/.netlify/functions/figuras'),
          axios.get('/.netlify/functions/colaboradores'),
          axios.get('/.netlify/functions/maquinas'),
          axios.get('/.netlify/functions/encomendas')
        ]);

        setPlanoTrabalhos(planoTrabalhosRes.data.data);
        console.log(planoTrabalhos);
        setAcompanhamentos(acompanhamentosRes.data.data);
        setFiguras(figurasRes.data.data);
        setColaboradores(colaboradoresRes.data.data);
        setMaquinas(maquinasRes.data.data);
        setEncomendas(encomendasRes.data.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const filterData = (data: any[], type: 'planoTrabalho' | 'acompanhamento') => {
    return data.filter(item => {
      const matchesSearchTerm = 
        (type === 'planoTrabalho' ? 
          item.encomendas?.figuras?.nome?.toLowerCase().includes(searchTerm.toLowerCase()) :
          item.figuras?.nome?.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesFigura = !selectedFigura || 
        (type === 'planoTrabalho' ? 
          item.encomendas?.figuras?.id_figura === selectedFigura.id_figura :
          item.figuras?.id_figura === selectedFigura.id_figura);

      const matchesColaborador = !selectedColaborador || item.id_colaborador === selectedColaborador.id_colaborador;
      const matchesMaquina = !selectedMaquina || item.id_maquina === selectedMaquina.id_maquina;
      const matchesEncomenda = !selectedEncomenda || item.id_encomenda === selectedEncomenda.id_encomenda;

      return matchesSearchTerm && matchesFigura && matchesColaborador && matchesMaquina && matchesEncomenda;
    });
  };

  const getPageItems = (items: any[], page: number, itemsPerPage: number) => {
    const start = page * itemsPerPage;
    return items.slice(start, start + itemsPerPage);
  };

  const renderPlanoTrabalhosTable = () => {
    const filteredData = filterData(planoTrabalhos, 'planoTrabalho');
    const pages = Math.ceil(filteredData.length / itemsPerPage);

    return (
      <>
        <HStack>
          <Input 
            className="TableSearchInput"
            placeholder="Pesquisar por nome da figura..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Menu>
            <MenuButton as={Button} className="TableSearchMenu">
              {selectedFigura ? selectedFigura.nome : "Filtrar por Figura"}
            </MenuButton>
            <MenuList className="TableSearchMenuList">
              <MenuItem className="TableSearchMenuItem" onClick={() => setSelectedFigura(null)}>
                Todas as Figuras
              </MenuItem>
              {figuras.map(figura => (
                <MenuItem 
                  key={figura.id_figura}
                  className="TableSearchMenuItem"
                  onClick={() => setSelectedFigura(figura)}
                >
                  {figura.nome}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton as={Button} className="TableSearchMenu">
              {selectedColaborador ? selectedColaborador.nome : "Filtrar por Colaborador"}
            </MenuButton>
            <MenuList className="TableSearchMenuList">
              <MenuItem className="TableSearchMenuItem" onClick={() => setSelectedColaborador(null)}>
                Todos os Colaboradores
              </MenuItem>
              {colaboradores.map(colaborador => (
                <MenuItem 
                  key={colaborador.id_colaborador}
                  className="TableSearchMenuItem"
                  onClick={() => setSelectedColaborador(colaborador)}
                >
                  {colaborador.nome}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton as={Button} className="TableSearchMenu">
              {selectedMaquina ? selectedMaquina.nome : "Filtrar por Máquina"}
            </MenuButton>
            <MenuList className="TableSearchMenuList">
              <MenuItem className="TableSearchMenuItem" onClick={() => setSelectedMaquina(null)}>
                Todas as Máquinas
              </MenuItem>
              {maquinas.map(maquina => (
                <MenuItem 
                  key={maquina.id_maquina}
                  className="TableSearchMenuItem"
                  onClick={() => setSelectedMaquina(maquina)}
                >
                  {maquina.nome}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
        </HStack>

        <Table className="TableTable">
          <Thead className="LineHead">
            <Tr>
              <Th color="white">ID</Th>
              <Th color="white">Figura</Th>
              <Th color="white">Colaborador</Th>
              <Th color="white">Máquina</Th>
              <Th color="white">Quantidade</Th>
              <Th color="white">Tempo de Conclusão</Th>
              <Th color="white">Semana</Th>
            </Tr>
          </Thead>
          <Tbody>
            {getPageItems(filteredData, page, itemsPerPage).map((plano) => (
              <Tr className="Line" key={plano.id_planodetrabalho}>
                <Td>{plano.id_planodetrabalho}</Td>
                <Td>{plano.encomendas?.figuras?.nome}</Td>
                <Td>{plano.colaboradores?.nome}</Td>
                <Td>{plano.maquinas?.nome}</Td>
                <Td>{plano.quantidade}</Td>
                <Td>{plano.tempo_conclusao}</Td>
                <Td>{plano.semana}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
        <HStack justifyContent="flex-end" mt={4}>
          <Button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}>
            <FaAngleLeft />
          </Button>
          <Button onClick={() => setPage(p => Math.min(pages - 1, p + 1))} disabled={page === pages - 1}>
            <FaAngleRight />
          </Button>
        </HStack>
      </>
    );
  };

  const renderAcompanhamentosTable = () => {
    console.log(acompanhamentos);
    const filteredData = filterData(acompanhamentos, 'acompanhamento');
    const pages = Math.ceil(filteredData.length / itemsPerPage);

    return (
      <>
        <HStack spacing={4} mb={4}>
          <Input 
            className="TableSearchInput"
            placeholder="Pesquisar por nome da figura..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Menu>
            <MenuButton as={Button} className="TableSearchMenu">
              {selectedFigura ? selectedFigura.nome : "Filtrar por Figura"}
            </MenuButton>
            <MenuList className="TableSearchMenuList">
              <MenuItem className="TableSearchMenuItem" onClick={() => setSelectedFigura(null)}>
                Todas as Figuras
              </MenuItem>
              {figuras.map(figura => (
                <MenuItem 
                  key={figura.id_figura}
                  className="TableSearchMenuItem"
                  onClick={() => setSelectedFigura(figura)}
                >
                  {figura.nome}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton as={Button} className="TableSearchMenu">
              {selectedColaborador ? selectedColaborador.nome : "Filtrar por Colaborador"}
            </MenuButton>
            <MenuList className="TableSearchMenuList">
              <MenuItem className="TableSearchMenuItem" onClick={() => setSelectedColaborador(null)}>
                Todos os Colaboradores
              </MenuItem>
              {colaboradores.map(colaborador => (
                <MenuItem 
                  key={colaborador.id_colaborador}
                  className="TableSearchMenuItem"
                  onClick={() => setSelectedColaborador(colaborador)}
                >
                  {colaborador.nome}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton as={Button} className="TableSearchMenu">
              {selectedMaquina ? selectedMaquina.nome : "Filtrar por Máquina"}
            </MenuButton>
            <MenuList className="TableSearchMenuList">
              <MenuItem className="TableSearchMenuItem" onClick={() => setSelectedMaquina(null)}>
                Todas as Máquinas
              </MenuItem>
              {maquinas.map(maquina => (
                <MenuItem 
                  key={maquina.id_maquina}
                  className="TableSearchMenuItem"
                  onClick={() => setSelectedMaquina(maquina)}
                >
                  {maquina.nome}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton as={Button} className="TableSearchMenu">
              {selectedEncomenda ? `#${selectedEncomenda.id_encomenda}` : "Filtrar por Encomenda"}
            </MenuButton>
            <MenuList className="TableSearchMenuList">
              <MenuItem className="TableSearchMenuItem" onClick={() => setSelectedEncomenda(null)}>
                Todas as Encomendas
              </MenuItem>
              {encomendas.map(encomenda => (
                <MenuItem 
                  key={encomenda.id_encomenda}
                  className="TableSearchMenuItem"
                  onClick={() => setSelectedEncomenda(encomenda)}
                >
                  #{encomenda.id_encomenda} - {encomenda.figuras?.nome}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
        </HStack>

        <Table className="TableTable">
          <Thead className="LineHead">
            <Tr>
              <Th color="white">ID</Th>
              <Th color="white">Figura</Th>
              <Th color="white">Colaborador</Th>
              <Th color="white">Máquina</Th>
              <Th color="white">Quantidade Produzida</Th>
              <Th color="white">Data de Produção</Th>
            </Tr>
          </Thead>
          <Tbody>
            {getPageItems(filteredData, page, itemsPerPage).map((acomp) => (
              <Tr className="Line" key={acomp.id_acompanhamento}>
                <Td>{acomp.id_acompanhamento}</Td>
                <Td>{acomp.figuras?.nome}</Td>
                <Td>{acomp.colaboradores?.nome}</Td>
                <Td>{acomp.maquinas?.nome}</Td>
                <Td>{acomp.quantidade_produzida}</Td>
                <Td>{new Date(acomp.data_producao).toLocaleDateString()}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
        <HStack justifyContent="flex-end" mt={4}>
          <Button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}>
            <FaAngleLeft />
          </Button>
          <Button onClick={() => setPage(p => Math.min(pages - 1, p + 1))} disabled={page === pages - 1}>
            <FaAngleRight />
          </Button>
        </HStack>
      </>
    );
  };

  return (
    <VStack w="80%" spacing={4} align="stretch">
      <Box className="TableBox" >
        <Tabs isFitted variant="line" color="white">
          <TabList my="2em">
            <Tab _selected={{ color: "bg.secondary.100" }} minW="50%"><strong>Planos de Trabalho Concluídos</strong></Tab>
            <Tab _selected={{ color: "bg.secondary.100" }} minW="50%"><strong>Acompanhamentos</strong></Tab>
          </TabList>
          <TabPanels>
            <TabPanel minW="50%">{renderPlanoTrabalhosTable()}</TabPanel>
            <TabPanel minW="50%">{renderAcompanhamentosTable()}</TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </VStack>
  );
};

export default HistoricoPage;