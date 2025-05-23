import React, { useState } from 'react';
import { Box, Table, Thead, Tbody, Tr, Th, Td, HStack, Button, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { Encomenda, Colaborador, Maquina } from '../../../Interfaces/interfaces';

interface PlanoTrabalhoTableProps {
  planoTrabalhos: any[];
  encomendas: Encomenda[];
  colaboradores: Colaborador[];
  maquinas: Maquina[];
  itemsPerPage: number;
}

const PlanoTrabalhoTable: React.FC<PlanoTrabalhoTableProps> = ({
  planoTrabalhos,
  encomendas,
  colaboradores,
  maquinas,
  itemsPerPage
}) => {
  const [page, setPage] = useState<number>(0);
  const [selectedEncomenda, setSelectedEncomenda] = useState<Encomenda | null>(null);
  const [selectedColaborador, setSelectedColaborador] = useState<Colaborador | null>(null);
  const [selectedMaquina, setSelectedMaquina] = useState<Maquina | null>(null);

  const filteredData = planoTrabalhos.filter(item => {
    return (
      (!selectedColaborador || item.id_colaborador === selectedColaborador.id_colaborador) &&
      (!selectedMaquina || item.id_maquina === selectedMaquina.id_maquina) &&
      (!selectedEncomenda || item.id_encomenda === selectedEncomenda.id_encomenda)
    );
  });

  const getPageItems = (items: any[], page: number, itemsPerPage: number) => {
    const start = page * itemsPerPage;
    return items.slice(start, start + itemsPerPage);
  };

  const pages = Math.ceil(filteredData.length / itemsPerPage);

  return (
    <>
      <Box className="TableBox" h="50vh">
        <HStack spacing={4} mb={4}>
          <Menu>
            <MenuButton as={Button} className="TableSearchMenuButton" ml="15%">
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
            <MenuButton as={Button} className="TableSearchMenuButton">
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
            <MenuButton as={Button} className="TableSearchMenuButton">
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
              <Th color="white" w="18%">Figura</Th>
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
                <Td>#{plano.id_encomenda} - {plano.encomendas.figuras?.nome}</Td>
                <Td>{plano.colaboradores?.nome}</Td>
                <Td>{plano.maquinas?.nome}</Td>
                <Td>{plano.quantidade}</Td>
                <Td>{plano.tempo_conclusao}</Td>
                <Td>{plano.semana}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
      <HStack justifyContent="flex-end" mt={4} mr="15%">
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

export default PlanoTrabalhoTable;