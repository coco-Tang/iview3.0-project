<template>
    <Modal
            v-model="isShow"
            :width="width"
            :title="title"
            :closable="false"
            :mask-closable="false">
        <slot name="content"></slot>
        <div slot="footer" class="modalFooterStyle">
            <div>
                <Button type="success" :loading="loading" @click="submit">确认</Button>
                <Button class="cancelButton" @click="cancel">取消</Button>
            </div>
        </div>
    </Modal>
</template>
<script>
export default {
    name: 'ModalBlock',
    props: {
        isShow: {
            type: Boolean,
            default: false
        },
        title: {
            type: String
        },
        width: {
            type: Number
        },
        loading: {
            type: Boolean,
            default: false
        },
        WarnMsg: {
            type: String
        }
    },
    methods: {
        cancel: function () {
            this.$emit('cancel');
        },
        submit () {
            this.$emit('submit');
        }
 
    }
}
</script>
