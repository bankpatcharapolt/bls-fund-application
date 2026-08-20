<template>
  <input
    type="text"
    class="form-control input-xs"
    ref="numericInput"
    :value="displayValue"
    :disabled="disabled"
    @focus="onFocusHandler"
    @blur="onBlurHandler"
    @keydown="onKeydownHandler"
    @input="onInputHandler"
    @paste="onPasteHandler"
  />
</template>

<script>
import numeral from "numeral";
import { checkNumericInput } from "./../../services";

export default {
  name: "NumericInput",

  props: {
    value: {
      type: [Number, String],
    },

    decimalPoint: {
      value: {
        type: Number,
        default: 0,
      },
    },

    disabled: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      previousValue: "",
      fieldValue: this.value,
      isFocus: false,
    };
  },

  computed: {
    displayValue() {
      if (this.isFocus) {
        return this.fieldValue;
      }
      return numeral(this.fieldValue).format("0,0");
    },
  },

  watch: {
    value(newValue) {
      this.setData(newValue);
    },
  },

  methods: {
    setData(value) {
      const newValue = numeral(value);
      if (newValue === "NaN") {
        return;
      }

      this.fieldValue = newValue.format("0");
    },

    onFocusHandler() {
      this.isFocus = true;
    },

    onBlurHandler() {
      this.isFocus = false;
    },

    onKeydownHandler(e) {
      if (e.key === "Unidentified") {
        return true;
      }

      const result =
        e.ctrlKey ||
        e.metaKey ||
        e.key === "Backspace" ||
        e.key === "Shift" ||
        e.key === "Home" ||
        e.key === "End" ||
        e.key === "ArrowLeft" ||
        e.key === "ArrowRight" ||
        e.key === "Tab"
          ? true
          : checkNumericInput(e.key);
      if (!result) {
        e.preventDefault();
      }
    },

    onInputHandler(e) {
      const input = e.target;
      if (e.data && !checkNumericInput(e.data)) {
        input.value = this.previousValue;
        this.$emit("input", input.value);
        return;
      }
      this.previousValue = input.value;
      this.$emit("input", input.value);
    },

    onPasteHandler(e) {
      const data = e.clipboardData.getData("text");
      const result = checkNumericInput(data);
      if (!result) {
        e.preventDefault();
      }
    },

    focus() {
      this.$refs.numericInput.focus();
    },
  },

  mounted() {
    this.setData(this.value);
  },
};
</script>