<template>
  <div>
    <div class="form-group" :class="getFieldClass('addressNo')">
      <label class="col-sm-4 control-label required">
        {{ $t("application.address-text.no") }}
      </label>
      <div class="col-sm-4">
        <input
          type="text"
          class="form-control input-xs"
          v-model="form.addressNo"
          maxlength="20"
          :disabled="disabled"
        />

        <span v-if="hasErrorAddressNo('addressNo')" class="small" style="color: #ff0000"
          >{{ $t("application.address-no-error") }}</span
        >
      </div>
   
    </div>

    <div class="form-group">
      <label class="col-sm-4 control-label">
        {{ $t("application.address-text.moo") }}
      </label>
      <div class="col-sm-4">
        <input
          type="text"
          class="form-control input-xs"
          v-model="form.moo"
          maxlength="33"
          :disabled="disabled"
        />
      </div>
    </div>

    <div class="form-group">
      <label class="col-sm-4 control-label">
        {{ $t("application.address-text.village") }}
      </label>
      <div class="col-sm-4">
        <input
          type="text"
          class="form-control input-xs"
          v-model="form.village"
          maxlength="33"
          :disabled="disabled"
        />
      </div>
    </div>

    <div class="form-group">
      <label class="col-sm-4 control-label">
        {{ $t("application.address-text.floor") }}
      </label>
      <div class="col-sm-4">
        <input
          type="text"
          class="form-control input-xs"
          v-model="form.floor"
          maxlength="50"
          :disabled="disabled"
        />
      </div>
    </div>

    <div class="form-group">
      <label class="col-sm-4 control-label">
        {{ $t("application.address-text.soi") }}
      </label>
      <div class="col-sm-4">
        <input
          type="text"
          class="form-control input-xs"
          v-model="form.soi"
          maxlength="33"
          :disabled="disabled"
        />
      </div>
    </div>

    <div class="form-group">
      <label class="col-sm-4 control-label">
        {{ $t("application.address-text.road") }}
      </label>
      <div class="col-sm-4">
        <input
          type="text"
          class="form-control input-xs"
          v-model="form.road"
          maxlength="33"
          :disabled="disabled"
        />
      </div>
    </div>

    <div class="form-group" :class="getFieldClass('country')">
      <label class="col-sm-4 control-label">
        {{ $t("application.address-text.country") }}
      </label>
      <div class="col-sm-4">
        <select
          class="form-control input-xs"
          v-model="form.country"
          disabled
          @change="onChangeCountryHandler()"
        >
          <option
            v-for="{ value, text } in countries"
            :key="value"
            :value="value"
          >
            {{ text }}
          </option>
        </select>
      </div>
    </div>

    <div class="form-group" :class="getFieldClass('province')">
      <label class="col-sm-4 control-label required">
        {{ $t("application.address-text.province") }}
      </label>
      <div class="col-sm-4">
        <select
          class="form-control input-xs"
          v-if="isThaiAddress"
          v-model="form.province"
          :disabled="disabled"
          @change="onChangeProvinceHandler()"
        >
          <option value>{{ $t("common.please-select") }}</option>
          <option
            v-for="{ code, province_th } in provinces"
            :key="code"
            :value="code"
          >
            {{ province_th }}
          </option>
        </select>

        <!-- For Non-Thai Country -->
        <input
          class="form-control input-xs"
          v-if="!isThaiAddress"
          v-model="form.province"
          maxlength="33"
          :disabled="disabled"
        />
      </div>
    </div>

    <div class="form-group" :class="getFieldClass('district')">
      <label class="col-sm-4 control-label required">
        {{ $t("application.address-text.district") }}
      </label>
      <div class="col-sm-4">
        <select
          class="form-control input-xs"
          v-if="isThaiAddress"
          v-model="form.district"
          :disabled="disabled"
          @change="onChangeDistrictHandler()"
        >
          <option value>{{ $t("common.please-select") }}</option>
          <option
            v-for="{ code, district_th } in districts"
            :key="code"
            :value="code"
          >
            {{ district_th }}
          </option>
        </select>

        <!-- For Non-Thai Country -->
        <input
          class="form-control input-xs"
          v-if="!isThaiAddress"
          v-model="form.district"
          maxlength="33"
          :disabled="disabled"
        />
      </div>
    </div>

    <div class="form-group" :class="getFieldClass('subdistrict')">
      <label class="col-sm-4 control-label required">
        {{ $t("application.address-text.sub-district") }}
      </label>
      <div class="col-sm-4">
        <select
          class="form-control input-xs"
          v-if="isThaiAddress"
          v-model="form.subdistrict"
          :disabled="disabled"
          @change="onChangeSubdistrictHandler()"
        >
          <option value>{{ $t("common.please-select") }}</option>
          <option
            v-for="{ code, sub_district_th } in subdistricts"
            :key="code"
            :value="code"
          >
            {{ sub_district_th }}
          </option>
        </select>

        <!-- For Non-Thai Country -->
        <input
          class="form-control input-xs"
          v-if="!isThaiAddress"
          v-model="form.subdistrict"
          maxlength="33"
          :disabled="disabled"
        />
      </div>
    </div>

    <div class="form-group" :class="getFieldClass('zipcode')">
      <label class="col-sm-4 control-label required">
        {{ $t("application.address-text.postal-code") }}
      </label>
      <div class="col-sm-4">
        <input
          type="text"
          class="form-control input-xs"
          v-model="form.zipcode"
          maxlength="5"
          v-mask="'#####'"
          :disabled="disabled"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { required  } from "vuelidate/lib/validators";
