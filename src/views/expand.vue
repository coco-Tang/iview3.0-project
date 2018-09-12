<template>
    <Table
        :column="column"
        :data="row.list"
        @on-selection-change="getPath"
    ></Table>
</template>
<script>
export default {
    props: {
        row: Object
    },
    data() {
        return {
            column: [
                {
                    type: 'selection',
                    width: 60
                },
                {
                    title: 'hobby',
                    key: 'hobby'
                }
            ]
        }
    },
    methods: {
        getPath(row) {
            console.log('row',row);
        }
    }
}
</script>

