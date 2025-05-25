import React, { useState } from 'react';
import { Text, Box, Table, Thead, Tbody, Tr, Th, Td, HStack, Button, Menu, MenuButton, MenuItem, MenuList, Spacer  } from "@chakra-ui/react";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { Colaborador, Encomenda, Maquina } from '../../../Interfaces/interfaces';

interface AcompanhamentosTableProps {
  acompanhamentos: any[];
  colaboradores: Colaborador[];
  maquinas: Maquina[];
  encomendas: Encomenda[];
  itemsPerPage: number;
}

const AcompanhamentosTable: React.FC<AcompanhamentosTableProps> = ({
  acompanhamentos,
  colaboradores,
  maquinas,
  encomendas,
  itemsPerPage
}) => {
  const [page, setPage] = useState<number>(0);
  const [selectedColaborador, setSelectedColaborador] = useState<Colaborador | null>(null);
  const [selectedMaquina, setSelectedMaquina] = useState<Maquina | null>(null);
  const [selectedEncomenda, setSelectedEncomenda] = useState<Encomenda | null>(null);

  const filteredData = acompanhamentos.filter(item => {
    return (
      (!selectedColaborador || item.colaboradores.id_colaborador === selectedColaborador.id_colaborador) &&
      (!selectedMaquina || item.maquinas.id_maquina === selectedMaquina.id_maquina) &&
      (!selectedEncomenda || item.encomendas.id_encomenda === selectedEncomenda.id_encomenda)
    );
  });

  const getPageItems = (items: any[], page: number, itemsPerPage: number) => {
    const start = page * itemsPerPage;
    return items.slice(start, start + itemsPerPage);
  };

  const pages = Math.ceil(filteredData.length / itemsPerPage);

  return (
    <>
      <Box h="50vh"> 
        <HStack spacing={4} mb={4}>  
          <Menu>
            <MenuButton as={Button} className="TableSearchMenuButton">
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
          <Spacer/>
          <Text color="text.primary.100" fontSize="larger" ml="2%"><strong>{filteredData.length}</strong> Itens de <strong>{acompanhamentos.length}</strong></Text>
        </HStack>

        <Table className="TableTable">
          <Thead className="LineHead">
            <Tr>
              <Th color="white">ID</Th>
              <Th color="white">Figura</Th>
              <Th color="white">Colaborador</Th>
              <Th color="white">Máquina</Th>
              <Th color="white">Quant. Produzida</Th>
              <Th color="white">Data de Produção</Th>
            </Tr>
          </Thead>
          <Tbody>
            {getPageItems(filteredData, page, itemsPerPage).map((acomp) => (
              <Tr className="Line" key={acomp.id_acompanhamento}>
                <Td>{acomp.id_acompanhamento}</Td>
                <Td>{acomp.encomendas.figuras?.nome}</Td>
                <Td>{acomp.colaboradores?.nome}</Td>
                <Td>{acomp.maquinas?.nome}</Td>
                <Td>{acomp.quantidade_produzida}</Td>
                <Td>{new Date(acomp.dia_hora).toLocaleDateString() + " : " + new Date(acomp.dia_hora).toLocaleTimeString()}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
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

export default AcompanhamentosTable;