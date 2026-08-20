import { required, minLength , requiredIf } from "vuelidate/lib/validators";

import provinceData from "./../data/province.json";
import districtData from "./../data/district.json";
import subdistrictData from "./../data/subdistrict.json";
import countryData from "./../data/country.json";

const checkNumericInput = (value, allowSlash = false) => {
  let patternString = "^(\\d";
  if (allowSlash) {
    patternString += "|\\/";
  }
  patternString += ")+$";
  const pattern = new RegExp(patternString);
  return pattern.test(value) ? true : false;
};

const mustSpecificOccupationOther = occupationCode => {
  return occupationCode === "00";
};

const isUnemployed = occupationCode => {
  return ["01", "02", "08", "09", "11", "14"].includes(occupationCode);
};

const mustSpecificBusinessType = occupationCode => {
  return ["03", "04", "06", "12", "00"].includes(occupationCode);
};

const mustSpecificBusinessTypeOther = code => {
  return code === "00";
};

const getValidationRules = (
  formValue,
  isLockATSBank = false,
  isLockDivBank = false,
  isATS_BBL_OR_KBANK = false,
  isOmnAndSeg=false,
  isHasAtsBank = false
) => {
  let ruleForm = {
    flagNotExpire: { required },
    flagMartialStatus: { required },
    flagRegisAdrs: { required },
    occupation: { required },
    srcIncomeCountry: { required },
    srcIncome: { required },
    monthlyIncome: { required },
    flagPoliticalPerson: { required },
    flagIsUSCitizen: { required },
    flagHolderUSResidentCard: { required },
    flagUSResidentForTax: { required },

    flagMailingAdrs: { required },
    investmentObjective: { required },
    atsBranch: { required },

  };
 //     divBranch: { required }
  let addRule = {};

  if (formValue.cardType === "PP") {
    addRule.issueCountry = { required };
    if (String(formValue.flagNotExpire) === "0") {
      addRule.passportExpireDate = { required };
    }
  } else {
    if (String(formValue.flagNotExpire) === "0") {
      addRule.expireDate = { required };
    }
  }

  if (String(formValue.flagMartialStatus) === "2") {
    addRule.spouseNameTh = { required };
    addRule.spouseSurnameTh = { required };
    addRule.spouseNameEn = { required };
    addRule.spouseSurnameEn = { required };
  }

  if (formValue.occupation == "00") {
    addRule.occupationOth = { required };
  }

  if (formValue.srcIncomeCountry == "999") {
    addRule.srcIncomeCountryOth = { required };
  }

  if (formValue.srcIncome.includes("7")) {
    addRule.srcIncomeOth = { required };
  }

  // if (!unemployedCodeList.includes(formValue.occupation)) {
  if (!isUnemployed(formValue.occupation)) {
    addRule.officeCompanyName = { required };
    addRule.position = { required };
  }

  if (mustSpecificOccupationOther(formValue.occupation)) {
    addRule.occupationOth = { required };
  }

  if (mustSpecificBusinessType(formValue.occupation)) {
    addRule.businessType = { required };

    if (mustSpecificBusinessTypeOther(formValue.businessType)) {
      addRule.businessTypeOth = { required };
    }
  }

  if (String(formValue.flagPoliticalPerson) == "1") {
    addRule.politicalPosition = { required };
  }

  if (formValue.investmentObjective.includes("0")) {
    addRule.investmentObjectiveOth = { required };
  }

  if (!isLockATSBank) {
    addRule.atsBank = { required };
    addRule.atsAccountType = { required };
    addRule.atsAccountName = { required };
    addRule.atsAccount = { required, minLength: minLength(10) };
  }

  if (!isLockDivBank && String(formValue.divFlag) === "2" && isATS_BBL_OR_KBANK != false) {
    addRule.divBank = { required };
    addRule.divBranch = { required };
    addRule.divAccountType = { required };
    addRule.divAccountName = { required };
    addRule.divAccount = { required, minLength: minLength(10) };
  }

  return {
    //   profilePhoto: { required },
    //      citizenCardID: { required }
    //    citizenCardIDPhoto: { required },
    //  bookbankPhoto: { required },
    form: { ...ruleForm, ...addRule },
    verifyForm: {
      bookbankPhoto: {
        required: requiredIf(function() {
          return !this.isATS_BBL_OR_KBANK || !isHasAtsBank;
        })
      },
      signaturePhoto: {
        required: requiredIf(function() {
          return !isOmnAndSeg;
        })
      },
      mobileNo: { required },
 
    }
  };
};

const getAddressText = addressData => {
  if (!addressData) {
    return "";
  }

  const {
    addressNo = "",
    moo = "",
    village = "",
    floor = "",
    soi = "",
    road = "",
    province = "",
    district = "",
    subdistrict = "",
    zipcode = "",
    country = "000"
  } = addressData;

  let result = addressNo;
  result += moo ? ` หมู่ที่ ${moo}` : "";
  result += village ? ` ${village}` : "";
  result += floor ? ` ชั้น ${floor}` : "";
  result += soi ? ` ซอย${soi}` : "";
  result += road ? ` ถนน${road}` : "";
  if (country === "000") {
    const findSubdistrictData = subdistrictData.datas.find(
      ({ code }) => String(code) === subdistrict
    );
    const findDistrictData = districtData.datas.find(
      ({ code }) => String(code) === district
    );
    const findProvinceData = provinceData.datas.find(
      ({ code }) => String(code) === province
    );

    const leadSubdistrict = province === "10" ? "แขวง" : "ตำบล";
    const leadDistrict = province === "10" ? "เขต" : "อำเภอ";
    result += findSubdistrictData?.["sub_district_th"]
      ? ` ${leadSubdistrict}${findSubdistrictData["sub_district_th"]}`
      : "";
    result += findDistrictData?.["district_th"]
      ? ` ${leadDistrict}${findDistrictData["district_th"]}`
      : "";
    result += findProvinceData?.["province_th"]
      ? ` จังหวัด${findProvinceData["province_th"]}`
      : "";
  } else {
    result += subdistrict ? ` ${subdistrict}` : "";
    result += district ? ` ${district}` : "";
    result += province ? ` ${province}` : "";
  }
  result += zipcode ? ` รหัสไปรษณีย์ ${zipcode}` : "";

  if (country !== "000") {
    const findCountry = countryData?.data.find(({ code }) => country === code);
    result += country ? ` ประเทศ ${findCountry["name"]}` : "";
  } else {
    result += " ประเทศไทย";
  }

  return result;
};

export {
  checkNumericInput,
  isUnemployed,
  mustSpecificOccupationOther,
  mustSpecificBusinessType,
  mustSpecificBusinessTypeOther,
  getValidationRules,
  getAddressText
};
