import { Modal, ModalOverlay, ModalContent, ModalBody, HStack, Heading, Img, Spacer, VStack, FormControl, FormLabel, Button, useToast } from "@chakra-ui/react";
import { MdEmail } from "react-icons/md";
import MaiaBorgesLogoGrande from "../../../Assets/MaiaBorgesLogoGrande.png";
import { IconInput } from "../../../Components/ReUsable/Inputs/IconInput";
import { useState } from "react";
import axios from "axios";
import { FaKey } from "react-icons/fa";
import PasswordInput from "../../../Components/ReUsable/Inputs/PasswordInput";

interface MudarPalavraPasseModalProps {
  onClose: () => void;
  colaboradorId?: string;
}

export const MudarPalavraPasseModal: React.FC<MudarPalavraPasseModalProps> = ({
  onClose,
  colaboradorId,
}) => {
  const [password, setPassword] = useState<string>("");
  const [passwordConfirm, setPasswordConfirm] = useState<string>("");
  const Toast = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    try {
        if( password !== passwordConfirm) {
            Toast({
                title: "Palavra-Passe Incompatível",
                description: "As palavras-passe não coincidem. Por favor, tente novamente.",
                status: "error",
            });
            return;
        }
        await axios.put(`/.netlify/functions/colaboradores/${colaboradorId}/changePassword`, { nova_senha: password });
        Toast({
            title: "Palavra-Passe Alterada",
            description: "A sua palavra-passe foi alterada com sucesso.",
            status: "success",
            duration: 5000,
            isClosable: true,
        });
    } catch (error: any) {
        Toast({
            title: "Erro no servidor",
            description: "Ocorreu um erro ao processar sua solicitação. Por favor, tente novamente mais tarde.",
            status: "error",
            duration: 5000,
            isClosable: true,
        });
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
                    Mudar Palavra-Passe
                </Heading>
                <Spacer />
                <Img src={MaiaBorgesLogoGrande} maxH="20%" maxW="20%" />
            </HStack>
            <FormControl>
              <FormLabel>
                  <strong>Nova Palavra-Passe</strong>
              </FormLabel>
              <PasswordInput password={password} setPassword={(x: string) => setPassword(x ?? "")} />
            </FormControl>
            <FormControl>
              <FormLabel>
                  <strong>Confirmar Nova Palavra-Passe</strong>
              </FormLabel>
              <PasswordInput password={passwordConfirm} setPassword={(x:any) => setPasswordConfirm(x ?? "")} />
            </FormControl>
            <Button
            width="full"
            className="SaveButton"
            onClick={handleSubmit}
            >
            Mudar Palavra-Passe
            </Button>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}