<template>
  <div
    class="container-fluid segigate-application-form form-horizontal"
    ref="form"
  >
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
        <!-- Apply Info -->
        <h5>{{ $t("application.personal-info") }}</h5>
        <div class="form-group">
          <label class="col-sm-4 control-label">{{
            $t("application.gender")
          }}</label>
          <div class="col-sm-8">
            <span class="info-text">{{ genderText | blankText }}</span>
          </div>
        </div>

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
            $t("application.birthdate")
          }}</label>
          <div class="col-sm-8">
            <span class="info-text">
              {{ displayValues.birthday | formatDate | blankText("n/a") }}
            </span>
          </div>
        </div>

        <div class="form-group">
          <label class="col-sm-4 control-label">{{
            $t("application.nationality")
          }}</label>
          <div class="col-sm-4">
            <select
              class="form-control input-xs"
              v-model="displayValues.nationality"
              disabled
            >
              <option
                v-for="{ value, text } in nationalities"
                :key="value"
                :value="value"
              >
                {{ text }}
              </option>
            </select>
          </div>
        </div>

        <div class="form-group">
          <label class="col-sm-4 control-label">{{
            $t("application.card-type")
          }}</label>
          <div class="col-sm-8">
            <label class="radio-inline radio-custom">
              <input
                type="radio"
                v-model="displayValues.cardType"
                value="CI"
                disabled
              />
              {{ $t("application.card-type-text.card-id") }}
            </label>
            <label class="radio-inline radio-custom">
              <input
                type="radio"
                v-model="displayValues.cardType"
                value="PP"
                disabled
              />
              {{ $t("application.card-type-text.passport") }}
            </label>
          </div>
        </div>

        <div
          class="form-group"
          :class="
            getFieldClass(
              displayValues.cardType === 'PP' ? 'cardID' : 'passportID'
            )
          "
        >
          <label class="col-sm-4 control-label">{{
            $t("application.card-no")
          }}</label>
          <div class="col-sm-4">
            <input
              type="tel"
              class="form-control input-xs"
              v-if="displayValues.cardType === 'CI'"
              v-model="displayValues.cardID"
              v-mask="'#-####-#####-##-#'"
              disabled
            />
            <input
              type="tel"
              class="form-control input-xs"
              v-if="displayValues.cardType === 'PP'"
              v-model="displayValues.cardID"
              v-mask="'#########'"
              disabled
            />
          </div>
        </div>

        <div
          class="form-group"
          v-if="displayValues.cardType === 'PP'"
          :class="getFieldClass('issueCountry')"
        >
          <label class="col-sm-4 control-label required">{{
            $t("application.issue-country")
          }}</label>
          <div class="col-sm-4">
            <select
              class="form-control input-xs"
              v-model="form.issueCountry"
              :disabled="isLoading"
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

        <div class="form-group" :class="getFieldClass('flagNotExpire')">
          <label class="col-sm-4 control-label required">{{
            $t("application.not-expired")
          }}</label>
          <div class="col-sm-8">
            <label class="radio-inline radio-custom">
              <input
                type="radio"
                v-model="form.flagNotExpire"
                value="0"
                :disabled="displayValues.cardType === 'PP' || isLoading"
              />
              {{ $t("common.no") }}
            </label>
            <label class="radio-inline radio-custom">
              <input
                type="radio"
                v-model="form.flagNotExpire"
                value="1"
                :disabled="displayValues.cardType === 'PP' || isLoading"
              />
              {{ $t("common.yes") }}
            </label>
          </div>
        </div>

        <div
          class="form-group"
          v-if="form.flagNotExpire == '0'"
          :class="
            getFieldClass(
              displayValues.cardType === 'CI'
                ? 'expireDate'
                : 'passportExpireDate'
            )
          "
        >
          <label class="col-sm-4 control-label required">
            {{ $t("application.expired-date") }}
          </label>
          <div class="col-sm-8">
            <date-input
              v-if="displayValues.cardType === 'CI'"
              v-model="form.expireDate"
              ref="expireDateRef"
              :max-year="maxExpireCardYear"
              :min-year="minExpireCardYear"
              :disabled="isLoading"
            ></date-input>
            <date-input
              v-if="displayValues.cardType === 'PP'"
              v-model="form.passportExpireDate"
              ref="passportExpireDateRef"
              :max-year="maxExpireCardYear"
              :min-year="minExpireCardYear"
              :disabled="isLoading"
            ></date-input>
          </div>
        </div>

        <div class="form-group" :class="getFieldClass('flagMartialStatus')">
          <label class="col-sm-4 control-label required">
            {{ $t("application.marital-status") }}
          </label>
          <div class="col-sm-8">
            <label class="radio-inline radio-custom">
              <input
                type="radio"
                v-model="form.flagMartialStatus"
                value="1"
                :disabled="isLoading"
              />
              {{ $t("application.marital-status-text.single") }}
            </label>
            <label class="radio-inline radio-custom">
              <input
                type="radio"
                v-model="form.flagMartialStatus"
                value="2"
                :disabled="isLoading"
              />
              {{ $t("application.marital-status-text.married") }}
            </label>
          </div>
        </div>

        <div
          class="form-group"
          v-if="form.flagMartialStatus == '2'"
          :class="getFieldClass(['spouseNameTh', 'spouseSurnameTh'])"
        >
          <label class="col-sm-4 control-label required">
            {{ $t("application.spouse-name-th") }}
          </label>
          <div class="col-sm-8">
            <div class="row">
              <div class="col-xs-6">
                <input
                  type="text"
                  class="form-control input-xs"
                  v-model="form.spouseNameTh"
                  :placeholder="$t('application.name')"
                  maxlength="100"
                  :disabled="isLoading"
                />
              </div>

              <div class="col-xs-6">
                <input
                  type="text"
                  class="form-control input-xs"
                  v-model="form.spouseSurnameTh"
                  :placeholder="$t('application.surname')"
                  maxlength="100"
                  :disabled="isLoading"
                />
              </div>
            </div>
          </div>
        </div>
        <div
          class="form-group"
          v-if="form.flagMartialStatus == '2'"
          :class="getFieldClass(['spouseNameEn', 'spouseSurnameEn'])"
        >
          <label class="col-sm-4 control-label required">
            {{ $t("application.spouse-name-en") }}
          </label>
          <div class="col-sm-8">
            <div class="row">
              <div class="col-xs-6">
                <input
                  type="text"
                  class="form-control input-xs"
                  v-model="form.spouseNameEn"
                  placeholder="Name"
                  maxlength="100"
                  :disabled="isLoading"
                />
              </div>

              <div class="col-xs-6">
                <input
                  type="text"
                  class="form-control input-xs"
                  v-model="form.spouseSurnameEn"
                  placeholder="Surname"
                  maxlength="100"
                  :disabled="isLoading"
                />
              </div>
            </div>
          </div>
        </div>
        <!-- End Apply Info -->

        <!-- Address/Occupation Info -->
        <div class="section">
          <h5>{{ $t("application.address-info") }}</h5>
          <div class="form-group">
            <label class="col-sm-4 control-label">
              {{ $t("application.old-address") }}
            </label>
            <div class="col-sm-8">
              <span class="info-text">{{
                displayValues.oldAddress | blankText("n/a")
              }}</span>
            </div>
          </div>

          <div class="form-group">
            <div class="col-sm-8 col-sm-offset-4">
              <label class="checkbox-inline checkbox-custom">
                <input type="checkbox" checked disabled />
                {{ $t("application.want-to-use-this-address") }}
              </label>
            </div>
          </div>
        </div>

        <!-- Contact Address -->
        <div class="section">
          <div class="form-group">
            <label class="col-sm-4 control-label">
              {{ $t("application.current-address") }}
            </label>
          </div>

          <address-form
            v-model="form.contactAddress"
            ref="contactAddressRef"
            :lang="lang"
            :disabled="isLoading"
          >
          </address-form>
        </div>
        <!-- End Contract Address -->

        <!-- Register Address -->
        <div class="section">
          <div class="form-group" :class="getFieldClass('flagRegisAdrs')">
            <label class="col-sm-4 control-label required">
              {{ $t("application.registration-address") }}
            </label>
            <div class="col-sm-8">
              <label class="radio-inline radio-custom">
                <input
                  type="radio"
                  v-model="form.flagRegisAdrs"
                  value="1"
                  :disabled="isLoading"
                />
                {{
                  $t("application.registration-address-text.current-address")
                }}
              </label>
              <label class="radio-inline radio-custom">
                <input
                  type="radio"
                  v-model="form.flagRegisAdrs"
                  value="0"
                  :disabled="isLoading"
                />
                {{ $t("application.registration-address-text.other-address") }}
              </label>
            </div>
          </div>

          <address-form
            v-if="form.flagRegisAdrs === '0' && form.registerAddress"
            ref="registerAddressRef"
            v-model="form.registerAddress"
            :lang="lang"
            :disabled="isLoading"
          >
          </address-form>
        </div>
        <!-- End Register Address -->

        <!-- Occupation -->
        <div class="section">
          <h5>{{ $t("application.occupation-info") }}</h5>

          <div
            class="form-group"
            :class="getFieldClass(['occupation', 'occupationOth'])"
          >
            <label class="col-sm-4 control-label required">
              {{ $t("application.occupation") }}
            </label>
            <div class="col-sm-4">
              <select
                class="form-control input-xs"
                v-model="form.occupation"
                :disabled="isLoading"
                @change="onChangeOccupation"
              >
                <option value>{{ $t("common.please-select") }}</option>
                <option
                  v-for="{ code, title_th } in occupations"
                  :key="code"
                  :value="code"
                >
                  {{ title_th }}
                </option>
              </select>
            </div>
            <div class="col-sm-4" v-if="mustSpecificOccupationOther">
              <input
                type="text"
                class="form-control input-xs"
                v-model="form.occupationOth"
                :placeholder="$t('application.specify-occupation')"
                maxlength="40"
              />
            </div>
          </div>

          <div
            v-if="mustSpecificBusinessType"
            class="form-group"
            :class="getFieldClass(['businessType', 'businessTypeOth'])"
          >
            <label class="col-sm-4 control-label required">
              {{ $t("application.business-type") }}
            </label>
            <div class="col-sm-4">
              <select
                class="form-control input-xs"
                v-model="form.businessType"
                :disabled="isLoading"
              >
                <option value>{{ $t("common.please-select") }}</option>
                <option
                  v-for="{ code, title_th } in businessTypes"
                  :key="code"
                  :value="code"
                >
                  {{ title_th }}
                </option>
              </select>
            </div>
            <div class="col-sm-4" v-if="mustSpecificBusinessTypeOther">
              <input
                type="text"
                class="form-control input-xs"
                v-model="form.businessTypeOth"
                :placeholder="$t('application.specify-business-type')"
                maxlength="40"
                :disabled="isLoading"
              />
            </div>
          </div>

          <div
            class="form-group"
            :class="getFieldClass(['srcIncomeCountry', 'srcIncomeCountryOth'])"
          >
            <label class="col-sm-4 control-label required">
              {{ $t("application.country-source-income") }}
            </label>
            <div class="col-sm-4">
              <select
                class="form-control input-xs"
                v-model="form.srcIncomeCountry"
                :disabled="isLoading"
              >
                <option value>{{ $t("common.please-select") }}</option>
                <option
                  v-for="{ value, text } in countries"
                  :key="value"
                  :value="value"
                >
                  {{ text }}
                </option>
              </select>
            </div>
            <div class="col-sm-4" v-if="form.srcIncomeCountry == '999'">
              <input
                type="text"
                class="form-control input-xs"
                v-model="form.srcIncomeCountryOth"
                :placeholder="$t('application.specify-country-source-income')"
                maxlength="40"
                :disabled="isLoading"
              />
            </div>
          </div>

          <div
            class="form-group"
            :class="getFieldClass(['srcIncome', 'srcIncomeOth'])"
          >
            <label class="col-sm-4 control-label required">
              {{ $t("application.source-of-income") }}
            </label>
            <div class="col-sm-8">
              <label
                class="checkbox checkbox-custom"
                v-for="{ code, name_th } in sourceIncomes"
                :key="code"
              >
                <input
                  type="checkbox"
                  :value="code"
                  v-model="form.srcIncome"
                  :disabled="isLoading"
                />
                {{ name_th }}
                <input
                  type="text"
                  class="form-control input-xs input-inline"
                  style="width: 150px"
                  v-if="code == '7'"
                  v-model="form.srcIncomeOth"
                  :placeholder="$t('common.please-specify')"
                  maxlength="40"
                  :disabled="
                    isLoading ||
                    (!isLoading && form.srcIncome.indexOf('7') === -1)
                  "
                />
              </label>
            </div>
          </div>

          <div class="form-group" :class="getFieldClass('monthlyIncome')">
            <label class="col-sm-4 control-label required">
              {{ $t("application.monthly-income") }}
            </label>
            <div class="col-sm-4">
              <select
                class="form-control input-xs"
                v-model="form.monthlyIncome"
                :disabled="isLoading"
              >
                <option value>{{ $t("common.please-select") }}</option>
                <option
                  v-for="{ value, title } in incomes"
                  :key="value"
                  :value="value"
                >
                  {{ title }}
                </option>
              </select>
            </div>
          </div>
        </div>
        <!-- End Occupation -->

        <!-- Office Address -->
        <template v-if="!isUnemployed">
          <div class="form-group" :class="getFieldClass('officeCompanyName')">
            <label class="col-sm-4 control-label required">
              {{ $t("application.office-company-name") }}
            </label>
            <div class="col-sm-4">
              <input
                type="text"
                class="form-control input-xs"
                v-model="form.officeCompanyName"
                maxlength="33"
                :disabled="isLoading"
              />
            </div>
          </div>

          <address-form
            v-model="form.officeAddress"
            ref="officeAdrressRef"
            :lang="lang"
            :disabled="isLoading"
          >
          </address-form>

          <div class="form-group" :class="getFieldClass('position')">
            <label class="col-sm-4 control-label required">
              {{ $t("application.position") }}
            </label>
            <div class="col-sm-4">
              <input
                type="text"
                class="form-control input-xs"
                v-model="form.position"
                maxlength="33"
                :disabled="isLoading"
              />
            </div>
          </div>
        </template>
        <!-- End Office Address -->

        <div class="section">
          <h5>{{ $t("application.additonal-info") }}</h5>

          <div class="form-group" :class="getFieldClass('flagPoliticalPerson')">
            <label class="col-sm-4 control-label required">
              {{ $t("application.politician-relation") }}
            </label>
            <div class="col-sm-8">
              <label class="radio-inline radio-custom">
                <input
                  type="radio"
                  value="0"
                  v-model="form.flagPoliticalPerson"
                  :disabled="isLoading"
                />
                {{ $t("common.no") }}
              </label>
              <label class="radio-inline radio-custom">
                <input
                  type="radio"
                  value="1"
                  v-model="form.flagPoliticalPerson"
                  :disabled="isLoading"
                />
                {{ $t("common.yes") }}

                <select
                  class="form-control input-xs input-inline"
                  v-model="form.politicalPosition"
                  style="width: 150px"
                  :disabled="
                    isLoading ||
                    (!isLoading && form.flagPoliticalPerson === '0')
                  "
                >
                  <option value="">{{ $t("common.please-select") }}</option>
                  <option
                    v-for="{ politicalcode, politicalname_th } in politicals"
                    :key="politicalcode"
                    :value="String(politicalcode)"
                  >
                    {{ politicalname_th }}
                  </option>
                </select>
              </label>
            </div>
          </div>
          <div class="form-group" :class="getFieldClass('assetValue')">
            <label class="col-sm-4 control-label">
              {{ $t("application.asset-value") }}
            </label>
            <div class="col-sm-4">
              <numeric-input
                v-model="form.assetValue"
                :disabled="isLoading"
              ></numeric-input>
            </div>
          </div>
        </div>
        <!-- End Additional Info -->

        <div class="section">
          <h5>{{ $t("application.fatca-info") }}</h5>
          <div class="form-group" :class="getFieldClass('flagIsUSCitizen')">
            <label class="col-sm-4 control-label required">
              {{ $t("application.fatca-is-us-citizen") }}
            </label>
            <div class="col-sm-8">
              <label class="radio-inline radio-custom">
                <input
                  type="radio"
                  value="0"
                  v-model="form.flagIsUSCitizen"
                  :disabled="isLoading"
                />
                {{ $t("common.no") }}
              </label>
              <label class="radio-inline radio-custom">
                <input
                  type="radio"
                  value="1"
                  v-model="form.flagIsUSCitizen"
                  :disabled="isLoading"
                />
                {{ $t("common.yes") }}
              </label>
            </div>
          </div>

          <div
            class="form-group"
            :class="getFieldClass('flagHolderUSResidentCard')"
          >
            <label class="col-sm-4 control-label required">
              {{ $t("application.fatca-holder-green-card") }}
            </label>
            <div class="col-sm-8">
              <label class="radio-inline radio-custom">
                <input
                  type="radio"
                  value="0"
                  v-model="form.flagHolderUSResidentCard"
                  :disabled="isLoading"
                />
                {{ $t("common.no") }}
              </label>
              <label class="radio-inline radio-custom">
                <input
                  type="radio"
                  value="1"
                  v-model="form.flagHolderUSResidentCard"
                  :disabled="isLoading"
                />
                {{ $t("common.yes") }}
              </label>
            </div>
          </div>

          <div
            class="form-group"
            :class="getFieldClass('flagUSResidentForTax')"
          >
            <label class="col-sm-4 control-label required">
              {{ $t("application.fatca-us-resident") }}
            </label>
            <div class="col-sm-8">
              <label class="radio-inline radio-custom">
                <input
                  type="radio"
                  value="0"
                  v-model="form.flagUSResidentForTax"
                  :disabled="isLoading"
                />
                {{ $t("common.no") }}
              </label>
              <label class="radio-inline radio-custom">
                <input
                  type="radio"
                  value="1"
                  v-model="form.flagUSResidentForTax"
                  :disabled="isLoading"
                />
                {{ $t("common.yes") }}
              </label>
            </div>
          </div>
          <!-- End FATCA -->
        </div>
        <!-- End Address/Occupation Info -->

        <!-- Fund Info -->
        <div class="section">
          <h5>{{ $t("application.account-info") }}</h5>
          <div class="form-group" :class="getFieldClass('flagMailingAdrs')">
            <label class="col-sm-4 control-label required">
              {{ $t("application.mailing-address") }}
            </label>
            <div class="col-sm-8">
              <label class="checkbox checkbox-custom">
                <input type="checkbox" checked disabled />
                {{ $t("application.mailing-address-text.email") }}
              </label>
              <label class="radio radio-custom">
                <input
                  type="radio"
                  v-model="form.flagMailingAdrs"
                  value="1"
                  :disabled="isLoading"
                />
                {{ $t("application.mailing-address-text.id-card-address") }}
              </label>
              <label class="radio radio-custom">
                <input
                  type="radio"
                  v-model="form.flagMailingAdrs"
                  value="2"
                  :disabled="isLoading"
                />
                {{ $t("application.mailing-address-text.current-address") }}
              </label>
              <label class="radio radio-custom">
                <input
                  type="radio"
                  v-model="form.flagMailingAdrs"
                  value="3"
                  :disabled="isLoading || (!isLoading && isUnemployed)"
                />
                {{ $t("application.mailing-address-text.office-address") }}
              </label>
            </div>
          </div>

          <div
            class="form-group"
            :class="
              getFieldClass(['investmentObjective', 'investmentObjectiveOth'])
            "
          >
            <label class="col-sm-4 control-label required">
              {{ $t("application.investment-objective") }}
            </label>
            <div class="col-sm-8">
              <label
                class="checkbox checkbox-custom"
                v-for="{ value, title } in investmentObjectives"
                :key="value"
              >
                <input
                  type="checkbox"
                  :value="value"
                  v-model="form.investmentObjective"
                  :disabled="isLoading"
                />
                {{ title }}
                <input
                  type="text"
                  class="form-control input-xs input-inline"
                  style="width: 150px"
                  v-if="value == '0'"
                  :disabled="
                    isLoading ||
                    (!isLoading && !form.investmentObjective.includes('0'))
                  "
                  v-model="form.investmentObjectiveOth"
                  :placeholder="$t('common.please-specify')"
                  maxlength="100"
                />
              </label>
            </div>
          </div>
        </div>

        <div class="section" v-if="isATS_BBL_OR_KBANK">
          <h5>{{ $t("application.ats-info") }}</h5>

          <div class="form-group" :class="getFieldClass('atsBank')">
            <label class="col-sm-4 control-label required">
              {{ $t("application.bank") }}
            </label>
            <div class="col-sm-4">
              <select
                class="form-control input-xs"
                v-model="form.atsBank"
                disabled
                @change="onChangeATSBank"
              >
                <option value>{{ $t("common.please-select") }}</option>
                <option
                  v-for="{ value, title } in atsBanks"
                  :key="value"
                  :value="value"
                >
                  {{ title }}
                </option>
              </select>
            </div>
          </div>

          <div class="form-group" :class="getFieldClass('atsBranch')">
            <label class="col-sm-4 control-label required">
              {{ $t("application.branch") }}
            </label>
            <div class="col-sm-4">
              <input
                type="text"
                class="form-control input-xs"
                v-model="form.atsBranch"
                maxlength="45"
                :disabled="isLoading"
              />
            </div>
          </div>

          <div class="form-group" :class="getFieldClass('atsAccountType')">
            <label class="col-sm-4 control-label required">
              {{ $t("application.account-type") }}
            </label>
            <div class="col-sm-4">
              <select
                class="form-control input-xs"
                v-model="form.atsAccountType"
                disabled
              >
                <option value>{{ $t("common.please-select") }}</option>
                <option
                  v-for="{ value, title } in accountTypes"
                  :key="value"
                  :value="value"
                >
                  {{ title }}
                </option>
              </select>
            </div>
          </div>

          <div class="form-group" :class="getFieldClass('atsAccountName')">
            <label class="col-sm-4 control-label required">
              {{ $t("application.account-name") }}
            </label>
            <div class="col-sm-4">
              <input
                type="text"
                class="form-control input-xs"
                v-model="form.atsAccountName"
                disabled
                maxlength="220"
              />
            </div>
          </div>

          <div class="form-group" :class="getFieldClass('atsAccount')">
            <label class="col-sm-4 control-label required">
              {{ $t("application.account-no") }}
            </label>
            <div class="col-sm-4">
              <input
                type="tel"
                class="form-control input-xs"
                v-model="form.atsAccount"
                disabled
                v-mask="'###-#-#####-#'"
              />
            </div>
          </div>

          <span
            class="account-remark"
            v-html="$t('application.ats-remark')"
          ></span>
        </div>

         <!-- กรณีไม่มีบัญชี-->
        <div class="section" v-if="!isATS_BBL_OR_KBANK">
            <h5>{{ $t("application.div-info") }}</h5>
            <div class="form-group" >
                      <div class="col-sm-8 text-danger" v-html="$t('application.no-ats-account')"></div>
            </div>
        </div>

        <!-- <div class="section" v-if="isATS_BBL_OR_KBANK"> -->
        <div class="section" >
          <h5>{{ $t("application.div-info") }}</h5>

          <div class="form-group" :class="getFieldClass('divBank')">
            <label class="col-sm-4 control-label required">
              {{ $t("application.bank") }}
            </label>
            <div class="col-sm-4">
              <select
                class="form-control input-xs"
                v-model="form.divBank"
                disabled
              >
                <option value>{{ $t("common.please-select") }}</option>
                <option
                  v-for="{ value, title } in divBanks"
                  :key="value"
                  :value="value"
                >
                  {{ title }}
                </option>
              </select>
            </div>
          </div>

          <div class="form-group" :class="getFieldClass('divBranch')">
            <label class="col-sm-4 control-label required">
              {{ $t("application.branch") }}
            </label>
            <div class="col-sm-4">
              <input
                type="text"
                class="form-control input-xs"
                v-model="form.divBranch"
                maxlength="45"
                :disabled="isLoading"
              />
            </div>
          </div>

          <div class="form-group" :class="getFieldClass('divAccountType')">
            <label class="col-sm-4 control-label required">
              {{ $t("application.account-type") }}
            </label>
            <div class="col-sm-4">
              <select
                class="form-control input-xs"
                v-model="form.divAccountType"
                disabled
              >
                <option value>{{ $t("common.please-select") }}</option>
                <option
                  v-for="{ value, title } in accountTypes"
                  :key="value"
                  :value="value"
                >
                  {{ title }}
                </option>
              </select>
            </div>
          </div>

          <div class="form-group" :class="getFieldClass('divAccountName')">
            <label class="col-sm-4 control-label required">
              {{ $t("application.account-name") }}
            </label>
            <div class="col-sm-4">
              <input
                type="text"
                class="form-control input-xs"
                v-model="form.divAccountName"
                disabled
                maxlength="220"
              />
            </div>
          </div>

          <div class="form-group" :class="getFieldClass('divAccount')">
            <label class="col-sm-4 control-label required">
              {{ $t("application.account-no") }}
            </label>
            <div class="col-sm-4">
              <input
                type="tel"
                class="form-control input-xs"
                v-model="form.divAccount"
                disabled
                v-mask="'###-#-#####-#'"
              />
            </div>
          </div>

          <span
            class="account-remark"
            v-html="
              $t('application.div-remark', ['customerservice.bualuang.co.th'])
            "
          ></span>
        </div>
       

        <!-- End Fund Info -->

        <!-- Suitability -->
        <div
          class="section session-suitability"
          v-if="suitability && suitability.session && form.suitability"
        >
          <template v-for="(session, sessionIndex) in suitability.session">
            <div class="session-title" :key="sessionIndex">
              <h6>{{ session.sname }}</h6>
            </div>

            <div
              class="form-group"
              :class="getSuitabilityFieldClass(question.qcode)"
              v-for="(question, questionIndex) in session.question"
              :key="sessionIndex + '-' + questionIndex"
            >
              <div class="col-xs-12">
                <label class="control-label required">
                  {{ suitQuestionNoMapping[question.qcode] }}.
                  {{ question.qname }}
                </label>
              </div>

              <div class="col-xs-12" v-if="typeof question.qimage === 'string'">
                <img
                  :src="suitabilityImageBaseUrl + question.qimage"
                  class="suitability-image"
                />
              </div>

              <div class="col-xs-12">
                <div class="choice-container">
                  <label
                    :class="
                      question.qtype === 'Checkbox'
                        ? 'checkbox checkbox-custom'
                        : 'radio radio-custom'
                    "
                    v-for="(choice, choiceIndex) in question.choice"
                    :key="choiceIndex"
                  >
                    <input
                      v-if="question.qtype === 'Radio'"
                      type="radio"
                      :value="choice.ccode"
                      :checked="
                        form.suitability[question.qcode] === choice.ccode
                      "
                      :disabled="isLoading"
                      @change="
                        onChangeSuitabilityChoice(
                          question,
                          choice.ccode,
                          $event
                        )
                      "
                    />

                    <input
                      v-if="question.qtype === 'Checkbox'"
                      type="checkbox"
                      :value="choice.ccode"
                      :checked="
                        form.suitability[question.qcode].includes(choice.ccode)
                      "
                      :disabled="isLoading"
                      @change="
                        onChangeSuitabilityChoice(
                          question,
                          choice.ccode,
                          $event
                        )
                      "
                    />

                    {{ choice.cname }}
                  </label>
                </div>
              </div>
            </div>
          </template>
        </div>

        <!-- Suitabiliy Result Section -->
        <div
          class="section"
          v-if="$v.form.suitability && !$v.form.suitability.$invalid"
        >
          <h5>{{ $t("application.suitability-test-result") }}</h5>
          <div class="row" style="margin-bottom: 10px">
            <div class="col-sm-6">
              <strong>{{ $t("application.total-score") }}</strong>
            </div>
            <div class="col-sm-6">
              {{ totalScore }} {{ $t("application.point") }}
            </div>
          </div>
          <div class="row">
            <div class="col-sm-6">
              <strong>{{ $t("application.suitability-risk") }}</strong>
            </div>
            <div class="col-sm-6">
              <p>
                <strong>{{ suitabilityRisk }}:</strong>
                <br />
                {{ suitabilityRiskDesc }}
              </p>
            </div>
          </div>
          <div class="row">
            <div class="col-sm-6">
              <strong>{{ $t("application.suitability-product") }}</strong>
            </div>
            <div class="col-sm-6" v-html="suitabilityProduct"></div>
          </div>
        </div>
        <!-- End Suitability -->
      </tab>
      <!-- End Step 1 -->

      <tab
        :title="wizardTabTitle[1]"
        html-title
        :tab-classes="{ complete: currentTab > 1 }"
      >
        <!-- Upload Section -->
        <h5>ถ่ายรูป/อัพโหลดไฟล์ประกอบการเปิดบัญชีกองทุน</h5>
        <div class="upload-form">
          <div class="section">
            <div
              class="form-group"
             
            >
            <!-- add here -->



            <label class="col-sm-5 col-md-6 control-label required"
              >ยันยันตัวตน</label
            >
            <div class="col-sm-7 col-sm-6">
              <!--
                add on : requirment - เลิกใช้ popup NDID เดิม (bls-ndid-verify / ndidConfig.ndidVerifySuccess)
                เปลี่ยนไปเช็ค verifyIdentityConfig.verified (เว็บยืนยันตัวตนใหม่) แทน คงชื่อ isNdidVerifySuccess/
                onClickVerifyNDID ไว้เหมือนเดิมเพื่อลดความเสี่ยง (ดู computed/method ด้านล่างของไฟล์)
                ตัดคำว่า NDID/ThaID ออกจาก wording เพราะไม่ทราบแน่ชัดว่าเว็บใหม่นี้เสนอช่องทางอะไรบ้าง
              -->
              <div class="upload-status-container">
               
                <span
                  class="info-text success"
                  style="font-weight: bold"
                 v-if="this.isNdidVerifySuccess"
                >
                  <i class="glyphicon glyphicon-ok" aria-hidden="true"></i>
                  ยืนยันตัวตนเรียบร้อยแล้ว
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
                  กรุณายืนยันตัวตนดิจิทัล
                </span>
              </div>
            
              <button
                type="button"
                class="btn btn-labeled btn-primary"
                v-if="!this.isNdidVerifySuccess"
                @click="onClickVerifyNDID"
              >
                <span class="btn-label">
                  <i
                    class="glyphicon glyphicon-user"
                    aria-hidden="true"
                  ></i>
                </span>
                ยืนยันตัวตนดิจิทัล
              </button>
            </div>
            </div>
          </div>
          <!-- End Profile Image -->
          <!-- End Thai Citizen ID Card Photo -->

          <!-- <div class="section"> -->
          <!-- v-if="!isOmnAndSeg || (isOmnAndSeg && !isATS_BBL_OR_KBANK)" -->
          
            <div class="section" v-if="!isATS_BBL_OR_KBANK || !isHasAtsBank ">
              <div class="form-group" v-if="!isHasAtsBank" style="">
                  <label class="col-sm-5 col-md-6 control-label required"
                    >{{ $t("application.ats-info") }}</label>
                  <div class="col-sm-7 col-sm-6" 
                  style="padding-top: 8px;
                  padding-bottom: 20px;"    
                  v-html="$t('application.no-ats-account')">
                    
                </div>
              </div>
            <div class="form-group" v-if="!isHasAtsBank" style="margin-bottom: 5px;">
  <label class="col-sm-5 col-md-6 control-label hidden-xs"></label>
  
  <div class="col-sm-7 col-md-6" style="padding-top: 0px; padding-bottom: 5px;">
    หรือ
  </div>
