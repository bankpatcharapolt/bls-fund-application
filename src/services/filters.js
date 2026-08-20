import moment from "moment";
import numeral from "numeral";

import nationality from "../data/nationality.json";
import country from "../data/country.json";
import banks from "../data/bank.json";
import accountType from "../data/account_type.json";

export const blankText = (value, customText) => {
  if (String(value).trim().length === 0) {
    return customText && customText.trim().length > 0 ? customText : "-";
  }
  return value;
};

export const formatDate = value => {
  if (!value || String(value).length !== 8) {
    return "";
  }
  const momentDate = moment(value, "YYYYMMDD");
  if (!momentDate.isValid()) {
    return "";
  }

  return (
    momentDate.format("DD/MM/") +
    String(parseInt(momentDate.format("YYYY"), 10) + 543)
  );
};

export const textYesNo = (value, lang) => {
  if (String(value).trim().length != 0) {
    if (value == "0") {
      return lang === "en" ? "No" : "ไม่ใช่";
    } else if (value == "1") {
      return lang === "en" ? "Yes" : "ใช่";
    }
  }

  return "n/a";
};

export const nationalityText = value => {
  if (String(value).trim().length === 0) {
    return "";
  }

  const findData = nationality?.data.find(
    ({ value: itemValue }) => itemValue === value
  );

  return findData?.name ?? "";
};

export const countryText = value => {
  if (String(value).trim().length === 0) {
    return "";
  }
  const findData = country?.data.find(({ code }) => code === value);

  return findData?.name ?? "";
};

export const formatAccountNo = value => {
  if (!value) {
    return "";
  }

  const suffixIndex = value.length - 1;
  return `${value.substring(0, suffixIndex)}-${value.substring(suffixIndex)}`;
};

export const formatFullDate = (value, lang = "th") => {
  if (!value || value.length !== 8) {
    return "";
  }
  const momentDate = moment(value, "YYYYMMDD");
  if (!momentDate.isValid()) {
    return "";
  }

  if (lang !== "th") {
    return momentDate.format("DD MMMM YYYY");
  }

  const thaiMonthList = {
    "01": "มกราคม",
    "02": "กุมภาพันธ์",
    "03": "มีนาคม",
    "04": "เมษายน",
    "05": "พฤษภาคม",
    "06": "มิถุนายน",
    "07": "กรกฎาคม",
    "08": "สิงหาคม",
    "09": "กันยายน",
    "10": "ตุลาคม",
    "11": "พฤศจิกายน",
    "12": "ธันวาคม"
  };

  const thaiMonth = thaiMonthList[momentDate.format("MM")];
  const thaiYear = String(parseInt(momentDate.format("YYYY"), 10) + 543);

  return `${momentDate.format("DD")} ${thaiMonth} ${thaiYear}`;
};

export const bankName = findValue => {
  if (!findValue || findValue.length === 0) {
    return "";
  }

  const findBankData = banks.ats?.[findValue];
  return findBankData ?? "";
};

export const accountTypeText = findValue => {
  if (!findValue) {
    return "";
  }

  const findData = accountType.data.find(({ value }) => value === findValue);
  return findData?.title ?? "";
};

export const formatBankAccount = value => {
  if (!value) {
    return "";
  }

  if (value.length !== 10) {
    return value;
  }

  return `${value.substring(0, 3)}-${value.substring(3, 4)}-${value.substring(
    4,
    10
  )}`;
};

export const formatNumber = value => {
  if (!value) {
    return "";
  }

  const convertValue = numeral(value);
  if (convertValue.value() === "NaN") {
    return "";
  }

  return convertValue.format("0,0");
};
