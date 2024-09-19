import { instance } from ".";

const baseURL = "/invoice";

export const createInvoice = async (invoice) => {
  const response = await instance.post(`${baseURL}`, invoice);
  return response;
};

export const getInvoices = async (body) => {
  const response = await instance.get(`${baseURL}`, body);
  return response;
};

export const getInvoiceById = async (invoice) => {
  const response = await instance.get(`${baseURL}/${invoice._id}`);
  return response;
};

export const updateInvoicePaymentStatus = async (invoice, paymentStatus) => {
  const response = await instance.put(
    `${baseURL}/update-payment-status/${invoice._id}`,
    { paymentStatus }
  );
  return response;
};

export const getInvoiceByOrderId = async (order) => {
  const response = await instance.get(`${baseURL}/order/${order._id}`);
  return response;
};

export const getInvoiceByUserId = async (user) => {
  const response = await instance.get(`${baseURL}/user/${user._id}`);
  return response;
};

export const getInvoicesByMonthOrYear = async (month, year) => {
  const response = await instance.post(`${baseURL}/invoices-per-time`, {
    month: month || null,
    year: year || null,
  });
  return response;
};

export const updateInvoice = async (invoice) => {
  const response = await instance.put(
    `${baseURL}/update/${invoice._id}`,
    invoice
  );
  return response;
};

export const deleteInvoice = async (invoiceId) => {
  const response = await instance.put(`${baseURL}/delete/${invoiceId}`);
  return response;
};
