<template>
  <div style="display: inline-block">
    <vue-ladda
      type="button"
      button-class="btn btn-labeled btn-sm btn-primary"
      data-style="slide-up"
      ref="btnTakePhoto"
      :loading="isLoading"
      style="margin-right: 5px"
      v-if="takePhoto.showWebcamButton"
      @click="takePhoto.showModal = true"
    >
      <span class="btn-label">
        <i class="glyphicon glyphicon-camera" aria-hidden="true"></i>
      </span>
      ถ่ายรูป
    </vue-ladda>

    <vue-ladda
      type="button"
      button-class="btn btn-labeled btn-sm btn-primary"
      data-style="slide-up"
      ref="btnUploadFile"
      :loading="isLoading"
      v-if="showUploadButton"
      @click="onClickUploadImage"
    >
      <span class="btn-label">
        <i class="glyphicon glyphicon-cloud-upload" aria-hidden="true"></i>
      </span>
      อัพโหลด
    </vue-ladda>
    <div class="input-file-container">
      <input
        type="file"
        :accept="uploadMimeFileType"
        ref="uploadFile"
        class="input-file"
        @change="onInputFileChange"
      />
    </div>

    <span
      v-if="!takePhoto.showWebcamButton && !showUploadButton"
      style="color: #ff0000"
    >
      ขออภัยค่ะ ไม่พบกล้องถ่ายรูปบนอุปกรณ์ของท่าน
      กรุณาอนุญาตให้เข้าถึงกล้องถ่ายรูปหรือเปลี่ยนอุปกรณ์
      สำหรับใช้ประกอบการเปิดบัญชี อ่านรายละเอียด
      <a
        href="https://knowledge.bualuang.co.th/knowledge-base/fundaccountonline/"
        target="_blank"
        >คลิกที่นี่</a
      >
    </span>

    <!-- Take Photo Modal -->
    <modal
      v-model="takePhoto.showModal"
      :header="false"
      :footer="false"
      :backdrop="false"
      :transition-duration="0"
      class="modal-attachment modal-take-photo"
      ref="modal"
      @show="onShowModalTakePhoto"
      @hide="onHideModalTakePhoto"
    >
      <div class="spinner" v-if="takePhoto.showLoading">
        <div class="rect1"></div>
        <div class="rect2"></div>
        <div class="rect3"></div>
        <div class="rect4"></div>
        <div class="rect5"></div>
      </div>

      <web-cam
        ref="webcam"
        width="100%"
        height="auto"
        :device-id="takePhoto.deviceId"
        screenshot-format="image/png"
        @cameras="onWebcamCameras"
        @started="onWebcamStarted"
        @notsupported="onWebcamNotSupport"
        @error="onWebcamError"
      />

      <div
        class="modal-action-section top"
        v-if="takePhoto.showTakePhotoButton"
      >
        <div class="text-right">
          <button type="button" class="btn btn-close" >
            <i
              class="glyphicon glyphicon-remove-circle"
              aria-hidden="true"
              @click="takePhoto.showModal = false"
            ></i>
          </button>
        </div>
      </div>

      <div
        class="modal-action-section bottom"
        v-if="takePhoto.showTakePhotoButton"
      >
        <div style="padding-left: 15px">
          <span v-if="!showSwitchCameraButton">&nbsp;</span>
          <button
            type="button"
            class="btn"
            v-if="showSwitchCameraButton"
            @click="onClickChangeCamera"
          >
            <i class="glyphicon glyphicon-refresh" aria-hidden="true"></i>
            <span>เปลียนกล้อง</span>
          </button>
        </div>
        <div class="text-center">
          <button type="button" class="btn" @click="onClickTakePhoto">
            <i class="glyphicon glyphicon-camera" aria-hidden="true"></i>
            <span>ถ่ายรูป</span>
          </button>
        </div>
        <div class="text-right" style="padding-right: 15px">
          <span>&nbsp;</span>
        </div>
      </div>
    </modal>
    <!-- End Take Photo Modal -->

    <!-- View Photo Modal -->
    <modal
      v-model="viewPhoto.showModal"
      :header="false"
      :footer="false"
      :transition-duration="0"
      :backdrop="false"
      class="modal-attachment modal-view-photo"
      ref="modal"
    >
      <img :src="viewPhoto.captureImage" class="img-responsive" />

      <div class="modal-action-section top">
        <div class="text-right">
          <button type="button" class="btn btn-close" >
            <i
              class="glyphicon glyphicon-remove-circle"
              aria-hidden="true"
              @click="viewPhoto.showModal = false"
            ></i>
          </button>
        </div>
      </div>

      <div class="modal-action-section bottom">
        <div>&nbsp;</div>
        <div class="text-center">
          <button type="button" class="btn" @click="onClickSaveTakePhoto">
            <i class="glyphicon glyphicon-floppy-disk" aria-hidden="true"></i>
            <span>ใช้รูปนี้</span>
          </button>
        </div>

        <div class="text-right" style="padding-right: 15px">
          <button type="button" class="btn" @click="onClickRecapture">
            <i class="glyphicon glyphicon-trash" aria-hidden="true"></i>
            <span>ถ่ายรูปใหม่</span>
          </button>
        </div>
      </div>
    </modal>
    <!-- End View Photo Modal -->

    <!-- Crop Photo Modal -->
    <modal
      v-model="cropPhoto.showModal"
      :header="false"
      :footer="false"
      :transition-duration="0"
      :backdrop="false"
      class="modal-attachment modal-crop-photo"
      ref="modal"
      @before-close="onBeforeCloseCropModal"
    >
      <vue-cropper
        v-if="selectedImage"
        ref="cropper"
        :src="selectedImage"
        :initial-aspect-ratio="cropRatio"
        :aspect-ratio="cropRatio"
        :zoomable="false"
        :zoom-on-touch="false"
        :zoom-on-wheel="false"
        :rotatable="false"
        :movable="false"
        :container-style="{ width: '100%' }"
        :img-style="{ width: '100%' }"
      ></vue-cropper>

      <div class="modal-action-section top">
        <div class="header-text">
          <slot name="crop-header"></slot>
        </div>
        <div class="text-right">
          <button type="button" class="btn btn-close" >
            <i
              class="glyphicon glyphicon-remove-circle"
              aria-hidden="true"
              @click="cropPhoto.showModal = false"
            ></i>
          </button>
        </div>
      </div>

      <div class="modal-action-section bottom">
        <div class="text-center">
          <div style="display: inline-block; margin-right: 30px">
            <button
              type="button"
              class="btn"
              style="margin-right: 10px"
              @click="onClickSetCropperSize('decrease')"
            >
              <i class="glyphicon glyphicon-minus" aria-hidden="true"></i>
              <span>ลดกรอบ</span>
            </button>
            <button
              type="button"
              class="btn"
              @click="onClickSetCropperSize('increase')"
            >
              <i
                class="glyphicon glyphicon-plus"
                aria-hidden="true"
                style="left: 2px"
              ></i>
              <span>เพิ่มกรอบ</span>
            </button>
          </div>

          <button type="button" class="btn" @click="onClickSetCropImage">
            <i
              class="glyphicon glyphicon-floppy-disk"
              aria-hidden="true"
              style="left: 2px"
            ></i>
            <span>ตกลง</span>
          </button>
        </div>
      </div>
    </modal>
    <!-- End Crop Photo Modal -->
  </div>
