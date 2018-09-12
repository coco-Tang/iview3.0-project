<template>
        <!-- @input="data => $emit('input', data)" -->
    <Form
        ref="form"
        :model="form"
        :rules="rules"
        >
        <FormItem label="姓名">
            <Input v-model="form.name" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="Enter something..." :disabled="!show"></Input>
        </FormItem>
        <FormItem label="年龄">
            <Input v-model="form.age" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="Enter something..." :disabled="!show"></Input>
        </FormItem>
        <FormItem label="性别">
            <Input v-model="form.gender" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="Enter something..." :disabled="!show"></Input>
        </FormItem>
        <FormItem label="爱好">
            <Input v-model="form.hobby" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="Enter something..." :disabled="!show"></Input>
        </FormItem>
        <FormItem v-show="show">
            <Button type="primary" @click="submit(form.id)">保存修改</Button>
        </FormItem>
    </Form>
</template>
<script>
export default {
    data () {
        return {
            rules: {}
        }
    },
    props: {
        form: { type: Object, default: () => {} },
        show: { type: Boolean, default: false },
    },
    methods: {
        submit (id) {
            // console.log('id',id);
            // console.log('form',this.form);
            let formData = this.form;
            let data = { id, formData };
            this.$emit('saveFormInfo', data);

        }
    }
}
</script>

