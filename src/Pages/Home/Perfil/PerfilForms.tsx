import { Box, Button, FormControl, FormLabel, HStack, Spacer, Text, VStack} from "@chakra-ui/react";
import { FaCalendar, FaEdit, FaEnvelope, FaKey, FaUser } from "react-icons/fa";
import { Dispatch, SetStateAction } from "react";
import { CancelButton } from "../../../Components/ReUsable/Buttons/CancelButton";
import { SaveButton } from "../../../Components/ReUsable/Buttons/SaveButton";
import { IconInput } from "../../../Components/ReUsable/Inputs/IconInput";

interface PerfilProps {
  profile: any;
  editingProfile: any;
  setEditingProfile: Dispatch<SetStateAction<any>>;
  isEditing: boolean;
  setIsEditing: Dispatch<SetStateAction<boolean>>;
  handleChange: (field: string, value: string) => void;
  handleSaveProfile: () => void;
}

export function PerfilForms({
  profile,
  editingProfile,
  setEditingProfile,
  isEditing,
  setIsEditing,
  handleChange,
  handleSaveProfile,
}: PerfilProps) {

  return (
    <>
      <HStack>
        <Text fontSize="2xl" fontWeight="bold" color="text.primary.100" mb="2%">
          PERFIL
        </Text>
        <Spacer/>
        <Button size="sm" mb="2%" left="2%" leftIcon={<FaKey />} className="SaveButton">
          Mudar Palavra-Passe
        </Button>
      </HStack>
      <VStack spacing={6} align="stretch" color="text.primary.100">
        <FormControl isRequired>
          <FormLabel>Nome</FormLabel>
          <IconInput
            value={editingProfile?.nome || ""}
            icon={<FaUser />}
            isDisabled={!isEditing}
            onChange={(x) => handleChange("nome", x ?? "")}
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Data de Nascimento</FormLabel>
          <IconInput
            value={editingProfile.data_nascimento}
            type="date"
            icon={<FaCalendar />}
            isDisabled={!isEditing}
            onChange={(x) => handleChange("data_nascimento", x ?? "")}
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Email</FormLabel>
          <IconInput
            value={editingProfile.email || ""}
            type="email"
            icon={<FaEnvelope />}
            isDisabled={!isEditing}
            onChange={(x) => handleChange("email", x ?? "")}
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Número</FormLabel>
          <IconInput
            value={editingProfile.numero || ""}
            type="number"
            icon={<FaEnvelope />}
            isDisabled={!isEditing}
            onChange={(x) => handleChange("numero", x ?? "")}
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Turno</FormLabel>
          <Box cursor="default" as={Button} className="TableMenu">
            {editingProfile.turnos.descricao}
          </Box>
        </FormControl>

        {isEditing ? (
          <HStack>
            <SaveButton onClick={handleSaveProfile} />
            <CancelButton onClick={() => {
              setIsEditing(false);
              setEditingProfile(profile);
            }} />
          </HStack>
        ) : (
          <HStack>
            <Button
              leftIcon={<FaEdit />}
              onClick={() => setIsEditing(true)}
              className="SaveButton"
            >
              Editar Perfil
            </Button>
          </HStack>
        )}
      </VStack>
    </>
  );
}
