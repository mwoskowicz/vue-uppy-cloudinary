<template>
  <div id="app">
    <h1>Demo</h1>
    <uppy-cloudinary-uploader
      preset="b0gbylpo"
      cloudName="lthekxbe9"
      :options="{ upload_preset: 'pmq4e1qp',
  type: 'private',
  use_filename: true,
  unique_filename: true,
  timestamp: Date.now() / 1000 | 0, }"
    />
  </div>
</template>

<script>
import UppyCloudinaryUploader from './components/UppyCloudinaryUploader';

export default {

  name: 'app',
  components: {
    UppyCloudinaryUploader,
  },
};
</script>
