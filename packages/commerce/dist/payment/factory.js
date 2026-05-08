// Payment gateway factory — single route handler for all gateways
const registry = new Map();
export function registerGateway(adapter) {
    registry.set(adapter.name, adapter);
}
export function getGateway(name) {
    return registry.get(name);
}
export function getRegisteredGateways() {
    return Array.from(registry.keys());
}
//# sourceMappingURL=factory.js.map