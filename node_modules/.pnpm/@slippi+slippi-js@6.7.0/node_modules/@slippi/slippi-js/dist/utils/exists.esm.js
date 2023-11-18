// Based on https://github.com/wilsonzlin/edgesearch/blob/d03816dd4b18d3d2eb6d08cb1ae14f96f046141d/demo/wiki/client/src/util/util.ts
// Ensures value is not null or undefined.
// != does no type validation so we don't need to explcitly check for undefined.
function exists(value) {
  return value != null;
}

export { exists };
//# sourceMappingURL=exists.esm.js.map
