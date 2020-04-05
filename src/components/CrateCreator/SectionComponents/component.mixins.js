export const SimpleTypes = ["Value", "Text", "TextArea", "Select", "Date"];
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
        CompoundComponent: () =>
            import(
                "components/CrateCreator/CoreEntities/Compound.component.vue"
            ),
        PersonComponent: () =>
            import(
                "components/CrateCreator/CoreEntities/person/Person.component.vue"
            ),
        OrganisationComponent: () =>
            import(
                "components/CrateCreator/CoreEntities/organisation/Organisation.component.vue"
            )
    }
};
