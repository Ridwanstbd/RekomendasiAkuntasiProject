import React from "react";
import { View, StyleSheet } from "react-native";
import { Typography } from "../atoms/Typography";
import { Card } from "../atoms/Card";
import { Badge } from "../atoms/Badge";
import { AIRecommendation } from "@/types/accounting";
import { renderFormattedContent } from "../../utils/textFormatter";

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
        <Typography variant="caption" style={styles.date}>
          {item.month}/{item.year}
        </Typography>
      </View>
      <View>{renderFormattedContent(item.recommendationText)}</View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#E5E5EA",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  date: { color: "#8E8E93" },
});
