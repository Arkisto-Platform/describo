export default {
    components: {
        PersonComponent: () => import("./Person.component.vue"),
        OrganisationComponent: () => import("./Organisation.component.vue")
    }
};
