import { Text,useToast,Box,VStack,Img,FormControl,FormLabel,Button,Heading,HStack,Spacer, Checkbox } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import MaiaBorgesLogoGrande from "../../../Assets/MaiaBorgesLogoGrande.png";
import Cookies from "js-cookie";
import { Colaborador } from "../../../Interfaces/interfaces";
import axios from "axios";
import { MdEmail } from "react-icons/md";
import PasswordInput from "../../../Components/ReUsable/Inputs/PasswordInput";
import { IconInput } from "../../../Components/ReUsable/Inputs/IconInput";
import { RecuperarModal } from "./RecuperarModal";
import ReCAPTCHA from "react-google-recaptcha";
import TermsofUseModal from "./TermsofUse";
import PrivacyPolicyModal from "./PrivacyPolity";

const LoginPage = () => {
  const [showRecuperarModal, setShowRecuperarModal] = useState(false);
  const [showTermsofUse, setShowTermsofUse] = useState(false);
  const [showPoliticaPrivacidade, setShowPoliticaPrivacidade] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [captchaValue, setCaptchaValue] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);
  const showToast = useToast();

  useEffect(() => {
    const isLoggedIn = Cookies.get('IsLoggedIn');
    if (isLoggedIn) {
      window.location.href = '/HomePage';
    }
  }
  , []);

  const handleLogin = async () => {
      try {
          if (email === "" || password === "") {
            showToast({
              title: 'Preencha todos os campos',
              description: 'Por favor, preencha todos os campos obrigatórios.',
              status: 'error',
            });
            return;
          }
          if (!captchaValue) {
            showToast({
              title: 'Captcha não resolvido',
              description: 'Por favor, resolva o captcha antes de continuar.',
              status: 'error',
            });
            return;
          }
          if (checked == false) {
            showToast({
              title: 'Termos de uso não aceitos',
              description: 'Por favor, aceite os termos de uso e a política de privacidade.',
              status: 'error',
            });
            return;
          }
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
        mt="0%"
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
          <FormControl isRequired> 
            <ReCAPTCHA
              sitekey="6Lcd0UcrAAAAAL6ebSjSvUqYk6ODcnAw0oaioog9"
              onChange={value => setCaptchaValue(value)}
            />
          </FormControl>
          <FormControl isRequired>
            <Checkbox
              isChecked={checked}
              onChange={e => setChecked(e.target.checked)}
            >
              <HStack><Text>Eu li e aceito os</Text><Text onClick={() => setShowTermsofUse(true)}>Termos de Uso</Text><Text>e a</Text><Text onClick={() => setShowPoliticaPrivacidade(true)}>Política de Privacidade</Text></HStack>
            </Checkbox>
          </FormControl>
          <Button
            width="full"
            className="SaveButton"
            onClick={handleLogin}
          >
            Entrar
          </Button>
        </VStack>
        {showRecuperarModal && (
          <RecuperarModal
            onClose={() => setShowRecuperarModal(false)}
          />
        )}
        {showTermsofUse && (
          <TermsofUseModal
            onClose={() => setShowTermsofUse(false)}
          />
        )}
        {showPoliticaPrivacidade && (
          <PrivacyPolicyModal
            onClose={() => setShowPoliticaPrivacidade(false)}
          />
        )}
      </Box>
  );
};

export default LoginPage;
