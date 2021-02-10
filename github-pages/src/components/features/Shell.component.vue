<template>
    <div class="flex flex-col space-y-4 md:space-y-10 my-10">
        <div class="text-xl lg:text-4xl text-center">
            Features
            <span class="inline-block text-lg">(click on an image to expand)</span>
        </div>
        <div v-for="(item, idx) of items" :key="idx">
            <render-feature-component :item="item" />
        </div>
    </div>
</template>

<script>
import RenderFeatureComponent from "./RenderFeature.component.vue";

export default {
    components: {
        RenderFeatureComponent,
    },
    data() {
        return {
            expandImage: false,
            items: [
                {
                    image: "images/onboarding.png",
                    text: "Built in help to get you going quickly.",
                },
                {
                    image: "images/create-person.png",
                    text: "Entity type definitions like Person, Organization and many others.",
                },
                {
                    image: "images/create-organization.png",
                    text: "Create and attach entities to properties.",
                },
                {
                    image: "images/lookup-organization-in-ror.png",
                    text: "Lookup organizations in the Research Organization Registry (ROR).",
                },
                {
                    image: "images/add-content1.png",
                    text: "Manage crate data with the easy to use file selector.",
                },
                {
                    image: "images/add-content2.png",
                    text: "Browse the content of your crate.",
                },
                {
                    image: "images/add-content3.png",
                    text: "Edit Dataset and File properties.",
                },
                {
                    image: "images/add-content4.png",
                    text: "See and manage items linked from this item. ",
                },
                {
                    image: "images/add-content5.png",
                    text: "See how this item is linked to other entries. ",
                },
                {
                    image: "images/add-content6.png",
                    text: "Built in previews of image, audio, video and xml formats.",
                },
                {
                    image: "images/errors.png",
                    text: "Get notified when you haven't populated a required property.",
                },
                {
                    image: "images/inspect-data.png",
                    text: "Inspect the data you're creating.",
                },
                {
                    image: "images/export-data.png",
                    text:
                        "Export your crate as a zip file. Bonus points - export it as a BagIT bag!",
                },
                {
                    image: "images/custom-profile.png",
                    text: `<a href="https://github.com/Arkisto-Platform/describo/wiki/dsp-index" target="_blank" class="text-orange-600">Define your own profile.</a>
                        Describo is extensible in every way including
                        overriding inbuilt types and defining which types are available to the user.
                        `,
                },
                {
                    image: "images/types-value.png",
                    text: "Built in types - define a specific value for a property.",
                },
                {
                    image: "images/types-text.png",
                    text: "Built in types - collect text input from a user.",
                },
                {
                    image: "images/types-textarea.png",
                    text:
                        "Built in types - collect text input from a user using a text area. Great for descriptions!",
                },
                {
                    image: "images/types-date.png",
                    text: "Built in types - collect an ISO date from a user.",
                },
                {
                    image: "images/types-select.png",
                    text: "Built in types - collect a value from a set of options from the user.",
                },
                {
                    image: "images/data-pack-lookup.png",
                    text:
                        "Load data packs and allow the user to select a pre-defined JSON-LD object",
                },
            ],
        };
    },
};
</script>
