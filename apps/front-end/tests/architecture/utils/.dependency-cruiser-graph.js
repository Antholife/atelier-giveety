/**
 * Dependency Cruiser - Graph Generation Configuration
 *
 * Generates visual architecture diagrams showing layer dependencies
 * Similar to PHPArkitect's architecture visualization
 */

/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
  extends: "./dependency-cruiser.config.js",

  options: {
    reporterOptions: {
      dot: {
        /* Collapse to show only layer-level dependencies */
        collapsePattern: "^src/([^/]+)",

        /* Color coding by layer */
        theme: {
          graph: {
            /* Overall graph styling */
            splines: "ortho",
            rankdir: "TB",
            ranksep: "1",
            nodesep: "0.5",
          },
          modules: [
            /* Domain layer - Core (green) */
            {
              criteria: { path: "^src/domain" },
              attributes: {
                fillcolor: "#90EE90",
                fontcolor: "#000000",
                shape: "box",
              },
            },
            /* Application layer - Use Cases (blue) */
            {
              criteria: { path: "^src/application" },
              attributes: {
                fillcolor: "#87CEEB",
                fontcolor: "#000000",
                shape: "box",
              },
            },
            /* Infrastructure layer - External (yellow) */
            {
              criteria: { path: "^src/infrastructure" },
              attributes: {
                fillcolor: "#FFD700",
                fontcolor: "#000000",
                shape: "box",
              },
            },
            /* Presentation layer - UI (orange) */
            {
              criteria: { path: "^src/presentation" },
              attributes: {
                fillcolor: "#FFA500",
                fontcolor: "#000000",
                shape: "box",
              },
            },
            /* Tests */
            {
              criteria: { path: "^tests" },
              attributes: {
                fillcolor: "#E0E0E0",
                fontcolor: "#000000",
                shape: "note",
              },
            },
          ],
          dependencies: [
            /* Allowed dependencies (green) */
            {
              criteria: { resolved: "^src/domain" },
              attributes: { color: "green", penwidth: "2" },
            },
            /* Cross-layer dependencies (orange warning) */
            {
              criteria: {
                from: { path: "^src/presentation" },
                to: { path: "^src/infrastructure" },
              },
              attributes: { color: "orange", style: "dashed" },
            },
            /* Forbidden dependencies (red) */
            {
              criteria: {
                from: { path: "^src/domain" },
                to: { pathNot: "^src/domain" },
              },
              attributes: { color: "red", style: "bold" },
            },
          ],
        },
      },

      /* HTML report with interactive graph */
      html: {
        collapsePattern: "^src/([^/]+)",
        showMetrics: true,
      },

      /* Architecture report (text-based) */
      archi: {
        collapsePattern: "^src/([^/]+)",
      },
    },
  },
};
