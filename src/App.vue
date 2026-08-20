<template>
  <div id="app">
    <button
      type="button"
      class="btn btn-sm"
      style="margin-bottom: 20px; text-transform: uppercase"
      @click="toggleLangHandler()"
    >
      {{ lang }}
    </button>

    <bls-fund-application
      :suitability="suitability"
      :lang="lang"
      :is-webview="isWebview"
      :omnibus-agreement-text="omnibusAgreementText"
      :segregate-agreement-text="segregateAgreementText"
    />
  </div>
</template>

<script>
import suitability from "./assets/suitability.json";
import BlsFundApplication from "./containers/BlsFundApplication.vue";

export default {
  name: "App",

  data() {
    return {
      lang: "th",
      isWebview: false,
      suitability: suitability,
      omnibusAgreementText: `<p>เมื่อท่านคลิกหรือกด <strong>"ตกลง"</strong> จะถือเป็นการแสดงว่า</p><p>ท่านได้อ่านและเข้าใจเนื้อหาในเว็บไซต์ของบริษัทหลักทรัพย์ บัวหลวง จำกัด (มหาชน) ("บัวหลวง") เกี่ยวกับการเปิดบัญชีกองทุนรวมแบบไม่เปิดเผยชื่อผู้ถือหน่วยลงทุน (Omnibus Account) รวมทั้ง (1) แบบคำขอใช้บริการซื้อ ขาย และ/หรือสับเปลี่ยนกองทุน (2) สัญญาแต่งตั้งตัวแทนซื้อ ขาย และ/หรือสับเปลียนหน่วยลงทุน และ (3) แบบแจ้งความประสงค์ขอให้ถอนเงิน/โอนหลักทรัพย์/แปลงสถานะหลักทรัพย์ตามคำสั่งทางโทรศัพท์ (เรียกรวมว่า <strong>"ข้อตกลงการเปิดบัญชีกองทุนรวม (แบบออนไลน์)"</strong>) แล้ว</p><p>ท่านตกลงและยอมรับ<strong>ข้อตกลงการเปิดบัญชีกองทุนรวม (แบบออนไลน์)</strong> ผ่านระบบอิเล็กทรอนิกส์</p>`,
      segregateAgreementText: `<p>เมื่อท่านคลิกหรือกด <strong>"ตกลง"</strong> จะถือเป็นการแสดงว่า</p><p>ท่านได้อ่านและเข้าใจเนื้อหาในเว็บไซต์ของบริษัทหลักทรัพย์ บัวหลวง จำกัด (มหาชน) ("บัวหลวง") เกี่ยวกับการเปิดเลขที่ผู้ถือหน่วยเฉพาะเพื่อการลงทุนลดหย่อนภาษี (Segregate) รวมทั้ง (1) แบบฟอร์มชุดการกรอกข้อมูลสำหรับบุคคลธรรมดา (FundConnext) (2) แบบมาตรฐานในการประเมินความเหมาะสมในการลงทุน (3) แบบแจ้งสถานะความเป็นบุคคลอเมริกัน/ไม่เป็นบุคคลอเมริกัน (4) แบบคำขอใช้บริการซื้อ ขาย และ/หรือสับเปลี่ยนกองทุน (เรียกรวมว่า <strong>"ข้อตกลงการเปิดบัญชีกองทุนรวม (แบบออนไลน์)"</strong>) แล้ว</p><p>ท่านรับรองและยืนยันว่า ข้อมูล ตัวอย่างลายมือชื่อ ภาพถ่าย และรูปภาพใดๆ (รวมถึงแต่ไม่จำกัดเพียง ภาพบัตรประชาชนและสมุดบัญชีเงินฝากธนาคาร) ที่ท่านได้ให้ไว้ถูกต้อง ครบถ้วน และเป็นความจริงทุกประการ</p><p>ท่านยินยอมให้บัวหลวงทำซ้ำภาพถ่ายตัวอย่างลายมือชื่อของท่าน และนำภาพถ่ายตัวอย่างลายมือชื่อของท่านไปใช้ประกอบการเปิดบัญชีกองทุนรวม (แบบออนไลน์) และใช้กับบริษัทหลักทรัพย์จัดการกองทุนที่เป็นคู่สัญญากับบัวหลวงสำหรับการทำธุรกรรมที่เกี่ยวกับกองทุนรวมได้</p><p>ท่านตกลงและยอมรับ<strong>ข้อตกลงการเปิดบัญชีกองทุนรวม (แบบออนไลน์)</strong> ผ่านระบบอิเล็กทรอนิกส์</p>`,
    };
  },

  methods: {
    toggleLangHandler() {
      this.lang = this.lang === "th" ? "en" : "th";
    },
  },

  components: {
    BlsFundApplication,
  },
};
</script>

<style>
#app {
  background: #ddd;
  padding: 10px;
  font-size: 13px;
  /* font-family: Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: #2c3e50;
	margin-top: 60px; */
}
</style>
