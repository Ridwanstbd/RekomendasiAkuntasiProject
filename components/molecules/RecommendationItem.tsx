import React from "react";
import { View, StyleSheet } from "react-native";
import { Typography } from "../atoms/Typography";
import { Card } from "../atoms/Card";
import { Badge } from "../atoms/Badge";
import { AIRecommendation } from "@/types/accounting";

interface Props {
  item: AIRecommendation;
}

export const RecommendationItem: React.FC<Props> = ({ item }) => {
  const getColor = (type: string) => {
    switch (type) {
      case "CostSaving":
        return "#FF3B30";
      case "RevenueOptimization":
        return "#34C759";
      case "CashFlow":
        return "#007AFF";
      default:
        return "#5856D6";
    }
  };

  return (
    <Card style={styles.container}>
      <View style={styles.header}>
        <Badge
          label={item.recommendationType}
          color={getColor(item.recommendationType)}
        />
        <Typography variant="body" style={styles.date}>
          {item.month}/{item.year}
        </Typography>
      </View>
      <Typography variant="body" style={styles.text}>
        {item.recommendationText}
      </Typography>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: { marginBottom: 16, padding: 16 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  date: { fontSize: 12, color: "#8E8E93" },
  text: { lineHeight: 22, color: "#1C1C1E" },
});
