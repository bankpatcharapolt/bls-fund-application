import Swal from "sweetalert2";

const defaultAlertConfig = {
  showCancelButton: false,
  allowOutsideClick: false,
  allowEscapeKey: false,
  allowEnterKey: false
};

const showError = (
  title,
  message,
  confirmButtonText = "ตกลง",
  callback = null
) => {
  Swal.fire({
    icon: "error",
    title,
    html: message,
    confirmButtonText,
    ...defaultAlertConfig
  }).then(() => {
    callback?.();
  });
};

const showSuccess = (
  title,
  message,
  confirmButtonText = "ตกลง",
  callback = null
) => {
  Swal.fire({
    icon: "success",
    title,
    html: message,
    confirmButtonText,
    ...defaultAlertConfig
  }).then(() => {
    callback?.();
  });
};

const showInfo = (
  title,
  message,
  confirmButtonText = "ตกลง",
  callback = null
) => {
  Swal.fire({
    icon: "info",
    title,
    html: message,
    confirmButtonText,
    ...defaultAlertConfig
  }).then(() => {
    callback?.();
  });
};

const showWarning = (
  title,
  message,
  confirmButtonText = "ตกลง",
  callback = null
) => {
  Swal.fire({
    icon: "warning",
    title,
    html: message,
    confirmButtonText,
    ...defaultAlertConfig
  }).then(() => {
    callback?.();
  });
};

const showConfirm = (
  title,
  message,
  confirmButtonText = "ยืนยัน",
  cancelButtonText = "ยกเลิก",
  callback = null
) => {
  Swal.fire({
    icon: "question",
    title,
    html: message,
    confirmButtonText,
    cancelButtonText,
    ...defaultAlertConfig,
    showCancelButton: true
  }).then(result => {
    if (result.value) {
      callback?.();
    }
  });
};

export { showInfo, showError, showWarning, showSuccess, showConfirm };
