import React, { useRef } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from "react-native";
import { useHeaderHeight } from "@react-navigation/elements"; // Gunakan ini untuk akurasi tinggi header
import { ChatMessageItem } from "../molecules/ChatMessageItem";
import { ChatInputArea } from "../molecules/ChatInputArea";

interface ChatInterfaceProps {
  messages: any[];
  prompt: string;
  setPrompt: (t: string) => void;
  includeData: boolean;
  setIncludeData: (v: boolean) => void;
  loading: boolean;
  onSend: () => void;
}

export const ChatInterface = (props: ChatInterfaceProps) => {
  const flatListRef = useRef<FlatList>(null);
  const headerHeight = useHeaderHeight(); // Mengambil tinggi header secara dinamis

  return (
    <KeyboardAvoidingView
      // behavior "padding" sangat disarankan untuk iOS
      // Untuk Android, seringkali lebih baik "height" atau tidak diisi jika windowSoftInputMode adalah adjustResize
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
      // Gunakan headerHeight sebagai offset agar input tidak tertutup keyboard atau terangkat terlalu tinggi
      keyboardVerticalOffset={headerHeight}
    >
      <FlatList
        ref={flatListRef}
        data={props.messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ChatMessageItem text={item.text} sender={item.sender} />
        )}
        contentContainerStyle={styles.chatList}
        onContentSizeChange={() =>
          flatListRef.current?.scrollToEnd({ animated: true })
        }
      />
      <ChatInputArea {...props} />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  chatList: {
    paddingHorizontal: 16,
    paddingBottom: 20,
    paddingTop: 10,
  },
});
