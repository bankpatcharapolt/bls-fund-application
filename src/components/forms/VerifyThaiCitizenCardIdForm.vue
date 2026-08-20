<template>
  <div class="verify-thai-citizen-card-id-form">
    <div class="form-group">
      <label class="col-sm-5 col-md-6 control-label">ชื่อ - นามสกุล</label>
      <div class="col-sm-4 col-md-3">
        <input
          type="text"
          class="form-control input-xs"
          :value="fullname"
          disabled
        />
      </div>
    </div>

    <div class="form-group">
      <label class="col-sm-5 col-md-6 control-label">เลขบัตรประชาชน</label>
      <div class="col-sm-4 col-md-3">
        <the-mask
          class="form-control input-xs"
          :value="values.citizenCardID"
          mask="#-####-#####-##-#"
          disabled
        />
      </div>
    </div>

    <div class="form-group">
      <label class="col-sm-5 col-md-6 control-label required"
        >วันเดือนปีเกิดตามหน้าบัตรประชาชน</label
      >
      <div class="col-sm-7 col-md-6">
        <date-input
          v-model="birthdate"
          :max-year="currentYear"
          :min-year="minBirthDateYear"
          :disabled="isLoading"
          :allow-zero-date="true"
          :allow-zero-month="true"
        />
        <span class="small" style="color: #ff0000"
          >กรณีที่บัตรประชาชนของท่านไม่มีวันหรือเดือนเกิดให้เลือกเป็น "-"
          ในส่วนวันหรือเดือนตามค่าที่ไม่มี</span
        >
      </div>
    </div>

    <div class="form-group">
      <label class="col-sm-5 col-md-6 control-label required"
        >Laser Code No.</label
      >
      <div class="col-sm-4 col-md-3">
        <the-mask
          class="form-control input-xs"
          ref="inputLaserCardNo"
          v-model="laserCardNo"
          mask="AA##########"
          :disabled="isLoading"
        />
      </div>
    </div>
    <div class="form-group">
      <div class="col-sm-4 col-md-3 col-sm-offset-5 col-md-offset-6">
        <vue-ladda
          type="button"
          button-class="btn btn-xs btn-primary"
          :loading="isLoading"
          data-style="slide-up"
          :disabled="$v.$invalid"
          @click="onClickVerifyData"
          >ตรวจสอบ</vue-ladda
        >

        <img
          :src="laserCardImage"
          class="img-responsive"
          style="margin-top: 15px"
        />
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import Vuelidate from "vuelidate";
import { required, minLength } from "vuelidate/lib/validators";
Vue.use(Vuelidate);
import VueLadda from "vue-ladda";

import to from "await-to-js";
import moment from "moment";
import { TheMask } from "vue-the-mask";

import { DateInput } from "../fields";
import { laserCard } from "../../base64_images";
import { openAccountFundAPI, showError, contactMessage } from "../../services";

export default {
  name: "VerifyThaiCitizenCardIdForm",
  props: {
    values: {
      type: Object,
      default() {
        return {
          customerNo: "",
          name: "",
          surname: "",
          citizenCardID: "",
          birthdate: "",
        };
      },
    },
  },

  data() {
    return {
      birthdate: "",
      laserCardNo: "",
      isLoading: false,
    };
  },

  validations: {
    birthdate: { required },
    laserCardNo: { required, minLength: minLength(12) },
  },

  computed: {
    currentYear() {
      return parseInt(moment().format("YYYY"), 10);
    },

    minBirthDateYear() {
      return this.currentYear - 99;
    },

    fullname() {
      return `${this.values.name} ${this.values.surname}`.trim();
    },

    laserCardImage() {
      return laserCard;
    },
  },

  watch: {
    values: {
      handler(newValue) {
        this.setData(newValue);
      },
      deep: true,
    },
  },

  methods: {
    focus() {
      if (!this.$refs.inputLaserCardNo.$el.disabled) {
        this.$refs.inputLaserCardNo.$el.focus();
      }
    },

    setData(newValue) {
      if (!newValue) {
        return;
      }
      const { birthdate } = newValue;
      this.birthdate = birthdate;
    },

    async onClickVerifyData() {
      const inputData = {
        birthdate: this.birthdate,
        laserCardNo: this.laserCardNo,
      };

      this.isLoading = true;
      const [error] = await to(
        openAccountFundAPI.post(
          "fund/apply/segigate/citizen-card-id/verify",
          inputData
        )
      );
      this.isLoading = false;
      if (error) {
        const { status, data } = error.response;
        let message = "";

        if (status === 400 || status === 408) {
          const messageMapping = {
            "card not found":
              "ไม่สามารถตรวจสอบบัตรประชาชนของท่านได้ เนื่องจากไม่พบข้อมูลในระบบกรมการปกครอง<br />กรุณาตรวจสอบวันหมดอายุบัตรของท่าน",
            "invalid data":
              "ข้อมูลสมัครกับข้อมูลบนบัตรประชาชนไม่ถูกต้อง<br />กรุณาตรวจสอบ ชื่อ - นามสกุลและเลขบัตรประจำตัวประชาชนกับข้อมูลที่แสดง<br />บนหน้าจออีกครั้ง",
            "invalid lasercode":
              "ข้อมูลเลขหลังบัตรประชาชนที่ท่านกรอกไม่ถูกต้อง<br />กรุณาตรวจสอบเลขหลังบัตรประชาชน<br />และกรอกใหม่อีกครั้ง",
            "webservice timeout":
              "เนื่องจากเกิดข้อผิดพลาดในการติดต่อกับกรมการปกครอง กรุณาลองใหม่อีกครั้ง",
          };
          const { errMsg = null } = data;
          if (messageMapping[errMsg]) {
            message = messageMapping[errMsg];
          } else {
            message = `เนื่องจากเกิดข้อผิดพลาดระหว่างการส่งข้อมูลตรวจสอบหมายเลขบัตรประชาชน (-99)<br />${contactMessage}`;
          }
        }

        if (message === "") {
          message = `เนื่องจากเกิดข้อผิดพลาดระหว่างการส่งข้อมูลตรวจสอบหมายเลขบัตรประชาชน (${data.errNo}) <br />${contactMessage}`;
        }

        showError("ไม่สามารถทำรายการได้", message);
        return;
      }
      this.$emit("verified");
    },
  },

  mounted() {
    this.setData(this.values);
  },

  components: {
    DateInput,
    TheMask,
    VueLadda,
  },
};
</script>
