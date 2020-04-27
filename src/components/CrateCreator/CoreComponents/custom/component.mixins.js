export const CustomComponents = ["Organization"];

export function isCustomComponent(type) {
    return CustomComponents.includes(type);
}

export const components = {
    components: {
        OrganizationComponent: () =>
            import("./organisation/Organisation.component.vue"),
    },
};
