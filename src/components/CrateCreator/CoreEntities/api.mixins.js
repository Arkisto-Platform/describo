export default {
    props: {
        input: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            properties: {
                visible: false
            }
        };
    },
    methods: {
        cancel() {
            this.$emit("cancel", this.properties.id);
            this.properties.visible = false;
        }
    }
};
