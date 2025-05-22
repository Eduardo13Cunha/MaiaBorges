// src/components/SaveButton.tsx

import { Button, ButtonProps } from "@chakra-ui/react";
import { FaTrash } from "react-icons/fa";

interface DeleteButtonProps extends ButtonProps {
  onClick: () => void;
}

export function DeleteButton({ onClick, ...props }: DeleteButtonProps) {
  return (
    <Button
      onClick={onClick}
      leftIcon={<FaTrash/>}
      ml="43.5%"
      mt="2%"
      color="white"
      bgColor="Red"
      {...props}
    >
       Eliminar
    </Button>
  );
}
