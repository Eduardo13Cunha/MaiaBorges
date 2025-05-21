import { InputGroup, InputRightElement, IconButton} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useState } from "react";
import { IconInput } from "./IconInput";
import { FaKey } from "react-icons/fa";
  
const PasswordInput = ({ password, setPassword }: { password: string; setPassword: (val: string) => void }) => {
  const [show, setShow] = useState(false);
  const handleToggle = () => setShow(!show);

  return (
    <InputGroup>
      <IconInput
        type={show ? "text" : "password"}
        value={password}
        onChange={(x) => setPassword(x ?? "")}
        icon={<FaKey/>}
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
  