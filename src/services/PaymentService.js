// services/PaymentService.js
import { callApi } from "../utils/api";

export const PaymentService = {
  // Create payment order for PhonePe
  createOrder: async (orderData) => {
    return await callApi('POST', '/create-order', orderData);
  },

  // Process card payment
  processCardPayment: async (paymentData) => {
    return await callApi('POST', '/process-card-payment', paymentData);
  },

  // Verify payment status
  verifyPayment: async (transactionId) => {
    return await callApi('POST', '/verify-payment', { transactionId });
  },

  // Generate UPI QR code (if you want server-side generation)
  generateUpiQr: async (amount, orderId) => {
    return await callApi('POST', '/generate-upi-qr', { amount, orderId });
  },

  // Check payment status by order ID
  checkPaymentStatus: async (orderId) => {
    return await callApi('GET', `/payment-status/${orderId}`);
  },

  // Get order details
  getOrderDetails: async (orderId) => {
    return await callApi('GET', `/orders/${orderId}`);
  },

  // Get user's payment history
  getPaymentHistory: async (params = {}) => {
    return await callApi('GET', '/payment-history', {}, params);
  },

  // Refund payment
  refundPayment: async (orderId, refundData = {}) => {
    return await callApi('POST', `/orders/${orderId}/refund`, refundData);
  }
};