<template>
<!-- <div>{{row.list}}</div> -->
    <Table
        :columns="columns"
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
            columns: [
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
            console.log('row',this.row);
        }
    }
}
</script>

