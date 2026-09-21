<template>
  <div class="bls-fund-application">
    <template v-if="!isInitForm">
      <!-- Omnibus -->
      <template v-if="displayMode === 'omnibus'">
        <template
          v-if="
            omnibusData &&
            (omnibusData.currentStatus === 1 ||
              omnibusData.currentStatus === 2 ||
              omnibusData.currentStatus === 3)
          "
        >
          <omnibus-pre-form
            v-if="showOmnibusPreForm"
            :display-values="displayValues"
            :values="initFormData"
            :crs-state="crsState"
            @started="showOmnibusPreForm = false"
            @crsData="setCRSValue"
            
          >
            <!-- Omnibus Pre Form -->
          </omnibus-pre-form>

          <omnibus-application-form
            v-if="!showOmnibusPreForm"
            :lang="lang"
            :display-values="displayValues"
            :values="omnibusData"
            :agreement-text="omnibusAgreementText"
            @segigate-apply="onClickSegigateApply()"
            :identify-config="identifyConfig"
            :verify-identity-config="verifyIdentityConfig"
            
          >
            <!-- Omnibus Application Form -->
          </omnibus-application-form>
        </template>
      </template>
      <!-- End Omnibus -->

      <!-- Segigate -->
      <!--
        add on : requirment - เดิม segigate/omn+seg ผ่าน webview จะถูกบล็อกทั้งหมด (isWebview) ขึ้นข้อความ
        ให้ไปใช้เว็บเต็มแทน (error-page.segregate-webview) - requirment ใหม่ยกเลิกข้อจำกัดนี้แล้ว (ไม่แยก
        website/webview อีกต่อไป) เปลี่ยนเป็นเงื่อนไขเดียว: ต้องยืนยันตัวตนผ่านเว็บใหม่ก่อน (verifyIdentityConfig)
        ไม่ว่าจะเข้าผ่าน website หรือ webview ก็ตาม - ตัด && !isWebview ออกจากบรรทัดนี้แล้ว
      -->
      <template v-if="displayMode === 'segigate' || displayMode === 'omnandseg'">
        <template
          v-if="segigateData && [1, 2, 7].includes(segigateData.currentStatus)"
        >
          <segigate-pre-form
            v-if="showSegigatePreForm"
            :display-values="displayValues"
            :values="segigateData"
            :crs-state="crsState"
            @started="onClickStartSegigate"
            @crsData="setCRSValue"
          >
            <!-- Segigate Pre Form -->
          </segigate-pre-form>

          <!--
            add on : requirment - หน้า blocking ใหม่ แสดงแทน segigate-application-form 
          -->
          <div
            v-if="!showSegigatePreForm && !verifyIdentityConfig.verified"
            class=""
          >
          <!-- container-fluid verify-identity-required-page-->
          <!--
            <div class="verify-identity-required-page__icon">
              <i class="glyphicon glyphicon-lock" aria-hidden="true"></i>
            </div>
          -->
            <p class="verify-identity-required-page__text">
              {{ $t('error-page.verify-identity-required') }}
            </p>
          </div>

          <segigate-application-form
            v-if="!showSegigatePreForm && verifyIdentityConfig.verified"
            :display-values="displayValues"
            :values="segigateData"
            :suitability="suitability"
            :lang="lang"
            :agreement-text="segregateAgreementText"
            :crsData="crsData"
            :identify-config="identifyConfig"
            :ndid-config="ndidConfig"
            :verify-identity-config="verifyIdentityConfig"
            :is-omn-and-seg="displayMode === 'omnandseg'"
          >
          </segigate-application-form>
        </template>
      </template>
      <!-- End Segigate -->

      <!-- All Completed -->
      <template v-if="isCompleted">
        <div class="application-text container-fluid">
          <template v-if="displayMode === 'completed'">
            <p
              v-html="
                $t('finish-page.complete.line-1', [
                  formatFundAccountNo,
                  formatOpenDate,
                ])
              "
            ></p>
            <p
              v-html="
                $t('finish-page.complete.line-2', [
                  'customerservice.bualuang.co.th',
                ])
              "
            ></p>
          </template>
          <template v-if="displayMode === 'have-account'">
            <p
              v-html="
                $t('finish-page.have-account.line-1', [
                  formatFundAccountNo,
                  formatOpenDate,
                ])
              "
            ></p>
            <p
              v-html="
                $t('finish-page.have-account.line-2', [
                  'customerservice.bualuang.co.th',
                ])
              "
            ></p>
          </template>
        </div>
      </template>

      <template v-if="isPending">
        <div class="application-text container-fluid">
             <p v-html="$t('finish-page.omnibus_and_segigate.pending-line-1')"></p>
            <p
              v-html="
                $t('finish-page.omnibus_and_segigate.pending-line-2', [
                  'customerservice.bualuang.co.th',
                ])
              "
            ></p>
         
        </div>
      </template>
      <!-- End All Completed -->

      <div class="container-fluid" v-if="displayMode === ''">
        <div
          class="application-text"
          v-html="
            $t(
              errorMessage ? 'error-page.' + errorMessage : 'error-page.text',
              ['customerservice.bualuang.co.th']
            )
          "
        ></div>
      </div>

      <!--  -->
    </template>
    <!-- End Application Form -->

    <div class="container-fluid" v-else>
      <div
        class="application-text"
        v-if="errorMessage !== ''"
        v-html="
          $t(errorMessage ? 'error-page.' + errorMessage : 'error-page.text', [
            'customerservice.bualuang.co.th',
          ])
        "
      ></div>
      <div class="loading-text" v-else>
        <div class="spinner">
          <div class="rect1"></div>
          <div class="rect2"></div>
          <div class="rect3"></div>
          <div class="rect4"></div>
          <div class="rect5"></div>
        </div>
        <strong>{{ $t("common.please-wait") }}</strong>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import VueI18n from "vue-i18n";
