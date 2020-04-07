<template>
    <div class="flex flex-col">
        <div class="text-center" v-if="!googleViewerAccepted">
            <div class="my-3">
                The Google Docs viewer can be used to display this file type.
                However, this requires uploading your file to Google which may
                not be acceptable and will use your data upload capacity.
            </div>
            <div class="my-3">
                If you're ok with this click the button following to continue
                with this viewer
            </div>
            <div class="my-3">
                <el-button @click="googleViewerAccepted = true" type="warning"
                    >I'm ok with using the Google Docs viewer to view this file
                </el-button>
            </div>
        </div>
        <iframe :src="path" class="style-file-view" v-if="googleViewerAccepted">
            <p>Your browser does not support iframes.</p>
        </iframe>
        <!-- <iframe
    src="https://docs.google.com/viewer?url=http://infolab.stanford.edu/pub/papers/google.pdf&embedded=true"
    class="w-full"
    frameborder="0"
        ></iframe> -->
    </div>
</template>

<script>
export default {
    props: {
        path: {
            type: String,
            required: true,
        },
    },
    data() {
        return { googleViewerAccepted: false };
    },
    mounted() {},
    methods: {},
};
</script>

<style lang="scss" scoped></style>
