import { useToast, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, Button,  Textarea } from "@chakra-ui/react";
import axios from "axios";
import Cookies from "js-cookie";
import { useState } from "react";

interface ClienteModalProps {
  onClose: () => void;
}

export const ContactosModal: React.FC<ClienteModalProps> = ({
  onClose
}) => {
    const [sugestao, setSugestao] = useState('');
    const showToast = useToast();

    const handleSubmit = async () => {
        const userName= Cookies.get('userName');
        const userId= Cookies.get('userId');
        if (sugestao !== "") {
        try {
            await axios.post('/.netlify/functions/email/send-email', { userName, userId, sugestao });
            showToast({
              title: 'Sugestão enviada com sucesso!!',
              description: 'Sugestão enviada com sucesso para o administrador.',
              status: 'success',
            });
            setSugestao('');
        } catch (error) {
            console.error('Erro ao enviar o email:', error);
            showToast({
              title: 'Erro ao enviar a sugestão',
              description: 'Ocorreu um erro ao enviar a sugestão. Tente novamente mais tarde.',
              status: 'error',
            });
        }
        } else {
            showToast({
                title: 'Preencha o campo de sugestão',
                description: 'Por favor, preencha o campo de sugestão.',
                status: 'error',
            });
        };
    };

  return (
    <Modal onClose={onClose} isOpen={true}>
      <ModalOverlay />
      <ModalContent className="TableModal">
        <ModalHeader>
          Contacte-nos
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
            <Textarea size="lg" value={sugestao} onChange={(e) => setSugestao(e.target.value)}/>          
            <Button type="submit" onClick={handleSubmit} className="SaveButton">
              Enviar
            </Button>
            <Button onClick={onClose} className="CancelButton">
              Cancelar
            </Button>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};