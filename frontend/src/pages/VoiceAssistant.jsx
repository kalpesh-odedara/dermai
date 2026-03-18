import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { VoiceAssistant as VoiceAssistantModal } from "@/components/chat/VoiceAssistant";

const VoiceAssistantPage = () => {
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();

  // When modal closes, go back to previous page (or home)
  const handleClose = () => {
    setIsOpen(false);
    setTimeout(() => navigate(-1), 200);
  };

  return (
    <Layout>
      <VoiceAssistantModal isOpen={isOpen} onClose={handleClose} />
    </Layout>
  );
};

export default VoiceAssistantPage;
