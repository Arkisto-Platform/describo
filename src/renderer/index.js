"use strict";

import "core-js/stable";
import "regenerator-runtime/runtime";
import "source-map-support/register";

import "assets/tailwind.scss";
import "element-ui/lib/theme-chalk/index.css";
import "assets/global-styles.scss";
import "iv-viewer/dist/iv-viewer.css";

// import "leaflet/dist/leaflet.css";
// import { Icon } from "leaflet";
// delete Icon.Default.prototype._getIconUrl;
// Icon.Default.mergeOptions({
//     iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
//     iconUrl: require("leaflet/dist/images/marker-icon.png"),
//     shadowUrl: require("leaflet/dist/images/marker-shadow.png")
// });

import fontawesome from "@fortawesome/fontawesome-free/js/all";
import { config } from "@fortawesome/fontawesome-svg-core";
config.autoReplaceSvg = "nest";

import Vue from "vue";
import ElementUI from "element-ui";
import locale from "element-ui/lib/locale/lang/en";
Vue.use(ElementUI, { locale });

import * as filters from "./filters";
const filterNames = Object.keys(filters);
filterNames.forEach(filter => Vue.filter(filter, filters[filter]));

import App from "components/app.vue";
import { router } from "./routes";
import { store } from "./store";

App.router = router;
App.store = store;
const app = new Vue(App);
