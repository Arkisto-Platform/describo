<template>
    <div class="flex flex-col">
        <div v-for="entry of template" :key="entry.property">
            <describe-entry-component
                :entry="entry"
                :uuid="item.uuid"
                @add="add"
            />
        </div>

        <div class="flex flex-row mt-1">
            <el-button
                @click="remove()"
                type="danger"
                class="ml-1"
                v-if="enableRemove"
            >
                <i class="fas fa-trash-alt"></i>
            </el-button>
            <div class="flex flex-grow"></div>
            <el-button
                @click="save()"
                type="success"
                size="small"
                :disabled="itemName && !itemName.data"
            >
                <i class="fas fa-check"></i>&nbsp;save
            </el-button>
        </div>
    </div>
</template>

<script>
import { updateTemplate } from "./describe-entry";
import DescribeEntryComponent from "./DescribeEntry.component.vue";
import { groupBy, flattenDeep, isArray, has, cloneDeep } from "lodash";

export default {
    components: {
        DescribeEntryComponent,
    },
    props: {
        uuid: { type: String, required: true },
        enableRemove: { type: Boolean },
    },
    data() {
        return {
            inputs: [],
            template: [],
        };
    },
    computed: {
        item: function() {
            const item = this.$store.getters.getItemById(this.uuid);
            return item;
        },
        itemName: function() {
            return this.template.filter((i) => i.property === "name")[0];
        },
    },
    watch: {
        item: {
            handler: function() {
                this.updateTemplate();
            },
            deep: true,
        },
    },
    beforeMount() {
        this.loadProfileInputs();
    },
    mounted() {
        this.updateTemplate();
    },
    methods: {
        loadProfileInputs() {
            try {
                this.inputs = this.$store.getters.getTypeDefinition(
                    this.item["@type"]
                ).inputs;
            } catch (error) {
                this.inputs = [];
            }
        },
        updateTemplate() {
            this.loadProfileInputs();
            let template = updateTemplate({
                inputs: cloneDeep(this.inputs),
                item: this.item,
                typeDefinitions: cloneDeep(this.$store.state.typeDefinitions),
            });
            this.template = template;
        },
        add(payload) {
            const type = payload.type;
            const property = payload.property;

            this.template = this.template.map((input) => {
                // find the property we're updating
                if (input.property === property) {
                    // adding a value to a simple type
                    if (input.multiple) {
                        if (!input.data) input.data = [];
                        input.data.push("");
                    } else {
                        input.data = "";
                    }
                    input.enabled = true;
                }
                return input;
            });
        },
        remove() {
            // this.$store.commit("removeFromGraph", this.item);
            this.$emit("remove");
        },
        save() {
            this.$emit("save");
        },
    },
};
</script>

<style lang="scss" scoped></style>
