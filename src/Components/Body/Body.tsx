import { Box, StackProps, VStack } from "@chakra-ui/react";

export default function Body(props: StackProps) {
    return (
        <Box 
            bgColor="bg.primary.100"
            minH="92vh" 
            display="flex" 
            flexDirection="column" 
        >
            <VStack
                className="glass-dark"
                w="100%" 
                flex="1"
                {...props}
            >
                {props.children}
            </VStack>
        </Box>
    );
}