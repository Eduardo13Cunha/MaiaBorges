import {
    Input,
    InputGroup,
    InputRightElement,
    IconButton,
  } from "@chakra-ui/react";
  import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
  import { useState } from "react";
  
  const PasswordInput = ({ password, setPassword }: { password: string; setPassword: (val: string) => void }) => {
    const [show, setShow] = useState(false);
  
    const handleToggle = () => setShow(!show);
  
    return (
      <InputGroup>
        <Input
          type={show ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <InputRightElement>
          <IconButton
            variant="none"
            aria-label={show ? "Ocultar palavra-passe" : "Mostrar palavra-passe"}
            icon={show ? <ViewOffIcon /> : <ViewIcon />}
            onClick={handleToggle}
          />
        </InputRightElement>
      </InputGroup>
    );
  };
  
  export default PasswordInput;
  