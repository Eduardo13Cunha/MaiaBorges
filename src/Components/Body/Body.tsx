import { Box, StackProps, VStack } from "@chakra-ui/react";
import HackingAzul from "../../Assets/HackingAzul2.jpeg";

export default function Body(props: StackProps) {
    return (
        <Box 
            bgColor="rgba(84, 99, 172, 1)"
            minH="92vh" 
            display="flex" 
            flexDirection="column" 
        >
            <VStack
                className="glass-dark"
                w="100%" 
                flex="1" // Permite que o VStack cresça para preencher o espaço disponível
                {...props}
            >
                {props.children}
            </VStack>
        </Box>
    );
}