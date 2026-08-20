<template>
  <div class="verify-thai-citizen-card-id-form">
    <div class="form-group">
      <label class="col-sm-5 col-md-6 control-label">หมายเลขโทรศัพท์</label>
      <div class="col-sm-4 col-lg-3">
        <input
          type="text"
          class="form-control input-xs"
          :value="values.mobileNo"
          disabled
        />
      </div>
    </div>
    <div class="form-group">
      <div class="col-sm-4 col-md-3 col-sm-offset-5 col-md-offset-6">
        <vue-ladda
          type="button"
          button-class="btn btn-xs btn-primary"
          :loading="isLoading"
          ref="btnRequestOTP"
          data-style="slide-up"
          v-if="!isShowCountdown"
          @click="onClickRequestOTP"
        >
          {{ otpRequestButtonText }}
        </vue-ladda>
        <button
          type="button"
          class="btn btn-xs btn-primary"
          v-if="isShowCountdown"
          disabled
        >
          ขอรหัส SMS OTP ใหม่ ({{ countdown }}) วินาที
        </button>
      </div>
      <div
        v-if="otpRef"
        class="col-sm-7 col-md-6 col-sm-offset-5 col-md-offset-6"
      >
        <span class="small" style="color: #ff0000"
          >ระบบได้ส่งรหัส One-Time Password(OTP) ไปยังหมายเลขโทรศัพท์
          {{ values.mobileNo }} โปรดใส่รหัส OTP เพื่อยืนยันรายการของท่าน</span
        >
      </div>
    </div>

    <div class="form-group">
      <label class="col-sm-5 col-md-6 control-label">หมายเลข Reference</label>
      <div class="col-sm-4 col-lg-3">
        <input
          type="text"
          class="form-control input-xs"
          :value="otpRef"
          disabled
        />
      </div>
      <div class="col-sm-7 col-md-6 col-sm-offset-5 col-md-offset-6">
        <span class="small" style="color: #ff0000"
          >รหัส OTP จะส่งถึงท่านใน 30 วินาที
          หากท่านไม่ได้รับรหัสภายในเวลาที่กำหนด โปรดคลิก "ขอ OTP ใหม่"</span
        >
      </div>
    </div>

    <div class="form-group">
      <label class="col-sm-5 col-md-6 control-label"
        >กรุณากรอก OTP ที่ได้รับ</label
      >
      <div class="col-sm-4 col-lg-3">
        <the-mask
          class="form-control input-xs"
          v-model="otp"
          ref="inputOTPCode"
          mask="######"
          :disabled="isLoading || !otpRef"
        />
        <span class="small" style="color: #ff0000"></span>
      </div>
    </div>

    <div class="form-group">
      <div class="col-sm-4 col-md-3 col-sm-offset-5 col-md-offset-6">
        <vue-ladda
          type="button"
          button-class="btn btn-xs btn-primary"
          :loading="isLoading"
          data-style="slide-up"
          :disabled="!otpRef"
          @click="onClickVerifyOTP"
          >ตรวจสอบ</vue-ladda
        >
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
import { TheMask } from "vue-the-mask";

import to from "await-to-js";

import { openAccountFundAPI, showError, contactMessage } from "../../services";

export default {
  name: "VerifyMobileNoForm",

  props: {
    values: {
      type: Object,
      default() {
        return {
          customerNo: "",
          mobileNo: "",
        };
      },
    },
  },

  data() {
    return {
      otpRef: "",
      otp: "",
      isLoading: false,
      countdown: null,
    };
  },

  computed: {
    isShowCountdown() {
      return this.countdown && this.countdown > 0;
    },

    otpRequestButtonText() {
      if (!this.otpRef) {
        return "ขอรหัส SMS OTP";
      }

      return "ขอรหัส SMS OTP ใหม่";
    },
  },

  validations: {
    otp: { required, minLength: minLength(6) },
  },

  methods: {
    focus() {
      if (!this.$refs.inputOTPCode.$el.disabled) {
        this.$refs.inputOTPCode.$el?.focus();
        return;
      }

      if (!this.isShowCountdown) {
        this.$refs.btnRequestOTP.$refs.ladda?.focus();
      }
    },

    setCountdown() {
      this.countdown = 30;
      const countdownInterval = setInterval(() => {
        if (this.countdown == 1) {
          this.countdown = null;
          clearInterval(countdownInterval);
          return;
        }
        this.countdown--;
      }, 1000);
    },

    async onClickRequestOTP() {
      if (this.isShowCountdown) {
        return;
      }
      this.isLoading = true;

      const [error, result] = await to(
        openAccountFundAPI.post("fund/apply/otp/request", null)
      );
      this.isLoading = false;

      if (error) {
        const { data } = error.response;
        let message = "เนื่องจากเกิดข้อผิดพลาดระหว่างการส่งข้อมูลในการขอ OTP";
        if (data?.errNo) {
          message += ` (${data.errNo})`;
        }

        showError("ไม่สามารถทำรายการได้", `${message}<br />${contactMessage}`);
        return;
      }

      const { otpRef = null } = result;
      if (!otpRef) {
        let message =
          "เนื่องจากเกิดข้อผิดพลาดระหว่างการส่งข้อมูลในการขอ OTP (-88)";
        showError("ไม่สามารถทำรายการได้", `${message}<br />${contactMessage}`);
        return;
      }

      this.otpRef = otpRef;
      this.setCountdown();
      this.$refs.inputOTPCode.$el?.focus();
    },

    async onClickVerifyOTP() {
      if (this.otp.trim() === "") {
        showError("ไม่สามารถทำรายการได้", "เนื่องจากท่านยังไม่ได้กรอกรหัส OTP");
        return;
      }

      const inputData = {
        otpRef: this.otpRef,
        otp: this.otp,
        isOmnAndSeg : this.values.isOmnAndSeg ? "OMN_AND_SEG" : "SEG_ONLY"
      };

      this.isLoading = true;
      const [error] = await to(
        openAccountFundAPI.post("fund/apply/segigate/otp/verify", inputData)
      );
      this.isLoading = false;

      if (error) {
        const { status, data } = error.response;
        let message = "";
        if (status === 400) {
          const messageMapping = {
            "-4": 'เนื่องจากรหัส OTP หมดอายุ กรุณาคลิกที่ "ขอรับรหัส OTP ใหม่" อีกครั้ง',
            "-7": "เนื่องจากรหัส OTP ไม่ถูกต้อง (-7)",
            "-8": "รหัส เนื่องจากOTP ไม่ถูกต้อง (-8)",
            "-10": "เนื่องจากเบอร์มือถือไม่ถูกต้อง",
            "-14": "เนื่องจากกรุณาลองใหม่อีกครั้ง ภายใน 60 วินาที",
            "-15": `เนื่องจากเบอร์มือถือไม่ถูกต้อง<br />${contactMessage}`,
          };
          const { errNo = null } = data;
          if (errNo) {
            if (messageMapping[String(errNo)]) {
              message = messageMapping[String(errNo)];
            } else {
              message = `เนื่องจากเกิดข้อผิดพลาดระหว่างการส่งข้อมูลในการตรวจสอบ OTP (${String(
                errNo
              )})<br />${contactMessage}`;
            }
          }
        }

        if (message === "") {
          message = `เนื่องจากเกิดข้อผิดพลาดระหว่างการส่งข้อมูลในการตรวจสอบ OTP (-88)<br />${contactMessage}`;
        }
        showError("ไม่สามารถทำรายการได้", message);
        return;
      }

      this.$emit("verified");
    },
  },

  components: {
    TheMask,
    VueLadda,
  },
};
</script>
