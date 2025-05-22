// src/components/SaveButton.tsx

import { Button, ButtonProps } from "@chakra-ui/react";
import { FaSave } from "react-icons/fa";

interface SaveButtonProps extends ButtonProps {
  onClick?: () => void;
  type?: "submit" | "button" | "reset";
}

export function SaveButton({ onClick, ...props }: SaveButtonProps) {
  return (
    <Button
      type={props.type || "button"}
      onClick={onClick}
      leftIcon={<FaSave/>}
      className="SaveButton"
      {...props}
    >
       Salvar
    </Button>
  );
}

export function CreateButton({ onClick, ...props }: SaveButtonProps) {
  return (
    <Button
      type={props.type || "button"}
      onClick={onClick}
      leftIcon={<FaSave/>}
      className="SaveButton"
      {...props}
    >
       Criar
    </Button>
  );
}
