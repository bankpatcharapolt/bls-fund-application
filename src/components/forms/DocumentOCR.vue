<template>
  <div>
    <div v-if="!isInitialized" class="loading-container">
      <div class="simple-spinner"></div>
    </div>
    <div v-show="isInitialized"  id="docCaptureContainer"
      style="position: relative; width: 100%; max-width: 600px; margin: 0 auto; background-color: #000;">
         <div class="styles_container__KA8u8">
      <x-dot-document-auto-capture ref="docCaptureComponent" id="doc-auto-capture" :cameraOptions="cameraOptions"></x-dot-document-auto-capture>
      <x-dot-document-auto-capture-ui id="doc-auto-capture-ui" :props="uiProps"></x-dot-document-auto-capture-ui>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  props: {
    lang: {
      type: String,
      default: "th"
    }

  },
  data() {
    
    this.$i18n.locale = this.lang;
 
    return {
      isInitialized: false,
     
      uiProps: {
        instructions: {
          document_centering: this.lang == "th"? this.$i18n.messages.th.ocr.document_centering
           : this.$i18n.messages.en.ocr.document_centering,
          document_too_close: this.lang == "th"? this.$i18n.messages.th.ocr.document_too_close
           : this.$i18n.messages.en.ocr.document_too_close,
          document_too_far: this.lang == "th"? this.$i18n.messages.th.ocr.document_too_far
           : this.$i18n.messages.en.ocr.document_too_far,
          document_not_present: this.lang == "th"? this.$i18n.messages.th.ocr.document_not_present
           : this.$i18n.messages.en.ocr.document_not_present,
          sharpness_too_low: this.lang == "th"? this.$i18n.messages.th.ocr.sharpness_too_low
           : this.$i18n.messages.en.ocr.sharpness_too_low,
          brightness_too_low:this.lang == "th"? this.$i18n.messages.th.ocr.brightness_too_low
           : this.$i18n.messages.en.ocr.brightness_too_low,
          brightness_too_high: this.lang == "th"? this.$i18n.messages.th.ocr.brightness_too_high
           : this.$i18n.messages.en.ocr.brightness_too_high,
          device_pitched: this.lang == "th"? this.$i18n.messages.th.ocr.brightness_too_high
           : this.$i18n.messages.en.ocr.device_pitched
        },
        theme: {
          colors: {
            placeholderColor: "white",
            placeholderColorSuccess: "#00BFB2",
            instructionColor: "white",
            instructionColorSuccess: "#00BFB2",
            instructionTextColor: "black",
          },
          font: {
            family: "Arial",
            style: "normal",
            weight: 600,
          },
        },
      },
     
      cameraOptions: {
 
        onPhotoTaken: this.handlePhotoTaken,
        onError: this.handleError,


      },
      capturedImageUrl: null,
      cameraStream: null,
    };
  },
  mounted() {
    this.$emit('status-changed', false);
  },
  watch: {
    lang(value) {
      this.$i18n.locale = value;
    },
  },
  methods: {
    waitForVideoElement() {
    return new Promise((resolve, reject) => {
      const timeout = 15000; // เพิ่มเวลารอเป็น 15 วินาที เผื่อกรณีที่ต้องขออนุญาตกล้องนาน
      const interval = 100;
      let elapsedTime = 0;

      const checkInterval = setInterval(() => {
        const videoElement = document.querySelector('#dot-auto-capture-video');

        // ถ้าเจอ video element แล้ว
        if (videoElement) {
          clearInterval(checkInterval); // หยุดการค้นหา

          // Handler ที่จะทำงานเมื่อวิดีโอเล่น
          const onPlaying = () => {
            console.log("Video has started playing!");
            this.isInitialized = true;
            this.$emit('status-changed', true);
            clearTimeout(playingTimeout); // ยกเลิก timeout ของการรอเล่น
            resolve();
          };
          
          // ตั้งเวลา timeout สำหรับการรอ "playing" event โดยเฉพาะ
          const playingTimeout = setTimeout(() => {
              videoElement.removeEventListener('playing', onPlaying);
              this.isInitialized = true;
              this.$emit('status-changed', true);
              reject(new Error("Timeout: Video element was found but it did not start playing."));
          }, 10000); // รอให้วิดีโอเริ่มเล่นภายใน 10 วินาทีหลังจากเจอ element

          // 1. เพิ่ม Event Listener เพื่อรอ 'playing' event
          // ใช้ { once: true } เพื่อให้ event ทำงานแค่ครั้งเดียวแล้วลบตัวเองออก
          videoElement.addEventListener('playing', onPlaying, { once: true });

          // 2. เช็คเผื่อกรณีที่วิดีโอเล่นไปแล้วก่อนที่เราจะดัก event
          if (!videoElement.paused) {
            onPlaying();
          }
          
        } else {
          elapsedTime += interval;
          if (elapsedTime >= timeout) {
            clearInterval(checkInterval);
             this.isInitialized = true;
             this.$emit('status-changed', true);
            reject(new Error("Timeout: Video element with ID 'dot-auto-capture-video' not found."));
          }
        }
      }, interval);
    });
  },


     async initializeAndFetchConfig() {
        // const response = await fetch("https://user-thinker-gw.blockfint.com/api/ekyc-pro/document-sdk-config", { 
        //   headers: {
        //     'Thinker-Gw-User': "bls-nonprod", // ใส่ username ที่ถูกต้อง
        //     "Thinker-Gw-Key":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJFeHBpcmVzQXQiOjE3NzM5OTQ0MTksIlJvbGUiOiJVc2VyIiwiVXNlcm5hbWUiOiJibHMtbm9ucHJvZCJ9.Hi3-D68aIJlnpD3p53N9VassIwpyz4HKApdcRIM2CD4"
        //   },
        // });
        // if (!response.ok) {
        //   throw new Error('Failed to fetch face SDK config');
        // }
        // const data = await response.json();
        // console.log("data:",data);

     },
    async initializeCaptureComponent() {
      const loadScripts = async () => {
        const loadScript = (src, elementName) => {
          return new Promise((resolve, reject) => {
            if (typeof window !== 'undefined' && !window.customElements.get(elementName)) {
              const script = document.createElement('script');
              script.src = src;
              script.onload = () => {
                console.log(`${elementName} loaded`);
                resolve();
              };
              script.onerror = () => {
                console.error(`Failed to load ${elementName}`);
                reject();
              };
              document.head.appendChild(script);
            } else {
              resolve();
            }
          });
        };
        try {
          const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
         
         // กำหนดค่า videoConstraints ที่เหมาะสม
          this.cameraOptions.videoConstraints = {
            video: {
              width: { min: 1280, ideal: 1920 },
              height: { min: 720, ideal: 1080 },
              facingMode: isMobile ? "environment" : "user"
            }
          };
          //this.cameraStream = await navigator.mediaDevices.getUserMedia(this.cameraOptions.videoConstraints);
    
         
          // eof

          await Promise.all([
            loadScript('dot-document-auto-capture/index.umd.js', 'x-dot-document-auto-capture'),
            loadScript('dot-auto-capture-ui/document.umd.js', 'x-dot-document-auto-capture-ui'),
          ]);

           // --- Step 2: รอจนกว่า custom elements จะพร้อมใช้งานจริงๆ ---
           
        // await Promise.all([
        //   window.customElements.whenDefined('x-dot-document-auto-capture'),
        //   window.customElements.whenDefined('x-dot-document-auto-capture-ui')
        // ]);
        
          console.log("All custom elements are defined and ready.");
          this.initDocAutoCapture();
          this.initDocAutoCaptureUI();
          await this.waitForVideoElement();
         
          
        } catch (error) {
          console.error('Failed to load one or more scripts', error);
        }
      };
      await loadScripts();

    },
    async startCamera() {
       await this.initializeCaptureComponent();
      //  try {

      //   const devices = await navigator.mediaDevices.enumerateDevices();
      //   const videoDevices = devices.filter(device => device.kind == 'videoinput');
      //   if (videoDevices.length > 0) {
      //     await this.initializeCaptureComponent();
      //   } else {
      //     alert(this.$t("warning_page_dopaselfie.warning_webcam_notfound"));
      //     return false;
      //   }
      // } catch (error) {
      //   alert(this.$t("warning_page_dopaselfie.warning_webcam_notfound"));
      //   return false;
      // }
      
    },
    async  stopAllActiveCameras() {
     
      // 
    },
      stopCamera() {
 
        
      const captureElement = this.$refs.docCaptureComponent;
      if (captureElement && typeof captureElement.stopStreaming === 'function') {
        captureElement.stopStreaming();
        console.log("Web Component camera stopped successfully.");
      } else {
        
        this.stopAllActiveCameras();
      }
    },
   
    initDocAutoCapture() {
      const el = document.getElementById("doc-auto-capture");
      if (el) {
        el.cameraOptions = this.cameraOptions;
      }
    },
    initDocAutoCaptureUI() {
      const el = document.getElementById("doc-auto-capture-ui");
      if (el) {
        el.props = this.uiProps;
      
      }
    },
    // handlePhotoTaken({ image }) {
    //   this.$emit('photoTaken', image);
    // },
     handlePhotoTaken({ image, data }) {
     
     // if (!data || !data.detection || !data.detection.topLeft) {
     console.log(data);
        console.error("Document detection data is not available. Emitting full frame image.");
        this.$emit('photoTaken', image);
        return;
      //}
      
      // const { topLeft, topRight, bottomLeft, bottomRight } = data.detection;
      
      // // Calculate the bounding box from the four corners
      // const minX = Math.min(topLeft.x, topRight.x, bottomLeft.x, bottomRight.x);
      // const minY = Math.min(topLeft.y, topRight.y, bottomLeft.y, bottomRight.y);
      // const maxX = Math.max(topLeft.x, topRight.x, bottomLeft.x, bottomRight.x);
      // const maxY = Math.max(topLeft.y, topRight.y, bottomLeft.y, bottomRight.y);
      
      // const x = minX;
      // const y = minY;
      // const width = maxX - minX;
      // const height = maxY - minY;

      // const canvas = document.createElement('canvas');
      // const ctx = canvas.getContext('2d');
      // const img = new Image();
      
      // img.onload = () => {
      //   canvas.width = width;
      //   canvas.height = height;
        
      //   // Draw the cropped portion of the image onto the canvas
      //   ctx.drawImage(img, x, y, width, height, 0, 0, width, height);
        
      //   canvas.toBlob((croppedImageBlob) => {
      //     this.$emit('photoTaken', croppedImageBlob);
      //     URL.revokeObjectURL(img.src);
      //   }, 'image/jpeg', 0.9);
      // };
      
      // img.src = URL.createObjectURL(image);
    },
    handleError(error) {
      console.error("Error:", error);
    },

  },
  beforeDestroy() {

     // this.stopCamera();
    if (this.capturedImageUrl) {
      URL.revokeObjectURL(this.capturedImageUrl);
    }
  },
};
</script>