</div>
          
      

            <div
              class="form-group"
              :class="getVerifyFieldClass('bookbankPhoto')"
            >
              <label class="col-sm-5 col-md-6 control-label required"
                >รูปถ่ายหน้าบัญชีธนาคารสำหรับการขายหน่วยลงทุนและรับเงินปันผล</label
              >
              <div class="col-sm-7 col-sm-6">
                <div class="upload-status-container">
                  <span
                    class="info-text success"
                    style="font-weight: bold"
                    v-if="verifyForm.bookbankPhoto !== ''"
                  >
                    <i class="glyphicon glyphicon-ok" aria-hidden="true"></i>
                    ทำการถ่าย/อัพโหลดรูปหน้าบัญชีของท่านเรียบร้อยแล้ว
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
                    กรุณาถ่าย/อัพโหลดรูปหน้าบัญชีของท่าน
                  </span>
                </div>
                <div class="action-container">
                  <attachment-form
                    class="attachment-form-container"
                    ref="bookbankPhotoAttachmentForm"
                    :is-loading="isUploaded"
                    @change="onChangeImageAttachForm('bookbank', $event)"
                  ></attachment-form>
                </div>

                <view-photo-button
                  v-if="verifyForm.bookbankPhoto !== ''"
                  ref="viewBookbankPhotoButton"
                  :value="verifyForm.bookbankPhoto"
                  class="view-button-container"
                ></view-photo-button>
              </div>
              <div
                class="
                  col-sm-7 col-md-6 col-sm-offset-5 col-md-offset-6
                  example-image-container
                "
              >
                <span class="small" style="color: #ff0000"
                  >กรุณาถ่ายหน้าสมุดบัญชีตามตัวอย่างด้านล่าง (กรณีอัพโหลดไฟล์
                  ไฟล์ที่อัพโหลดจะต้องมีนามสกุล .png หรือ .jpg เท่านั้น)</span
                >
                <div class="example-image-block">
                  <img
                    :src="exampleBookbankImage"
                    style="border: 1px solid #ddd"
                  />
                </div>
              </div>
            </div>
          </div>

          <div v-else class="form-group">
            <label class="col-sm-5 col-md-6 control-label">การยืนยันบัญชีธนาคาร</label>
            <div class="col-sm-7 col-sm-6">
              <div class="upload-status-container">
                <span class="info-text success" style="font-weight: bold">
                  <i class="glyphicon glyphicon-ok" aria-hidden="true"></i>
                  ยืนยันบัญชีเรียบร้อยแล้ว ไม่ต้องอัพโหลดหน้าสมุดบัญชี
                </span>
              </div>
            </div>
          </div>
          <!-- End Div Bookbank Photo -->

            <div class="section" v-if="!isOmnAndSeg ">
            <div
              class="form-group"
              :class="getVerifyFieldClass('signaturePhoto')"
            >
              <label class="col-sm-5 col-md-6 control-label required"
                >ลายเซ็น</label
              >
              <div class="col-sm-7 col-sm-6">
                <div class="upload-status-container">
                  <span
                    class="info-text success"
                    style="font-weight: bold"
                    v-if="verifyForm.signaturePhoto !== ''"
                  >
                    <i class="glyphicon glyphicon-ok" aria-hidden="true"></i>
                    ทำการถ่าย/อัพโหลดรูปลายเซ็นเรียบร้อยแล้ว
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
                    กรุณาทำการถ่าย/อัพโหลดรูปลายเซ็นของท่าน
                  </span>
                </div>
                <div class="action-container">
                  <attachment-form
                    class="attachment-form-container"
                    ref="signaturePhotoAttachmentForm"
                    upload-mime-file-type="image/png"
                    :crop-ratio="3"
                    :crop-after-take-photo="true"
                    :crop-after-upload="true"
                    :use-grayscale="true"
                    :is-loading="isUploaded"
                    @change="onChangeImageAttachForm('signature', $event)"
                  >
                    <template v-slot:crop-header>
                      กรุณาปรับขนาดกรอบบนล่างให้เท่ากับขนาดลายเซ็น
                    </template>
                  </attachment-form>
                </div>

                <view-photo-button
                  v-if="verifyForm.signaturePhoto"
                  ref="viewSignaturePhotoButton"
                  :value="verifyForm.signaturePhoto"
                  class="view-button-container"
                ></view-photo-button>
              </div>
              <div
                class="
                  col-sm-7 col-md-6 col-sm-offset-5 col-md-offset-6
                  example-image-container
                "
              >
                <span class="small" style="color: #ff0000"
                  >กรุณาเซ็นลายเซ็นบนกระดาษขาวและถ่ายรูปให้ชัดเจน
                  (กรณีอัพโหลดไฟล์ ไฟล์ที่อัพโหลดจะต้องมีนามสกุล .png
                  เท่านั้น)</span
                >

                <div class="example-image-block">
                  <img
                    :src="exampleSignaureImage"
                    style="border: 1px solid #ddd"
                  />
                </div>
              </div>
            </div>
          </div>
          <!-- End Siganture Photo -->
        </div>
        <!-- End Upload Section -->

        <div class="section">
          <h5>ยืนยันตัวตนผ่านหมายเลขโทรศัพท์มือถือ</h5>

          <div class="form-group" :class="getVerifyFieldClass('mobileNo')">
            <label class="col-sm-5 col-md-6 control-label"
              >สถานะการยืนยัน</label
            >
            <div class="col-sm-7 col-md-6">
              <span
                class="info-text success"
                style="font-weight: bold"
                v-if="verifyForm.mobileNo == 'Y'"
              >
                <i class="glyphicon glyphicon-ok" aria-hidden="true"></i>
                ยืนยันตัวตนผ่านหมายเลขโทรศัพท์มือถือของท่านเรียบร้อยแล้ว
              </span>
              <span class="info-text danger" style="font-weight: bold" v-else>
                <i class="glyphicon glyphicon-remove" aria-hidden="true"></i>
                กดปุ่ม "ขอรหัส SMS OTP" เพื่อรับรหัส OTP ทาง SMS
                โทรศัพท์มือถือของท่าน
              </span>
            </div>
          </div>

          <verify-mobile-no-form
            v-if="verifyForm.mobileNo != 'Y'"
            ref="verifyMobileNoForm"
            :values="verifyMobileNoData"
            :disabled="disableMobileNoForm"
            @verified="onMobileNoVerified"
          ></verify-mobile-no-form>
        </div>

        <div class="section">
          <h5>ยืนยันบัตรประชาชน</h5>

          <div class="form-group" :class="getVerifyFieldClass('citizenCardID')">
            <label class="col-sm-5 col-md-6 control-label"
              >สถานะการยืนยัน</label
            >
            <div class="col-sm-7 col-md-6">
              <span
                class="info-text success"
                style="font-weight: bold"
                v-if="(this.identifyConfig && this.identifyConfig.identifyDopaDatetime) || this.verifyForm.citizenCardID == 'Y'"
              >
                <i class="glyphicon glyphicon-ok" aria-hidden="true"></i>
                ยืนยันบัตรประชาชนของท่านเรียบร้อยแล้ว
              </span>
              <span class="info-text danger" style="font-weight: bold" v-else>
                <i class="glyphicon glyphicon-remove" aria-hidden="true"></i>
                <!-- กรุณาทำการยืนยันบัตรประชาชนของท่านตามข้อมูลด้านล่างนี้ -->
                 กรุณาทำการยืนยันบัตรประชาชนของท่านในขั้นตอนยืนยันตัวตน
              </span>
            </div>
          </div>
