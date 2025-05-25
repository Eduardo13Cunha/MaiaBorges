import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, Box } from "@chakra-ui/react";
import ReCAPTCHA from "react-google-recaptcha";

interface ReCaptchaModalProps {
  onClose: () => void;
  setCaptchaValue: React.Dispatch<React.SetStateAction<string | null>>;
}

export const ReCaptchaModal: React.FC<ReCaptchaModalProps> = ({
  onClose,
  setCaptchaValue,
}) => {

  const handleCaptchaChange = (value: string | null) => {
    setCaptchaValue(value);
  };

  return (
    <Modal isOpen={true} onClose={onClose}>
      <ModalOverlay />
      <ModalContent h="80%" bg="none" boxShadow="none">
        <ModalBody pb={6}>
          <Box h="100%" display="flex" alignItems="center" justifyContent="center">
            <ReCAPTCHA
              sitekey="6Lcd0UcrAAAAAL6ebSjSvUqYk6ODcnAw0oaioog9"
              onChange={handleCaptchaChange}
            />
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}