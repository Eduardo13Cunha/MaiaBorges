// src/components/Toaster.tsx
"use client";

import { useToast } from "@chakra-ui/react";

export const useCustomToast = () => {
  const toast = useToast();

  const showToast = ({
    title,
    description,
    status = "info",
    duration = 5000,
    isClosable = true,
  }: {
    title: string;
    description?: string;
    status?: "info" | "warning" | "success" | "error" | "loading";
    duration?: number;
    isClosable?: boolean;
  }) => {
    toast({
      title,
      description,
      status,
      duration,
      isClosable,
      position: "bottom-right",
    });
  };

  return showToast;
};