<!-- 
          <verify-thai-citizen-card-id-form
            v-if="verifyForm.citizenCardID != 'Y'"
            ref="verifyCardNoForm"
            :values="verifyCardIDData"
            :disabled="disabledThaiCitizenCardIDForm"
            @verified="onCitizenCardIDVerified"
          ></verify-thai-citizen-card-id-form> -->
        </div>

        <div class="container-fluid contract-container">
          <div class="well">
            <p v-html="agreementText"></p>
          </div>

          <p class="text-center">
            {{ $t("verify-page.please-read-segregate-agreement") }}
            <a :href="contractUrl" target="_blank">
              {{ $t("common.click-here") }}
            </a>
          </p>

          <div class="form-group">
            <label class="checkbox checkbox-custom">
              <input type="checkbox" v-model="isAgree" />
              {{ $t("verify-page.agree") }}
              <span style="color: #ff0000; font-size: 16px">*</span>
            </label>
          </div>
        </div>
      </tab>
      <!-- End Step 2 -->

      <tab
        :title="wizardTabTitle[2]"
        html-title
        :tab-classes="{ complete: currentTab > 2 }"
      >
        <h4>{{ $t("result-page.check-info") }}</h4>
        <div class="verify-result-content" v-if="values">
          <div class="row">
            <div class="col-sm-5 label-text">
              {{ $t("application.gender") }}
            </div>
            <div class="col-sm-7">
              {{
                displayValues.gender == "F"
                  ? $t("application.gender-text.female")
                  : displayValues.gender == "M"
                  ? $t("application.gender-text.male")
                  : $t("application.gender-text.other")
              }}
            </div>
          </div>

          <div class="row">
            <div class="col-sm-5 label-text">
              {{ $t("application.title") }}
            </div>
            <div class="col-sm-7">
              {{ displayValues.titleTh }}
            </div>
          </div>

          <div class="row">
            <div class="col-sm-5 label-text">
              {{ $t("application.name-th") }}
            </div>
            <div class="col-sm-7">
              {{ displayValues.nameTh }} {{ displayValues.surnameTh }}
            </div>
          </div>

          <div class="row">
            <div class="col-sm-5 label-text">
              {{ $t("application.name-en") }}
            </div>
            <div class="col-sm-7">
              {{ displayValues.nameEn }} {{ displayValues.surnameEn }}
            </div>
          </div>

          <div class="row">
            <div class="col-sm-5 label-text">
              {{ $t("application.mobile-no") }}
            </div>
            <div class="col-sm-7">{{ displayValues.mobileNo }}</div>
          </div>

          <div class="row">
            <div class="col-sm-5 label-text">
              {{ $t("application.email") }}
            </div>
            <div class="col-sm-7">{{ displayValues.email }}</div>
          </div>

          <div class="row">
            <div class="col-sm-5 label-text">
              {{ $t("application.birthdate") }}
            </div>
            <div class="col-sm-7">
              {{ displayValues.birthday | formatDate }}
            </div>
          </div>

          <div class="row">
            <div class="col-sm-5 label-text">
              {{ $t("application.nationality") }}
            </div>
            <div class="col-sm-7">
              {{ displayValues.nationality | nationalityText }}
            </div>
          </div>

          <div class="row">
            <div class="col-sm-5 label-text">
              {{ $t("application.card-type") }}
            </div>
            <div class="col-sm-7">
              {{ $t("application.card-type-text.card-id") }}
            </div>
          </div>

          <div class="row">
            <div class="col-sm-5 label-text">
              {{ $t("application.card-no") }}
            </div>
            <div class="col-sm-7">{{ displayValues.cardID }}</div>
          </div>

          <div class="row" v-if="form.flagNotExpire == '0'">
            <div class="col-sm-5 label-text">
              {{ $t("application.expired-date") }}
            </div>
            <div class="col-sm-7">{{ form.expireDate | formatDate }}</div>
          </div>

          <div class="row">
            <div class="col-sm-5 label-text">
              {{ $t("application.marital-status") }}
            </div>
            <div class="col-sm-7">{{ maritalStatus }}</div>
          </div>

          <div class="row" v-if="form.flagMartialStatus === '2'">
            <div class="col-sm-5 label-text">
              {{ $t("application.spouse-name-th") }}
            </div>
            <div class="col-sm-7">
              {{ form.spouseNameTh }} {{ form.spouseSurnameTh }}
            </div>
          </div>
          <div class="row" v-if="form.flagMartialStatus === '2'">
            <div class="col-sm-5 label-text">
              {{ $t("application.spouse-name-en") }}
            </div>
            <div class="col-sm-7">
              {{ form.spouseNameEn }} {{ form.spouseSurnameEn }}
            </div>
          </div>
          <!-- End Apply Info -->

          <div class="section">
            <h5>{{ $t("application.current-address") }}</h5>
            <div class="row">
              <div class="col-sm-5 label-text">
                {{ $t("result-page.address") }}
              </div>
              <div class="col-sm-7">{{ contactAdddressText }}</div>
            </div>
          </div>
          <!-- End Current Address -->

          <div class="section">
            <h5>{{ $t("application.registration-address") }}</h5>
            <div class="row">
              <div class="col-sm-5 label-text">
                {{ $t("result-page.address") }}
              </div>
              <div class="col-sm-7">{{ registerAddressText }}</div>
            </div>
          </div>
          <!-- End Register Address -->

          <div class="section">
            <h5>{{ $t("application.occupation-info") }}</h5>
            <div class="row">
              <div class="col-sm-5 label-text">
                {{ $t("application.occupation") }}
              </div>
              <div class="col-sm-7">{{ occupationText }}</div>
            </div>

            <div class="row" v-if="mustSpecificBusinessType">
              <div class="col-sm-5 label-text">
                {{ $t("application.business-type") }}
              </div>
              <div class="col-sm-7">{{ businessTypeText }}</div>
            </div>

            <div class="row">
              <div class="col-sm-5 label-text">
                {{ $t("application.country-source-income") }}
              </div>
              <div class="col-sm-7">{{ sourceIncomeCountryText }}</div>
            </div>

            <div class="row">
              <div class="col-sm-5 label-text">
                {{ $t("application.source-of-income") }}
              </div>
              <div class="col-sm-7">{{ sourceIncomeText }}</div>
            </div>

            <div class="row">
              <div class="col-sm-5 label-text">
                {{ $t("application.monthly-income") }}
              </div>
              <div class="col-sm-7">{{ incomeText }}</div>
            </div>

            <template v-if="!isUnemployed">
              <div class="row">
                <div class="col-sm-5 label-text">
                  {{ $t("application.office-company-name") }}
                </div>
                <div class="col-sm-7">{{ form.officeCompanyName }}</div>
              </div>

              <div class="row">
                <div class="col-sm-5 label-text">
                  {{ $t("result-page.office-address") }}
                </div>
                <div class="col-sm-7">{{ officeAdddressText }}</div>
              </div>

              <div class="row">
                <div class="col-sm-5 label-text">
                  {{ $t("application.position") }}
                </div>
                <div class="col-sm-7">{{ form.position }}</div>
              </div>
            </template>

            <div class="row">
              <div class="col-sm-5 label-text">
                {{ $t("application.politician-relation") }}
              </div>
              <div class="col-sm-7">
                {{ form.flagPoliticalPerson | textYesNo(lang) }}

                <template
                  v-if="
                    form.flagPoliticalPerson === '1' && politicalText !== ''
                  "
                >
                  ({{ politicalText }})
                </template>
              </div>
            </div>

            <div class="row">
              <div class="col-sm-5 label-text">
                {{ $t("application.asset-value") }}
              </div>
              <div class="col-sm-7">
                {{ form.assetValue | formatNumber | blankText }}
              </div>
            </div>
          </div>

          <div class="section">
            <h5>{{ $t("application.fatca-info") }}</h5>
            <div class="row">
              <div class="col-sm-5 label-text">
                {{ $t("application.fatca-is-us-citizen") }}
              </div>
              <div class="col-sm-7">
                {{ form.flagIsUSCitizen | textYesNo(lang) }}
              </div>
            </div>

            <div class="row">
              <div class="col-sm-5 label-text">
                {{ $t("application.fatca-holder-green-card") }}
              </div>
              <div class="col-sm-7">
                {{ form.flagHolderUSResidentCard | textYesNo(lang) }}
              </div>
            </div>

            <div class="row">
              <div class="col-sm-5 label-text">
                {{ $t("application.fatca-us-resident") }}
              </div>
              <div class="col-sm-7">
                {{ form.flagUSResidentForTax | textYesNo(lang) }}
              </div>
            </div>
          </div>

          <div class="section">
            <h5>{{ $t("application.account-info") }}</h5>
            <div class="row">
              <div class="col-sm-5 label-text">
                {{ $t("application.mailing-address") }}
              </div>
              <div class="col-sm-7">{{ mailingAddressText }}</div>
            </div>

            <div class="row">
              <div class="col-sm-5 label-text">
                {{ $t("application.investment-objective") }}
              </div>
              <div class="col-sm-7">{{ investmentObjectiveText }}</div>
            </div>

            <div class="row">
              <div class="col-sm-5 label-text">
                {{ $t("application.ats-info") }}
              </div>
              <div class="col-sm-7" v-html="atsAccountText"></div>
            </div>

            <div class="row">
              <div class="col-sm-5 label-text">
                {{ $t("application.div-info") }}
              </div>
              <div class="col-sm-7" v-html="divAccountText"></div>
            </div>
          </div>
          <!-- Fund Info -->

          <div class="section">
            <h5>{{ $t("application.suitability-test-result") }}</h5>

            <div class="row">
              <div class="col-sm-5 label-text">
                {{ $t("application.total-score") }}
              </div>
              <div class="col-sm-7">
                {{ this.totalScore }} {{ $t("application.point") }}
              </div>
            </div>

            <div class="row">
              <div class="col-sm-5 label-text">
                {{ $t("application.suitability-risk") }}
              </div>
              <div class="col-sm-7">
                <strong>{{ suitabilityRisk }}</strong>
                <br />
                {{ suitabilityRiskDesc }}
              </div>
            </div>

            <div class="row">
              <div class="col-sm-5 label-text">
                {{ $t("application.suitability-product") }}
              </div>
              <div class="col-sm-7" v-html="suitabilityProduct"></div>
            </div>
          </div>
          <!-- End Suitability -->

          <div class="section">
            <h5>
              ร่างเอกสารชุดสมัครที่ลูกค้าจะได้รับ
              <span
                style="font-size: 1.125rem; color: #ff0000; font-weight: 600"
                >* กรุณาตรวจสอบความชัดเจนของเอกสารก่อนส่ง</span
              >
            </h5>

            <div class="row" style="margin-bottom: 20px">
              <div class="col-sm-5 label-text">ชุดสมัคร</div>
              <div class="col-sm-7">
                <vue-ladda
                  type="button"
                  button-class="btn btn-xs btn-primary"
                  data-style="slide-up"
                  :loading="isLoading"
                  @click="onClickViewPDF('application')"
                >
                  Download
                </vue-ladda>
              </div>
            </div>
            <div class="row" style="margin-bottom: 20px">
              <div class="col-sm-5 label-text">เอกสารสัญญา</div>
              <div class="col-sm-7">
                <vue-ladda
                  type="button"
                  button-class="btn btn-xs btn-primary"
                  data-style="slide-up"
                  :loading="isLoading"
                  @click="onClickViewPDF('contract')"
                >
                  Download
                </vue-ladda>
              </div>
            </div>
            <div class="row">
              <div class="col-sm-5 label-text">สำเนาสมุดบัญชี</div>
              <div class="col-sm-7">
                <vue-ladda
                  type="button"
                  button-class="btn btn-xs btn-primary"
                  data-style="slide-up"
                  :loading="isLoading"
                  @click="onClickViewPDF('bookbank')"
                >
                  Download
                </vue-ladda>
              </div>
            </div>
          </div>
        </div>
      </tab>
      <!-- End Step 3 -->

      <tab
        :title="wizardTabTitle[3]"
        html-title
        :tab-classes="{ complete: currentTab === 3 }"
      >
        <div class="application-text">
          <p
            v-html="
              $t('finish-page.segigate.line-1', [
                formatFundAccountNo,
                formatOpenDate,
              ])
            "
          ></p>
          <p v-html="$t('finish-page.segigate.line-2', [formatApplyDate])"></p>
          <p
            v-html="
              $t('finish-page.segigate.line-3', [
                'customerservice.bualuang.co.th',
              ])
            "
          ></p>
        </div>
      </tab>
      <!-- End Tab 4 -->
    </tabs>

    <div class="container-fluid btn-container" v-if="currentTab < 3">
      <div class="row">
        <div class="col-xs-4">
          <vue-ladda
            type="button"
            button-class="btn btn-labeled btn-warning"
            v-if="currentTab > 0"
            data-style="slide-up"
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
        <div class="col-xs-4 text-center">
          <vue-ladda
            type="button"
            button-class="btn btn-labeled btn-success"
            v-show="currentTab === 0"
            data-style="slide-up"
            :loading="isLoading"
            @click="onClickSave"
          >
            <span class="btn-label">
              <i class="glyphicon glyphicon-floppy-disk" aria-hidden="true"></i>
            </span>
            {{ $t("common.save") }}
          </vue-ladda>
        </div>
        <div class="col-xs-4 text-right">
          <vue-ladda
            type="button"
            button-class="btn btn-labeled btn-primary"
            data-style="slide-up"
            :loading="isLoading"
            v-show="currentTab === 0"
            @click="onClickNext"
          >
            <span class="btn-label">
              <i
                class="glyphicon glyphicon-chevron-right"
                aria-hidden="true"
              ></i>
            </span>
            {{ $t("common.next") }}
          </vue-ladda>

          <button
            type="button"
            class="btn btn-labeled btn-primary"
            :disabled="!isAgree || !this.isNdidVerifySuccess"
            v-show="currentTab === 1"
            @click="onClickNext"
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
            button-class="btn btn-labeled btn-success"
            v-show="currentTab === 2"
            data-style="slide-up"
            :loading="isLoading"
            @click="onClickSendData"
          >
            <span class="btn-label">
              <i class="glyphicon glyphicon-floppy-disk" aria-hidden="true"></i>
            </span>
            {{ $t("common.submit") }}
          </vue-ladda>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import Vuelidate from "vuelidate";
