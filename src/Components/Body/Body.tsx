import { Box, StackProps, VStack } from "@chakra-ui/react";

export default function Body(props: StackProps) {
    return (
        <Box 
            bgColor="rgba(100, 100, 230,0.8)"
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