<template>
    <div class="flex flex-row">
        <div
            class="flex flex-col bg-yellow-200 rounded-lg p-2"
            v-if="item.uuid"
        >
            <div class="flex flex-row">
                <div>@id: {{ item.uuid }}</div>
                <div class="ml-2">
                    <i class="fas fa-long-arrow-alt-right"></i>
                    {{ property }}
                </div>
            </div>
            <div>@type: {{ item["@type"] }}</div>
            <div>name: {{ item.name }}</div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        property: {
            type: String,
            required: true,
        },
        itemId: {
            type: String,
            required: true,
        },
        parentId: {
            type: String,
            required: true,
        },
    },
    computed: {
        item: function() {
            return this.$store.getters.getItemById(this.parentId);
        },
    },
    data() {
        return {};
    },
};
</script>