import { required } from "vuelidate/lib/validators";
import { Tabs, Tab } from "uiv";
import VueLadda from "vue-ladda";
import moment from "moment";
import { saveAs } from "file-saver";
import { mask } from "vue-the-mask";
import to from "await-to-js";
import numeral from "numeral";

import { DateInput, NumericInput } from "../fields";
//   VerifyThaiCitizenCardIdForm,
import {
  AddressForm,
  AttachmentForm,
  ViewPhotoButton,
  VerifyMobileNoForm,

} from "../forms";

import { openAccountFundAPI } from "../../services/axios";
import {
  contactMessage,
  pleaseContactMessage,
  defaultDisplayValues,
  defaultFormData,
  defaultSubmitFormData,
} from "../../services/constants";
import {
  isUnemployed,
  mustSpecificOccupationOther,
  mustSpecificBusinessType,
  mustSpecificBusinessTypeOther,
  getValidationRules,
  getAddressText,
} from "../../services/utils";
import { showConfirm, showWarning, showError } from "../../services/alert";

import {
  blankText,
  formatDate,
  nationalityText,
  textYesNo,
  formatFullDate,
  formatAccountNo,
  formatNumber,
} from "../../services/filters";

import country from "../../data/country.json";
import nationality from "../../data/nationality.json";
import occupation from "../../data/occupation.json";
import businessType from "../../data/businesstype.json";
import sourceIncome from "../../data/source_income.json";
import political from "../../data/political.json";
import income from "../../data/income.json";
import investObjective from "../../data/investment_objective.json";
import banks from "../../data/bank.json";
import accountType from "../../data/account_type.json";
import suitabilityGroup from "../../data/suitability_group.json";
import mailingAddress from "../../data/mailing_address.json";
import investmentObjective from "../../data/investment_objective.json";
import {
  profile,
  bookbank,
  thaiCitizenIDCard,
  siganture,
  thaiCitizenMask
} from "../../base64_images";

