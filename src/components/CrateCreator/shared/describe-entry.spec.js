import {
    updateTemplate,
    setFlags,
    determinePropertyDataType,
} from "./describe-entry";
import { isArray, isString } from "lodash";

test("setFlags: type Value - return show false, enabled true", () => {
    let item = { "@type": "Value", value: "v" };
    expect(setFlags({ item }).showAddControl).toBe(false);
    expect(setFlags({ item }).enabled).toBe(true);
});
test("setFlags: required not multiple - return show false, enabled true", () => {
    let item = { "@type": "Text", data: "d", required: true };
    expect(setFlags({ item }).showAddControl).toBe(false);
    expect(setFlags({ item }).enabled).toBe(true);
});
test("setFlags: multiple not required - return show true, enabled true", () => {
    let item = { "@type": "Text", data: "d", multiple: true };
    expect(setFlags({ item }).showAddControl).toBe(true);
    expect(setFlags({ item }).enabled).toBe(true);
});
test("setFlags: not multiple not required and data - return show false, enabled true", () => {
    let item = { "@type": "Text", data: "d" };
    expect(setFlags({ item }).showAddControl).toBe(false);
    expect(setFlags({ item }).enabled).toBe(true);
});
test("setFlags: not multiple not required and data - return show false, enabled true", () => {
    let item = { "@type": "Text", data: "d" };
    expect(setFlags({ item }).showAddControl).toBe(false);
    expect(setFlags({ item }).enabled).toBe(true);
});
test("setFlags: not multiple not required no data - return show true, enabled false", () => {
    let item = { "@type": "Text", data: undefined };
    expect(setFlags({ item }).showAddControl).toBe(true);
    expect(setFlags({ item }).enabled).toBe(false);
});
test("it should join an empty item with a template", () => {
    const typeDefinition = {
        metadata: {
            allowAdditionalProperties: true,
        },
        inputs: [{ property: "name", "@type": "Text" }],
    };
    const item = {
        "@type": "ContactPoint",
        uuid: "#3",
    };

    let { template, report } = updateTemplate({ typeDefinition, item });
    // console.log(template);
    template = template[0];
    expect(template.property).toBe("name");
    expect(template.data).toEqual([]);
});
test("it should join a populated item with a template", () => {
    const typeDefinition = {
        metadata: {
            allowAdditionalProperties: true,
        },
        inputs: [{ property: "name", "@type": "Text", multiple: false }],
    };
    const item = {
        "@type": "ContactPoint",
        uuid: "#3",
        name: "something",
    };

    let { template, report } = updateTemplate({ typeDefinition, item });
    // console.log(template);
    template = template[0];
    expect(template.data).toBe(item.name);
});
test("it should create a template with generic inputs", () => {
    const typeDefinition = {
        metadata: {
            allowAdditionalProperties: true,
        },
        inputs: [],
    };
    const item = {
        "@type": "ContactPoint",
        uuid: "#3",
    };
    let { template, report } = updateTemplate({ typeDefinition, item });
    // console.log(template);
    expect(template).toEqual([
        {
            property: "name",
            "@type": "Text",
            showAddControl: true,
            enabled: false,
        },
        {
            property: "description",
            "@type": "TextArea",
            showAddControl: true,
            enabled: false,
        },
    ]);
});
test("it should add item properties extra to template in as well", () => {
    const typeDefinition = {
        metadata: {
            allowAdditionalProperties: true,
        },
        inputs: [{ property: "name", "@type": "Text" }],
    };
    const item = {
        "@type": "ContactPoint",
        uuid: "#3",
        description: "desc",
    };

    let { template, report } = updateTemplate({ typeDefinition, item });
    // console.log(JSON.stringify(template, null, 2));
    expect(template.length).toBe(2);
    expect(template[1].property).toBe("description");
});
test("test handling a required item that is not a multiple", () => {
    let typeDefinition = {
        metadata: {
            allowAdditionalProperties: true,
        },
        inputs: [
            {
                property: "name",
                "@type": "Text",
                required: true,
                multiple: false,
            },
        ],
    };
    let item = {
        "@type": "ContactPoint",
        uuid: "#3",
    };

    let { template, report } = updateTemplate({ typeDefinition, item });
    // console.log(template);
    template = template[0];
    expect(template.required).toBe(true);
    expect(template).toHaveProperty("data", "");
    expect(template.showAddControl).toBe(false);

    typeDefinition = {
        metadata: {
            allowAdditionalProperties: true,
        },
        inputs: [
            {
                property: "name",
                "@type": "Text",
                required: true,
                multiple: false,
            },
        ],
    };
    item = {
        "@type": "ContactPoint",
        uuid: "#3",
        name: "something",
    };

    ({ template, report } = updateTemplate({ typeDefinition, item }));
    template = template[0];
    expect(template.showAddControl).toBe(false);
    expect(isString(template.data)).toBe(true);
});
test("test handling a required item that can be a multiple", () => {
    let typeDefinition = {
        metadata: {
            allowAdditionalProperties: true,
        },
        inputs: [
            {
                property: "name",
                "@type": "Text",
                required: true,
                multiple: true,
            },
        ],
    };
    let item = {
        "@type": "ContactPoint",
        uuid: "#3",
        name: ["name"],
    };

    let { template, report } = updateTemplate({ typeDefinition, item });
    template = template[0];
    expect(template.required).toBe(true);
    expect(template).toHaveProperty("data");
    expect(template.showAddControl).toBe(true);
    expect(isArray(template.data)).toBe(true);
});
test("test handling an item that can have multiple but is not required", () => {
    let typeDefinition = {
        metadata: {
            allowAdditionalProperties: true,
        },
        inputs: [
            {
                property: "name",
                "@type": "Text",
                multiple: true,
            },
        ],
    };
    let item = {
        "@type": "ContactPoint",
        uuid: "#3",
        name: ["name"],
    };

    let { template, report } = updateTemplate({ typeDefinition, item });
    // console.log(JSON.stringify(template, null, 2));
    template = template[0];
    expect(template.required).toBe(undefined);
    expect(template).toHaveProperty("data");
    expect(template.showAddControl).toBe(true);
    expect(isArray(template.data)).toBe(true);

    item = {
        "@type": "ContactPoint",
        uuid: "#3",
    };

    ({ template, report } = updateTemplate({ typeDefinition, item }));
    // console.log(template);
    template = template[0];
    expect(template.required).toBe(undefined);
    expect(template).toHaveProperty("data", []);
    expect(template.showAddControl).toBe(true);
    expect(isArray(template.data)).toBe(true);
});
test("test handling an that is not required and can't have multiples", () => {
    let typeDefinition = {
        metadata: {
            allowAdditionalProperties: true,
        },
        inputs: [
            {
                property: "name",
                "@type": "Text",
                multiple: false,
            },
        ],
    };
    let item = {
        "@type": "ContactPoint",
        uuid: "#3",
        name: ["name"],
    };

    let { template, report } = updateTemplate({ typeDefinition, item });
    // console.log(template);
    template = template[0];
    expect(template.required).toBe(undefined);
    expect(template).toHaveProperty("data", "name");
    expect(template.showAddControl).toBe(false);
    expect(isString(template.data)).toBe(true);
});
test("test creating a template from an item with one simple property", () => {
    const typeDefinition = {
        metadata: {
            allowAdditionalProperties: true,
        },
        inputs: [],
    };
    const item = {
        "@type": "ContactPoint",
        uuid: "#3",
        name: "something",
    };

    let { template, report } = updateTemplate({ typeDefinition, item });
    // console.log(template);
    template = template[0];
    expect(template).toEqual({
        property: "name",
        "@type": "Text",
        data: "something",
        showAddControl: false,
        enabled: true,
    });
});
test("determineProperty: map a string to a Text element", () => {
    let item = {
        name: "name",
    };
    let template = determinePropertyDataType({
        property: "name",
        data: item.name,
    });
    // console.log(template);
    expect(template).toEqual({
        property: "name",
        "@type": "Text",
        data: item.name,
    });
});
test("determineProperty: map a string to a Date element", () => {
    let item = {
        date: new Date().toISOString(),
    };
    let template = determinePropertyDataType({
        property: "date",
        data: item.date,
    });
    // console.log(template);
    expect(template).toEqual({
        property: "date",
        "@type": "Date",
        data: item.date,
    });
});
test("determineProperty: map an object referencing something else ", () => {
    let item = {
        name: {
            uuid: "#1",
            "@type": "Person",
        },
    };
    let template = determinePropertyDataType({
        property: "name",
        data: item.name,
    });
    // console.log(template);
    expect(template).toEqual({
        property: "name",
        "@type": "Person",
        data: [item.name],
        multiple: true,
    });

    item = {
        name: {
            uuid: "#1",
        },
    };
    template = determinePropertyDataType({
        property: "name",
        data: item.name,
    });
    // console.log(template);
    expect(template).toEqual({
        property: "name",
        "@type": "Text",
        data: [item.name],
        multiple: true,
    });
});
test("determineProperty: map an array of objects each referencing something else ", () => {
    let item = {
        name: [
            { uuid: "#1", "@type": "Person" },
            { uuid: "#2", "@type": "Organization" },
        ],
    };
    let template = determinePropertyDataType({
        property: "name",
        data: item.name,
    });
    // console.log(template);
    expect(template).toEqual({
        property: "name",
        "@type": ["Organization", "Person"],
        data: item.name,
        multiple: true,
    });
});