import { mask } from "vue-the-mask";

import { defaultAddressFormData } from "./../../services/constants";

import country from "./../../data/country.json";
import province from "./../../data/province.json";
import district from "./../../data/district.json";
import subdistrict from "./../../data/subdistrict.json";


export default {
  name: "AddressForm",

  model: {
    prop: "data",
    event: "change",
  },

  props: {
    data: {
      type: Object,
    },
    lang: {
      type: String,
      default: "th",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      form: {
        ...defaultAddressFormData,
      },
      provinces: province.datas.map((item) => ({
        ...item,
        code: String(item.code),
      })),
    };
  },

  validations() {
    return {
      form: {
        addressNo: { required, customAddressNo:this.customAddressNoValidator },
        country: { required },
        province: { required },
        district: { required },
        subdistrict: { required },
        zipcode: { required },
      },
    };
  },

  computed: {
    isThaiAddress() {
      return this.form.country === "000";
    },

    countries() {
      return country.data.map(({ code: value, name: text }) => ({
        value,
        text,
      }));
    },

    districts() {
      if (this.form.province === "") {
        return [];
      }

      return district.datas
        .filter(
          ({ code_pro: provinceCode }) =>
            String(provinceCode) === String(this.form.province)
        )
        .map((item) => ({ ...item, code: String(item.code) }));
    },

    subdistricts() {
      if (this.form.district === "") {
        return [];
      }

      return subdistrict.datas
        .filter(
          ({ code_dis: districtCode }) =>
            String(districtCode) === String(this.form.district)
        )
        .map((item) => ({ ...item, code: String(item.code) }));
    },
  },

  watch: {
    form: {
      handler(newValue) {
        this.$emit("change", newValue);
      },
      deep: true,
    },
  },

  methods: {
    customAddressNoValidator(value) {
      const regex = /^[1-9]{1}[0-9]{0,3}(?:[-\\/][0-9]{1,4}){0,4}$/;
      console.log(regex.test(value));
      return regex.test(value);
    },
    getFieldClass(fieldname) {
      if (!this.$v.form[fieldname].$dirty) {
        return;
      }
      let hasErrorClass = false;
      if (Array.isArray(fieldname)) {
        hasErrorClass = fieldname.some(
          (field) => this.$v.form?.[field]?.$invalid
        );
      } else {
        if (this.$v.form?.[fieldname]?.$invalid) {
          hasErrorClass = true;
        }
      }
      return { "has-error": hasErrorClass };
    },
    hasErrorAddressNo(fieldname) {
      if (!this.$v.form[fieldname].$dirty) {
        return;
      }
      let hasErrorClass = false;
      if (Array.isArray(fieldname)) {
        hasErrorClass = fieldname.some(
          (field) => this.$v.form?.[field]?.$invalid
        );
      } else {
        if (this.$v.form?.[fieldname]?.$invalid) {
          hasErrorClass = true;
        }
      }
      return hasErrorClass;
    },

    onChangeCountryHandler() {
      this.form.province = "";
      this.form.district = "";
      this.form.subdistrict = "";
      this.form.zipcode = "";
    },

    onChangeProvinceHandler() {
      this.form.district = "";
      this.form.subdistrict = "";
      this.form.zipcode = "";
    },

    onChangeDistrictHandler() {
      this.form.subdistrict = "";
      this.form.zipcode = "";
    },

    onChangeSubdistrictHandler() {
      if (this.form.subdistrict === "") {
        this.form.zipcode = "";
        return;
      }

      const data = this.subdistricts.find(
        ({ code }) => String(code) === String(this.form.subdistrict)
      );
      this.form.zipcode = data ? String(data.zipcode ?? "") : "";
    },
  },

  mounted() {
    this.$nextTick(() => {
      if (this.data) {
        this.form = {
          ...this.data,
        };
      }
    });
  },

  directives: {
    mask,
  },
};
</script>