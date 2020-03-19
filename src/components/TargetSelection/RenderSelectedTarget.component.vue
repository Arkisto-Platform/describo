<template>
    <div class="pt-2">Describing {{ target }}</div>
</template>

<script>
export default {
    data() {
        return {
            target: undefined
        };
    },
    mounted() {
        const target = this.$store.state.target;
        switch (target.type) {
            case "local":
                this.target = `local folder: ${target.folder}`;
                break;
        }
    }
};
</script>

<style lang="scss" scoped></style>
