import { Modal, ModalOverlay, ModalContent, ModalBody, HStack, Heading, Img, Spacer, VStack, FormControl, FormLabel, Button, useToast } from "@chakra-ui/react";
import { MdEmail } from "react-icons/md";
import MaiaBorgesLogoGrande from "../../../Assets/MaiaBorgesLogoGrande.png";
import { IconInput } from "../../../Components/ReUsable/Inputs/IconInput";
import { useState } from "react";
import axios from "axios";

interface RecuperarModalProps {
  onClose: () => void;
}

export const RecuperarModal: React.FC<RecuperarModalProps> = ({
  onClose,
}) => {
  const [email, setEmail] = useState<string>("");
  const Toast = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    try {
        await axios.post('/.netlify/functions/email/recuperar-email', { userEmail: email });
        Toast({
            title: "Email enviado",
            description: "Por favor, verifique o seu email para continuar.",
            status: "success",
            duration: 5000,
            isClosable: true,
        });
    } catch (error: any) {
        if (error.response && error.response.status === 404) {
          Toast({
              title: "Email não encontrado",
              description: "O email fornecido não está registrado. Por favor, verifique e tente novamente.",
              status: "error",
              duration: 5000,
              isClosable: true,
          });
        }
        else {
          Toast({
              title: "Erro no servidor",
              description: "Ocorreu um erro ao processar sua solicitação. Por favor, tente novamente mais tarde.",
              status: "error",
              duration: 5000,
              isClosable: true,
          });
        }
        console.error("Erro ao enviar email:", error);
    }
  }

  return (
    <Modal isOpen={true} onClose={onClose}>
      <ModalOverlay/>
      <ModalContent className="TableModal" pb="1.5%">
        <ModalBody>
          <VStack spacing={6}>
            <HStack>
                <Heading as="h1" textAlign="center">
                    Recuperar Palavra-Passe
                </Heading>
                <Spacer />
                <Img src={MaiaBorgesLogoGrande} maxH="20%" maxW="20%" />
            </HStack>
            <FormControl>
              <FormLabel>
                  <strong>Email</strong>
              </FormLabel>
              <IconInput type="email" value={email} icon={<MdEmail />} onChange={x => setEmail(x ?? "")} />
            </FormControl>
            <Button
            width="full"
            className="SaveButton"
            onClick={handleSubmit}
            >
            Enviar Email de Recuperação
            </Button>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}