<template>
  <div class="container-fluid form-horizontal omnibus-application-form">
    <tabs
      class="wizard"
      :transition-duration="0"
      v-model="currentTab"
      @before-change="onBeforeChangeTab"
    >
      <tab
        :title="wizardTabTitle[0]"
        html-title
        :tab-classes="{ complete: currentTab > 0 }"
      >
        <form ref="form" novalidate>
          <h5>{{ $t("omnibus-application.personal-info") }}</h5>
          <div class="form-group">
            <label class="col-sm-4 control-label">{{
              $t("application.title")
            }}</label>
            <div class="col-sm-8">
              <span class="info-text">
                {{ displayValues.titleTh | blankText }}
              </span>
            </div>
          </div>

          <div class="form-group">
            <label class="col-sm-4 control-label">{{
              $t("application.name-th")
            }}</label>
            <div class="col-sm-8">
              <span class="info-text">{{ applyNameTH | blankText }}</span>
            </div>
          </div>

          <div class="form-group">
            <label class="col-sm-4 control-label">{{
              $t("application.name-en")
            }}</label>
            <div class="col-sm-8">
              <span class="info-text">{{ applyNameEN | blankText }}</span>
            </div>
          </div>

          <div class="form-group">
            <label class="col-sm-4 control-label">{{
              $t("application.mobile-no")
            }}</label>
            <div class="col-sm-8">
              <span class="info-text">{{
                displayValues.mobileNo | blankText("n/a")
              }}</span>
            </div>
          </div>

          <div class="form-group">
            <label class="col-sm-4 control-label">{{
              $t("application.email")
            }}</label>
            <div class="col-sm-8">
              <span class="info-text">{{
                displayValues.email | blankText("n/a")
              }}</span>
            </div>
          </div>

          <div class="form-group">
            <label class="col-sm-4 control-label">{{
              $t("application.nationality")
            }}</label>
            <div class="col-sm-8">
              <span class="info-text">{{
                displayValues.nationality | nationalityText | blankText("n/a")
              }}</span>
            </div>
          </div>

          <div class="section">
            <h5>{{ $t("omnibus-application.ats-info") }}</h5>

            <p
              v-if="!hasATS"
              v-html="$t('omnibus-application.no-ats', [atsRegistrationLink])"
            ></p>

            <template v-if="hasATS">
              <div class="form-group">
                <label class="col-sm-4 control-label">
                  {{ $t("application.bank") }}
                </label>
                <div class="col-sm-4">
                  <span class="info-text">
                    {{ values.atsBank | bankName | blankText("n/a") }}
                  </span>
                </div>
              </div>

              <div class="form-group">
                <label class="col-sm-4 control-label">
                  {{ $t("application.account-type") }}
                </label>
                <div class="col-sm-4">
                  <span class="info-text">
                    {{
                      values.atsAccountType | accountTypeText | blankText("n/a")
                    }}
                  </span>
                </div>
              </div>

              <div class="form-group">
                <label class="col-sm-4 control-label">
                  {{ $t("application.account-name") }}
                </label>
                <div class="col-sm-4">
                  <span class="info-text">
                    {{ values.atsAccountName | blankText("n/a") }}
                  </span>
                </div>
              </div>

              <div class="form-group">
                <label class="col-sm-4 control-label">
                  {{ $t("application.account-no") }}
                </label>
                <div class="col-sm-4">
                  <span class="info-text">
                    {{
                      values.atsAccount | formatBankAccount | blankText("n/a")
                    }}
                  </span>
                </div>
              </div>
            </template>
          </div>

          <div class="section">
            <h5>{{ $t("omnibus-application.div-info") }}</h5>

            <div class="form-group">
              <label class="col-sm-4 control-label">
                {{ $t("application.bank") }}
              </label>
              <div class="col-sm-4">
                <span class="info-text">
                  {{ values.divBank | bankName | blankText("n/a") }}
                </span>
              </div>
            </div>

            <div class="form-group">
              <label class="col-sm-4 control-label">
                {{ $t("application.account-type") }}
              </label>
              <div class="col-sm-4">
                <span class="info-text">
                  {{
                    values.divAccountType | accountTypeText | blankText("n/a")
                  }}
                </span>
              </div>
            </div>

            <div class="form-group">
              <label class="col-sm-4 control-label">
                {{ $t("application.account-name") }}
              </label>
              <div class="col-sm-4">
                <span class="info-text">
                  {{ values.divAccountName | blankText("n/a") }}
                </span>
              </div>
            </div>

            <div class="form-group">
              <label class="col-sm-4 control-label">
                {{ $t("application.account-no") }}
              </label>
              <div class="col-sm-4">
                <span class="info-text">
                  {{ values.divAccount | formatBankAccount | blankText("n/a") }}
                </span>
              </div>
            </div>
          </div>

          <div class="section">
            <h5>{{ $t("omnibus-application.additonal-info") }}</h5>
            <div
              class="form-group"
              :class="
                getFieldClass(['referenceChannel', 'referenceChannelDesc'])
              "
            >
              <label class="col-sm-4 control-label required">
                {{ $t("application.reference-channel") }}
              </label>
              <div class="col-sm-4">
                <select
                  class="form-control input-xs"
                  v-model="form.referenceChannel"
                  :disabled="isLoading"
                >
                  <option value>{{ $t("common.please-select") }}</option>
                  <option
                    v-for="{ value, text } in referenceChannelItems"
                    :key="value"
                    :value="value"
                  >
                    {{ $t("application.reference-channel-" + text) }}
                  </option>
                </select>
              </div>
              <div class="col-sm-4" v-if="form.referenceChannel == '9'">
                <input
                  type="text"
                  class="form-control input-xs"
                  v-model="form.referenceChannelDesc"
                  :placeholder="$t('application.specify-reference-channel')"
                  maxlength="40"
                  :disabled="isLoading"
                />
              </div>
            </div>
          </div>
        </form>
      </tab>
      <!-- End Tab 1 -->

      <tab
        :title="wizardTabTitle[1]"
        html-title
        :tab-classes="{ complete: currentTab > 1 }"
      >
        <div class="verify-result-content">
          <h5>{{ $t("omnibus-application.personal-info") }}</h5>

          <div class="form-group">
            <label class="col-sm-4 control-label">{{
              $t("application.title")
            }}</label>
            <div class="col-sm-8">
              <span class="info-text">
                {{ displayValues.titleTh | blankText }}
              </span>
            </div>
          </div>

          <div class="form-group">
            <label class="col-sm-4 control-label">{{
              $t("application.name-th")
            }}</label>
            <div class="col-sm-8">
              <span class="info-text">{{ applyNameTH | blankText }}</span>
            </div>
          </div>

          <div class="form-group">
            <label class="col-sm-4 control-label">{{
              $t("application.name-en")
            }}</label>
            <div class="col-sm-8">
              <span class="info-text">{{ applyNameEN | blankText }}</span>
            </div>
          </div>

          <div class="form-group">
            <label class="col-sm-4 control-label">{{
              $t("application.mobile-no")
            }}</label>
            <div class="col-sm-8">
              <span class="info-text">{{
                displayValues.mobileNo | blankText("n/a")
              }}</span>
            </div>
          </div>

          <div class="form-group">
            <label class="col-sm-4 control-label">{{
              $t("application.email")
            }}</label>
            <div class="col-sm-8">
              <span class="info-text">{{
                displayValues.email | blankText("n/a")
              }}</span>
            </div>
          </div>

          <div class="form-group">
            <label class="col-sm-4 control-label">{{
              $t("application.nationality")
            }}</label>
            <div class="col-sm-8">
              <span class="info-text">{{
                displayValues.nationality | nationalityText | blankText("n/a")
              }}</span>
            </div>
          </div>

          <div class="section">
            <h5>{{ $t("omnibus-application.ats-info") }}</h5>

            <p
              v-if="!hasATS"
              v-html="$t('omnibus-application.no-ats', [atsRegistrationLink])"
            ></p>

            <template v-if="hasATS">
              <div class="form-group">
                <label class="col-sm-4 control-label">
                  {{ $t("application.bank") }}
                </label>
                <div class="col-sm-4">
                  <span class="info-text">
                    {{ values.atsBank | bankName | blankText("n/a") }}
                  </span>
                </div>
              </div>

              <div class="form-group">
                <label class="col-sm-4 control-label">
                  {{ $t("application.account-type") }}
                </label>
                <div class="col-sm-4">
                  <span class="info-text">
                    {{
                      values.atsAccountType | accountTypeText | blankText("n/a")
                    }}
                  </span>
                </div>
              </div>

              <div class="form-group">
                <label class="col-sm-4 control-label">
                  {{ $t("application.account-name") }}
                </label>
                <div class="col-sm-4">
                  <span class="info-text">
                    {{ values.atsAccountName | blankText("n/a") }}
                  </span>
                </div>
              </div>

              <div class="form-group">
                <label class="col-sm-4 control-label">
                  {{ $t("application.account-no") }}
                </label>
                <div class="col-sm-4">
                  <span class="info-text">
                    {{
                      values.atsAccount | formatBankAccount | blankText("n/a")
                    }}
                  </span>
                </div>
              </div>
            </template>
          </div>

          <div class="section">
            <h5>{{ $t("omnibus-application.div-info") }}</h5>

            <div class="form-group">
              <label class="col-sm-4 control-label">
                {{ $t("application.bank") }}
              </label>
              <div class="col-sm-4">
                <span class="info-text">
                  {{ values.divBank | bankName | blankText("n/a") }}
                </span>
              </div>
            </div>

            <div class="form-group">
              <label class="col-sm-4 control-label">
                {{ $t("application.account-type") }}
              </label>
              <div class="col-sm-4">
                <span class="info-text">
                  {{
                    values.divAccountType | accountTypeText | blankText("n/a")
                  }}
                </span>
              </div>
            </div>

            <div class="form-group">
              <label class="col-sm-4 control-label">
                {{ $t("application.account-name") }}
              </label>
              <div class="col-sm-4">
                <span class="info-text">
                  {{ values.divAccountName | blankText("n/a") }}
                </span>
              </div>
            </div>

            <div class="form-group">
              <label class="col-sm-4 control-label">
                {{ $t("application.account-no") }}
              </label>
              <div class="col-sm-4">
                <span class="info-text">
                  {{ values.divAccount | formatBankAccount | blankText("n/a") }}
                </span>
              </div>
            </div>
          </div>
          <!-- add on : 20251203 -->
          <div class="section">
              <h5>{{ $t("application.identification-info") }}</h5>
               <div
              class="form-group"
           
            >
            <!-- add here -->



            <label class="col-sm-4 control-label required"
              >ยันยันตัวตน</label
            >
            <div class="col-sm-7 col-sm-6">
              <div class="upload-status-container">
                <span
                  class="info-text success"
                  style="font-weight: bold"
                  v-if="(identifyConfig && identifyConfig.identifyFaceDatetime && identifyConfig.identifyDopaDatetime)"
                >
                  <i class="glyphicon glyphicon-ok" aria-hidden="true"></i>
                  ทำการยืนยันตัวตนเรียบร้อยแล้ว
                </span>
                <span
                  class="info-text danger"
                  style="font-weight: bold"
                  v-else
                >
                  <i
                    class="glyphicon glyphicon-remove"
                    aria-hidden="true"
                  ></i>
                  กรุณายืนยันตัวตน
                </span>
              </div>
              <button 
                type="button"
                class="btn btn-labeled btn-primary"
                v-if="(!identifyConfig || (identifyConfig && (!identifyConfig.identifyFaceDatetime || !identifyConfig.identifyDopaDatetime)))"
                @click="onClickVerify"
              >
                <span class="btn-label">
                  <i
                    class="glyphicon glyphicon-user"
                    aria-hidden="true"
                  ></i>
                </span>
                เริ่มยืนยันตัวตน
              </button>
            </div>
            </div>
          </div>
          <div class="section">
            <h5>{{ $t("omnibus-application.additonal-info") }}</h5>
            <div class="form-group">
              <label class="col-sm-4 control-label">
                {{ $t("application.reference-channel") }}
              </label>
              <div class="col-sm-8">
                <template v-if="form.referenceChannel !== ''">
                  {{
                    $t(
                      "application.reference-channel-" +
                        selectedReferenceChannelText
                    )
                  }}
                  <template v-if="form.referenceChannel === '9'">
                    ({{ form.referenceChannelDesc }})
                  </template>
                </template>
              </div>
            </div>
          </div>
        </div>

        <!-- OTP Form -->

        <div
          class="well"
          style="margin-top: 50px"
          v-if="!isConfirmOTP"
          ref="otpForm"
        >
          <div class="form-group">
            <label class="col-sm-4 control-label">หมายเลขโทรศัพท์</label>
            <div class="col-sm-4 col-lg-4">
              <input
                type="text"
                class="form-control input-xs"
                :value="displayValues.mobileNo"
                disabled
              />
            </div>
          </div>

          <div class="form-group">
            <div class="col-sm-8 col-sm-offset-4">
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
                ขอรหัส SMS OTP ใหม่ ({{ otpCountdown }}) วินาที
              </button>

              <a
                :href="changeMobileNoURL"
                class="btn btn-xs btn-primary changeMobileNoClass"
                style="margin-left: 5px"
                :disabled="isLoading"
              >
                เปลียนแปลงหมายเลขโทรศัพท์มือถือ
              </a>
            </div>
            <div
              v-if="otpForm.otpRef"
              class="col-sm-4 col-md-3 col-sm-offset-4"
            >
              <span class="small" style="color: #ff0000"
                >ระบบได้ส่งรหัส One-Time Password(OTP) ไปยังหมายเลขโทรศัพท์
                {{ displayValues.mobileNo }} โปรดใส่รหัส OTP
                เพื่อยืนยันรายการของท่าน</span
              >
            </div>
          </div>

          <div class="form-group">
            <label class="col-sm-4 control-label">หมายเลข Reference</label>
            <div class="col-sm-4">
              <input
                type="text"
                class="form-control input-xs"
                :value="otpForm.otpRef"
                disabled
              />
            </div>
            <div class="col-sm-8 col-sm-offset-4">
              <span class="small" style="color: #ff0000"
                >รหัส OTP จะส่งถึงท่านใน 30 วินาที
                หากท่านไม่ได้รับรหัสภายในเวลาที่กำหนด โปรดคลิก "ขอ OTP
                ใหม่"</span
              >
            </div>
          </div>

          <div class="form-group">
            <label class="col-sm-4 control-label"
              >กรุณากรอก OTP ที่ได้รับ</label
            >
            <div class="col-sm-4">
              <the-mask
                class="form-control input-xs"
                v-model="otpForm.otp"
                ref="inputOTPCode"
                mask="######"
                :disabled="isLoading || !otpForm.otpRef"
              />
              <span class="small" style="color: #ff0000"></span>
            </div>
          </div>

          <div class="form-group">
            <div class="col-sm-8 col-sm-offset-4">
              <vue-ladda
                type="button"
                button-class="btn btn-xs btn-primary"
                :loading="isLoading"
                data-style="slide-up"
                :disabled="!otpForm.otpRef"
                @click="onClickVerifyOTP"
                >ตรวจสอบ</vue-ladda
              >
            </div>
          </div>
        </div>

         <template v-if="isConfirmOTP">
        <!-- <template > -->
          <div class="well">
            <p v-html="agreementText"></p>
          </div>

          <p class="text-center">
            {{ $t("verify-page.please-read-omnibus-agreement") }}
            <a :href="contractUrl" target="_blank">
              {{ $t("common.click-here") }}
            </a>
          </p>

          <div class="form-group text-center">
            <label class="checkbox checkbox-custom">
              <input type="checkbox" v-model="isAgree" />
              {{ $t("verify-page.agree") }}
              <span style="color: #ff0000; font-size: 16px">*</span>
            </label>
          </div>
        </template>
        <!-- End OTP Form -->
      </tab>
      <!-- End Tab 2 -->

      <tab
        :title="wizardTabTitle[2]"
        html-title
        :tab-classes="{ complete: currentTab === 2 }"
      >
        <div class="application-text">
          <template v-if="displayMode === 'pending'">
            <p v-html="$t('finish-page.omnibus.pending-line-1')"></p>
            <p
              v-html="
                $t('finish-page.omnibus.pending-line-2', [
                  'customerservice.bualuang.co.th',
                ])
              "
            ></p>
          </template>

          <template v-if="displayMode === 'completed'">
            <p
              v-html="
                $t('finish-page.omnibus.success-line-1', [
                  formatFundAccountNo,
                  formatOpenDate,
                ])
              "
            ></p>
            <p v-html="$t('finish-page.omnibus.success-line-2')"></p>

            <div class="text-center" style="margin-top: 40px">
              <button
                type="button"
                class="btn btn-primary"
                style="white-space: normal"
                @click.prevent="onClickSegigateApply()"
              >
                {{ $t("finish-page.omnibus.segigate-apply") }}
              </button>
            </div>
          </template>
        </div>
      </tab>
      <!-- End Tab 3 -->
    </tabs>

    <div class="container-fluid btn-container" v-if="currentTab < 2">
      <div class="row">
        <div class="col-xs-6">
          <vue-ladda
            type="button"
            button-class="btn btn-labeled btn-warning"
            v-if="currentTab > 0"
            data-style="zoom-in"
            :loading="isLoading"
            @click="onClickPrev"
          >
            <span class="btn-label">
              <i
                class="glyphicon glyphicon-chevron-left"
                aria-hidden="true"
              ></i>
            </span>
            {{ $t("common.prev") }}
          </vue-ladda>
        </div>

        <div class="col-xs-6 text-right">
          <button
            type="button"
            v-if="currentTab === 0"
            class="btn btn-labeled btn-primary"
            @click.prevent="onClickNext"
          >
            <span class="btn-label">
              <i
                class="glyphicon glyphicon-chevron-right"
                aria-hidden="true"
              ></i>
            </span>
            {{ $t("common.next") }}
          </button>

          <vue-ladda
            type="button"
            button-class="btn btn-labeled btn-primary"
            v-if="currentTab === 1 && isAgree && this.isIdentifyComplted "
            data-style="slide-up"
            :loading="isLoading"
            @click="onClickSendData"
          >
            <span class="btn-label">
              <i class="glyphicon glyphicon-floppy-disk" aria-hidden="true"></i>
            </span>
            {{ $t("common.submit") }}
          </vue-ladda>

          <button
            type="button"
            v-if="currentTab === 1 &&( !isAgree || !this.isIdentifyComplted)"
            class="btn btn-labeled btn-primary"
            disabled
          >
            <span class="btn-label">
              <i class="glyphicon glyphicon-floppy-disk" aria-hidden="true"></i>
            </span>
            {{ $t("common.submit") }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import Vuelidate from "vuelidate";
import { required, minLength } from "vuelidate/lib/validators";
import { Tabs, Tab } from "uiv";
import VueLadda from "vue-ladda";
import { TheMask, mask } from "vue-the-mask";
import to from "await-to-js";

Vue.use(Vuelidate);

import {
  contactMessage,
  pleaseContactMessage,
  defaultDisplayValues,
} from "../../services/constants";
import { openAccountFundAPI } from "../../services/axios";
import {
  blankText,
  nationalityText,
  formatFullDate,
  formatAccountNo,
  bankName,
  accountTypeText,
  formatBankAccount,
} from "../../services/filters";
import { showError, showConfirm } from "../../services/alert";

export default {
  name: "OmnibusApplicationForm",

  props: {
    displayValues: {
      type: Object,
      default() {
        return defaultDisplayValues;
      },
    },

    values: {
      type: Object,
      required: true,
    },

    isSuccess: {
      type: Boolean,
      default: false,
    },

    lang: {
      type: String,
      default: "th",
    },

    agreementText: {
      type: String,
      default: "",
    },
    crsData:{
      type:Object,
      required:false,
    },
    identifyConfig: {
            type: Object,
            default: () => ({})
        },
  },

  data() { 
    return {
      currentTab: 0,
      isLoading: false,
      form: {
        referenceChannel: "6",
        referenceChannelDesc: "",
      },
      displayMode: "pending",
      verifyForm: {
        mobileNo: "",
        citizenCardID: "",
        FacecompareIdentify:""
      },
      referenceChannelItems: [
        { value: "1", text: "ic" },
        { value: "2", text: "officer" },
        { value: "3", text: "website" },
        { value: "4", text: "seminar" },
        { value: "5", text: "bbl" },
        { value: "6", text: "internet" },
        { value: "7", text: "printing-media" },
        { value: "8", text: "friend" },
        { value: "9", text: "other" },
      ],
      isConfirmOTP: false,
      isAgree: false,
      otpCountdown: null,
      otpForm: {
        otpRef: "",
        otp: "",
      },
      
    };
  },

  validations() {
    let rules = {
      form: {
        referenceChannel: { required },
      },
      otpForm: {
        otp: {
          required,
          minLength: minLength(6),
        },
      },
    };

    if (this.form.referenceChannel === "9") {
      rules.form.referenceChannelDesc = { required };
    }

    return rules;
  },

  computed: {
     isIdentifyComplted(){
        return (this.identifyConfig && this.identifyConfig.identifyFaceDatetime && this.identifyConfig.identifyDopaDatetime) ;
    },
    contractUrl() {
      let taskType;
      if(this.values?.isNewCustCode){
            taskType = 3;
      }else{
            taskType = 4;
      }
  
      if(taskType == 3){
        return process.env.VUE_APP_OMNIBUS_NEWCUSTCODE_CONTRACT_URL;
      }else{
        return process.env.VUE_APP_OMNIBUS_CONTRACT_URL;
      }

     
    },

    changeMobileNoURL() {
      return process.env.VUE_APP_LINK_CHANGE_MOBILE;
    },

    atsRegistrationLink() {
      if (!["002", "004"].includes(this.values.divBank)) {
        return "https://knowledge.bualuang.co.th/knowledge-base/what-is-eats/";
      }
      return process.env.VUE_APP_LINK_ATS_REGISTRATION;
    },

    wizardTabTitle() {
      const iconHTML =
        '<div class="icon-container"><i class="glyphicon glyphicon-ok"></i></div>';
      return [
        `<span class="step">
          ${this.currentTab > 0 ? iconHTML : "1"}
        </span>
        <span class="title">${this.$t("application.step.fill-data")}</span>`,
        `<span class="step">
          ${this.currentTab > 1 ? iconHTML : "2"}
        </span>
        <span class="title">
          ${this.$t("application.step.check-info")}
        </span>`,
        `<span class="step">
          ${this.currentTab > 1 ? iconHTML : "3"}
        </span>
        <span class="title">
          ${this.$t("application.step.result")}
        </span>`,
      ];
    },

    applyNameTH() {
      if (!this.displayValues.nameTh) {
        return "";
      }
      return `${this.displayValues.nameTh} ${this.displayValues.surnameTh}`;
    },

    applyNameEN() {
      if (!this.displayValues.nameEn) {
        return "";
      }
      return `${this.displayValues.nameEn} ${this.displayValues.surnameEn}`;
    },

    selectedReferenceChannelText() {
      const findItem = this.referenceChannelItems.find(
        ({ value }) => value === this.form.referenceChannel
      );
      return findItem?.text ?? "";
    },

    isShowCountdown() {
      return this.otpCountdown && this.otpCountdown > 0;
    },

    otpRequestButtonText() {
      return this.otpForm.otpRef ? "ขอรหัส SMS OTP ใหม่" : "ขอรหัส SMS OTP";
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

    hasATS() {
      return this.values?.atsAccount && this.values?.atsBank;
    },
  },

  methods: {
       async onClickVerify() {
      if (window.onclickShowIdentifyApp) {
        try {
           let taskType;
           if(this.values?.isNewCustCode){
            taskType = "3";
          }else{
            taskType = "4";
          }
          await window.onclickShowIdentifyApp(taskType);
        } catch (err) {
          console.error("Error when calling Identify App:", err);
        }
      } else {
        console.warn("onclickShowIdentifyApp is not loaded yet.");
      }
    },
    getFieldClass(fieldname) {
      let hasErrorClass = false;
      if (Array.isArray(fieldname)) {
        hasErrorClass = fieldname.some(
          (field) =>
            this.$v.form?.[field]?.$dirty && this.$v.form?.[field]?.$invalid
        );
      } else {
        hasErrorClass =
          this.$v.form?.[fieldname]?.$dirty &&
          this.$v.form?.[fieldname]?.$invalid;
      }
      return { "has-error": hasErrorClass };
    },

    onBeforeChangeTab() {
      // for Disable tab
    },

    onClickPrev() {
      if (this.currentTab === 0) return;
      this.form.pincode = "";
      this.scrollToTop();
      this.currentTab--;
    },

    async onClickNext() {
      if (this.currentTab === 1) return;

      this.$v.form.$touch();
      if (this.$v.form.$invalid) {
        this.$refs.form
          .getElementsByClassName("has-error")[0]
          .scrollIntoView({ behavior: "smooth" });
        return;
      }
      this.scrollToTop();
      this.currentTab++;
    },
    handleResult(result) {
      if (typeof result === "object" && result !== null) {
        // this.crsData = result;
    
        this.sendApplyData();
      } else if (result === true) {
        this.sendApplyData();
      }
    },
    sendApplyData(){
      showConfirm(
        "ยืนยันการส่งข้อมูล",
        "ท่านได้ตรวจสอบข้อมูลเรียบร้อยแล้วและต้องการส่งข้อมูลใช่หรือไม่",
        "ยืนยัน",
        "ยกเลิก",
        async () => {
          let taskType;
          if(this.values?.isNewCustCode){
            taskType = 3;
          }else{
            taskType = 4;
          }
          
          // ต้องส่ง customerDetail
          const customerDetail = this.identifyConfig && this.identifyConfig?.customerDetail ? this.identifyConfig.customerDetail : null;
          let dateOfIssueEn = "";
          let dateOfExpiryEn = "";
          if(customerDetail){
              console.log("send omn->",customerDetail);
              const customerDetailObject = JSON.parse(customerDetail);
              dateOfIssueEn = customerDetailObject.dateOfIssueEn;
              dateOfExpiryEn = customerDetailObject.dateOfExpiryEn;
              
          }

          if(this.values.cardissuedate){
            dateOfIssueEn = this.values.cardissuedate;
          }
          // ====================================
          
          const params = {
            referenceChannel: this.form.referenceChannel,
            referenceChannelDesc: this.form.referenceChannelDesc,
            taskType  : taskType,
            identifyDopaDatetime:this.identifyConfig.identifyDopaDatetime,
            identifyFaceDatetime:this.identifyConfig.identifyFaceDatetime,
            dateOfIssueEn:dateOfIssueEn,
            dateOfExpiryEn:dateOfExpiryEn
          };
      
          // console.log(params);
          this.isLoading = true;
          const [error] = await to(
            openAccountFundAPI.post("fund/apply/omnibus/send", params)
          );
          this.isLoading = false;
          if (error) {
            const { status, data } = error.response;
            if (status === 400) {
              const errorMapping = {
                "invalid customer type": `เนื่องจากท่านไม่ใช่บุคคลธรรมดา ${pleaseContactMessage}`,
                "invalid card type": `เนื่องจากท่านไม่มีเอกสารยืนยันตัวตนเป็นบัตรประชาชนหรือ Passport ${pleaseContactMessage}`,
                "invalid age":
                  "เนื่องจากอายุของท่านไม่ถึง 20 ปี กรุณาตรวจสอบข้อมูลวันเดือนปีเกิดของท่าน",
              };
              if (errorMapping[data?.errMsg]) {
                showError(
                  "ขออภัยค่ะ ท่านไม่สามารถสมัครได้",
                  errorMapping[data?.errMsg]
                );
                return;
              }
            }

            showError(
              "ไม่สามารถส่งข้อมูลได้",
              `เนื่องจากเกิดข้อผิดพลาดในการส่งข้อมูลการสม้คร ${contactMessage}`
            );
            return;
          }

          this.scrollToTop();
          this.currentTab = 2;
        }
      );
   
    },
    onClickSendData() {
      if (
        typeof window.openCRSWithCallback === "function" 
      ) {
        window.openCRSWithCallback(this.handleResult , "omn");
      }
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

      this.otpForm = {
        otpRef,
        otp: "",
      };
      this.setCountdown();
      this.$refs.inputOTPCode.$el?.focus();
    },

    async onClickVerifyOTP() {
      if (this.otpForm.otp.trim() === "") {
        showError("ไม่สามารถทำรายการได้", "เนื่องจากท่านยังไม่ได้กรอกรหัส OTP");
        return;
      }
     const tasktype = this.values?.isNewCustCode ? 3 : 4;
     const inputData = { 
          ...this.otpForm, 
          tasktype,
          maincustcode:this.values.customerNo
     };


      this.isLoading = true;
      const [error] = await to(
        openAccountFundAPI.post("fund/apply/omnibus/otp/verify", inputData)
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

      this.isConfirmOTP = true;
    },

    onClickSegigateApply() {
      this.$emit("segigate-apply");
    },

    setCountdown() {
      this.otpCountdown = 30;
      const countdownInterval = setInterval(() => {
        if (this.otpCountdown == 1) {
          this.otpCountdown = null;
          clearInterval(countdownInterval);
          return;
        }
        this.otpCountdown--;
      }, 1000);
    },

    scrollToTop() {
      window.scrollTo({ top: 0 });
    },
  },

  mounted() {
    if (this.values.currentStatus !== 1) {
      this.currentTab = 2;

      if (this.values.currentStatus === 3) {
        this.displayMode = "completed";
      }
    }
    const data = this.values;
      // Set Verify Form
    this.$nextTick(() => {
      const identifyMapping = {
        ["1"]: "mobileNo",
        ["2"]: "citizenCardID",
        ["3"]: "FacecompareIdentify",
      };
      console.log("data.confirmation::",data);
      data.confirmations.forEach(({ ruleID }) => {
        const identifyName = identifyMapping[ruleID];
        if (identifyName) {
          this.verifyForm[identifyName] = "Y";
        }
      });

  
    });
  },

  filters: {
    blankText,
    nationalityText,
    bankName,
    accountTypeText,
    formatBankAccount,
  },

  components: {
    Tabs,
    Tab,
    VueLadda,
    TheMask,
  },

  directives: {
    mask,
  },
};
</script>

<style lang="scss">
$step-width: 33.3333%;

.bls-fund-application {
  .omnibus-application-form {
    @import "./../../assets/scss/wizard";
  }
}

@media (max-width: 400px) {
    /* ใช้สำหรับ div ที่ครอบปุ่มทั้งหมด */
    .changeMobileNoClass{
 
        margin-top: 5px !important;
        margin-left: 0 !important; 
    }

   
}

 .changeMobileNoClass{
 
         margin-top: 0px;
        margin-left: 5px; 
    }
</style>
