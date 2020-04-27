<template>
    <div
        class="flex flex-col p-1 border-l-2 border-gray-400"
        :class="{ 'border-orange-600 bg-red-200': showAlert }"
    >
        <!-- property label -->
        <div class="my-auto text-left text-sm pr-2">
            <span v-if="showAlert" class="text-orange-600">
                <i class="fas fa-asterisk"></i>
            </span>
            {{ label }}
            <div class="float-right text-xs text-gray-600" v-if="showAlert">
                This property is required.
            </div>
        </div>
        <!-- end: property label -->

        <!--  add control -->
        <add-control :template="entry" @add="add" v-if="entry.showAddControl" />
        <!--  end: add control -->

        <div v-if="entry.multiple">
            <div
                v-for="instance of entry.data"
                :key="instance.idx"
                class="my-1"
            >
                <render-item-component
                    v-if="isSimpleType(entry['@type'])"
                    class="w-full"
                    :template="entry"
                    :reference="uuid"
                    :instance="instance"
                />
            </div>
        </div>
        <div v-else>
            <render-item-component
                v-if="isSimpleType(entry['@type'])"
                class="my-1"
                :template="entry"
                :reference="uuid"
                :instance="entry"
            />
        </div>
    </div>
</template>

<script>
import { updateTemplate } from "./describe-entry";
import RenderItemComponent from "./RenderItem.component.vue";
import AddControl from "./AddControl.component.vue";
import { shortName } from "src/renderer/filters";
import { cloneDeep, isArray, isEmpty, has } from "lodash";
import { generateId } from "components/CrateCreator/tools";
import { isSimpleType } from "./component.mixins";

export default {
    components: {
        AddControl,
        RenderItemComponent,
    },
    props: {
        entry: { type: Object, required: true },
        uuid: { type: String, required: true },
    },
    data() {
        return {
            label: this.entry.label || shortName(this.entry.property),
            addItem: {},
        };
    },
    computed: {
        showAlert: function() {
            return (
                this.entry.required &&
                ((isArray(this.entry.data) && isEmpty(this.entry.data)) ||
                    !this.entry.data)
            );
        },
    },
    methods: {
        isSimpleType(type) {
            return isSimpleType(type);
        },
        add(add) {
            this.$emit("add", add);
        },
    },
};
</script>
