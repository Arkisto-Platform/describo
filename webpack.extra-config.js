const HtmlWebpackPlugin = require("html-webpack-plugin");
const merge = require("webpack-merge");
const { compact } = require("lodash");

module.exports = config => {
    config.devtool =
        process.env.NODE_ENV === "development"
            ? "eval-cheap-module-source-map"
            : "";
    let cssRules;
    if (process.env.NODE_ENV === "development") {
        config.module.rules = config.module.rules.map(rule => {
            if (rule.use && rule.use[0] === "css-hot-loader") {
                // do nothing
            } else {
                return rule;
            }
        });
        cssRules = [
            {
                test: /\.?css$/,
                use: [
                    "vue-style-loader",
                    { loader: "css-loader", options: { importLoaders: 1 } },
                    "postcss-loader"
                ]
            }
        ];
    } else {
        config.module.rules = config.module.rules.map(rule => {
            try {
                if (rule.use && rule.use[0].match("mini-css-extract-plugin")) {
                    // do nothing
                } else {
                    return rule;
                }
            } catch (error) {
                return rule;
            }
        });
        cssRules = [
            {
                test: /\.?css$/,
                use: [
                    "css-hot-loader",
                    "vue-style-loader",
                    { loader: "css-loader", options: { importLoaders: 1 } },
                    "postcss-loader"
                ]
            }
        ];
    }
    config.module.rules = compact(config.module.rules);
    config.module.rules.push(...cssRules);
    config.module.rules.push({
        test: /\.worker\.js$/,
        use: { loader: "worker-loader", options: { inline: true } }
    });

    config = merge(config, {
        resolve: {
            alias: {
                src: `${__dirname}/src`,
                assets: `${__dirname}/src/assets`,
                components: `${__dirname}/src/components`,
                node_modules: `${__dirname}/node_modules`
            }
        },
        plugins: [
            new HtmlWebpackPlugin({
                title: "Describo",
                template: "src/renderer/index.html",
                hash: true
            })
        ]
    });
    // console.log(JSON.stringify(config, null, 2));
    return config;
};