</template>

<script>
import Modal from "uiv/dist/Modal";
import { WebCam } from "vue-web-cam";
import Jimp from "jimp";
import VueLadda from "vue-ladda";
import VueCropper from "vue-cropperjs";
import "cropperjs/dist/cropper.css";

import { showError } from "../../services";

export default {
  name: "AttachmentForm",

  props: {
    showUploadButton: {
      type: Boolean,
      default: true,
    },
    uploadMimeFileType: {
      type: String,
      default: "image/jpeg,image/png",
    },
    cropAfterUpload: {
      type: Boolean,
      default: false,
    },
    cropAfterTakePhoto: {
      type: Boolean,
      default: false,
    },
    useGrayscale: {
      type: Boolean,
      default: false,
    },
    cropRatio: {
      type: Number,
      default: 1.333,
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      selectedImage: null,
      camera: null,
      uploadPhoto: {
        file: null,
      },
      takePhoto: {
        showWebcamButton: true,
        showModal: false,
        showLoading: true,
        showWebcam: false,
        showTakePhotoButton: false,
        deviceId: null,
        currentDeviceIdIndex: 0,
        devices: [],
      },
      viewPhoto: {
        captureImage: null,
        showModal: false,
      },
      cropPhoto: {
        showModal: false,
      },
    };
  },

  computed: {
    device() {
      return this.takePhoto.devices.find(
        (n) => n.deviceId === this.takePhoto.deviceId
      );
    },

    showSwitchCameraButton() {
      return this.takePhoto.devices.length > 1;
    },
  },

  watch: {
    camera(newValue) {
      this.takePhoto.deviceId = newValue;
    },
  },

  methods: {
    focus() {
      if (this.takePhoto.showWebcamButton) {
        this.$refs.btnTakePhoto.$refs.ladda?.focus();
      }

      if (this.takePhoto.showUploadButton) {
        this.$refs.btnUploadFile.$refs.ladda?.focus();
      }
    },

    // Upload
    onClickUploadImage() {
      this.$refs.uploadFile.value = "";
      this.$refs.uploadFile.click();
    },

    onInputFileChange(inputFile) {
     
      const { files } = inputFile.target;

      this.selectedImage = null;
      const file = files[0];
      if (!file) {
        showError(
          "ไม่สามารถนำเข้าไฟล์เข้าสู่ระบบได้",
          "เนื่องจากไม่สามารถนำไฟล์เข้าสู่ระบบได้เนื่องจากเกิดข้อผิดพลาดในการอ่านไฟล์ของท่าน"
        );

        return;
      }

      const size = file.size / 1024 / 1024;
      if (size > 2) {
        showError(
          "ไม่สามารถนำเข้าไฟล์เข้าสู่ระบบได้",
          "เนื่องจากไฟล์มีขนาดเกิน 2 mb."
        );
        return;
      }

      const reader = new FileReader();
      reader.onload = async () => {
        let sourceImage = reader.result;
        if (this.useGrayscale) {
          sourceImage = await this.getGrayscaleImage(reader.result);
        }

        if (this.cropAfterUpload) {
          this.selectedImage = sourceImage;
          this.cropPhoto.showModal = true;
          this.$refs.uploadFile.value = "";
          return;
        }
  
        this.$emit("change", { value:sourceImage , type:"upload" });
        this.$refs.uploadFile.value = "";
      };
      reader.readAsDataURL(file);
    },

    // Take Photo Method
    onShowModalTakePhoto() {
      if (this.takePhoto.devices.length === 0) {
        return;
      }
      this.selectedImage = null;
      this.takePhoto.showWebcam = true;
      this.viewPhoto.captureImage = null;
      if (!this.takePhoto.deviceId) {
        const selectedDevice =
          this.takePhoto.devices[this.takePhoto.currentDeviceIdIndex];
        if (selectedDevice) {
          this.camera = selectedDevice.deviceId;
          this.takePhoto.deviceId = selectedDevice.deviceId;
        }
      }

      this.$refs.webcam.start();
    },

    onHideModalTakePhoto() {
      this.$refs.webcam.stop();
      this.takePhoto.showLoading = true;
      this.takePhoto.showTakePhotoButton = false;
    },

    onWebcamCameras(cameras) {
      this.takePhoto.devices = cameras;
    },

    onWebcamError() {
      this.takePhoto.showWebcamButton = false;
    },

    onWebcamNotSupport() {
      this.takePhoto.showWebcamButton = false;
    },

    onWebcamStarted() {
      this.takePhoto.showLoading = false;
      this.takePhoto.showTakePhotoButton = true;
      this.viewPhoto.captureImage = null;
    },

    onClickChangeCamera() {
      if (
        this.takePhoto.currentDeviceIdIndex ===
        this.takePhoto.devices.length - 1
      ) {
        this.takePhoto.currentDeviceIdIndex = 0;
      } else {
        this.takePhoto.currentDeviceIdIndex++;
      }

      const selectedDevice =
        this.takePhoto.devices[this.takePhoto.currentDeviceIdIndex];
      this.takePhoto.deviceId = selectedDevice.deviceId;
      this.camera = selectedDevice.deviceId;
    },

    onClickTakePhoto() {
      this.viewPhoto.captureImage = this.$refs.webcam.capture();
      this.takePhoto.showModal = false;
      this.viewPhoto.showModal = true;
    },

    onClickRecapture() {
      this.viewPhoto.captureImage = null;
      this.viewPhoto.showModal = false;
      this.takePhoto.showModal = true;
    },

    async onClickSaveTakePhoto() {
      let sourceImage = this.viewPhoto.captureImage;
      if (this.useGrayscale) {
        sourceImage = await this.getGrayscaleImage(sourceImage);
      }

      this.viewPhoto.captureImage = null;
      this.viewPhoto.showModal = false;

      if (this.cropAfterTakePhoto) {
        this.selectedImage = sourceImage;
        this.cropPhoto.showModal = true;
        return;
      }

      this.$emit("change", { value:sourceImage , type : 'live'}  );
    },

    // Crop Image
    onClickSetCropImage() {
      const image = this.$refs.cropper.getCroppedCanvas().toDataURL();
      this.cropPhoto.showModal = false;
      this.$emit("change", { value:image } );
    },

    onBeforeCloseCropModal() {
      this.$refs.cropper.destroy();
    },

    onClickSetCropperSize(option) {
      const { width: cropCanvasWidth, height: cropCanvasHeight } =
        this.$refs.cropper.getImageData();
      const { width: cropWidth, height: cropHeight } =
        this.$refs.cropper.getCropBoxData();
      const factor = cropWidth * 0.05;
      const newCropWidth =
        option === "increase" ? cropWidth + factor : cropWidth - factor;
      const newCropHeight = (cropHeight / cropWidth) * newCropWidth;

      this.$refs.cropper.setCropBoxData({
        width: newCropWidth,
        height: newCropHeight,
        left: cropCanvasWidth / 2 - newCropWidth / 2,
        top: cropCanvasHeight / 2 - newCropHeight / 2,
      });
    },

    async getGrayscaleImage(sourceImage) {
      const tmpImageSplit = sourceImage.split(";base64,");
      const mimeType = tmpImageSplit[0].replace("data:", "");
      const imageBuffer = Buffer.from(tmpImageSplit[1], "base64");
      const image = await Jimp.read(imageBuffer);
      return image.greyscale().contrast(1).getBase64Async(mimeType);
    },
  },

  components: {
    Modal,
    VueLadda,
    WebCam,
    VueCropper,
  },
};
</script>

