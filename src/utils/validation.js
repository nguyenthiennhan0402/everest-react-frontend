import * as errorMessage from "constants/ErrorMessages";

export const validateName = (value) => {
  const minLength = 2;
  const maxLength = 50;

  if (!value) {
    return Promise.reject(errorMessage.ERROR_CAMPAIGN_NAME_REQUIRED);
  }

  if (value.length < minLength || value.length > maxLength) {
    return Promise.reject(`Name must be between ${minLength} and ${maxLength} characters.`);
  }

  const specialCharactersRegex = /^[\w'\-,.][^!¡?÷?¿/\\+=@#$%^&*(){}|~<>;:[\]]{2,}$/;

  if (!specialCharactersRegex.test(value)) {
    return Promise.reject(errorMessage.ERROR_CAMPAIGN_NAME_CANNOT_CONTAIN_SPECIAL_CHARACTERS);
  }

  return Promise.resolve();
};

export const validateTitle = (value) => {
  const minLength = 2;
  const maxLength = 50;
  if (!value) {
    return Promise.reject(errorMessage.ERROR_CAMPAIGN_TITLE_REQUIRED);
  }
  if (value.length < minLength || value.length > maxLength) {
    return Promise.reject(`Title must be between ${minLength} and ${maxLength} characters.`);
  }
  return Promise.resolve();
};

export const validateNumber = (value, msgReject, msgResolve, type) => {
  const minValue = 0;
  const maxValue = 10000000000;

  if (!value) {
    return Promise.reject(msgReject);
  }

  if (isNaN(value)) {
    return Promise.reject(msgResolve);
  }

  if (value < minValue) {
    return Promise.reject(`${type} must be a positive number`);
  }

  if (value > maxValue) {
    return Promise.reject(`${type} is too large`);
  }

  return Promise.resolve();
};

export const validateBidAmount = (value, budgetFieldValue) => {
  if (value && budgetFieldValue && parseFloat(value) > parseFloat(budgetFieldValue)) {
    return Promise.reject(errorMessage.ERROR_CAMPAIGN_BID_AMOUNT_RANGE);
  }

  return Promise.resolve();
};
