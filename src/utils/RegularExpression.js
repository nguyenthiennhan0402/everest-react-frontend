export const phoneRegex =
  /^\(?(?:(?:\+\d{1,3})?)?[-.\s]?\d{1,3}[-.\s]?\d{3,5}[-.\s]?\d{4}(?:\s?(\w{1,10})\s?(\d{1,6}))?$/;

export const emailRegex = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
export const addressRegex = /^[a-zA-Z0-9\u00C0-\u024F\u1E00-\u1EFF\s,'-.]+$/;
export const nameRegex = /^(?!\s)(?!.*\s$)[\p{Letter}]+(?:\s[\p{Letter}]+)*$/u;
