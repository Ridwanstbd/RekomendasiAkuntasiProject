import React, { useState, useEffect } from "react";
import { Alert } from "react-native";
import { MainLayoutTemplate } from "@/components/templates/MainLayoutTemplate";
import { ChatInterface } from "@/components/organisms/ChatInterface";
import { AIRecommendation } from "@/types/accounting";
import api from "@/services/api";

interface ChatMessage {
  id: string;
  text: string;
  sender: "user" | "ai";
  timestamp: Date;
}

export default function CustomAIRecommendationScreen() {
  const [prompt, setPrompt] = useState("");
  const [includeData, setIncludeData] = useState(true);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await api.get("/api/recommendations", {
        params: { isCustom: true, limit: 20 },
      });

      const history: ChatMessage[] = [];
      res.data.data.forEach((item: AIRecommendation) => {
        if (item.customPrompt) {
          history.push({
            id: `q-${item.id}`,
            text: item.customPrompt,
            sender: "user",
            timestamp: new Date(item.generatedAt),
          });
        }
        history.push({
          id: `a-${item.id}`,
          text: item.recommendationText,
          sender: "ai",
          timestamp: new Date(item.generatedAt),
        });
      });

      setMessages(
        history.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
      );
    } catch (err) {
      console.error("Gagal ambil riwayat:", err);
    }
  };

  const handleAskAI = async () => {
    if (prompt.trim().length < 5) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      text: prompt,
      sender: "user",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    const currentPrompt = prompt;
    setPrompt("");
    setLoading(true);

    try {
      const now = new Date();
      const res = await api.post("/api/recommendations/custom", {
        prompt: currentPrompt,
        includeFinancialData: includeData,
        year: now.getFullYear(),
        month: now.getMonth() + 1,
      });

      const aiResponse = res.data.data.recommendation;
      setMessages((prev) => [
        ...prev,
        {
          id: aiResponse.id,
          text: aiResponse.recommendationText,
          sender: "ai",
          timestamp: new Date(aiResponse.generatedAt),
        },
      ]);
    } catch (err: any) {
      Alert.alert("Gagal", "Terjadi kesalahan saat menghubungi AI.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayoutTemplate
      onRefresh={fetchHistory}
      isScrollable={false}
      style={{ padding: 0 }}
    >
      <ChatInterface
        messages={messages}
        prompt={prompt}
        setPrompt={setPrompt}
        includeData={includeData}
        setIncludeData={setIncludeData}
        loading={loading}
        onSend={handleAskAI}
      />
    </MainLayoutTemplate>
  );
}
