import React from "react";
import { View, StyleSheet } from "react-native";
import { Card } from "../atoms/Card";
import { Typography } from "../atoms/Typography";
import { User, Bot } from "lucide-react-native";
import { renderFormattedContent } from "../../utils/textFormatter"; // Sesuaikan path

interface ChatMessageItemProps {
  text: string;
  sender: "user" | "ai";
}

export const ChatMessageItem = ({ text, sender }: ChatMessageItemProps) => (
  <View
    style={[
      styles.bubbleWrapper,
      sender === "user" ? styles.userWrapper : styles.aiWrapper,
    ]}
  >
    <View style={styles.avatarContainer}>
      {sender === "ai" ? (
        <Bot size={20} color="#5856D6" />
      ) : (
        <User size={20} color="#8E8E93" />
      )}
    </View>
    <Card
      style={[
        styles.bubble,
        sender === "user" ? styles.userBubble : styles.aiBubble,
      ]}
    >
      {/* Ganti <Typography> pembungkus dengan View karena 
        renderFormattedContent mengembalikan komponen View/Typography sendiri 
      */}
      <View>
        {renderFormattedContent(
          text,
          sender === "user" ? styles.userText : styles.aiText
        )}
      </View>
    </Card>
  </View>
);

const styles = StyleSheet.create({
  bubbleWrapper: { flexDirection: "row", marginBottom: 16, maxWidth: "85%" },
  userWrapper: { alignSelf: "flex-end", flexDirection: "row-reverse" },
  aiWrapper: { alignSelf: "flex-start" },
  avatarContainer: { marginHorizontal: 8, marginTop: 4 },
  bubble: { padding: 12, borderRadius: 16 },
  userBubble: { backgroundColor: "#007AFF", borderTopRightRadius: 2 },
  aiBubble: { backgroundColor: "#F2F2F7", borderTopLeftRadius: 2 },
  userText: { color: "#FFF" },
  aiText: { color: "#1C1C1E" },
});
