<template>
  <button
    :class="[buttonStyle]"
    @focus="preventFocus"
    @click="openUploader">

    {{ buttonText }}
  </button>
</template>

<script>
  import Uppy from 'uppy/lib/core';
  import Dashboard from 'uppy/lib/plugins/Dashboard';
  import Webcam from 'uppy/lib/plugins/Webcam';
  /* eslint-disable no-unused-vars */
  import 'uppy/dist/uppy.min.css';

  const BASE_URL = 'https://api.cloudinary.com/v1_1/';
  const POSTFIX = '/auto/upload';

  const DE_LOCALES = {
    closeModal: 'Fenster schließen',
    // Used as the header for import panels, e.g
    importFrom: 'Import from',
    dashboardWindowTitle: 'Uppy Dashboard Window (Press escape to close)',
    dashboardTitle: 'Uppy Dashboard',
    copyLinkToClipboardSuccess: 'Link kopiert',
    // input element below this string.
    copyLinkToClipboardFallback: 'Kopiere die URL von unten',
    // Used as the hover title and screen reader label for buttons that copy a file link.
    copyLink: 'Link kopieren',
    fileSource: 'Dateiquelle: %{name}',
    done: 'Fertig',
    removeFile: 'Datei entfernen',
    // Used as the screen reader label for buttons that open the metadata editor panel for a file.
    editFile: 'Datei bearbeiten',
    // Shown in the panel header for the metadata editor. Rendered as "Editing image.png".
    editing: 'Bearbeiten',
    // Used as the screen reader label for the button that saves metadata edits and returns to the
    // file list view.
    finishEditingFile: 'Bearbeitung abgeschlossen',
    // Used as the label for the tab button that opens the system file selection dialog.
    myDevice: 'Mein Computer',
    // Shown in the main dashboard area when no files have been selected, and one or more
    // remote provider plugins are in use. %{browse} is replaced with a link that opens the system
    // file selection dialog.
    dropPasteImport: 'Ziehe Dateien hier her, importiere sie oben über die möglichen Quellen oder klicke',
    // Shown in the main dashboard area when no files have been selected, and no provider
    // plugins are in use. %{browse} is replaced with a link that opens the system
    // file selection dialog.
    dropPaste: 'Dateien hier einfügen, oder %{browse}',
    // This string is clickable and opens the system file selection dialog.
    browse: 'dursuchen',
    // Used as the hover text and screen reader label for file progress indicators when
    // they have been fully uploaded.
    uploadComplete: 'Hochladen abgeschlossen',
    // Used as the hover text and screen reader label for the buttons to resume paused uploads.
    resumeUpload: 'Hochladen fortsetzen',
    // Used as the hover text and screen reader label for the buttons to pause uploads.
    uploading: 'Hochladen',
    // Shown in the status bar once all files have been uploaded.
    complete: 'Hochladen abgeschlossen',
    // Shown in the status bar if an upload failed.
    uploadFailed: 'Hochladen fehlgeschlagen',
    // Shown next to `uploadFailed`.
    pleasePressRetry: 'Bitte wiederholen klicken, um erneut hochzuladen',
    // Shown in the status bar while the upload is paused.
    paused: 'Pausiert',
    error: 'Fehler',
    retry: 'Wiederholen',
    // Used as the label for the button that cancels an upload.
    cancel: 'Abbruch',
    retryUpload: 'Erneut Hochladen',
    pauseUpload: 'Hochladen pausiert',
    // Used as the screen reader label for the button that resumes a paused upload.
    cancelUpload: 'Hochladen abbrechen',
    filesUploadedOfTotal: {
      0: '%{complete} of %{smart_count} Datei hochgeladen',
      1: '%{complete} of %{smart_count} Dateien hochgeladen',
    },
    dataUploadedOfTotal: '%{complete} of %{total}',
    xTimeLeft: '%{time} verbleibende Zeit',
    // Used as the label for the button that starts an upload.
    uploadXFiles: {
      0: '%{smart_count} Datei Hochladen',
      1: '%{smart_count} Dateien Hochladen',
    },
    uploadXNewFiles: {
      0: '+%{smart_count} Datei Hochladen',
      1: '+%{smart_count} Dateien Hochladen',
    },
    dropHereOr: 'Ziehe Dateien hier her or %{browse}',
    // Used as the label for the link that opens the system file selection dialog.
    chooseFiles: 'Dateien auswählen',
    // Shown before a picture is taken when the `countdown` option is set.
    smile: 'Smile!',
    // Used as the label for the button that takes a picture.
    // This is not visibly rendered but is picked up by screen readers.
    takePicture: 'Take a picture',
    // Used as the label for the button that starts a video recording.
    // This is not visibly rendered but is picked up by screen readers.
    startRecording: 'Begin video recording',
    // Used as the label for the button that stops a video recording.
    // This is not visibly rendered but is picked up by screen readers.
    stopRecording: 'Stop video recording',
    // Title on the “allow access” screen
    allowAccessTitle: 'Please allow access to your camera3',
  };

  export default {
    props: {
      cloudName: {
        type: String,
        required: true,
      },

      locales: {
        type: Object,
        required: false,
      },

      buttonText: {
        type: String,
        default: 'Upload',
      },

      minNumberOfFiles: {
        type: Number,
        default: 1,
      },

      maxNumberOfFiles: {
        type: Number,
        default: 10,
      },

      maxFileSize: {
        type: Number,
        default: 40000000,
      },

      allowedFileTypes: {
        type: Array,
        default() {
          return ['image/*', 'video/*'];
        },
      },

      autoProceed: {
        type: Boolean,
        default: false,
      },

      autoClose: {
        type: Boolean,
        default: true,
      },

      showProgressDetails: {
        type: Boolean,
        default: true,
      },

      closeModalOnClickOutside: {
        type: Boolean,
        default: true,
      },

      buttonStyle: {
        type: String,
        default: 'uploader',
      },

      signRequest: {
        type: Function,
      },

      options: {
        type: Object,
        required: true,
      },
    },

    data() {
      return {
        uppy: {},
      };
    },

    mounted() {
      this.uppy = this.createUppyInstance();
      this.uppy.on('complete', this.completeHandler);
    },

    methods: {
      // Opens the upload dialog
      openUploader() {
        this.uppy.getPlugin('Dashboard').openModal();
      },

      // Closes the upload dialog
      closeUploader() {
        this.uppy.getPlugin('Dashboard').closeModal();
      },

      // Uploads a single file
      uploadFile(file, options, isLastFile) {
        const formData = new FormData();
        const xhr = new XMLHttpRequest();

        formData.append('file', file.data);
        this.appendFormDataParams(formData, options);

        xhr.upload.addEventListener('loadstart', () => {
          this.uppy.emit('upload-started', file.id);
        });

        xhr.addEventListener('load', (ev) => {
          if (ev.target.status === 200) {
            this.$emit('uploaded', JSON.parse(ev.target.response));
            this.uppy.emit('upload-success', file.id);
            if (isLastFile && this.autoClose) { setTimeout(this.closeUploader, 500); }
          } else {
            this.uppy.emit('upload-error', file.id, new Error('Failed to upload'));
          }
        });

        xhr.addEventListener('error', () => {
          this.uppy.emit('upload-error', file.id, new Error('Failed to upload'));
        });

        xhr.upload.addEventListener('progress', (ev) => {
          if (ev.lengthComputable) {
            const progressData = {
              uploader: this,
              id: file.id,
              bytesUploaded: ev.loaded,
              bytesTotal: ev.total,
            };
            this.uppy.emit('upload-progress', progressData);
            this.$emit('upload-progress', progressData);
          }
        });

        xhr.open('POST', `${BASE_URL}${this.cloudName}${POSTFIX}`);
        xhr.send(formData);
      },

      // Create an instance of Uppy.io
      createUppyInstance() {
        return Uppy({
          autoProceed: this.autoProceed,
          restrictions: {
            maxFileSize: this.maxFileSize,
            maxNumberOfFiles: this.maxNumberOfFiles,
            minNumberOfFiles: this.minNumberOfFiles,
            allowedFileTypes: this.allowedFileTypes,
          },
        })
          .use(Dashboard, {
            target: 'body',
            showProgressDetails: this.showProgressDetails,
            closeModalOnClickOutside: this.closeModalOnClickOutside,
            locale: {
              strings: DE_LOCALES,
            },
          })
          .use(Webcam, {
            target: Dashboard,
            locale: {
              strings: DE_LOCALES,
            },
          })
          .run();
      },

      // Complete handler for Uppy
      completeHandler(result) {
        (async () => {
          let options = null;
          const filesLength = result.successful.length;
          if (this.options.type !== undefined) {
            const response = await this.signRequest(this.options);
            options = response.data;
          }
          result.successful.forEach((file, index) => {
            this.uploadFile(file, options || this.options, filesLength === index + 1);
          });
        })();
      },

      appendFormDataParams(formData, params) {
        Object.keys(params).forEach((key) => {
          formData.append(key, params[key]);
        });
      },

      preventFocus(event) {
        event.srcElement.blur();
        event.preventDefault();
      },
    },
  };
</script>

<style scoped>
  .uploader {
    text-decoration: none;
    color: #fff;
    background-color: #26a69a;
    text-align: center;
    letter-spacing: 0.5px;
    -webkit-transition: 0.2s ease-out;
    transition: 0.2s ease-out;
    cursor: pointer;
    font-size: 1rem;
    outline: 0;
    border: none;
    border-radius: 2px;
    display: inline-block;
    height: 36px;
    line-height: 36px;
    padding: 0 2rem;
    text-transform: uppercase;
    vertical-align: middle;
    -webkit-tap-highlight-color: transparent;
  }
</style>