<style>
.bls-fund-application .input-file-container {
  position: relative;
  overflow: hidden;
  width: 1px;
  height: 1px;
  float: left;
  display: block;
}

.bls-fund-application .input-file-container .input-file {
  position: absolute;
  top: -999px;
  left: -999px;
}

.bls-fund-application .modal-attachment {
  background-color: #000;
}

.bls-fund-application .modal-attachment .modal-dialog {
  width: calc(100vw - 20px);
  margin: 10px;
}

.bls-fund-application .modal-attachment .modal-content {
  border-radius: 0;
  background-color: #000;
}

.bls-fund-application .modal-attachment .modal-body {
  padding: 0;
}

.bls-fund-application .modal-view-photo .modal-body img {
  width: 100%;
}

.bls-fund-application .modal-action-section {
  position: absolute;

  left: 0;
  width: 100%;
  display: flex;
}

.bls-fund-application .modal-action-section.top {
  top: 15px;
  left:-5%;
}

.bls-fund-application .modal-action-section.top .header-text {
  color: #fff;
  position: absolute;
  top: 12px;
  left: 0;
  background-color: rgba(0, 0, 0, 0.25);
  padding: 5px 10px;
  font-size: 1.5rem;
}

.bls-fund-application .modal-action-section.bottom {
  padding: 20px 15px 30px;
  bottom: 0;
}

.bls-fund-application .modal-action-section > div {
  flex: 1;
}

.bls-fund-application .modal-action-section .btn {
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.5);
  color: #fff;
  font-size: 30px;
  position: relative;
  padding-top: 13px;
  padding-left: 15px;
  padding-right: 15px;
}

.bls-fund-application .modal-action-section .btn span {
  position: absolute;
  left: 50%;
  bottom: -20px;
  margin-left: -30px;
  font-size: 14px;
  width: 60px;
}

.bls-fund-application .modal-action-section .btn.btn-close {
  padding: 0 2px;
  font-size: 30px;
  height: 36px;
  border-radius: 50%;
  z-index: 1000;
  margin-right: -12px;
}

.bls-fund-application .modal-attachment .spinner {
  margin: 100px auto;
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -20px;
  margin-left: -25px;
}

.bls-fund-application .modal-attachment .spinner > div {
  background-color: #fff;
}

@media screen and (min-width: 768px) {
  .bls-fund-application .modal-attachment .modal-dialog {
    width: 700px;
    margin-top: 30px;
    margin-left: auto;
    margin-right: auto;
  }
}
</style>
