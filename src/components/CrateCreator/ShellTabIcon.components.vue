<template>
    <div
        class="flex flex-row my-1 hover:text-orange-600"
        :class="{ 'text-2xl text-orange-600': selected }"
    >
        <div class="mr-2">
            <i :class="types[type]"></i>
        </div>
        <div>
            {{ type }}
        </div>
    </div>
</template>

<script>
export default {
    props: {
        type: {
            type: String,
            required: true,
        },
        selected: {
            type: Boolean,
            required: true,
        },
    },
    data() {
        return {
            types: {
                ContactPoint: "fas fa-address-card",
                CreateAction: "fas fa-plus",
                CreativeWork: "fas fa-image",
                Dataset: "fas fa-folder",
                DataDownload: "fas fa-download",
                File: "fas fa-file",
                GeoCoordinates: "fas fa-map-marker-alt",
                IndividualProduct: "fas fa-barcode",
                Organization: "fas fa-university",
                Person: "fas fa-user",
                Place: "fas fa-globe",
                PropertyValue: "fas fa-paragraph",
                Publication: "fas fa-newspaper",
                RepositoryCollection: "fas fa-cubes",
                RepositoryObject: "fas fa-cube",
                ScholarlyArticle: "fas fa-scroll",
                Script: "fas fa-code",
                SoftwareApplication: "fas fa-code",
                Workflow: "fas fa-project-diagram",
                WorkflowSketch: "fas fa-project-diagram",
            },
        };
    },
};
</script>