<style scoped>
/* Container เดิมของคุณ */
.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  max-width: 600px;
  height: 300px;
  margin: 0 auto;
  background-color:transparent;
  border: 1px solid transparent;
}

/* Spinner CSS */
.simple-spinner {
  width: 50px;
  height: 50px;
  border: 5px solid #e0e0e0; /* สีวงกลมพื้นหลัง */
  border-top: 5px solid #3498db; /* สีส่วนที่หมุน */
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
.styles_container__KA8u8 {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  /* เต็มความกว้างของ #captureContainer */
  height: 100%;
  /* เต็มความสูงของ #captureContainer */
  background-color: black;
  position: relative;
  overflow: hidden;
  /* ซ่อนส่วนที่เกิน */
}

/* ในไฟล์ CSS หลักของคุณ (เช่น main.css หรือ app.css) */
video {
  position: relative !important;
  width: 100%;
  height: 100%;
}

#captureContainer {
  position: relative;
  width: 100%;
  /* max-width: 400px; */
  /* กำหนดความสูงที่ต้องการ หรือความสูงสูงสุด */
  height: 100%;
  /* ลองกำหนดความสูง */
  /* หรือ */
  /* max-height: 400px; */
  margin: 0 auto;
  background-color: #000;
  overflow: hidden;
  /* ซ่อนส่วนที่เกิน */
}

face-camera,
face-ui {
  display: block;
  width: 100%;
  height: 100%;
}

#capturedImage {
  display: block;
  width: 100%;
  max-width: 400px;
  margin: 20px auto 0;
  border: 1px solid #ccc;
}
</style>