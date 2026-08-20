<template>
  <div class="preview-image-container">
    <button class="preview-image-button" @click.prevent="showModal = true">
      <img :src="value" class="img-responsive" />
    </button>

    <modal
      v-model="showModal"
      :header="false"
      :footer="false"
      :transition-duration="0"
      class="modal-attachment modal-view-photo"
      ref="modal"
    >
      <img :src="value" class="img-responsive" />

      <div class="modal-action-section top" >
        <div class="text-right">
          <button type="button" class="btn btn-close" style="top:18px;left:-15px;">
            <i
              class="glyphicon glyphicon-remove-circle"
              aria-hidden="true"
              @click="showModal = false"
            ></i>
          </button>
        </div>
      </div>
    </modal>
  </div>
</template>

<script>
import Modal from "uiv/dist/Modal";

export default {
  name: "ViewPhotoButton",

  props: {
    value: {
      type: String,
      default: "",
    },
  },

  data() {
    return {
      showModal: false,
    };
  },

  methods: {
    openModal() {
      this.showModal = true;
    },
  },

  components: {
    Modal,
  },
};
</script>

<style>
.preview-image-container {
  clear: both;
  display: block;
  width: 100%;
}

.preview-image-container .preview-image-button {
  border: 1px solid #ddd;
  background-color: #fff;
  border-radius: 4px;
  outline: none;
  padding: 4px;
}

.modal-view-image {
  background-color: #000;
}

.modal-view-image .modal-dialog {
  width: calc(100vw - 20px);
  margin: 10px;
}

.modal-view-image .modal-content {
  border-radius: 0;
  background-color: #000;
}

.modal-view-image .modal-body {
  padding: 0;
}

.modal-view-photo .modal-body img {
  width: 100%;
}

.modal-action-section {
  position: absolute;

  left: 0;
  width: 100%;
  display: flex;
}

.modal-action-section.top {
  top: -12px;
}

.modal-action-section.bottom {
  padding: 20px 15px 30px;
  bottom: 0;
}

.modal-action-section > div {
  flex: 1;
}

.modal-action-section .btn {
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.5);
  color: #fff;
  font-size: 30px;
  position: relative;
  padding-top: 13px;
  padding-left: 15px;
  padding-right: 15px;
}

.modal-action-section .btn span {
  position: absolute;
  left: 50%;
  bottom: -20px;
  margin-left: -30px;
  font-size: 14px;
  width: 60px;
}

.modal-action-section .btn.btn-close {
  padding: 0 2px;
  font-size: 30px;
  height: 36px;
  border-radius: 50%;
  z-index: 1000;
  margin-right: -12px;
}

@media screen and (min-width: 768px) {
  .modal-view-image .modal-dialog {
    width: 700px;
    margin-top: 30px;
    margin-left: auto;
    margin-right: auto;
  }
}
</style>
