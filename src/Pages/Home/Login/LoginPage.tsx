import { Text,useToast,Box,VStack,Img,FormControl,FormLabel,Button,Heading,HStack,Spacer} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import MaiaBorgesLogoGrande from "../../../Assets/MaiaBorgesLogoGrande.png";
import Cookies from "js-cookie";
import { Colaborador } from "../../../Interfaces/interfaces";
import axios from "axios";
import { MdEmail } from "react-icons/md";
import PasswordInput from "../../../Components/ReUsable/Inputs/PasswordInput";
import { IconInput } from "../../../Components/ReUsable/Inputs/IconInput";
import { ReCaptchaModal } from "./ReCaptchaModal";
import { RecuperarModal } from "./RecuperarModal";

const LoginPage = () => {
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [showRecuperarModal, setShowRecuperarModal] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [captchaValue, setCaptchaValue] = useState<string | null>(null);
  const showToast = useToast();

  useEffect(() => {
    const isLoggedIn = Cookies.get('IsLoggedIn');
    if (isLoggedIn) {
      window.location.href = '/HomePage';
    }
  }
  , []);

  useEffect(() =>{
    handleLogin();
  }, [captchaValue])

  const handleSubmit = async () =>{
    if (email === "" || password === "") {
      showToast({
        title: 'Preencha todos os campos',
        description: 'Por favor, preencha todos os campos obrigatórios.',
        status: 'error',
      });
      return;
    }
    setShowCaptcha(true);

  }

  const handleLogin = async () => {
      try {
          const response = await axios.post('/.netlify/functions/auth', { email, password });
          
          const user = (response.data as { data: Colaborador }).data;

          Cookies.set('userName', user.nome);
          Cookies.set('IsLoggedIn', true.toString());
          Cookies.set('roleId', user.id_cargo.toString());
          Cookies.set('userId', user.id_colaborador.toString());
          window.location.href = '/HomePage';
      } catch (error: any) {
          if (error?.response?.status === 404) {
            showToast({
              title: 'Email inválido',
              description: 'Verifique se o email está correto.',
              status: 'error',
            });
          } else if (error?.response?.status === 401) {
            showToast({
              title: 'Password inválida',
              description: 'Verifique se a password está correta.',
              status: 'error',
            });
          }
      }
  };

  return (
      <Box
        p={8}
        bg="white"
        borderRadius="xl"
        boxShadow="lg"
        w="100%"
        maxW="400px"
        className="TableModal"
      >
        <VStack spacing={6}>
          <HStack>
            <Heading as="h1" textAlign="center">
              Iniciar Sessão
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

          <FormControl>
            <FormLabel>
              <strong>Palavra-Passe</strong>
            </FormLabel>
            <PasswordInput password={password} setPassword={setPassword}/>
            <Text cursor="pointer" _hover={{textDecoration:"underline"}} onClick={() => setShowRecuperarModal(true)}>
              Esqueci a minha palavra-passe
            </Text>
          </FormControl>
          <Button
            width="full"
            className="SaveButton"
            onClick={handleSubmit}
          >
            Entrar
          </Button>
        </VStack>
        {showCaptcha && (
          <ReCaptchaModal
            onClose={() => setShowCaptcha(false)}
            setCaptchaValue={setCaptchaValue}
          />
        )}
        {showRecuperarModal && (
          <RecuperarModal
            onClose={() => setShowRecuperarModal(false)}
          />
        )}
      </Box>
  );
};

export default LoginPage;
