import conventionalComponent from "./custom-rules/use-conventional-component.mjs";
import { frontEndRules } from "./eslint-rules.mjs";

const projectRules = {
  customRules: {
    "use-conventional-component": conventionalComponent,
  },
  rules: {
    ...frontEndRules,
  },
};

export default projectRules;
