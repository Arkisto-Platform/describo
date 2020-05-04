<template>
    <div class="flex flex-col bg-teal-200 rounded p-4">
        <div class="flex flex-row border-b border-black pb-2 mb-2">
            <div>Item data report</div>
            <div class="flex-grow"></div>
            <div>
                <el-button @click="collapse = !collapse" size="mini">
                    <span v-show="collapse"
                        ><i class="fas fa-angle-down"></i
                    ></span>
                    <span v-show="!collapse"
                        ><i class="fas fa-angle-up"></i
                    ></span>
                </el-button>
            </div>
        </div>
        <div v-if="!collapse">
            <div>@type: {{ report.type }}</div>
            <div
                :class="{
                    'text-red-600': report.templateAvailable === false,
                }"
            >
                Template defined in configuration:
                {{ report.templateAvailable }}
            </div>
            <div
                :class="{
                    'text-red-600': report.extraProperties.length,
                }"
            >
                Extra properties in data (not in template):
                {{ report.extraProperties }}
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        report: {
            type: Object,
            required: true,
        },
    },
    data() {
        return {
            collapse: true,
        };
    },
};
</script>
