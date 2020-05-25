import { cloneDeep, debounce, isArray, isString, uniq } from "lodash";
import { validateIdentifier } from "components/CrateCreator/tools";

export default {
    props: {
        template: {
            type: Object,
            required: true,
        },
        reference: {
            type: String,
            required: true,
        },
    },
    data() {
        return {
            value: cloneDeep(this.template.data),
            debouncedSave: debounce(this.save, 1500),
            saved: false,
        };
    },
    watch: {
        data: function() {
            this.value = cloneDeep(this.data);
        },
    },
    computed: {
        enabled: function() {
            return this.data || this.template.enabled ? true : false;
        },
    },
    methods: {
        save() {
            let item = this.$store.getters.getItemById(this.reference);
            const property = this.template.property;
            if (isArray(item[property])) {
                item[property] = item[property].map((v) => {
                    if (v === this.template.data)
                        return this.setValidIdentifier(property, this.value);
                    return v;
                });
                item[property].push(
                    this.setValidIdentifier(property, this.value)
                );
                item[property] = uniq(item[property]);
            } else if (isString(item[property])) {
                item[property] = this.setValidIdentifier(property, this.value);
            } else if (!item[property]) {
                item[property] = this.template.multiple
                    ? [this.setValidIdentifier(property, this.value)]
                    : this.setValidIdentifier(property, this.value);
            }
            this.$store.commit("saveToGraph", item);
            this.$emit("done");
        },
        focus() {
            this.saved = false;
        },
        setValidIdentifier(property, value) {
            return property === "@id" ? validateIdentifier(value) : value;
        },
    },
};
