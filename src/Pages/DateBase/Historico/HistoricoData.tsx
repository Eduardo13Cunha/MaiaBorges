import React, { useState, useEffect } from "react";
import { useToast, VStack, Box, Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import axios from "axios";
import PlanoTrabalhoTable from "./PlanoTrabalhoTable";
import AcompanhamentosTable from "./AcompanhamentosTable";
import { isLoggedIn } from "../../../Routes/validation";

const HistoricoPage: React.FC = () => {
  const [planoTrabalhos, setPlanoTrabalhos] = useState<any[]>([]);
  const [acompanhamentos, setAcompanhamentos] = useState<any[]>([]);
  const [colaboradores, setColaboradores] = useState<any[]>([]);
  const [maquinas, setMaquinas] = useState<any[]>([]);
  const [encomendas, setEncomendas] = useState<any[]>([]);
  const itemsPerPage = 8;
  const showToast = useToast();

  useEffect(() => {
    isLoggedIn();
    const fetchData = async () => {
      try {
        const [planoTrabalhosRes, acompanhamentosRes, colaboradoresRes, maquinasRes, encomendasRes] = await Promise.all([
          axios.get('/.netlify/functions/planotrabalhos/historicoplanotrabalho'),
          axios.get('/.netlify/functions/acompanhamentos'),
          axios.get('/.netlify/functions/colaboradores'),
          axios.get('/.netlify/functions/maquinas'),
          axios.get('/.netlify/functions/encomendas')
        ]);

        setPlanoTrabalhos(planoTrabalhosRes.data.data);
        setAcompanhamentos(acompanhamentosRes.data.data);
        setColaboradores(colaboradoresRes.data.data);
        setMaquinas(maquinasRes.data.data);
        setEncomendas(encomendasRes.data.data);
      } catch (error) {
        showToast({
          title: "Erro ao carregar dados",
          description: "Não foi possível carregar os dados necessários.",
          status: "error",
        });
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <VStack w="100%" spacing={4} align="stretch">
      <Box className="TableBox">
        <Tabs isFitted variant="line" color="white">
          <TabList my="2em">
            <Tab _selected={{ color: "bg.secondary.100" }} minW="50%">
              <strong>Planos de Trabalho Concluídos</strong>
            </Tab>
            <Tab _selected={{ color: "bg.secondary.100" }} minW="50%">
              <strong>Acompanhamentos</strong>
            </Tab>
          </TabList>
          <TabPanels>
            <TabPanel minW="50%">
              <PlanoTrabalhoTable 
                planoTrabalhos={planoTrabalhos}
                colaboradores={colaboradores}
                maquinas={maquinas}
                encomendas={encomendas}
                itemsPerPage={itemsPerPage}
              />
            </TabPanel>
            <TabPanel minW="50%">
              <AcompanhamentosTable 
                acompanhamentos={acompanhamentos}
                colaboradores={colaboradores}
                maquinas={maquinas}
                encomendas={encomendas}
                itemsPerPage={itemsPerPage}
              />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </VStack>
  );
};

export default HistoricoPage;