<template>
  <iframe
    width="100%"
    :style="{ height: iframeHeight + 'px', border: 'none' }"
    ref="iframe"
    @load="resizeIframe"
  ></iframe>
</template>

<script>
export default {
  data() {
    return {
      iframeHeight: 500, // 初始高度，可以根据需要调整
    };
  },
  methods: {
    resizeIframe() {
      const iframe = this.$refs.iframe;
      if (iframe) {
        try {
          const body = iframe.contentDocument?.window;
          if (body) {
            // 延迟读取，确保内容加载完成
            setTimeout(() => {
              const height = body.innerHeight;
              console.log("body.scrollHeight:", height);
              if (height === 0) {
                console.log("body.scrollHeight is 0");
                console.log("iframe", iframe.contentWindow.document);
                this.iframeHeight = 600; // fallback 高度
              } else {
                this.iframeHeight = height;
              }
            }, 300);
          } else {
            this.iframeHeight = 800;
          }
        } catch (e) {
          console.error("无法获取 iframe 内容的高度:", e);
        }
      }
    },
    handleWindowResize(){
      this.resizeIframe()
    }
  },
  mounted() {
    window.addEventListener('resize', this.handleWindowResize)
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.handleWindowResize)
  }
};
</script>
<style scoped>
iframe body {
  min-height: 500px;
}
</style>
