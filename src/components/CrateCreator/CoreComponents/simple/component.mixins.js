export const SimpleTypes = ["Value", "Text", "TextArea", "Select", "Date"];

export function isSimpleType(type) {
    return SimpleTypes.includes(type);
}

export const components = {
    components: {
        DateComponent: () => import("./Date.component.vue"),
        SelectComponent: () => import("./Select.component.vue"),
        TextAreaComponent: () => import("./TextArea.component.vue"),
        TextComponent: () => import("./Text.component.vue"),
        ValueComponent: () => import("./Value.component.vue"),
    },
};
