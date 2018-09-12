<template>
  <Modal
    title="子组件"
    :value="value"
    :draggable="true"
    @input="data => $emit('input', data)"
    width="580"
    @on-ok="ok"
    @on-cancel="cancel">
    <p slot="header">
      子组件头部{{title}}
    </p>
    <div style="text-align:center">
        <p>自定义弹框内容</p>
        <p>自定义弹框内容</p>
    </div>
    <!-- <div slot="footer">
        <Button type="primary" @click="ok">确定</Button>
        <Button type="warning" @click="cancel">取消</Button>
    </div> -->
  </Modal> 
</template>

<script>
export default {
  props: {
    value: { type: Boolean, default: false },
    title: { type: String, default: "提示" },
    // draggable: { type: Boolean, default: true },
  },
  methods: {
    ok() {
      /* 一个对话框 */
      this.$emit('on-complete', !this.value);
      /* 多个对话框 */
      // this.$emit('on-complete', !this.value, 'value1')
    },
    cancel() {
      this.$emit('on-complete', !this.value);
      // this.$emit('on-complete', !this.value, 'value1');
    }
  }
};
</script>

