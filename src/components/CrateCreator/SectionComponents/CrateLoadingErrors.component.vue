<template>
    <el-drawer
        :with-header="false"
        :visible="drawer"
        direction="rtl"
        size="50%"
        @close="$emit('close')"
    >
        <div class="flex flex-col bg-gray-200 h-full overflow-scroll">
            <div class="m-4">
                <div class="text-xl my-2">Crate Loading Errors</div>
                <div class="p-4 rounded style-content-area overflow-scroll">
                    <ol>
                        <li
                            :value="idx"
                            v-for="(error, idx) of errors"
                            :key="idx"
                            class="text-sm my-2"
                        >
                            {{ error }}
                        </li>
                    </ol>
                </div>
            </div>
        </div>
    </el-drawer>
</template>

<script>
export default {
    props: {
        drawer: {
            type: Boolean,
            required: true,
        },
        errors: {
            type: Array,
            required: true,
        },
    },
    data() {
        return {};
    },
    methods: {},
};
</script>

<style lang="scss" scoped>
.style-content-area {
    height: calc(100vh - 150px);
}
</style>
