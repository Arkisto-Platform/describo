<template>
    <div @blur="add(value)">
        {{ value }}
    </div>
</template>

<script>
import SimpleComponentMixins from "./SimpleComponentMixins";
export default {
    mixins: [SimpleComponentMixins]
};
</script>

<style lang="scss" scoped></style>
