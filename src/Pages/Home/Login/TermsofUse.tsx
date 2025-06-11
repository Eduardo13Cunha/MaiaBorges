import { Modal, ModalOverlay, ModalContent, ModalBody, HStack, Heading, Img, Spacer, VStack, Button, Text, Box } from "@chakra-ui/react";
import MaiaBorgesLogoGrande from "../../../Assets/MaiaBorgesLogoGrande.png";

interface TermsofUseModalProps {
  onClose: () => void;
}

export const TermsofUseModal: React.FC<TermsofUseModalProps> = ({
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
                    Termos de Uso
                </Heading>
                <Spacer />
                <Img src={MaiaBorgesLogoGrande} maxH="20%" maxW="20%" />
            </HStack>
            
            <Box 
              maxH="60vh" 
              overflowY="auto" 
              w="100%" 
              p={4}
              sx={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                '&::-webkit-scrollbar': {
                  display: 'none',
                },
              }}
            >
              <VStack spacing={4} align="start">
                <Text fontSize="sm" color="text.primary.100">
                  <strong>Última atualização:</strong> 07 de junho de 2025
                </Text>

                <Heading as="h2" size="md" color="text.primary.100">
                  ACORDO COM NOSSOS TERMOS LEGAIS
                </Heading>

                <Text fontSize="sm" color="text.primary.100">
                  Somos a <strong>Maia Borges Manager</strong> ('Empresa', 'nós', 'nosso'). 
                  Operamos o website <Text as="span" color="blue.500">https://maiaborgesmanager.netlify.app</Text> (o 'Site'), 
                  bem como quaisquer outros produtos e serviços relacionados que se referem ou vinculam a estes termos legais 
                  (os 'Termos Legais') (coletivamente, os 'Serviços').
                </Text>

                <Text fontSize="sm" color="text.primary.100">
                  Pode contactar-nos por email em <Text as="span" color="blue.500">maiaborgesmanager@gmail.com</Text> ou por correio para Portugal.
                </Text>

                <Text fontSize="sm" color="text.primary.100">
                  Estes Termos Legais constituem um acordo legalmente vinculativo feito entre você, pessoalmente ou em nome de uma entidade 
                  ('você'), e a Maia Borges Manager, sobre o seu acesso e uso dos Serviços. Você concorda que, ao aceder aos Serviços, 
                  leu, compreendeu e concordou em estar vinculado por todos estes Termos Legais. SE NÃO CONCORDAR COM TODOS ESTES TERMOS LEGAIS, 
                  ENTÃO ESTÁ EXPRESSAMENTE PROIBIDO DE USAR OS SERVIÇOS E DEVE DESCONTINUAR O USO IMEDIATAMENTE.
                </Text>

                <Heading as="h3" size="sm" color="text.primary.100">
                  1. NOSSOS SERVIÇOS
                </Heading>

                <Text fontSize="sm" color="text.primary.100">
                  As informações fornecidas ao usar os Serviços não se destinam à distribuição ou uso por qualquer pessoa ou entidade 
                  em qualquer jurisdição ou país onde tal distribuição ou uso seria contrário à lei ou regulamentação.
                </Text>

                <Heading as="h3" size="sm" color="text.primary.100">
                  2. DIREITOS DE PROPRIEDADE INTELECTUAL
                </Heading>

                <Text fontSize="sm" color="text.primary.100">
                  Somos proprietários ou licenciados de todos os direitos de propriedade intelectual nos nossos Serviços, incluindo todo o código fonte, 
                  bases de dados, funcionalidade, software, designs de websites, áudio, vídeo, texto, fotografias e gráficos nos Serviços 
                  (coletivamente, o 'Conteúdo'), bem como as marcas comerciais, marcas de serviço e logótipos neles contidos (as 'Marcas').
                </Text>

                <Heading as="h3" size="sm" color="text.primary.100">
                  3. REPRESENTAÇÕES DO UTILIZADOR
                </Heading>

                <Text fontSize="sm" color="text.primary.100">
                  Ao usar os Serviços, você representa e garante que: (1) tem capacidade legal e concorda em cumprir estes Termos Legais; 
                  (2) não é menor de idade na jurisdição em que reside; (3) não acederá aos Serviços através de meios automatizados ou não humanos; 
                  (4) não usará os Serviços para qualquer propósito ilegal ou não autorizado; e (5) o seu uso dos Serviços não violará 
                  qualquer lei ou regulamentação aplicável.
                </Text>

                <Heading as="h3" size="sm" color="text.primary.100">
                  4. ATIVIDADES PROIBIDAS
                </Heading>

                <Text fontSize="sm" color="text.primary.100">
                  Não pode aceder ou usar os Serviços para qualquer propósito que não seja aquele para o qual disponibilizamos os Serviços. 
                  Como utilizador dos Serviços, concorda em não:
                </Text>

                <Box pl={4}>
                  <Text fontSize="sm" color="text.primary.100">
                    • Recuperar sistematicamente dados dos Serviços para criar uma coleção ou base de dados<br/>
                    • Enganar, defraudar ou induzir em erro outros utilizadores<br/>
                    • Contornar recursos de segurança dos Serviços<br/>
                    • Disparar, difamar ou prejudicar os Serviços<br/>
                    • Usar informações dos Serviços para assediar ou prejudicar outras pessoas<br/>
                    • Fazer uso inadequado dos nossos serviços de suporte<br/>
                    • Usar os Serviços de forma inconsistente com leis aplicáveis
                  </Text>
                </Box>

                <Heading as="h3" size="sm" color="text.primary.100">
                  5. POLÍTICA DE PRIVACIDADE
                </Heading>

                <Text fontSize="sm" color="text.primary.100">
                  Preocupamo-nos com a privacidade e segurança dos dados. Por favor, reveja a nossa Política de Privacidade. 
                  Ao usar os Serviços, concorda em estar vinculado pela nossa Política de Privacidade.
                </Text>

                <Heading as="h3" size="sm" color="text.primary.100">
                  6. PRAZO E RESCISÃO
                </Heading>

                <Text fontSize="sm" color="text.primary.100">
                  Estes Termos Legais permanecerão em pleno vigor e efeito enquanto usar os Serviços. Reservamo-nos o direito de, 
                  a nosso critério exclusivo e sem aviso ou responsabilidade, negar acesso e uso dos Serviços a qualquer pessoa 
                  por qualquer motivo.
                </Text>

                <Heading as="h3" size="sm" color="text.primary.100">
                  7. LEI APLICÁVEL
                </Heading>

                <Text fontSize="sm" color="text.primary.100">
                  Estes Termos Legais são regidos e interpretados de acordo com as leis de Portugal.
                </Text>

                <Heading as="h3" size="sm" color="text.primary.100">
                  8. CONTACTE-NOS
                </Heading>

                <Text fontSize="sm" color="text.primary.100">
                  Para resolver uma reclamação sobre os Serviços ou para receber mais informações sobre o uso dos Serviços, 
                  contacte-nos em:
                </Text>

                <Box pl={4}>
                  <Text fontSize="sm" color="text.primary.100">
                    <strong>Maia Borges Manager</strong><br/>
                    Portugal<br/>
                    <Text as="span" color="blue.500">maiaborgesmanager@gmail.com</Text>
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

export default TermsofUseModal;