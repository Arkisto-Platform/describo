<template>
    <div
        class="flex flex-col my-1 p-2"
        :class="{
            'bg-green-200': saved,
            'hover:bg-gray-200': !saved,
        }"
    >
        <div class="text-lg">@id</div>
        <div>
            <el-input
                class="w-full style-element"
                @focus="focus"
                @input="debouncedSave"
                v-model="value"
                :disabled="disabled"
            ></el-input>
        </div>
    </div>
</template>

<script>
import { debounce } from "lodash";

export default {
    props: {
        uuid: {
            type: String,
            required: true,
        },
    },
    components: {
        RenderCoreComponent: () =>
            import("./RenderCoreComponent.component.vue"),
    },
    data() {
        return {
            disabledTypes: ["File", "Dataset"],
            value: undefined,
            debouncedSave: debounce(this.save, 1500),
            saved: false,
            disabled: false,
        };
    },
    beforeMount() {
        let item = this.$store.getters.getItemById(this.uuid);
        this.value = item["@id"] ? item["@id"] : this.uuid;
        this.disabled = this.disabledTypes.includes(item["@type"]);
    },
    methods: {
        save() {
            this.saved = true;
            let item = this.$store.getters.getItemById(this.uuid);
            item["@id"] = this.value;
            this.$store.commit("saveToGraph", item);
            setTimeout(() => {
                this.saved = false;
            }, 1000);
        },
        focus() {
            this.saved = false;
        },
        setValidIdentifier(property, value) {
            return property === "@id" ? validateIdentifier(value) : value;
        },
    },
};
</script>
