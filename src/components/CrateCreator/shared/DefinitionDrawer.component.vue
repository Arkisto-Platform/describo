<template>
    <el-drawer
        :with-header="false"
        :visible="drawer"
        direction="rtl"
        size="50%"
        :modal="false"
        @close="$emit('close')"
    >
        <div class="style-frame">
            <iframe
                :src="url"
                class="w-full h-full overflow-scroll"
                v-if="url"
            ></iframe>
            <div
                class="flex flex-col bg-gray-200 p-4 w-full h-full text-gray-700 "
                v-if="definition"
            >
                <div class="text-xl font-light">
                    {{ definition.name }}
                </div>
                <div class="text-lg" v-if="definition.description">
                    {{ definition.description }}
                </div>
                <div v-else>
                    A definition has not been provided for this property.
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
        url: {
            type: String,
        },
        definition: {
            type: Object,
        },
    },
    data() {
        return {};
    },
    methods: {},
};
</script>

<style lang="scss" scoped>
.style-frame {
    height: 100vh;
    width: 100%;
}
</style>
