<template>
  <div class="date-input-container">
    <select
      class="form-control input-xs"
      v-model="day"
      @change="onChangeInput"
      :disabled="disabled"
    >
      <option value>DD</option>
      <option v-if="allowZeroDate" value="">-</option>
      <option v-for="item in days" :key="'d-' + item" :value="item">
        {{ item }}
      </option>
    </select>

    <select
      class="form-control input-xs"
      v-model="month"
      @change="onChangeInput"
      :disabled="disabled"
    >
      <option value>MM</option>
      <option v-if="allowZeroMonth" value="">-</option>
      <option v-for="item in months" :key="'m-' + item" :value="item">
        {{ item }}
      </option>
    </select>

    <select
      class="form-control input-xs"
      v-model="year"
      @change="onChangeInput"
      :disabled="disabled"
    >
      <option value="">YYYY</option>
      <option v-for="item in years" :key="'y-' + item" :value="item">
        {{ item | buddhistYear }}
      </option>
    </select>
  </div>
</template>

<script>
import moment from "moment";

export default {
  name: "DateInput",

  props: {
    value: {
      type: [Number, String],
    },
    maxYear: {
      type: [Number, String],
      default: "",
    },
    minYear: {
      type: [Number, String],
      default: "",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    allowZeroDate: {
      type: Boolean,
      default: false,
    },
    allowZeroMonth: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      day: "",
      month: "",
      year: "",
    };
  },

  computed: {
    days() {
      const results = [];
      for (let i = 1; i <= 31; i++) {
        results.push(i <= 9 ? "0" + String(i) : String(i));
      }
      return results;
    },

    months() {
      const results = [];
      for (let i = 1; i <= 12; i++) {
        results.push(i <= 9 ? "0" + String(i) : String(i));
      }
      return results;
    },

    years() {
      const results = [];
      const startYear = this.maxYear
        ? parseInt(this.maxYear, 10)
        : parseInt(moment().format("YYYY"), 10) + 80;
      const endYear = this.minYear
        ? parseInt(this.minYear, 10)
        : parseInt(moment().format("YYYY"), 10) - 80;
      let year = startYear;
      do {
        results.push(year);
        year--;
      } while (year >= endYear);
      return results;
    },
  },

  watch: {
    value(newValue) {
      this.setData(newValue);
    },
  },

  methods: {
    setData(value) {
      if (value === "") {
        this.day = "";
        this.month = "";
        this.year = "";
        return;
      }

      if (this.allowZeroDate || this.allowZeroMonth) {
        if (value.length === 8) {
          this.day = value.substr(6, 2);
          this.month = value.substr(4, 2);
          this.year = value.substr(0, 4);
        }
        return;
      }
      const momentDate = moment(value, "YYYYMMDD");

      if (!momentDate.isValid()) {
        this.day = "";
        this.month = "";
        this.year = "";
        return;
      }

      this.day = momentDate.format("DD");
      this.month = momentDate.format("MM");
      this.year = momentDate.format("YYYY");
    },

    onChangeInput() {
      const strInput = this.year + this.month + this.day;
      if (this.allowZeroDate || this.allowZeroMonth) {
        if (strInput.length === 8) {
          this.$emit("input", strInput);
        }
        return;
      }

      if (
        this.year === "" ||
        this.month === "" ||
        this.day === "" ||
        !moment(strInput).isValid()
      ) {
        this.$emit("input", "");
        return;
      }

      this.$emit("input", strInput);
    },
  },

  mounted() {
    this.$nextTick(() => {
      this.setData(this.value);
    });
  },

  filters: {
    buddhistYear(value) {
      return value && value !== "" ? String(parseInt(value, 10) + 543) : "";
    },
  },
};
</script>

<style scoped>
.date-input-container .form-control {
  display: inline-block;
  width: auto;
  margin-left: 10px;
}

.date-input-container .form-control:first-child {
  margin-left: 0;
}
</style>