Vue.use(Vuelidate);

export default {
  name: "SegigateApplicationForm",

  props: {
    displayValues: {
      type: Object,
      default() {
        return defaultDisplayValues;
      },
    },
    identifyConfig: {
            type: Object,
            default: () => ({})
        },
    // add on : requirment - ndidConfig รับค่าจาก popup ยืนยันตัวตนผ่าน NDID (bls-ndid-verify)
    // ใช้เช็ค ndidConfig.ndidVerifySuccess เป็นเงื่อนไขเดียวของปุ่ม "ถัดไป" ใน step 2 (แทนที่
    // identifyConfig เดิม - DOPA/OCR/Selfie ไม่เกี่ยวข้องกับการกดถัดไปแล้วตาม requirment ล่าสุด)
    // หมายเหตุ (requirment ใหม่) : ไม่ได้ใช้เป็นเงื่อนไขหลักแล้ว เปลี่ยนไปใช้ verifyIdentityConfig ด้านล่างแทน
    // แต่ยังคง prop นี้ไว้ ไม่ได้ลบ
    ndidConfig: {
            type: Object,
            default: () => ({})
        },
    // add on : requirment - เว็บยืนยันตัวตนใหม่ (แทนที่ popup NDID เดิม) รับจาก BlsFundApplication.vue
    // sync มาจาก blade ผ่าน bus.$on('verify-identity-config-updated', ...)
    verifyIdentityConfig: {
            type: Object,
            default: () => ({ verified: false })
        },

    values: {
      type: Object,
      required: true,
    },

    suitability: {
      type: Object,
      required: true,
    },

    lang: {
      type: String,
      default: "th",
    },
    agreementText: {
      type: String,
      required: true,
    },
    crsData:{
      type:Object,
      required:false,
    },
    isOmnAndSeg: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      currentTab: 0,
      isLoading: false,
      form: { ...defaultFormData, suitability: null },
      verifyForm: {
        profilePhoto: "",
        citizenCardIDPhoto: "",
        bookbankPhoto: "",
        signaturePhoto: "",
        mobileNo: "",
        citizenCardID: "",
        FacecompareIdentify:""
      },
      lockAtsBank: false,
      lockDivBank: false,
      hasAtsBank:"",
      totalScore: 0,

      showError: false,
      isUploaded: false,
      disableMobileNoForm: false,
      disabledThaiCitizenCardIDForm: false,

      isAgree: false,
      submitAt: "",

      occupations: occupation.datas,
      businessTypes: businessType.datas,
      sourceIncomes: sourceIncome.data,
      politicals: political.data,
      investmentObjectives: investObjective.data,
      accountTypes: accountType.data,
    };
  },
  // created(){
  //   alert(this.isOmnAndSeg);
  // },
  validations() {
    let rules = getValidationRules(this.form,null,null,null,this.isOmnAndSeg , this.isHasAtsBank);
    if (!this.suitabilityItems) {
      return rules;
    }

    if (Object.keys(this.suitabilityItems).length > 0) {
      let suitabilityRules = {};
      Object.keys(this.suitabilityItems).forEach((fieldKey) => {
        suitabilityRules[fieldKey] = { required };
      });

      rules.form = { ...rules.form, suitability: suitabilityRules };
    }
    
    return rules;
  },

  computed: {
    isHasAtsBank(){

      return this.hasAtsBank == "" || this.hasAtsBank == "yes";

    },
    isATS_BBL_OR_KBANK() {
      // check ธนาคารที่เลือกใน ATS เป็น BBL (002) หรือ KBANK (004) เปล่า
    //  return false;
      
      return ['002', '004'].includes(this.form.atsBank);
    },
    isIdentifyComplted(){
      console.log("isIdentifyComplted this.verifyForm.citizenCardID:" + this.verifyForm.citizenCardID + " this.verifyForm.FacecompareIdentify:" + this.verifyForm.FacecompareIdentify + " identifyConfig" , this.identifyConfig )
        if(this.verifyForm.citizenCardID == "Y" && this.verifyForm.FacecompareIdentify == "Y"){
          return true;
        }

        // กรณีทำ dopa แล้ว
        if(this.verifyForm.citizenCardID == "Y" && this.verifyForm.FacecompareIdentify != "Y"){
          return (this.identifyConfig && (this.identifyConfig.identifyFaceDatetime));
        }

        // กรณีทำ face แล้ว
         if(this.verifyForm.citizenCardID != "Y" && this.verifyForm.FacecompareIdentify == "Y"){
          return (this.identifyConfig && (this.identifyConfig.identifyDopaDatetime));
        }

        // กรณีไม่เคยทำเลย
        if(this.verifyForm.citizenCardID != "Y" && this.verifyForm.FacecompareIdentify != "Y"){
              return (this.identifyConfig && (this.identifyConfig.identifyFaceDatetime && this.identifyConfig.identifyDopaDatetime));
        }

        return (this.identifyConfig && (this.identifyConfig.identifyFaceDatetime && this.identifyConfig.identifyDopaDatetime));
    },
    // add on : requirment - เงื่อนไขเดียวของปุ่ม "ถัดไป" ใน step 2 - เดิมเช็คจาก ndidConfig.ndidVerifySuccess
    // (popup NDID) ตอนนี้เปลี่ยนไปเช็ค verifyIdentityConfig.verified (เว็บยืนยันตัวตนใหม่) แทน คงชื่อ
    // computed property เดิมไว้ (isNdidVerifySuccess) เพราะยังใช้ gate ปุ่ม "ถัดไป" อยู่ ไม่เปลี่ยนชื่อ
    isNdidVerifySuccess() {
      return !!(this.verifyIdentityConfig && this.verifyIdentityConfig.verified === true);
    },
    suitVersion() {
      return process.env.VUE_APP_SUIT_VERSION;
    },

    suitabilityImageBaseUrl() {
      return process.env.VUE_APP_BASE_IMAGE_URL;
    },

    contractUrl() {
      return process.env.VUE_APP_SEGREGATE_CONTRACT_URL;
    },

    showUploadProfile() {
      return process.env.VUE_APP_ENABLE_UPLOAD === "Y";
    },

    showUploadCitizenCard() {
      return process.env.VUE_APP_ENABLE_UPLOAD === "Y";
    },

    suitabilityItems() {
      const result = {};
      if (!this.suitability?.session) {
        return result;
      }
   
      this.suitability?.session.forEach(({ question = [] }) => {
        question.forEach(({ qcode, qtype }) => {
          if (qtype === "Radio") {
            result[qcode] = "";
          } else if (qtype === "Checkbox") {
            result[qcode] = [];
          }
        });
      });

      return result;
    },

    exampleProfileImage() {
      return profile;
    },
    examplethaiCitizenMaskImage(){
      return thaiCitizenMask;
    },
    exampleThaiCitizenIDCardImage() {
      return thaiCitizenIDCard;
    },
    exampleBookbankImage() {
      return bookbank;
    },
    exampleSignaureImage() {
      return siganture;
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
          ${this.$t("application.step.identification")}
        </span>`,
        `<span class="step">
          ${this.currentTab > 2 ? iconHTML : "3"}
        </span>
        <span class="title">
          ${this.$t("application.step.check-info")}
        </span>`,
        `<span class="step">
          ${this.currentTab === 3 ? iconHTML : "4"}
        </span>
        <span class="title">
          ${this.$t("application.step.result")}
        </span>`,
      ];
    },

    currentYear() {
      return parseInt(moment().format("YYYY"), 10);
    },

    maxExpireCardYear() {
      return this.currentYear + 15;
    },

    minExpireCardYear() {
      return this.currentYear - 15;
    },

    minBirthDateYear() {
      return this.currentYear - 30;
    },

    genderText() {
      const mapping = {
        M: "ชาย",
        F: "หญิง",
        O: "อื่นๆ",
      };

      return mapping?.[this.displayValues.gender] ?? "";
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

    countries() {
      return country.data.map(({ code: value, name: text }) => ({
        value,
        text,
      }));
    },

    nationalities() {
      return nationality.data.map(({ value, name: text }) => ({
        value,
        text,
      }));
    },

    incomes() {
      return income.data.map(({ value, title }) => ({
        value,
        title,
      }));
    },

    isUnemployed() {
      return isUnemployed(this.form.occupation);
    },

    mustSpecificOccupationOther() {
      return mustSpecificOccupationOther(this.form.occupation);
    },

    mustSpecificBusinessType() {
      return mustSpecificBusinessType(this.form.occupation);
    },

    mustSpecificBusinessTypeOther() {
      return mustSpecificBusinessTypeOther(this.form.businessType);
    },

    atsBanks() {
      return Object.keys(banks.ats).map((bankCode) => ({
        value: bankCode,
        title: banks.ats[bankCode],
      }));
    },

    isATSinDivBank() {
    
      return (
        this.form.atsBank === "" ||
        (this.form.atsBank &&
          this.divBanks.map((item) => item.value).includes(this.form.atsBank))
      );
    },

    divBanks() {
      return Object.keys(banks.div).map((bankCode) => ({
        value: bankCode,
        title: banks.div[bankCode],
      }));
    },

    suitabilityGrade() {
      if (this.totalScore >= 37) {
        return "5";
      } else if (this.totalScore >= 30) {
        return "4";
      } else if (this.totalScore >= 22) {
        return "3";
      } else if (this.totalScore >= 15) {
        return "2";
      }
      return "1";
    },

    suitabilityGroup() {
      return `group-${this.suitabilityGrade}`;
    },

    suitQuestionNoMapping() {
      let questionNo = 1;
      let result = {};
      this.suitability.session.forEach((session) => {
        if (session.question) {
          session.question.forEach(({ qcode }) => {
            result[qcode] = questionNo;
            questionNo++;
          });
        }
      });
      return result;
    },

    suitabilityRisk() {
      return suitabilityGroup[this.suitabilityGroup]?.risk
        ? suitabilityGroup[this.suitabilityGroup].risk
        : "n/a";
    },
    suitabilityRiskDesc() {
      return suitabilityGroup[this.suitabilityGroup]?.risk_desc
        ? suitabilityGroup[this.suitabilityGroup].risk_desc
        : "n/a";
    },
    suitabilityProduct() {
      return suitabilityGroup[this.suitabilityGroup]?.product
        ? suitabilityGroup[this.suitabilityGroup].product
        : "n/a";
    },

    dafaultSuitabilityItems() {
      const result = {};
      if (!this.suitability?.session) {
        return result;
      }

      this.suitability?.session.forEach(({ question = [] }) => {
        question.forEach(({ qcode, qtype }) => {
          if (qtype === "Radio") {
            result[qcode] = "";
          } else if (qtype === "Checkbox") {
            result[qcode] = [];
          }
        });
      });

      return result;
    },

    applicationFormConfigs() {
      return {
        lockAtsBank: this.lockAtsBank,
        lockDivBank: this.lockDivBank,
      };
    },

    verifyMobileNoData() {
      const result = {
        mobileNo: "",
      };

      if (!this.displayValues) {
        return result;
      }

      return {
        ...result,
        isOmnAndSeg:this.isOmnAndSeg,
        mobileNo: this.displayValues.mobileNo
          ? this.displayValues.mobileNo
          : "",
      };
    },

    verifyCardIDData() {
      const result = {
        name: "",
        surname: "",
        citizenCardID: "",
        birthdate: "",
      };

      if (!this.displayValues) {
        return result;
      }

      return {
        ...result,
        name: this.displayValues.nameTh ? this.displayValues.nameTh : "",
        surname: this.displayValues.surnameTh
          ? this.displayValues.surnameTh
          : "",
        citizenCardID: this.displayValues.cardID
          ? this.displayValues.cardID
          : "",
        birthdate: this.displayValues.birthDate
          ? this.displayValues.birthDate
          : "",
      };
    },

    maritalStatus() {
      const mapping = {
        1: "โสด",
        2: "สมรส",
        3: "หม้าย",
        4: "หย่า",
      };

      return mapping[this.values.flagMartialStatus]
        ? mapping[this.values.flagMartialStatus]
        : "";
    },

    assetValue() {
      if (this.values.assetValue === "") {
        return "";
      }

      return numeral(this.values.assetValue).format("0,0");
    },

    registerAddressText() {
      if (this.form.flagRegisAdrs === "1") {
        return this.contactAdddressText;
      }
      return getAddressText(this.form.registerAddress);
    },

    officeAdddressText() {
      if (this.form.flagOfficeAdrs == 1) {
        return this.contactAdddressText;
      } else if (this.form.flagOfficeAdrs == 2) {
        return this.registerAddressText;
      }

      return getAddressText(this.form.officeAddress);
    },

    contactAdddressText() {
      return getAddressText(this.form.contactAddress);
    },

    occupationText() {
      if (mustSpecificOccupationOther(this.form.occupation)) {
        return this.form.occupationOth;
      }
      const findData = occupation.datas.find(
        ({ code }) => code === String(this.form.occupation)
      );
      return findData?.["title_th"] ?? "";
    },

    businessTypeText() {
      if (mustSpecificBusinessTypeOther(this.form.businessType)) {
        return this.form.businessTypeOth;
      }
      const findData = businessType.datas.find(
        ({ code }) => code === this.form.businessType
      );
      return findData?.["title_th"] ?? "";
    },

    incomeText() {
      const findIncomeData = income?.data.find(
        ({ value }) => value === this.form.monthlyIncome
      );
      return findIncomeData?.["title"] ?? "";
    },

    sourceIncomeText() {
      if (!this.form?.srcIncome) {
        return "";
      }

      const resultTextList = this.form.srcIncome.map((srcIncomeItem) => {
        if (String(srcIncomeItem) === "7") {
          return `อื่นๆ (${this.form.srcIncomeOth})`;
        } else {
          const result = sourceIncome.data.find(
            (item) => String(item.code) === String(srcIncomeItem)
          );
          return result ? result["name_th"] : "";
        }
      });
      return resultTextList.filter((item) => item != "").join(", ");
    },

    politicalText() {
      if (String(this.form?.flagPoliticalPerson) !== "1") {
        return "";
      }

      const politicalData = political.data;
      const selectedPolitical = politicalData.find(
        ({ politicalcode = "" }) =>
          String(politicalcode) === this.form.politicalPosition
      );
      return selectedPolitical ? selectedPolitical?.politicalname_th : "";
    },

    investmentObjectiveText() {
      if (!this.form?.investmentObjective) {
        return "";
      }

      const investmentObjectiveData = investmentObjective.data;

      const resultTextList = this.form.investmentObjective
        .filter((value) => String(value) !== "0")
        .map((investmentObjectiveItem) => {
          const result = investmentObjectiveData.find(
            (item) => String(item.value) === String(investmentObjectiveItem)
          );
          return result ? result.title : "";
        });

      if (this.form.investmentObjective.includes("0")) {
        resultTextList.push(`อื่นๆ (${this.form.investmentObjectiveOth})`);
      }
      return resultTextList.filter((item) => item != "").join(", ");
    },

    sourceIncomeCountryText() {
      if (this.form.srcIncomeCountry === "999") {
        return this.form.srcIncomeCountryOth;
      }

      const findCountry = country.data.find(
        ({ code }) => code === this.form.srcIncomeCountry
      );
      return findCountry?.name ?? "";
    },

    mailingAddressText() {
      const mailingAddressData = mailingAddress.data;
      const result = mailingAddress.data.find(
        (item) => String(item.value) === String(this.form.flagMailingAdrs)
      );
      if (result) {
        return `${mailingAddressData[0]?.title}, ${result?.title}`;
      }

      return mailingAddressData[0]?.title;
    },

    atsAccountText() {
      const bankText = banks.ats[this.form.atsBank]
        ? banks.ats[this.form.atsBank]
        : "";
      const findAccountType = accountType.data.find(
        (item) => String(item.value) === String(this.form.atsAccountType)
      );
      const accountText = findAccountType ? findAccountType.title : "";

      return `
        <strong>${this.$t("application.bank")} :</strong> ${bankText}<br />
        <strong>${this.$t("application.branch")} :</strong> ${
        this.values.atsBranch
      } <br />
        <strong>${this.$t(
          "application.account-type"
        )} :</strong> ${accountText}<br />
        <strong>${this.$t("application.account-no")} :</strong> ${
        this.values.atsAccount
      }<br />
        <strong>${this.$t("application.account-name")} :</strong> ${
        this.values.atsAccountName
      }
      `;
    },

    divAccountText() {
      const bankText = banks.div[this.form.divBank]
        ? banks.div[this.form.divBank]
        : "";
      const findAccountType = accountType.data.find(
        (item) => String(item.value) === String(this.form.divAccountType)
      );
      const accountText = findAccountType ? findAccountType.title : "";

      return `
        <strong>${this.$t("application.bank")} :</strong> ${bankText} <br />
        <strong>${this.$t("application.branch")} :</strong> ${
        this.form.divBranch
      } <br />
        <strong>${this.$t(
          "application.account-type"
        )} :</strong> ${accountText}<br />
        <strong>${this.$t("application.account-no")} :</strong> ${
        this.form.divAccount
      }<br />
        <strong>${this.$t("application.account-name")} :</strong> ${
        this.form.divAccountName
      }
      `;
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

    formatApplyDate() {
      if (!this.submitAt) {
        return "";
      }

      const sumbitDate = moment(this.submitAt, "YYYYMMDDHHmmss").format(
        "YYYYMMDD"
      );
      return formatFullDate(sumbitDate, this.lang);
    },
  },

  methods: {
    
    onChangeOccupation() {
      if (this.isUnemployed && String(this.form.flagMailingAdrs) === "3") {
        this.form.flagMailingAdrs = "1";
      }
      this.form.occupationOth = "";
      this.form.businessType = "";
      this.form.businessTypeOth = "";
    },

    onChangeATSBank() {
      const banks = this.divBanks.map((item) => item.value);
      if (!banks.includes(this.form.atsBank)) {
        this.form.flagDiv = "2";
      }
    },

    onChangeSuitabilityChoice(question, selectedChoice, event) {
      const { qcode, qtype } = question;
      if (qtype === "Radio") {
        this.form.suitability[qcode] = selectedChoice;
      } else if (qtype === "Checkbox") {
        if (event.target.checked) {
          this.form.suitability[qcode].push(selectedChoice);
          this.form.suitability[qcode].sort();
        } else {
          this.form.suitability[qcode] = this.form.suitability[qcode].filter(
            (item) => item !== String(selectedChoice)
          );
        }
      }
      this.calculateScore();
    },

    async onClickViewPDF(fileType) {
      this.isLoading = true;

      const inputData = {
        file: fileType,
        type:this.isOmnAndSeg ? "OMN_AND_SEG":"SEG_ONLY"
      };
      const [error, result] = await to(
        openAccountFundAPI.post("fund/apply/segigate/pdf", inputData)
      );
      this.isLoading = false;
      if (error) {
        showError(
          "ไม่สามารถแสดงเอกสารได้ (-1)",
          `เนื่องจากเกิดข้อผิดพลาดในแสดงเอกสาร ${contactMessage}`
        );
        return;
      }

      if (!result?.data) {
        showError(
          "ไม่สามารถแสดงเอกสารได้ (-2)",
          `เนื่องจากเกิดข้อผิดพลาดในแสดงเอกสาร ${contactMessage}`
        );
        return;
      }

      const { data: dataURI } = result;
      const byteString = atob(dataURI);
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      const blob = new Blob([ab], { type: "application/pdf;charset=utf-8" });
      saveAs(
        blob,
        `${this.displayValues.customerNo}_${fileType}_draft_${moment().format(
          "YYYYMMDDHHmmss"
        )}.pdf`
      );
    },

    onBeforeChangeTab() {
      // for Disable tab
    },

    async onClickVerify() {
      // หมายเหตุ : method นี้ไม่ได้ถูกเรียกจาก template แล้ว (step 2 เปลี่ยนไปใช้ onClickVerifyNDID แทน)
      // คงไว้เป็น reference เดิมเผื่อต้องย้อนกลับ/เทียบ logic ในอนาคต
      if (window.onclickShowIdentifyApp) {
        try {
          // send tasktype  to blsport tasktype 2 meaning open seg only
          const isDopaRequired = this.verifyForm["citizenCardID"] == "Y" ? "Y": "N";
          const isFaceCompareVerify = this.verifyForm["FacecompareIdentify"] == "Y" ? "Y": "N";
          
          await window.onclickShowIdentifyApp( this.isOmnAndSeg ? "1" : "2", isDopaRequired , isFaceCompareVerify);
      
        } catch (err) {
          console.error("Error when calling Identify App:", err);
        }
      } else {
        console.warn("onclickShowIdentifyApp is not loaded yet.");
      }
    },
    // add on : requirment - step 2 (seg / omn+seg) เลิกใช้ popup NDID เดิม (onClickShowNdidVerify) แล้ว
    // เปลี่ยนไปเปิดเว็บยืนยันตัวตนใหม่แทน (onClickShowVerifyIdentityWebsite ประกาศไว้ใน
    // fund-application-new_blade.php) คงชื่อ method เดิมไว้ (onClickVerifyNDID) เพื่อลดความเสี่ยง
    onClickVerifyNDID() {
      if (window.onClickShowVerifyIdentityWebsite) {
        try {
          window.onClickShowVerifyIdentityWebsite();
        } catch (err) {
          console.error("Error when calling verify identity website:", err);
        }
      } else {
        console.warn("onClickShowVerifyIdentityWebsite is not loaded yet.");
      }
    },
    onClickPrev() {
      if (this.currentTab === 0) return;
      this.scrollToTop();
      this.currentTab--;
    },

    onClickNext() {
      if (this.currentTab === 2) return;

      if (this.currentTab === 0) {
        if (this.validateApplicationForm()) {
          return;
        }

        const {
          flagIsUSCitizen,
          flagHolderUSResidentCard,
          flagUSResidentForTax,
        } = this.form;
        if (
          String(flagIsUSCitizen) === "1" ||
          String(flagHolderUSResidentCard) === "1" ||
          String(flagUSResidentForTax) === "1"
        ) {
          showWarning(
            "ท่านไม่สามารถทำรายการผ่านช่องทางนี้",
            "เนื่องจากท่านเป็นบุคคลที่มีข้อมูลอยู่ในกลุ่มของ FATCA (Foreign Account Tax Compliance Act)<br />" +
              contactMessage
          );
          return;
        }

        this.saveData(false);
        return;
      } else if (this.currentTab === 1) {
       // this.saveData(false);
        if (this.validateVerifyForm()) {
          return;
        }
        this.saveData(true);
      }

      this.scrollToTop();
      this.currentTab++;
    },

    onClickSave() {
      this.saveData();
    },

    getImageDataWithoutPrefix(dataUrl) {
      // Split the data URI at the comma
      const parts = dataUrl.split(',');
      if (parts.length === 2) {
        return parts[1];
      } else {
     
        return null;
      }
    },
    getBase64EncodeImg(img){

    var newimg= img.replace(/^data:image\/(png|jpg|jpeg|gif|heic|heif);base64,/, "");
    return newimg;
    },
    getBlob(value){
      const arr = value.split(",");
      const mime = arr[0].match(/:(.*?);/)[1];
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      const blobImage = new Blob([u8arr], { type: mime });
      return blobImage;
    },
    async onChangeImageAttachForm(imageType, event) {
      
      let value = event.value;
      let type = event.type;
      // req : mask region
      if(imageType == "citizen_card_id"){
        
        this.isLoading = true;
        var picFormat  = value.split(';')[0].split('/')[1]; // file extension
      
        const formData = new FormData();
        formData.append('cardNo', this.displayValues.cardID);
        formData.append('picFormat', picFormat);
        if(type == 'upload'){
         formData.append('src', type);
         formData.append('cardNoBin', this.getBase64EncodeImg(value));
        }else{
          formData.append('blobFile', this.getBlob(value));
        }
        const [error, res] = await to(
          openAccountFundAPI.post("fund/identify/card", formData  , {
          headers: { "Content-Type": "multipart/form-data" },
        })
        );
        this.isLoading = false;
        if(error){  
          this.showErrorCitizenCard();
    
          return;
        }
        if(res){
          const { status , result , data} = res;
          if (status != 200 ) {
            this.showErrorCitizenCard();
        
            return;
          }else{
            if(result == 1){
              value  ="data:image/"+picFormat+";base64,"+ data;
              
            }else{
              this.showErrorCitizenCard();
            
              return;
            }
          }
        }

      }

      const arr = value.split(",");
      const mime = arr[0].match(/:(.*?);/)[1];
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      const blobImage = new Blob([u8arr], { type: mime });

      // eof
      const formData = new FormData();
      formData.append("imageType", imageType);
      formData.append("uploadFile", blobImage);
       formData.append("isOmnAndSeg", this.isOmnAndSeg ? "OMN_AND_SEG" : "SEG_ONLY");

    
      this.isUploaded = true;
      this.disableMobileNoForm = true;
      this.disabledThaiCitizenCardIDForm = true;
      const [error, result] = await to(
        openAccountFundAPI.post("fund/apply/segigate/attachment", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
      );
      this.isUploaded = false;
      this.disableMobileNoForm = false;
      this.disabledThaiCitizenCardIDForm = false;

      if (error) {
        const { data } = error.response;
        showError(
          "ไม่สามารถอัพโหลดไฟล์เข้าสู่ระบบได้",
          `เนื่องจากเกิดข้อผิดพลาดระหว่างการส่งข้อมูลอัพโหลดรูป (${data.errNo}) <br />${contactMessage}`
        );
        return;
      }

      const { file = null } = result;
      if (!file) {
        let message =
          "เนื่องจากเกิดข้อผิดพลาดระหว่างการส่งข้อมูลอัพโหลดรูป (-88)";
        showError(
          "ไม่สามารถอัพโหลดไฟล์เข้าสู่ระบบได้",
          `${message}<br />${contactMessage}`
        );
        return;
      }
 
      switch (imageType) {
        case "profile":
          this.verifyForm.profilePhoto = file;
          setTimeout(() => {
            if (this.$refs.viewProfilePhotoButton) {
              this.$refs.viewProfilePhotoButton.openModal();
            }
          }, 500);
          break;
        case "citizen_card_id":
          this.verifyForm.citizenCardIDPhoto = file;
          setTimeout(() => {
            if (this.$refs.viewCitizenCardPhotoButton) {
              this.$refs.viewCitizenCardPhotoButton.openModal();
            }
          }, 500);
          break;
        case "bookbank":
          this.verifyForm.bookbankPhoto = file;
          setTimeout(() => {
            if (this.$refs.viewBookbankPhotoButton) {
              this.$refs.viewBookbankPhotoButton.openModal();
            }
          }, 500);
          break;
        case "signature":
       
          this.verifyForm.signaturePhoto = file;
          setTimeout(() => {
            if (this.$refs.viewSignaturePhotoButton) {
              this.$refs.viewSignaturePhotoButton.openModal();
            }
          }, 500);
          break;
      }
    },
    showErrorCitizenCard(){
      showError(
        "เกิดปัญหาขึ้นภายในระบบเกี่ยวกับการอัพโหลดไฟล์",
        `เนื่องจากเกิดปัญหาในการตรวจสอบบัตรประชาชนของท่าน <br />${contactMessage}`
      );
    },
    getImageFormatFromDataUri(base64String) {


        // แปลง base64 เป็น binary string
        const binaryString = atob(base64String);


        // สร้าง Blob object จาก binary string
        const blob = new Blob([binaryString]);


        // สร้าง URL จาก Blob object
        const blobUrl = URL.createObjectURL(blob);
        console.log(blobUrl);

        // สร้าง element สำหรับการอ่านข้อมูลของ Blob object
        const reader = new FileReader();


        // เมื่ออ่าน Blob object แล้ว
        reader.onloadend = function () {
          // รับเฉพาะชนิดของไฟล์จาก Blob object
          const arrayBuffer = reader.result;
          const uint8Array = new Uint8Array(arrayBuffer);
          let mimeType = "";
          // ตรวจสอบหัวของไฟล์เพื่อระบุชนิดของไฟล์
          if (uint8Array.length > 1) {
            const byte1 = uint8Array[0];
            const byte2 = uint8Array[1];
            if (byte1 === 0xff && byte2 === 0xd8) {
              mimeType = "image/jpeg";
            } else if (byte1 === 0x89 && byte2 === 0x50) {
              mimeType = "image/png";
            } else if (byte1 === 0x47 && byte2 === 0x49) {
              mimeType = "image/gif";
            } else if (byte1 === 0x42 && byte2 === 0x4d) {
              mimeType = "image/bmp";
            }else if (byte1 === 0x00 && byte2 === 0x00 && uint8Array[3] === 0x18 && uint8Array[4] === 0x66 && uint8Array[5] === 0x74 && uint8Array[6] === 0x79 && uint8Array[7] === 0x70) {
                mimeType = "image/heic";
            }
          }
          return mimeType;
        };

        
    },
    dataURItoBlob(dataurl) {
      const arr = dataurl.split(',');
      const mime = arr[0].match(/:(.*?);/)[1];
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new Blob([u8arr], { type: mime });
    },
    onMobileNoVerified() {
      this.verifyForm.mobileNo = "Y";
    },

    onCitizenCardIDVerified() {
      this.verifyForm.citizenCardID = "Y";
    },
   

    sendApplyData(){
      showConfirm(
        "ยืนยันการส่งข้อมูล",
        "ท่านได้ตรวจสอบข้อมูลเรียบร้อยแล้วและต้องการส่งข้อมูลใช่หรือไม่",
        "ยืนยัน",
        "ยกเลิก",
        async () => {
          this.isLoading = true;
           const params = {
            identifyDopaDatetime:this.identifyConfig.identifyDopaDatetime,
            identifyFaceDatetime:this.identifyConfig.identifyFaceDatetime,
            isOmnAndSeg:this.isOmnAndSeg ? "OMN_AND_SEG" : "SEG_ONLY"
          };

          const endpoint = this.isOmnAndSeg 
          ? "fund/apply/omn_and_seg/send" 
          : "fund/apply/segigate/send";

          const [error, result] = await to(
            openAccountFundAPI.post(endpoint, params)
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
                "invalid card expire":
                  "เนื่องจากบัตรประจำตัวประชาชนของท่านหมดอายุ กรุณาตรวจสอบวันหมดอายุบัตรประชาชนของท่าน",
                "is fatca":
                  "เนื่องจากท่านเป็นบุคคลที่มีข้อมูลอยู่ในกลุ่มของ FATCA (Foreign Account Tax Compliance Act)<br />" +
                  contactMessage,
              };

              if (errorMapping[data?.errMsg]) {
                showError(
                  "ขออภัยค่ะ ท่านไม่สามารถสมัครได้",
                  errorMapping[data?.errMsg]
                );
                return;
              }
            }

            const messageErrorCodeMapping = {
              "Cannot Check Old Data from WS": "-1",
              "Cannot Get Data from Open Account API": "-2",
              "Cannot Get Data from API": "-3",
              "cannot call InsertAcctOpnFund": "-4",
              "cannot call UpdateAcctOpnFund": "-4",
              "cannot get return data from InsertAcctOpnFund": "-5",
              "cannot get return data from UpdateAcctOpnFund": "-5",
              "cannot get data from open account": "-6",
              "cannot update and send pdf": "-7",
            };
            let errDisplayCode = "-88";
            if (messageErrorCodeMapping[data?.errMsg]) {
              errDisplayCode = messageErrorCodeMapping[data?.errMsg];
            }

            showError(
              "ไม่สามารถทำการส่งข้อมูลได้",
              `เนื่องจากเกิดข้อผิดพลาดในการเชื่อมต่อเพื่อส่งข้อมูลการสม้คร (${errDisplayCode})<br />${contactMessage}`
            );
            return;
          }

          const { submitAt } = result;
          this.submitAt = submitAt;

          this.scrollToTop();
          this.currentTab = 3;
        }
      );
    },
    handleResult(result) {
      if (typeof result === "object" && result !== null) {
        this.crsData = result;
        // this.$emit("crsData" , this.crsData);
        this.sendApplyData();
      } else if (result === true) {
        this.sendApplyData();
      }
    },

    onClickSendData() {
      if (
        typeof window.openCRSWithCallback === "function" 
      ) {
        window.openCRSWithCallback(this.handleResult , "seg");
      }
    },

    scrollToTop() {
      window.scrollTo({ top: 0 });
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

    getSuitabilityFieldClass(questionCode) {
      return {
        "has-error":
          this.$v.form.suitability?.[questionCode]?.$dirty &&
          this.$v.form.suitability?.[questionCode]?.$invalid,
      };
    },

    getVerifyFieldClass(fieldname) {
      let hasErrorClass = false;
      if (Array.isArray(fieldname)) {
        hasErrorClass = fieldname.some(
          (field) => this.showError && this.$v.verifyForm?.[field]?.$invalid
        );
      } else {
        hasErrorClass =
          this.showError && this.$v.verifyForm?.[fieldname]?.$invalid;
      }
      return { "has-error": hasErrorClass };
    },

    calculateScore() {
      let totalScore = 0;
      if (!this.suitability || !this.form.suitability) {
        return;
      }

      this.suitability?.session.forEach(({ question = null }) => {
        if (question) {
          question.forEach(({ qscore, qcode, qtype, choice }) => {
            if (qscore === "true" && this.form.suitability[qcode]) {
              if (qtype === "Radio") {
                const { cscore = null } = choice.find(
                  (choiceItem) =>
                    choiceItem.ccode === this.form.suitability[qcode]
                );
                if (cscore) {
                  totalScore += parseInt(cscore, 10);
                }
              } else if (qtype === "Checkbox") {
                const selectedValue = this.form.suitability[qcode].map(
                  (value) => {
                    const { cscore = null } = choice.find(
                      (choiceItem) => choiceItem.ccode === value
                    );

                    return cscore ? parseInt(cscore, 10) : 0;
                  }
                );

                if (selectedValue.length > 0) {
                  totalScore += Math.max(...selectedValue);
                }
              }
            }
          });
        }
      });
      this.totalScore = totalScore;
    },

    validateApplicationForm() {
      this.$v.form.$touch();
      const { contactAddressRef, registerAddressRef, officeAdrressRef } =
        this.$refs;
      let isContactAddressInvalid = false;
      let isRegisterAddressInvalid = false;
      let isOfficeAddressInvalid = false;

      if (contactAddressRef) {
        contactAddressRef.$v.$touch();
        isContactAddressInvalid = contactAddressRef.$v.$invalid;
      }

      if (registerAddressRef) {
        registerAddressRef.$v.$touch();
        isRegisterAddressInvalid = registerAddressRef.$v.$invalid;
      }

      if (officeAdrressRef) {
        officeAdrressRef.$v.$touch();
        isOfficeAddressInvalid = officeAdrressRef.$v.$invalid;
      }
      console.log("this.$v.form",this.$v.form);
      if (this.$v.form.$invalid) {
        console.log("Form is invalid! Details:");
        Object.keys(this.$v.form).forEach(key => {
          if (key.indexOf('$') === -1 && this.$v.form[key].$invalid) {
            console.log(`Field [${key}] is invalid`);
          }
        });
      } else {
        console.log("Form is valid! Ready to submit.");
      }
      console.log("isOfficeAddressInvalid:",isOfficeAddressInvalid);
      console.log("isContactAddressInvalid:",isContactAddressInvalid);
      console.log("isRegisterAddressInvalid:",isRegisterAddressInvalid);
      if (
        this.$v.form.$invalid ||
        isContactAddressInvalid ||
        isRegisterAddressInvalid ||
        isOfficeAddressInvalid
      ) {
        this.$nextTick(() => {
          this.$refs.form
            .getElementsByClassName("has-error")[0]
            .scrollIntoView({ behavior: "smooth" });
        });
        return true;
      }
      return false;
    },

    validateVerifyForm() {
      this.showError = false;
      console.log("this.$v.verifyForm",this.$v.verifyForm);
      console.log("this.$v.verifyForm.$invalid:", this.$v.verifyForm.$invalid);
      if (!this.$v.verifyForm.$invalid) {
        return false;
      }

      // if (this.$v.verifyForm.profilePhoto?.$invalid) {
      //   this.$refs.profilePhotoAttachmentForm.focus();
      // } else if (this.$v.verifyForm.citizenCardIDPhoto?.$invalid) {
      //   this.$refs.citizenCardPhotoAttachmentForm.focus();
      // } else if (this.$v.verifyForm.bookbankPhoto?.$invalid) {
      //   this.$refs.bookbankPhotoAttachmentForm.focus();
      // } else if (this.$v.verifyForm.signaturePhoto?.$invalid) {
      //   this.$refs.signaturePhotoAttachmentForm.focus();
      // } else if (this.$v.verifyForm.mobileNo?.$invalid) {
      //   this.$refs.verifyMobileNoForm.focus();
      // } 
       if (this.$v.verifyForm.bookbankPhoto?.$invalid) {
        this.$refs.bookbankPhotoAttachmentForm.focus();
      } else if (this.$v.verifyForm.signaturePhoto?.$invalid) {
        this.$refs.signaturePhotoAttachmentForm.focus();
      } else if (this.$v.verifyForm.mobileNo?.$invalid) {
        this.$refs.verifyMobileNoForm.focus();
      } 
      
      // else if (this.$v.verifyForm.citizenCardID?.$invalid) {
      //   this.$refs.verifyCardNoForm.focus();
      // }

      this.showError = true;
      return true;
    },

    async saveData(isClickSave = true) {
      const values = { ...this.form };
      const submitValue = { ...defaultSubmitFormData };

      for (const [field] of Object.entries(defaultSubmitFormData)) {
        if (values[field] && field !== "suitability") {
          submitValue[field] = values[field];
        }
      }
      console.log(submitValue);
      if (this.displayValues.cardType === "CI") {
        submitValue.issueCountry = "";
        submitValue.expireDate =
          values.flagNotExpire === "1" ? "99990101" : values.expireDate;
      } else if (this.displayValues.cardType === "PP") {
        submitValue.expireDate =
          values.flagNotExpire === "1" ? "99990101" : values.passportExpireDate;
      }

      if (submitValue.contactAddress?.country === "000") {
        submitValue.contactAddress.province = String(
          submitValue.contactAddress.province
        );
        submitValue.contactAddress.district = String(
          submitValue.contactAddress.district
        );
        submitValue.contactAddress.subdistrict = String(
          submitValue.contactAddress.subdistrict
        );
      }

      if (submitValue.registerAddress?.country === "000") {
        submitValue.registerAddress.province = String(
          submitValue.registerAddress.province
        );
        submitValue.registerAddress.district = String(
          submitValue.registerAddress.district
        );
        submitValue.registerAddress.subdistrict = String(
          submitValue.registerAddress.subdistrict
        );
      }

      if (submitValue.officeAddress?.country === "000") {
        submitValue.officeAddress.province = String(
          submitValue.officeAddress.province
        );
        submitValue.officeAddress.district = String(
          submitValue.officeAddress.district
        );
        submitValue.officeAddress.subdistrict = String(
          submitValue.officeAddress.subdistrict
        );
      }

      if (values.flagDiv === "1") {
        submitValue.divBank = values.atsBank;
        submitValue.divAccount = values.atsAccount;
        submitValue.divAccountName = values.atsAccountName;
        submitValue.divAccountType = values.atsAccountType;
        submitValue.divBranch = values.atsBranch;
      }
      submitValue.atsAccount = values.atsAccount.replace(/-/g, "");
      submitValue.divAccount = values.divAccount.replace(/-/g, "");
      submitValue.investmentObjective.sort();
      submitValue.srcIncome.sort();

      submitValue.suitability = [];
      for (const [questionCode, choiceCode] of Object.entries(
        values.suitability
      )) {
        if (typeof choiceCode === "string") {
          submitValue.suitability.push({ questionCode, choiceCode });
        } else if (typeof choiceCode === "object") {
          choiceCode.forEach((value) => {
            submitValue.suitability.push({ questionCode, choiceCode: value });
          });
        }
      }

      submitValue.score = String(this.totalScore);
      submitValue.grade = this.suitabilityGrade;
      submitValue.qnversion = this.suitVersion;

      // ต้องส่ง customerDetail.dateOfIssueEn
      if(this.identifyConfig){
        const customerDetail = this.identifyConfig && this.identifyConfig?.customerDetail ? this.identifyConfig.customerDetail : null;
        if(customerDetail){
            console.log("send seg->",customerDetail);
            const customerDetailObject = JSON.parse(customerDetail);
            submitValue.dateOfIssueEn = customerDetailObject.dateOfIssueEn;
        }
      }
      // ====================================
      
      console.log(submitValue);
      const endpoint = this.isOmnAndSeg 
      ? "fund/apply/omn_and_seg/save" 
      : "fund/apply/segigate/save";

    console.log("Submit URL:", endpoint);

      this.isLoading = true;
      const [error] = await to(
        openAccountFundAPI.post(endpoint, submitValue)
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
            "invalid card expire":
              "เนื่องจากบัตรประจำตัวประชาชนของท่านหมดอายุ กรุณาตรวจสอบวันหมดอายุบัตรประชาชนของท่าน",
            "is fatca":
              "เนื่องจากท่านเป็นบุคคลที่มีข้อมูลอยู่ในกลุ่มของ FATCA (Foreign Account Tax Compliance Act)<br />" +
              contactMessage,
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
          "ไม่สามารถบันทึกข้อมูลได้",
          `เนื่องจากเกิดข้อผิดพลาดในการบันทึกข้อมูลการสม้คร ${contactMessage}`
        );
        return;
      }

      if (!isClickSave) {
        this.currentTab++;
        this.scrollToTop();
      }
    },
  },

  mounted() {
    const data = this.values;
    if ([2, 7].includes(data.currentStatus)) {
      this.currentTab = 3;
    }

    // Set Form
    this.showPreForm = data.isNewApply;
    this.lockAtsBank = data.lockAtsBank;
    this.lockDivBank = data.lockDivBank;
    this.hasAtsBank = data.hasAtsBank;
    this.submitAt = data.submitAt;

    let suitability = {};
    if (this.dafaultSuitabilityItems) {
      for (const [questionCode, choiceCode] of Object.entries(
        this.dafaultSuitabilityItems
      )) {
        if (typeof choiceCode !== "string") {
          const filterAnswers = data.suitability.filter(
            (item) => item.questionCode === questionCode
          );
          suitability[questionCode] = filterAnswers.map(
            ({ choiceCode }) => choiceCode
          );
        } else {
          const findAnswer = data.suitability.find(
            (item) => item.questionCode === questionCode
          );
          suitability[questionCode] = findAnswer ? findAnswer.choiceCode : "";
        }
      }
    }

    const isPassport = data.cardType === "PP";
    const isPermanentCardNo = String(data.expireDate).substr(0, 4) === "9999";

    this.form = {
      flagNotExpire: isPermanentCardNo ? "1" : "0",
      cardID: !isPassport ? data.cardID : "",
      expireDate: !isPassport
        ? !isPermanentCardNo
          ? data.expireDate
          : ""
        : "",
      passportID: isPassport ? data.cardID : "",
      issueCountry: isPassport ? data.issueCountry : "",
      passportExpireDate: isPassport
        ? !isPermanentCardNo
          ? data.expireDate
          : ""
        : "",
      flagMartialStatus: data?.flagMartialStatus,
      spouseNameTh: data?.spouseNameTh,
      spouseSurnameTh: data?.spouseSurnameTh,
      spouseNameEn: data?.spouseNameEn,
      spouseSurnameEn: data?.spouseSurnameEn,

      contactAddress: { ...data?.contactAddress },
      flagRegisAdrs: data?.flagRegisAdrs,
      registerAddress: { ...data?.registerAddress },
      officeAddress: { ...data?.officeAddress },
      officeCompanyName: data?.officeCompanyName,
      occupation: data.occupation,
      occupationOth: data.occupationOth,
      businessType: data.businessType,
      businessTypeOth: data.businessTypeOth,
      srcIncomeCountry: data.srcIncomeCountry,
      srcIncomeCountryOth: data.srcIncomeCountryOth,
      srcIncome: data.srcIncome,
      srcIncomeOth: data.srcIncome.includes("7") ? data.srcIncomeOth : "",
      monthlyIncome: data.monthlyIncome,
      position: data.position,
      flagPoliticalPerson: data.flagPoliticalPerson,
      politicalPosition:
        data.flagPoliticalPerson === "1" ? data.politicalPosition : "",
      assetValue:
        numeral(data.assetValue) !== "NaN"
          ? numeral(data.assetValue).format("0")
          : "",
      flagIsUSCitizen: data.flagIsUSCitizen,
      flagHolderUSResidentCard: data.flagHolderUSResidentCard,
      flagUSResidentForTax: data.flagUSResidentForTax,

      investmentObjective: data.investmentObjective,
      investmentObjectiveOth: data.investmentObjective.includes("0")
        ? data.investmentObjectiveOth
        : "",
      atsBank: data.atsBank,
      atsBranch: data.atsBranch,
      atsAccountType: data.atsAccountType,
      atsAccountName: data.atsAccountName,
      atsAccount: data.atsAccount,
      flagDiv: data.flagDiv,
      divBank: data.divBank,
      divBranch: data.divBranch,
      divAccountType: data.divAccountType,
      divAccountName: data.divAccountName,
      divAccount: data.divAccount,
      flagMailingAdrs: data.flagMailingAdrs,
      suitability: {
        ...this.suitabilityItems,
        ...suitability,
      },
      ...this.crsData  // Set CRS Form
    };

  
    if(Object.keys(this.crsData).length == 0){
      const keys = ['fatcaflag', 'fatca', 'taxpayertype', 'taxpayerid', 'crsflag', 'crs_detail', 'pob', 'pobcity' ,'pobcitydesc','nationid'];
      keys.forEach(key => {
        if (data?.[key]) {
          this.form[key] = data[key];
        }
      });
    }


    this.calculateScore();
    
    // Set Verify Form
    this.$nextTick(() => {
      const identifyMapping = {
        ["1"]: "mobileNo",
        ["2"]: "citizenCardID",
        ["3"]: "FacecompareIdentify",
      };
      data.confirmations.forEach(({ ruleID }) => {
        const identifyName = identifyMapping[ruleID];
        if (identifyName) {
          this.verifyForm[identifyName] = "Y";
        }
      });

      const fileMapping = {
        ["1"]: "citizenCardIDPhoto",
        ["5"]: "bookbankPhoto",
        ["8"]: "profilePhoto",
        ["9"]: "signaturePhoto",
      };
      data.attachments.forEach(({ fileType, mimeType, data }) => {
        const attachmentName = fileMapping[fileType];
        if (attachmentName) {
          this.verifyForm[attachmentName] = `data:${mimeType};base64,${data}`;
        }
      });
    });
    // Set CRS Form
    if(this.crsData && Object.keys(this.crsData).length > 0){
      this.saveData();
    }
  },
  watch: {
  identifyConfig: {
    handler(newValue, oldValue) {
      if (newValue && (newValue.identifyFaceDatetime)) {
        const isFaceChanged = newValue.identifyFaceDatetime !== oldValue?.identifyFaceDatetime;
        if (isFaceChanged) {
          console.log("Identify Datetime changed, auto saving..."  + " newValue.identifyFaceDatetime:" + newValue.identifyFaceDatetime + " oldValue?.identifyFaceDatetime:" + oldValue?.identifyFaceDatetime);
          this.saveData(true); // เรียกฟังก์ชัน save
        }
      }
    },
    deep: true, 
    immediate: false
  }
},
  filters: {
    blankText,
    formatDate,
    nationalityText,
    textYesNo,
    formatNumber,
  },

  components: {
    Tabs,
    Tab,
    VueLadda,
    DateInput,
    NumericInput,
    AddressForm,
    AttachmentForm,
    ViewPhotoButton,
    VerifyMobileNoForm,
   
  },

  directives: {
    mask,
  },
};
//  VerifyThaiCitizenCardIdForm,
</script>

<style lang="scss">
$step-width: 25%;

.bls-fund-application {
  .segigate-application-form {
    @import "./../../assets/scss/wizard";

    @media screen and (min-width: 768px) {
      .session-suitability {
        .control-label {
          text-align: left;
        }
      }
    }

    .upload-form {
      .attachment-form-container {
        margin-bottom: 10px;
        width: 100%;
      }

      .form-group {
        margin-bottom: 15px;

        &::after {
          content: "";
          clear: both;
          display: block;
        }
      }

      .section {
        padding-top: 20px;

        &:first-child {
          border-top: none;
        }
      }

      .view-button-container {
        margin-top: 15px;

        @media screen and (min-width: 768px) {
          width: 200px;
        }
      }

      @media screen and (min-width: 768px) {
        .control-label {
          padding-top: 8px;
        }

        .attachment-form-container {
          margin-bottom: 0;
          width: auto;
        }
      }
    }

    .upload-status-container {
      padding-top: 8px;
      padding-bottom: 20px;
    }

    .example-image-container {
      margin-top: 15px;
    }

    .example-image-block {
      img {
        width: 200px;
        clear: both;
        display: block;
        margin-left: auto;
        margin-right: auto;

        @media screen and (min-width: 768px) {
          margin-left: 0;
          margin-right: 0;
        }
      }
    }

    .result-content {
      .label-text {
        font-weight: bold;

        @media screen and (min-width: 768px) {
          text-align: right;
        }
      }

      .row {
        margin-bottom: 10px;
      }
    }
  }
}
</style>
