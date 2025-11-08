import axios from "axios";



export const createPayment = (data) =>
  axios.post("http://localhost:5000/api/customer-payments", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

export const getPaymentsByCustomer = (customerId) =>
  axios.get(
    `http://localhost:5000/api/customer-payments/customer/${customerId}`,
     {
      "Content-Type": "application/json",
    }
  );




export const getPaymentsByCashier = (cashierId) =>
  axios.get(`http://localhost:5000/api/customer-payments/cashier/${cashierId}`);
