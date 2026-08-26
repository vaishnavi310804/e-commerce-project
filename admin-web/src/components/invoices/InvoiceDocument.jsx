import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: "Helvetica",
    color: "#222",
  },

  header: {
    marginBottom: 25,
    borderBottom: "1px solid #ddd",
    paddingBottom: 15,
  },

  shopName: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
  },

  invoiceTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
  },

  section: {
    marginBottom: 18,
  },

  sectionTitle: {
    fontSize: 11,
    fontWeight: "bold",
    marginBottom: 6,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },

  label: {
    color: "#666",
  },

  table: {
    marginTop: 10,
    borderTop: "1px solid #ddd",
    borderLeft: "1px solid #ddd",
    borderRight: "1px solid #ddd",
  },

  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f5f5f5",
    borderBottom: "1px solid #ddd",
    padding: 7,
    fontWeight: "bold",
  },

  tableRow: {
    flexDirection: "row",
    borderBottom: "1px solid #ddd",
    padding: 7,
  },

  productColumn: {
    width: "45%",
  },

  quantityColumn: {
    width: "15%",
    textAlign: "center",
  },

  priceColumn: {
    width: "20%",
    textAlign: "right",
  },

  totalColumn: {
    width: "20%",
    textAlign: "right",
  },

  summary: {
    marginTop: 15,
    marginLeft: "55%",
  },

  grandTotal: {
    marginTop: 8,
    paddingTop: 8,
    borderTop: "1px solid #222",
    fontSize: 13,
    fontWeight: "bold",
  },

  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: "center",
    color: "#777",
    fontSize: 9,
  },
});

const InvoiceDocument = ({ order }) => {
  if (!order) {
    return null;
  }

  const products = order.products || [];

  const subtotal = Number(order.subtotal || 0);
  const shippingCharge = Number(order.shippingCharge || 0);
  const tax = Number(order.tax || 0);
  const discount = Number(order.discount || 0);
  const totalAmount = Number(order.totalAmount || 0);

  const customerName =
    order.user?.fullName ||
    order.user?.name ||
    order.shippingAddress?.fullName ||
    "Guest Customer";

  const customerEmail = order.user?.email || "";

  const customerPhone =
    order.user?.phoneNumber ||
    order.user?.phone ||
    "";

  const shippingAddress = order.shippingAddress || order.address || {};

  const addressText = [
    shippingAddress.address || shippingAddress.streetAddress || shippingAddress.street,
    shippingAddress.city,
    shippingAddress.state,
    shippingAddress.pincode || shippingAddress.postalCode || shippingAddress.zipCode,
    shippingAddress.country,
  ]
    .filter(Boolean)
    .join(", ");

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const invoiceNum = order.invoiceNumber || order.orderNumber || order._id || "—";

  const isReplacement =
    Boolean(order.originalOrder) ||
    (totalAmount === 0 && products.some((item) => Number(item.originalPrice || 0) > 0));

  const originalOrderNumber =
    typeof order.originalOrder === "object"
      ? order.originalOrder?.orderNumber
      : typeof order.originalOrder === "string"
      ? order.originalOrder
      : null;

  let totalExchangeValue = 0;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.shopName}>ShopEase</Text>

          <Text>Tax Invoice</Text>

          {isReplacement && (
            <View style={{ marginTop: 4 }}>
              <Text style={{ fontSize: 11, fontWeight: "bold", color: "#6547C9" }}>
                Replacement Order
              </Text>
              {originalOrderNumber ? (
                <Text style={{ fontSize: 9, color: "#555", marginTop: 2 }}>
                  Exchange for Order #{originalOrderNumber}
                </Text>
              ) : null}
            </View>
          )}

          <Text style={styles.invoiceTitle}>
            Invoice #{invoiceNum}
          </Text>
        </View>

        {/* Order Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Information</Text>

          <View style={styles.row}>
            <Text style={styles.label}>Order ID</Text>
            <Text>{order.orderNumber || order._id || "—"}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Order Date</Text>
            <Text>{formatDate(order.createdAt)}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Payment Method</Text>
            <Text>{order.paymentMethod || "—"}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Payment Status</Text>
            <Text>{order.paymentStatus || "—"}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bill To</Text>

          <Text>{customerName}</Text>

          {customerEmail ? <Text>{customerEmail}</Text> : null}

          {customerPhone ? <Text>{customerPhone}</Text> : null}

          {addressText ? <Text>{addressText}</Text> : null}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Items</Text>

          <View style={styles.table}>
            <View style={styles.tableHeader} fixed>
              <Text style={styles.productColumn}>Product</Text>
              <Text style={styles.quantityColumn}>Qty</Text>
              <Text style={styles.priceColumn}>Price</Text>
              <Text style={styles.totalColumn}>Total</Text>
            </View>

            {products.map((item, index) => {
              const quantity = Number(item.quantity || 1);

              const price =
                Number(item.originalPrice || 0) > 0
                  ? Number(item.originalPrice)
                  : Number(item.price || 0);

              const itemTotal = price * quantity;
              totalExchangeValue += itemTotal;

              const productName =
                item.product?.name ||
                item.productName ||
                "Product";

              return (
                <View style={styles.tableRow} key={item._id || index}>
                  <Text style={styles.productColumn}>
                    {productName}
                  </Text>

                  <Text style={styles.quantityColumn}>
                    {quantity}
                  </Text>

                  <Text style={styles.priceColumn}>
                    ₹{price.toFixed(2)}
                  </Text>

                  <Text style={styles.totalColumn}>
                    ₹{itemTotal.toFixed(2)}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Summary */}
        <View style={styles.summary}>
          {isReplacement ? (
            <>
              <View style={styles.row}>
                <Text>Item Value</Text>
                <Text>₹{totalExchangeValue.toFixed(2)}</Text>
              </View>

              <View style={styles.row}>
                <Text>Exchange Credit</Text>
                <Text>- ₹{totalExchangeValue.toFixed(2)}</Text>
              </View>

              <View style={styles.row}>
                <Text style={styles.grandTotal}>Net Payable</Text>
                <Text style={styles.grandTotal}>₹0.00</Text>
              </View>
            </>
          ) : (
            <>
              <View style={styles.row}>
                <Text>Subtotal</Text>
                <Text>₹{subtotal.toFixed(2)}</Text>
              </View>

              <View style={styles.row}>
                <Text>Shipping</Text>
                <Text>₹{shippingCharge.toFixed(2)}</Text>
              </View>

              <View style={styles.row}>
                <Text>Tax</Text>
                <Text>₹{tax.toFixed(2)}</Text>
              </View>

              <View style={styles.row}>
                <Text>Discount</Text>
                <Text>- ₹{discount.toFixed(2)}</Text>
              </View>

              <View style={styles.row}>
                <Text style={styles.grandTotal}>Total</Text>
                <Text style={styles.grandTotal}>
                  ₹{totalAmount.toFixed(2)}
                </Text>
              </View>
            </>
          )}
        </View>

        <Text style={styles.footer}>
          Thank you for shopping with ShopEase.
        </Text>
      </Page>
    </Document>
  );
};

export default InvoiceDocument;