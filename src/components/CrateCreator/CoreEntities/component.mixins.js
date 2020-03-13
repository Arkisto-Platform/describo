export default {
    components: {
        TextComponent: () => import("./Text.component.vue"),
        PersonComponent: () => import("./Person.component.vue"),
        OrganisationComponent: () => import("./Organisation.component.vue")
    }
};
