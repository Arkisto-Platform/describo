export const SimpleTypes = ["Value", "Text", "TextArea", "Select", "Date"];
export const CustomComponents = ["Organisation"];

export function isSimpleType(type) {
    return SimpleTypes.includes(type);
}

export function isCustomComponent(type) {
    return CustomComponents.includes(type);
}

export const components = {
    components: {
        DateComponent: () =>
            import("components/CrateCreator/CoreEntities/Date.component.vue"),
        SelectComponent: () =>
            import("components/CrateCreator/CoreEntities/Select.component.vue"),
        TextAreaComponent: () =>
            import(
                "components/CrateCreator/CoreEntities/TextArea.component.vue"
            ),
        TextComponent: () =>
            import("components/CrateCreator/CoreEntities/Text.component.vue"),
        ValueComponent: () =>
            import("components/CrateCreator/CoreEntities/Value.component.vue"),
    },
};

export const customComponents = {
    components: {
        OrganisationComponent: () =>
            import(
                "components/CrateCreator/CoreEntities/organisation/Organisation.component.vue"
            ),
    },
};
