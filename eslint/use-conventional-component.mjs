/** @rule Interdit certains imports MUI directs au profit des wrappers projet. */

const rule = {
  meta: {
    type: "problem",
    docs: {
      description: "Disallow direct usage of certain MUI components",
    },
    messages: {
      avoidMui:
        "Do not use MUI '{{ name }}' directly. Use our '{{ replacement }}' component instead.",
    },
    schema: [
      {
        type: "object",
        properties: {
          forbidden: {
            type: "object",
            additionalProperties: { type: "string" },
          },
        },
        additionalProperties: false,
      },
    ],
  },
  create(context) {
    const options = context.options[0] || {};
    const forbidden = options.forbidden;

    const localMap = {};

    return {
      ImportDeclaration(node) {
        const source = node.source.value;

        if (source === "@mui/material") {
          for (const specifier of node.specifiers) {
            if (
              specifier.type === "ImportSpecifier" &&
              forbidden[specifier.imported.name]
            ) {
              localMap[specifier.local.name] = {
                imported: specifier.imported.name,
                replacement: forbidden[specifier.imported.name],
              };
            }
          }
        } else if (source.startsWith("@mui/material/")) {
          const component = source.replace("@mui/material/", "");
          const specifier = node.specifiers[0];
          if (
            specifier &&
            (specifier.type === "ImportDefaultSpecifier" ||
              specifier.type === "ImportSpecifier") &&
            forbidden[component]
          ) {
            localMap[specifier.local.name] = {
              imported: component,
              replacement: forbidden[component],
            };
          }
        }
      },
      JSXOpeningElement(node) {
        if (node.name.type === "JSXIdentifier") {
          const tag = node.name.name;
          if (localMap[tag]) {
            context.report({
              node: node.name,
              messageId: "avoidMui",
              data: {
                name: localMap[tag].imported,
                replacement: localMap[tag].replacement,
              },
            });
          }
        }
      },
    };
  },
};

export default rule;
