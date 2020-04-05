import RemoveControl from "components/CrateCreator/SectionComponents/RemoveControl.component.vue";
import { cloneDeep, debounce, isArray, isString, uniq } from "lodash";

export default {
    components: {
        RemoveControl
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
        data: {}
    },
    data() {
        return {
            value: cloneDeep(this.data),
            debouncedSave: debounce(this.save, 500),
            saved: false
        };
    },
    watch: {
        data: function() {
            this.value = cloneDeep(this.data);
        }
    },
    computed: {
        enabled: function() {
            return this.data || this.template.enabled ? true : false;
        }
    },
    methods: {
        save() {
            // console.log("save", {
            //     property: this.template.property,
            //     uuid: this.template.uuid,
            //     oldValue: this.data,
            //     newValue: this.value,
            //     reference: this.reference
            // });
            let item = this.$store.getters.getItemById(this.reference);
            const property = this.template.property;
            if (isArray(item[property])) {
                item[property].push(this.value);
                item[property] = uniq(item[property]);
            } else if (isString(item[property])) {
                item[property] = this.value;
            } else if (!item[property]) {
                item[property] = this.template.multiple
                    ? [this.value]
                    : this.value;
            }
            // console.log(JSON.stringify(item, null, 2));
            this.$store.commit("saveToGraph", item);
            this.saved = true;
            setTimeout(() => {
                this.saved = false;
            }, 1000);
            this.$emit("done");
        },
        cancel() {
            // console.log("cancel", {
            //     property: this.template.property,
            //     uuid: this.template.uuid,
            //     oldValue: this.data,
            //     newValue: this.value,
            //     reference: this.reference
            // });
            const item = this.$store.getters.getItemById(this.reference);
            const property = this.template.property;
            if (isArray(item[property])) {
                item[property] = item[property].filter(v => v !== this.data);
                item[property] = uniq(item[property]);
            } else {
                delete item[property];
            }
            // console.log(JSON.stringify(item, null, 2));
            this.$store.commit("saveToGraph", item);
            this.$emit("done");
        },
        focus() {
            this.saved = false;
        }
    }
};
