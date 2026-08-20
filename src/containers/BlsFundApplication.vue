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
            
          >
            <!-- Omnibus Application Form -->
          </omnibus-application-form>
        </template>
      </template>
      <!-- End Omnibus -->

      <!-- Segigate -->
      <template v-if="(displayMode === 'segigate' || displayMode === 'omnandseg') && !isWebview">
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

          <segigate-application-form
            v-if="!showSegigatePreForm"
            :display-values="displayValues"
            :values="segigateData"
            :suitability="suitability"
            :lang="lang"
            :agreement-text="segregateAgreementText"
            :crsData="crsData"
            :identify-config="identifyConfig"
            :ndid-config="ndidConfig"
            :is-omn-and-seg="displayMode === 'omnandseg'"
          >
          </segigate-application-form>
        </template>
      </template>

      <template v-if="(displayMode === 'segigate' || displayMode === 'omnandseg') && isWebview">
        <div class="application-text container-fluid">
          <p v-html="$t('error-page.segregate-webview')"></p>
        </div>
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
    ndidConfig: {
        type: Object,
        default: () => ({})
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
        }
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
    // ให้ปิด pre-form แล้วขึ้น popup ยืนยันตัวตน (ถ่ายบัตร + DOPA) ทันที ก่อนเข้าหน้า ApplicationForm
    // เดิม auto-trigger ตัวนี้เคยอยู่ที่ fund-application-new_blade.php (ยิงทันทีตอนโหลดหน้า) แต่ requirment
    // เปลี่ยนมาให้รอจนกว่าจะกดยอมรับก่อน จึงย้ายมาไว้ตรงนี้แทน
    onClickStartSegigate() {
      this.showSegigatePreForm = false;
      if (window.onclickShowIdentifyApp) {
        window.onclickShowIdentifyApp("0");
      } else {
        console.warn("onclickShowIdentifyApp is not loaded yet.");
      }
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
}
</style>
