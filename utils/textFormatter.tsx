import React from "react";
import { View, StyleSheet, TextStyle, StyleProp } from "react-native";
import { Typography } from "../components/atoms/Typography";

const styles = StyleSheet.create({
  paragraph: { lineHeight: 24, marginBottom: 10 },
  heading: { marginTop: 18, marginBottom: 10 },
  listItem: { flexDirection: "row", marginBottom: 8, paddingLeft: 4 },
  bullet: { marginRight: 10, fontWeight: "bold" },
  listText: { flex: 1, lineHeight: 24 },
  spacing: { height: 6 },
  bold: { fontWeight: "700" },
  italic: { fontStyle: "italic" },
});

export const renderFormattedContent = (
  text: string,
  baseStyle?: StyleProp<TextStyle>
) => {
  const renderInlineStyles = (lineText: string) => {
    const parts = lineText.split(/(\*\*.*?\*\*|\*.*?\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <Typography
            key={index}
            variant="body"
            style={[styles.bold, baseStyle]}
          >
            {part.slice(2, -2)}
          </Typography>
        );
      }
      if (part.startsWith("*") && part.endsWith("*") && part.length > 2) {
        return (
          <Typography
            key={index}
            variant="body"
            style={[styles.italic, baseStyle]}
          >
            {part.slice(1, -1)}
          </Typography>
        );
      }
      return part;
    });
  };

  const lines = text.split("\n");
  return lines.map((line, index) => {
    const trimmedLine = line.trim();

    // 1. Heading (###)
    if (trimmedLine.startsWith("###")) {
      return (
        <Typography
          key={index}
          variant="h3"
          style={[styles.heading, baseStyle]}
        >
          {trimmedLine.replace("###", "").trim()}
        </Typography>
      );
    }

    // 2. List (*)
    if (trimmedLine.startsWith("*")) {
      return (
        <View key={index} style={styles.listItem}>
          <Typography variant="body" style={[styles.bullet, baseStyle]}>
            •
          </Typography>
          <Typography variant="body" style={[styles.listText, baseStyle]}>
            {renderInlineStyles(trimmedLine.substring(1).trim())}
          </Typography>
        </View>
      );
    }

    // 3. Spacing
    if (trimmedLine === "") return <View key={index} style={styles.spacing} />;

    // 4. Paragraf biasa
    return (
      <Typography
        key={index}
        variant="body"
        style={[styles.paragraph, baseStyle]}
      >
        {renderInlineStyles(trimmedLine)}
      </Typography>
    );
  });
};
