import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Text,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import ScreenWrapper from "@/src/components/common/ScreenWrapper";
import ReceiptHeader from "@/src/components/receipt/ReceiptHeader";
import ReceiptInvoiceCard from "@/src/components/receipt/ReceiptInvoiceCard";
import ReceiptCustomerCard from "@/src/components/receipt/ReceiptCustomerCard";
import ReceiptProductCard from "@/src/components/receipt/ReceiptProductCard";
import ReceiptPriceSummaryCard from "@/src/components/receipt/ReceiptPriceSummaryCard";
import { getMyOrderDetails, OrderData } from "@/src/api/order.api";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import Colors from "@/src/constants/colors";
import Fonts from "@/src/constants/fonts";

const ReceiptScreen = () => {
  const { orderId } = useLocalSearchParams();

  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<OrderData | null>(null);

  useEffect(() => {
    fetchReceipt();
  }, [orderId]);

  const fetchReceipt = async () => {
    try {
      if (!orderId) return;

      const response = await getMyOrderDetails(orderId as string);

      if (response.success) {
        setOrder(response.data);
      }
    } catch (error) {
      console.log("Receipt Error:", error);
      Alert.alert("Error", "Unable to load receipt.");
    } finally {
      setLoading(false);
    }
  };

  const handleShare = () => {
    Alert.alert(
      "Share receipt will be available soon."
    );
  };

  const handleDownload = async () => {
  if (!order) return;

  try {
    const productsHtml = order.products
      .map(
        (item) => `
          <tr>
            <td>${item.product.name}</td>
            <td>${item.quantity}</td>
            <td>₹${item.price.toFixed(2)}</td>
            <td>₹${(item.price * item.quantity).toFixed(2)}</td>
          </tr>
        `
      )
      .join("");

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 30px;
              color: #222;
            }

            .header {
              text-align: center;
              margin-bottom: 30px;
            }

            .brand {
              font-size: 28px;
              font-weight: bold;
              color: #6C63FF;
            }

            .subtitle {
              color: #666;
              margin-top: 5px;
            }

            .section {
              margin-top: 25px;
            }

            .section-title {
              font-size: 16px;
              font-weight: bold;
              margin-bottom: 10px;
              color: #333;
            }

            .info-row {
              margin-bottom: 5px;
            }

            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 10px;
            }

            th {
              background: #f2f2f2;
              text-align: left;
              padding: 10px;
              border-bottom: 1px solid #ddd;
            }

            td {
              padding: 10px;
              border-bottom: 1px solid #eee;
            }

            .summary {
              margin-top: 25px;
              margin-left: auto;
              width: 300px;
            }

            .summary-row {
              display: flex;
              justify-content: space-between;
              padding: 7px 0;
            }

            .total {
              font-size: 18px;
              font-weight: bold;
              border-top: 2px solid #333;
              margin-top: 8px;
              padding-top: 10px;
            }

            .footer {
              text-align: center;
              margin-top: 40px;
              color: #777;
              font-size: 12px;
            }
          </style>
        </head>

        <body>

          <div class="header">
            <div class="brand">ShopEase</div>
            <div class="subtitle">Order Receipt</div>
          </div>

          <div class="section">
            <div class="section-title">Invoice Details</div>

            <div class="info-row">
              <strong>Invoice Number:</strong>
              ${order.invoiceNumber}
            </div>

            <div class="info-row">
              <strong>Order Number:</strong>
              ${order.orderNumber}
            </div>

            <div class="info-row">
              <strong>Order Date:</strong>
              ${new Date(order.createdAt).toLocaleDateString()}
            </div>

            <div class="info-row">
              <strong>Order Status:</strong>
              ${order.orderStatus}
            </div>

            <div class="info-row">
              <strong>Payment Status:</strong>
              ${order.paymentStatus}
            </div>
          </div>

          <div class="section">
            <div class="section-title">Shipping Address</div>

            <div>${order.shippingAddress.fullName}</div>
            <div>${order.shippingAddress.phoneNumber}</div>
            <div>${order.shippingAddress.streetAddress}</div>
            <div>
              ${order.shippingAddress.city},
              ${order.shippingAddress.state}
              ${order.shippingAddress.postalCode}
            </div>
            <div>${order.shippingAddress.country}</div>
          </div>

          <div class="section">
            <div class="section-title">Products</div>

            <table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Qty</th>
                  <th>Price</th>
                  <th>Total</th>
                </tr>
              </thead>

              <tbody>
                ${productsHtml}
              </tbody>
            </table>
          </div>

          <div class="summary">

            <div class="summary-row">
              <span>Subtotal</span>
              <span>₹${order.subtotal.toFixed(2)}</span>
            </div>

            <div class="summary-row">
              <span>Discount</span>
              <span>-₹${order.discount.toFixed(2)}</span>
            </div>

            <div class="summary-row">
              <span>Shipping</span>
              <span>₹${order.shippingCharge.toFixed(2)}</span>
            </div>

            <div class="summary-row">
              <span>Tax</span>
              <span>₹${order.tax.toFixed(2)}</span>
            </div>

            <div class="summary-row total">
              <span>Total</span>
              <span>₹${order.totalAmount.toFixed(2)}</span>
            </div>

          </div>

          <div class="footer">
            Thank you for shopping with ShopEase.
          </div>

        </body>
      </html>
    `;

    const { uri } = await Print.printToFileAsync({
      html,
    });

    const available = await Sharing.isAvailableAsync();

    if (!available) {
      Alert.alert(
        "PDF Generated",
        "The PDF was generated successfully, but sharing is not available on this device."
      );
      return;
    }

    await Sharing.shareAsync(uri, {
      mimeType: "application/pdf",
      dialogTitle: "Download or Share Receipt",
      UTI: "com.adobe.pdf",
    });
  } catch (error) {
    console.error("PDF Generation Error:", error);

    Alert.alert(
      "Error",
      "Unable to generate the PDF receipt."
    );
  }
};

  if (loading) {
    return (
      <ScreenWrapper backgroundColor="#F8F8F8">
        <ActivityIndicator
          size="large"
          color={Colors.primary}
          style={{ marginTop: 50 }}
        />
      </ScreenWrapper>
    );
  }

  if (!order) {
    return (
      <ScreenWrapper backgroundColor="#F8F8F8">
        <Text style={styles.emptyText}>
          Receipt not found.
        </Text>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper backgroundColor="#F8F8F8">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        <ReceiptHeader onShare={handleShare} />

        <ReceiptInvoiceCard
          invoiceNumber={order.invoiceNumber}
          orderNumber={order.orderNumber}
          orderDate={new Date(order.createdAt).toLocaleDateString()}
          orderStatus={order.orderStatus}
          paymentStatus={order.paymentStatus}
        />

        <ReceiptCustomerCard
          address={order.shippingAddress}
        />

        {order.products.map((item) => (
          <ReceiptProductCard
            key={item.itemNumber}
            item={item}
          />
        ))}

        <ReceiptPriceSummaryCard
          subtotal={order.subtotal}
          discount={order.discount}
          shippingCharge={order.shippingCharge}
          tax={order.tax}
          totalAmount={order.totalAmount}
        />

        <TouchableOpacity
          style={styles.downloadButton}
          activeOpacity={0.8}
          onPress={handleDownload}
        >
          <Text style={styles.downloadText}>
            Download PDF
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </ScreenWrapper>
  );
};

export default ReceiptScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
  },

  downloadButton: {
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },

  downloadText: {
    color: Colors.white,
    fontSize: 16,
    fontFamily: Fonts.bold,
  },

  emptyText: {
    marginTop: 80,
    textAlign: "center",
    color: Colors.gray,
    fontSize: 16,
    fontFamily: Fonts.medium,
  },
});