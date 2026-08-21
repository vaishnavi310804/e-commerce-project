import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import ScreenWrapper from "@/src/components/common/ScreenWrapper";
import Colors from "@/src/constants/colors";
import Fonts from "@/src/constants/fonts";
import { getMyTickets, Ticket } from "@/src/api/ticket.api";

const TicketScreen = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTickets = async () => {
    try {
      setLoading(true);

      const response = await getMyTickets();

      if (response.success) {
        setTickets(response.data || []);
      }
    } catch (error) {
      console.log("Fetch Tickets Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchTickets();
    }, []),
  );

  const getStatusStyle = (status: Ticket["status"]) => {
    switch (status) {
      case "Open":
        return styles.openStatus;

      case "In Progress":
        return styles.progressStatus;

      case "Resolved":
        return styles.resolvedStatus;

      case "Closed":
        return styles.closedStatus;

      default:
        return styles.openStatus;
    }
  };

  const getPriorityStyle = (priority: Ticket["priority"]) => {
    switch (priority) {
      case "Critical":
        return styles.criticalPriority;

      case "High":
        return styles.highPriority;

      case "Medium":
        return styles.mediumPriority;

      case "Low":
        return styles.lowPriority;

      default:
        return styles.mediumPriority;
    }
  };

  const renderTicket = ({ item }: { item: Ticket }) => {
    return (
      <TouchableOpacity
        activeOpacity={0.85}
        style={styles.ticketCard}
        onPress={() =>
          router.push({
            pathname: "/ticket-details",
            params: {
              ticketId: item._id,
            },
          })
        }
      >
        <View style={styles.ticketHeader}>
          <View style={styles.ticketNumberContainer}>
            <Text style={styles.ticketNumber}>{item.ticketNumber}</Text>
          </View>

          <View style={[styles.statusBadge, getStatusStyle(item.status)]}>
            <Text style={styles.statusText}>{item.status}</Text>
          </View>
        </View>

        <Text style={styles.subject} numberOfLines={2}>
          {item.subject}
        </Text>

        <Text style={styles.category}>{item.category}</Text>

        <View style={styles.divider} />

        <View style={styles.bottomRow}>
          <View>
            <Text style={styles.label}>Priority</Text>

            <View
              style={[styles.priorityBadge, getPriorityStyle(item.priority)]}
            >
              <Text style={styles.priorityText}>{item.priority}</Text>
            </View>
          </View>

          <View style={styles.dateContainer}>
            <Text style={styles.label}>Created</Text>

            <Text style={styles.date}>
              {new Date(item.createdAt).toLocaleDateString("en-US", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </Text>
          </View>
        </View>

        {item.order && (
          <View style={styles.orderContainer}>
            <Ionicons name="bag-outline" size={17} color={Colors.gray} />

            <Text style={styles.orderText}>
              Order #{item.order.orderNumber}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <ScreenWrapper>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="chevron-back" size={22} color={Colors.text} />
          </TouchableOpacity>

          <Text style={styles.title}>My Tickets</Text>

          <View style={styles.headerPlaceholder} />
        </View>

        <FlatList
          data={tickets}
          keyExtractor={(item) => item._id}
          renderItem={renderTicket}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.list,
            tickets.length === 0 && styles.emptyList,
          ]}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>

              <Text style={styles.emptyTitle}>No Tickets Yet</Text>

              <Text style={styles.emptyText}>
                Facing an issue with your order, payment, delivery,
                refund, or anything else, raise a ticket and we'll look into it.
              </Text>
            </View>
          }
        />
        <TouchableOpacity
          style={styles.raiseButton}
          activeOpacity={0.85}
          onPress={() => router.push("/ticket-raise")}
        >

          <Text style={styles.raiseButtonText}>Raise a Ticket</Text>
        </TouchableOpacity>
      </View>
    </ScreenWrapper>
  );
};

export default TicketScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  header: {
    height: 64,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },

  headerPlaceholder: {
    width: 42,
  },

  title: {
    fontSize: 21,
    fontFamily: Fonts.bold,
    color: Colors.text,
  },

  list: {
    padding: 20,
    paddingBottom: 100,
  },

  emptyList: {
    flexGrow: 1,
    justifyContent: "center",
  },

  ticketCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 17,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#EEEEEE",
  },

  ticketHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  ticketNumberContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  ticketNumber: {
    marginLeft: 8,
    fontSize: 13,
    fontFamily: Fonts.semibold,
    color: Colors.gray,
  },

  statusBadge: {
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: 20,
  },

  statusText: {
    fontSize: 12,
    fontFamily: Fonts.semibold,
  },

  openStatus: {
    backgroundColor: "#FFF3E0",
  },

  progressStatus: {
    backgroundColor: "#E1F5FE",
  },

  resolvedStatus: {
    backgroundColor: "#E8F0FF",
  },

  closedStatus: {
    backgroundColor: "#F0F0F0",
  },

  subject: {
    marginTop: 15,
    fontSize: 17,
    lineHeight: 23,
    fontFamily: Fonts.bold,
    color: Colors.text,
  },

  category: {
    marginTop: 5,
    fontSize: 13,
    fontFamily: Fonts.medium,
    color: Colors.gray,
  },

  divider: {
    height: 1,
    backgroundColor: "#EEEEEE",
    marginVertical: 15,
  },

  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  label: {
    fontSize: 11,
    fontFamily: Fonts.medium,
    color: Colors.gray,
    marginBottom: 5,
  },

  priorityBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 12,
  },

  priorityText: {
    fontSize: 11,
    fontFamily: Fonts.semibold,
  },

  criticalPriority: {
    backgroundColor: "#FFE3E3",
  },

  highPriority: {
    backgroundColor: "#FFEBEE",
  },

  mediumPriority: {
    backgroundColor: "#FFF3E0",
  },

  lowPriority: {
    backgroundColor: "#F5F5F5",
  },

  dateContainer: {
    alignItems: "flex-end",
  },

  date: {
    fontSize: 13,
    fontFamily: Fonts.semibold,
    color: Colors.text,
  },

  orderContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 15,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F1F1F1",
  },

  orderText: {
    marginLeft: 7,
    fontSize: 12,
    fontFamily: Fonts.medium,
    color: Colors.gray,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  emptyContainer: {
    alignItems: "center",
    paddingHorizontal: 30,
  },

  emptyTitle: {
    fontSize: 20,
    fontFamily: Fonts.bold,
    color: Colors.text,
    marginBottom: 10,
  },

  emptyText: {
    textAlign: "center",
    fontSize: 14,
    lineHeight: 21,
    fontFamily: Fonts.regular,
    color: Colors.gray,
  },

  raiseButton: {
    position: "absolute",
    left: 20,
    right: 20,
    bottom: 20,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  raiseButtonText: {
    marginLeft: 8,
    color: Colors.white,
    fontSize: 16,
    fontFamily: Fonts.bold,
  },
});
