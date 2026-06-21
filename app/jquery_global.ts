import jq from "jquery";

// Expose jQuery to the global scope
// typing is effed because the types add it to the global scope, but it isn't really put there
(globalThis as unknown as { jQuery: typeof jq }).jQuery = jq;
