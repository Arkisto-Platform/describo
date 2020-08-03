<template>
    <div class="flex flex-col">
        <div v-if="template.length">
            <render-profile-report-component
                :report="report"
                v-if="
                    !report.templateAvailable || report.extraProperties.length
                "
            />

            <!-- The special @id component -->
            <render-id-input-component :uuid="uuid" />

            <!-- render the items in the template -->
            <div v-for="input in template" :key="input.property">
                <render-profile-input-component
                    :input="input"
                    :container="container"
                    :show="showAllProperties"
                    @add="add"
                    v-if="input.property !== '@id'"
                />
            </div>

            <div class="flex flex-row justify-center my-4">
                <el-button
                    class="flex-grow focus:outline-none focus:border-2 focus:border-blue-600"
                    type="primary"
                    @click="showAllProperties = !showAllProperties"
                    v-if="!showAllProperties"
                >
                    Show all available properties
                </el-button>
            </div>
        </div>
    </div>
</template>

<script>
import { updateTemplate } from "./describe-entry";
import {
    cloneDeep,
    isArray,
    isPlainObject,
    isString,
    isEmpty,
    difference,
    has,
} from "lodash";
import RenderProfileReportComponent from "./RenderProfileReport.component.vue";
import { isSimpleType } from "components/CrateCreator/CoreComponents/simple/component.mixins";
import { generateId } from "components/CrateCreator/tools";

export default {
    components: {
        RenderIdInputComponent: () => import("./RenderIdInput.component.vue"),
        RenderProfileInputComponent: () =>
            import("./RenderProfileInput.component.vue"),
        RenderProfileReportComponent,
    },
    props: {
        uuid: {
            type: String,
            required: true,
        },
    },
    data() {
        return {
            typeDefinition: [],
            report: {},
            template: [],
            showAllProperties: false,
            view: {
                definitionDrawer: false,
                property: undefined,
            },
        };
    },
    computed: {
        container: function() {
            return this.$store.getters.getItemById(this.uuid);
        },
    },
    watch: {
        container: {
            handler: function() {
                this.updateTemplate();
            },
            deep: true,
        },
        uuid: function() {
            this.template = [];
            this.$nextTick(() => {
                this.loadProfileInputs();
                this.updateTemplate();
            });
        },
    },
    beforeMount() {
        this.loadProfileInputs();
        this.updateTemplate();
    },
    methods: {
        loadProfileInputs() {
            const container = this.$store.getters.getItemById(this.uuid);
            let type = container["@type"];
            if (isArray(type)) {
                const mappings = this.$store.state.mappings;
                const stringifiedType = type.sort().join(", ");
                if (has(mappings, stringifiedType)) {
                    type = mappings[stringifiedType];
                } else {
                    if (type.includes("Dataset")) {
                        type = "Dataset";
                    } else if (type.includes("File")) {
                        type = "File";
                    } else {
                        type = stringifiedType;
                    }
                }
            }
            if (type === "RootDataset") {
                this.typeDefinition = this.$store.getters.getActiveProfileDefinition();
            } else {
                this.typeDefinition = this.$store.getters.getTypeDefinition(
                    type
                );
            }
        },
        updateTemplate() {
            // if no inputs are defined we want to just show the data pack selector
            if (
                !this.typeDefinition.inputs ||
                !this.typeDefinition.inputs.length
            )
                return;

            // otherwise if inputs are defined - assemble the template for the profile renderer
            let { template, report } = updateTemplate({
                item: this.container,
                typeDefinition: cloneDeep(this.typeDefinition),
            });
            this.report = report;
            this.template = template;
        },
        add({ type, property }) {
            this.template = this.template.map((item) => {
                if (item.property === property) {
                    if (isSimpleType(type)) {
                        if (item.multiple) {
                            item.data.push("");
                        } else {
                            item.data = "";
                        }
                        item.enabled = true;
                    } else {
                        this.$emit("link-item");
                        let item = {
                            "@type": type,
                            uuid: generateId(),
                        };
                        this.$store.commit("saveToGraph", item);
                        this.$store.commit("addNewItem", {
                            itemId: item.uuid,
                            parentId: this.uuid,
                            property,
                        });
                    }
                }
                return item;
            });
        },
    },
};
</script>