import to from "await-to-js";

import { openAccountFundAPI } from "./../services/axios";

import {
  defaultDisplayValues,
  defaultFormData,
  contactMessage,
} from "./../services/constants";

import { formatFullDate, formatAccountNo } from "./../services/filters";

import {
  OmnibusPreForm,
  OmnibusApplicationForm,
} from "./../components/omnibus";

import {
  SegigatePreForm,
  SegigateApplicationForm,
} from "./../components/segigate";

import transData from "./../i18n.json";

Vue.use(VueI18n);

export default {
  name: "BlsFundApplication",

  props: {
    identifyConfig: {
        type: Object,
        default: () => ({})
    },
    // add on : requirment - ndidConfig รับค่าจาก popup ยืนยันตัวตนผ่าน NDID (bls-ndid-verify) ที่ blsport
    // sync เข้ามา (ดู bus.$on('ndid-config-updated', ...) ใน fund-application-new_blade.php)
    // ส่งต่อให้ segigate-application-form ใช้เช็คเงื่อนไขปุ่ม "ถัดไป" ใน step 2
    // หมายเหตุ (requirment ใหม่) : ไม่ได้ใช้เป็นเงื่อนไขหลักแล้ว เปลี่ยนไปใช้ verifyIdentityConfig ด้านล่างแทน
    // แต่ยังคง prop นี้ไว้ ไม่ได้ลบ (ดูเหตุผลใน README ที่แนบมา)
    ndidConfig: {
        type: Object,
        default: () => ({})
    },
    // add on : requirment - เว็บยืนยันตัวตนใหม่ (แทนที่ bls identify application เดิมทั้ง 3 จุด: PreForm accept
    // ของ segigate/omn+seg, ปุ่ม "ยันยันตัวตน" ของ omnibus ล้วนๆ, ปุ่มยืนยันตัวตนใน step 2 ของ omn+seg)
    // sync เข้ามาจาก blade ผ่าน bus.$on('verify-identity-config-updated', ...) เหมือน identifyConfig/ndidConfig
    verifyIdentityConfig: {
        type: Object,
        default: () => ({ verified: false })
    },
    suitability: {
      type: Object,
      required: true,
    },
    lang: {
      type: String,
      default: "th",
    },
    isWebview: {
      type: Boolean,
      default: false,
    },
    omnibusAgreementText: {
      type: String,
      required: true,
    },
    segregateAgreementText: {
      type: String,
      required: true,
    },
  },

  data() {
    this.$i18n.locale = this.lang;

    return {
      displayMode: "",
      currentTab: 0,
      isInitForm: true,
      isInProgressOmnibus: false,
      displayValues: defaultDisplayValues,
      initFormData: defaultFormData,
      showOmnibusPreForm: false,
      omnibusData: null,
      showSegigatePreForm: false,
      segigateData: null,
      isLoading: false,
      errorMessage: "",
      contactMessage,
      suitTotalScore: 0,
      crsState:"",
      crsData:{},
    };
  },

  computed: {
    isCompleted() {
      if (!this.displayMode) {
        return false;
      }

      return ["completed", "have-account"].includes(this.displayMode);
    },
     isPending() {
      if (!this.displayMode) {
        return false;
      }

      return ["pending"].includes(this.displayMode);
    },

    formatFundAccountNo() {
      if (!this.displayValues.fundAccountNo) {
        return "";
      }
      const { fundAccountNo } = this.displayValues;
      return formatAccountNo(fundAccountNo);
    },

    formatOpenDate() {
      if (!this.displayValues.openDate) {
        return "";
      }
      const { openDate } = this.displayValues;
      return formatFullDate(openDate, this.lang);
    },
  },

  watch: {
    lang(value) {
      this.$i18n.locale = value;
    },
    identifyConfig: {
        handler(newConfig) {
            console.log("bls-fund-application: ได้รับ identifyConfig ใหม่:", newConfig);

        },
        deep: true,
        immediate: true // ให้ทำงานทันทีที่ Component ถูก Mount ด้วย
    }
  },

  mounted() {
    this.$nextTick(() => {
      this.loadData();
    });
  },

  methods: {
    setCRSValue(values){
      this.crsData = values;
    },
    async loadData() {
      const [err, result] = await to(openAccountFundAPI.post("fund/apply"));
      this.isInitForm = false;
      if (err) {
        return;
      }

      const { initDisplayMode, displayValues, omnibusData, segigateData ,crsState } =
        result.data;
      this.displayMode = initDisplayMode;
      this.crsState = crsState;
      if (this.displayMode === "omnibus") {
        if (!omnibusData) {
          this.errorMessage = "omnibus-null-data";
          this.displayMode = "";
          return;
        }
      } else if (this.displayMode === "segregate") {
        if (!segigateData) {
          this.errorMessage = "segregate-null-data";
          this.displayMode = "";
          return;
        }
      }

      Object.keys(this.displayValues).forEach((field) => {
        this.displayValues[field] = displayValues[field] ?? "";
      });

      if (initDisplayMode !== "completed") {
        if (omnibusData) {
          const { currentStatus, isNewApply } = omnibusData;
          this.isSuccessOmnibus = currentStatus === 2;
          this.showOmnibusPreForm = isNewApply;
          this.omnibusData = { ...omnibusData };
        }

        if (segigateData) {
         this.showSegigatePreForm = segigateData.isNewApply;
         // this.showSegigatePreForm = true; // TODO : REMOVE THIS LINE ON PRODUCTION
          this.segigateData = { ...segigateData };
          // add on : requirment - "เข้ามาในหน้าเปิดบัญชี omn+seg ในstep1" ครอบคลุมกรณีนี้ด้วย: ถ้าไม่ใช่ใบสมัคร
          // ใหม่ (isNewApply=false) จะไม่เห็น PreForm เลย ไปที่ ApplicationForm (step1) ตรงๆ - ต้องเช็ค/trigger
          // ยืนยันตัวตนตรงนี้ด้วย เพราะ onClickStartSegigate (ทริกเกอร์ตอนกด PreForm accept) จะไม่ถูกเรียกในเคสนี้
          if (!segigateData.isNewApply) {
            this.checkAndTriggerVerifyIdentity();
          }
        }
      }
    },

    // add on : requirment - เช็คสถานะยืนยันตัวตน (verifyIdentityConfig.verified) ถ้ายังไม่เคยยืนยัน ให้เปิด
    // เว็บยืนยันตัวตนใหม่ (new tab / external browser แล้วแต่ website/webview) ครั้งเดียว ใช้ร่วมกันทั้งจุดที่
    // กด "ยอมรับ" ใน PreForm (onClickStartSegigate) และจุดที่เข้า step1 ตรงๆ (loadData ด้านบน)
    checkAndTriggerVerifyIdentity() {
      if (this.verifyIdentityConfig && this.verifyIdentityConfig.verified) {
        return;
      }
      if (window.onClickShowVerifyIdentityWebsite) {
        window.onClickShowVerifyIdentityWebsite();
      } else {
        console.warn("onClickShowVerifyIdentityWebsite is not loaded yet.");
      }
    },

    onClickSegigateApply() {
      if (!this.segigateData) {
        this.errorMessage = "segregate-null-data";
        this.displayMode = "";
        return;
      }
      this.displayMode = "segigate";
    },

    // add on : requirment - หลังลูกค้ากด "ยอมรับและเปิดเลขที่ผู้ถือหน่วยเฉพาะ..." ในหน้า pre-form ของ
    // segigate (ครอบคลุมทั้ง mode segigate และ omnandseg เพราะใช้ pre-form/application-form ร่วมกัน)
    // เดิมเคยเปิด popup bls identify application (DOPA+OCR) ตรงนี้ - requirment ใหม่เลิกใช้แล้ว
    // เปลี่ยนเป็นเช็ค/เปิดเว็บยืนยันตัวตนใหม่แทน (ผ่าน checkAndTriggerVerifyIdentity ด้านบน ใช้ร่วมกับ loadData)
    onClickStartSegigate() {
      this.showSegigatePreForm = false;
      this.checkAndTriggerVerifyIdentity();
    },

    scrollToTop() {
      window.scrollTo({ top: 0 });
    },
  },

  components: {
    OmnibusPreForm,
    OmnibusApplicationForm,
    SegigatePreForm,
    SegigateApplicationForm,
  },

  i18n: transData,
};
</script>

<style lang="scss">
.bls-fund-application {
  background-color: #fff;
  padding: 20px 0;

  @import "./../assets/scss/common";
  @import "./../assets/scss/button";
  @import "./../assets/scss/loading";
  @import "./../assets/scss/verify-result-content";
  @import "./../assets/scss/verify-identity";
}
</style>
