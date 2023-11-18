var ConnectionEvent;

(function (ConnectionEvent) {
  ConnectionEvent["CONNECT"] = "connect";
  ConnectionEvent["MESSAGE"] = "message";
  ConnectionEvent["HANDSHAKE"] = "handshake";
  ConnectionEvent["STATUS_CHANGE"] = "statusChange";
  ConnectionEvent["DATA"] = "data";
  ConnectionEvent["ERROR"] = "error";
})(ConnectionEvent || (ConnectionEvent = {}));

var ConnectionStatus;

(function (ConnectionStatus) {
  ConnectionStatus[ConnectionStatus["DISCONNECTED"] = 0] = "DISCONNECTED";
  ConnectionStatus[ConnectionStatus["CONNECTING"] = 1] = "CONNECTING";
  ConnectionStatus[ConnectionStatus["CONNECTED"] = 2] = "CONNECTED";
  ConnectionStatus[ConnectionStatus["RECONNECT_WAIT"] = 3] = "RECONNECT_WAIT";
})(ConnectionStatus || (ConnectionStatus = {}));

var Ports;

(function (Ports) {
  Ports[Ports["DEFAULT"] = 51441] = "DEFAULT";
  Ports[Ports["LEGACY"] = 666] = "LEGACY";
  Ports[Ports["RELAY_START"] = 53741] = "RELAY_START";
})(Ports || (Ports = {}));

export { ConnectionEvent, ConnectionStatus, Ports };
//# sourceMappingURL=types.esm.js.map
