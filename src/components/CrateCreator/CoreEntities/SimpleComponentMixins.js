import AddControl from "components/CrateCreator/SectionComponents/AddControl.component.vue";
import { debounce } from "lodash";

export default {
    components: {
        AddControl
    },
    props: {
        input: {
            type: Object
        }
    },
    data() {
        return {
            debouncedSave: debounce(this.save, 500),
            saved: false,
            value: this.input.value,
            enabled: this.input.value ? true : false
        };
    },
    methods: {
        save() {
            this.$emit("save", this.value);
            this.saved = true;
            setTimeout(() => {
                this.saved = false;
            }, 1000);
        },
        focus() {
            this.saved = false;
        },
        add() {
            this.enabled = true;
        }
    }
};
