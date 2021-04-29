<template>
  <div
    class="stream-player"
    :class="autoplay ? 'autoplay' : ''"
    :id="domId"
  ></div>
</template>

<script>
// @ts-nocheck
/* eslint-disable */
import { mapActions, mapGetters, mapState } from "vuex";
import { Icon, Notify } from "vant";

export default {
  components: {
    //vIcon:Icon
  },
  props: {
    stream: {
      type: Object,
      default: false,
    },
    domId: {
      type: String,
      default: "",
    },
    uid: {
      type: Number,
      default: "",
    },
  },
  data() {
    return {
      resume: false,
      autoplay: false,
    };
  },

  created() {
    //this.watchCallback()
  },
  mounted() {
    this.$nextTick(function() {
      if (this.stream && !this.stream.isPlaying()) {
        this.stream.play(`${this.domId}`, { fit: "cover" }, (err) => {
          if (err && err.status !== "aborted") {
            console.warn("trigger autoplay policy");
          }
        });
      }
    });
  },
  beforeDestroy() {
    if (this.stream) {
      if (this.stream.isPlaying()) {
        this.stream.stop();
      }
      this.stream.close();
    }
  },
  computed: {},
  methods: {
    handleClick() {
      if (this.autoplay && !this.resume) {
        this.stream.resume();
        this.resume = true;
      }
    },
    handleDoubleClick(e) {
      e.stopPropagation();
      this.$emit("onDoubleClick", stream);
    },
  },
};
</script>
<style lang="scss" scoped>
.stream-player {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
}
</style>
