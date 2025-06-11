import { Modal, ModalOverlay, ModalContent, ModalBody, HStack, Heading, Img, Spacer, VStack, Button, Text, Box } from "@chakra-ui/react";
import MaiaBorgesLogoGrande from "../../../Assets/MaiaBorgesLogoGrande.png";

interface PrivacyPolicyModalProps {
  onClose: () => void;
}

export const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({
  onClose,
}) => {
  return (
    <Modal isOpen={true} onClose={onClose} size="6xl">
      <ModalOverlay/>
      <ModalContent className="TableModal" pb="1.5%" maxH="90vh">
        <ModalBody>
          <VStack spacing={6}>
            <HStack>
                <Heading as="h1" textAlign="center">
                    Política de Privacidade
                </Heading>
                <Spacer />
                <Img src={MaiaBorgesLogoGrande} maxH="20%" maxW="20%" />
            </HStack>
            
            <Box 
              maxH="60vh" 
              overflowY="auto" 
              w="100%" 
              p={4} 
            >
              <VStack spacing={4} align="start">
                <Text fontSize="sm" color="text.primary.100">
                  <strong>Última atualização:</strong> 07 de junho de 2025
                </Text>

                <Text fontSize="sm" color="text.primary.100">
                  Esta Política de Privacidade descreve as nossas políticas e procedimentos sobre a recolha, uso e divulgação 
                  das suas informações quando utiliza o Serviço e informa-o sobre os seus direitos de privacidade e como a lei o protege.
                </Text>

                <Text fontSize="sm" color="text.primary.100">
                  Utilizamos os seus dados pessoais para fornecer e melhorar o Serviço. Ao utilizar o Serviço, concorda com a 
                  recolha e uso de informações de acordo com esta Política de Privacidade.
                </Text>

                <Heading as="h3" size="sm" color="text.primary.100">
                  INTERPRETAÇÃO E DEFINIÇÕES
                </Heading>

                <Heading as="h4" size="xs" color="text.primary.100">
                  Interpretação
                </Heading>

                <Text fontSize="sm" color="text.primary.100">
                  As palavras cuja letra inicial está em maiúscula têm significados definidos nas seguintes condições. 
                  As seguintes definições terão o mesmo significado, independentemente de aparecerem no singular ou no plural.
                </Text>

                <Heading as="h4" size="xs" color="text.primary.100">
                  Definições
                </Heading>

                <Text fontSize="sm" color="text.primary.100">
                  Para os fins desta Política de Privacidade:
                </Text>

                <Box pl={4}>
                  <Text fontSize="sm" color="text.primary.100">
                    • <strong>Conta</strong> significa uma conta única criada para si para aceder ao nosso Serviço ou partes do nosso Serviço.<br/>
                    • <strong>Empresa</strong> (referida como "a Empresa", "Nós", "Nosso" neste Acordo) refere-se à Maia Borges Manager.<br/>
                    • <strong>Cookies</strong> são pequenos ficheiros colocados no seu computador, dispositivo móvel ou qualquer outro dispositivo por um website.<br/>
                    • <strong>País</strong> refere-se a: Portugal<br/>
                    • <strong>Dispositivo</strong> significa qualquer dispositivo que possa aceder ao Serviço, como um computador, telemóvel ou tablet digital.<br/>
                    • <strong>Dados Pessoais</strong> são qualquer informação que se relacione com um indivíduo identificado ou identificável.<br/>
                    • <strong>Serviço</strong> refere-se ao Website.<br/>
                    • <strong>Website</strong> refere-se ao Maia Borges Manager, acessível em <Text as="span" color="blue.500">https://maiaborgesmanager.netlify.app</Text><br/>
                    • <strong>Você</strong> significa o indivíduo que acede ou utiliza o Serviço.
                  </Text>
                </Box>

                <Heading as="h3" size="sm" color="text.primary.100">
                  RECOLHA E USO DOS SEUS DADOS PESSOAIS
                </Heading>

                <Heading as="h4" size="xs" color="text.primary.100">
                  Tipos de Dados Recolhidos
                </Heading>

                <Text fontSize="sm" color="text.primary.100">
                  <strong>Dados Pessoais</strong><br/>
                  Ao utilizar o nosso Serviço, podemos pedir-lhe que nos forneça certas informações pessoalmente identificáveis 
                  que podem ser usadas para contactá-lo ou identificá-lo. As informações pessoalmente identificáveis podem incluir, 
                  mas não se limitam a:
                </Text>

                <Box pl={4}>
                  <Text fontSize="sm" color="text.primary.100">
                    • Endereço de email<br/>
                    • Nome próprio e apelido<br/>
                    • Número de telefone<br/>
                    • Dados de Uso
                  </Text>
                </Box>

                <Text fontSize="sm" color="text.primary.100">
                  <strong>Dados de Uso</strong><br/>
                  Os Dados de Uso são recolhidos automaticamente ao utilizar o Serviço. Podem incluir informações como o endereço 
                  de Protocolo de Internet do seu Dispositivo, tipo de navegador, versão do navegador, as páginas do nosso Serviço 
                  que visita, a hora e data da sua visita, o tempo gasto nessas páginas, identificadores únicos do dispositivo e 
                  outros dados de diagnóstico.
                </Text>

                <Heading as="h3" size="sm" color="text.primary.100">
                  TECNOLOGIAS DE RASTREAMENTO E COOKIES
                </Heading>

                <Text fontSize="sm" color="text.primary.100">
                  Utilizamos Cookies e tecnologias de rastreamento similares para rastrear a atividade no nosso Serviço e 
                  armazenar certas informações. As tecnologias que utilizamos podem incluir:
                </Text>

                <Box pl={4}>
                  <Text fontSize="sm" color="text.primary.100">
                    • <strong>Cookies Necessários/Essenciais:</strong> Estes Cookies são essenciais para lhe fornecer serviços disponíveis através do Website.<br/>
                    • <strong>Cookies de Funcionalidade:</strong> Estes Cookies permitem-nos lembrar escolhas que faz quando utiliza o Website.<br/>
                    • <strong>Cookies de Aceitação de Política:</strong> Estes Cookies identificam se os utilizadores aceitaram o uso de cookies no Website.
                  </Text>
                </Box>

                <Heading as="h3" size="sm" color="text.primary.100">
                  USO DOS SEUS DADOS PESSOAIS
                </Heading>

                <Text fontSize="sm" color="text.primary.100">
                  A Empresa pode usar os Dados Pessoais para os seguintes fins:
                </Text>

                <Box pl={4}>
                  <Text fontSize="sm" color="text.primary.100">
                    • Para fornecer e manter o nosso Serviço<br/>
                    • Para gerir a sua Conta como utilizador do Serviço<br/>
                    • Para contactá-lo por email, chamadas telefónicas, SMS ou outras formas de comunicação eletrónica<br/>
                    • Para lhe fornecer notícias, ofertas especiais e informações gerais sobre outros bens e serviços<br/>
                    • Para gerir os seus pedidos<br/>
                    • Para transferências comerciais<br/>
                    • Para outros fins, como análise de dados e melhoria do Serviço
                  </Text>
                </Box>

                <Heading as="h3" size="sm" color="text.primary.100">
                  RETENÇÃO DOS SEUS DADOS PESSOAIS
                </Heading>

                <Text fontSize="sm" color="text.primary.100">
                  A Empresa reterá os seus Dados Pessoais apenas pelo tempo necessário para os fins estabelecidos nesta 
                  Política de Privacidade. Reteremos e usaremos os seus Dados Pessoais na medida necessária para cumprir 
                  as nossas obrigações legais, resolver disputas e fazer cumprir os nossos acordos legais e políticas.
                </Text>

                <Heading as="h3" size="sm" color="text.primary.100">
                  ELIMINAR OS SEUS DADOS PESSOAIS
                </Heading>

                <Text fontSize="sm" color="text.primary.100">
                  Tem o direito de eliminar ou solicitar que o ajudemos a eliminar os Dados Pessoais que recolhemos sobre si. 
                  Pode atualizar, alterar ou eliminar as suas informações a qualquer tempo, iniciando sessão na sua Conta 
                  e visitando a secção de configurações da conta.
                </Text>

                <Heading as="h3" size="sm" color="text.primary.100">
                  SEGURANÇA DOS SEUS DADOS PESSOAIS
                </Heading>

                <Text fontSize="sm" color="text.primary.100">
                  A segurança dos seus Dados Pessoais é importante para nós, mas lembre-se de que nenhum método de transmissão 
                  pela Internet ou método de armazenamento eletrónico é 100% seguro. Embora nos esforcemos para usar meios 
                  comercialmente aceitáveis para proteger os seus Dados Pessoais, não podemos garantir a sua segurança absoluta.
                </Text>

                <Heading as="h3" size="sm" color="text.primary.100">
                  PRIVACIDADE DAS CRIANÇAS
                </Heading>

                <Text fontSize="sm" color="text.primary.100">
                  O nosso Serviço não se dirige a menores de 13 anos. Não recolhemos conscientemente informações pessoalmente 
                  identificáveis de menores de 13 anos. Se é pai ou tutor e tem conhecimento de que o seu filho nos forneceu 
                  Dados Pessoais, contacte-nos.
                </Text>

                <Heading as="h3" size="sm" color="text.primary.100">
                  ALTERAÇÕES A ESTA POLÍTICA DE PRIVACIDADE
                </Heading>

                <Text fontSize="sm" color="text.primary.100">
                  Podemos atualizar a nossa Política de Privacidade de tempos em tempos. Notificá-lo-emos de quaisquer alterações 
                  publicando a nova Política de Privacidade nesta página e atualizando a data de "Última atualização" no topo 
                  desta Política de Privacidade.
                </Text>

                <Heading as="h3" size="sm" color="text.primary.100">
                  CONTACTE-NOS
                </Heading>

                <Text fontSize="sm" color="text.primary.100">
                  Se tiver alguma questão sobre esta Política de Privacidade, pode contactar-nos:
                </Text>

                <Box pl={4}>
                  <Text fontSize="sm" color="text.primary.100">
                    <strong>Maia Borges Manager</strong><br/>
                    Portugal<br/>
                    Por email: <Text as="span" color="blue.500">maiaborgesmanager@gmail.com</Text>
                  </Text>
                </Box>
              </VStack>
            </Box>

            <Button
              width="full"
              className="SaveButton"
              onClick={onClose}
            >
              Aceitar e Fechar
            </Button>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default PrivacyPolicyModal;