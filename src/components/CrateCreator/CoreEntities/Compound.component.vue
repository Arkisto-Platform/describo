<template>
    <div>
        <!-- <pre>{{ data }}</pre> -->
        <!-- <pre>{{ template }}</pre> -->
        <div>
            <div class="flex flex-row flex-wrap">
                <render-item-component
                    class="my-1 mr-1"
                    v-for="item of data"
                    :key="item"
                    :template="template"
                    :reference="reference"
                    :data="item"
                    @done="$emit('done')"
                />
            </div>
        </div>
    </div>
</template>

<script>
import RenderItemComponent from "components/CrateCreator/SectionComponents/RenderItem.component.vue";
import { generateId } from "components/CrateCreator/tools";
import { cloneDeep } from "lodash";

export default {
    components: {
        RenderItemComponent
    },
    props: {
        template: {
            type: Object,
            required: true
        },
        reference: {
            type: String,
            required: true
        },
        data: {
            type: String | Array | Object | undefined
        }
    },
    data() {
        return {};
    }
};
</script>

<style lang="scss" scoped></style>
