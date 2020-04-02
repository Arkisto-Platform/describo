export default {
    components: {
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
