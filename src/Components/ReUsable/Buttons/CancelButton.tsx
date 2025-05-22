// src/components/SaveButton.tsx

import { Button, ButtonProps } from "@chakra-ui/react";
import { FaTimes } from "react-icons/fa";

interface CancelButtonProps extends ButtonProps {
  onClick: () => void;
}

export function CancelButton({ onClick, ...props }: CancelButtonProps) {
  return (
    <Button
      onClick={onClick}
      leftIcon={<FaTimes/>}
      className="CancelButton"
      {...props}
    >
       Cancelar
    </Button>
  );
}
