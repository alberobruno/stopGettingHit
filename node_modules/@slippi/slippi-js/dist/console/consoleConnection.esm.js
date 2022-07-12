import { EventEmitter } from 'events';
import net from 'net';
import inject from 'reconnect-core';
import { ConsoleCommunication, CommunicationType } from './communication.esm.js';
import { ConnectionStatus, Ports, ConnectionEvent } from './types.esm.js';

const NETWORK_MESSAGE = "HELO\0";
const DEFAULT_CONNECTION_TIMEOUT_MS = 20000;
var CommunicationState;

(function (CommunicationState) {
  CommunicationState["INITIAL"] = "initial";
  CommunicationState["LEGACY"] = "legacy";
  CommunicationState["NORMAL"] = "normal";
})(CommunicationState || (CommunicationState = {}));

const defaultConnectionDetails = {
  consoleNick: "unknown",
  gameDataCursor: /*#__PURE__*/Uint8Array.from([0, 0, 0, 0, 0, 0, 0, 0]),
  version: "",
  clientToken: 0
};
const consoleConnectionOptions = {
  autoReconnect: true
};
/**
 * Responsible for maintaining connection to a Slippi relay connection or Wii connection.
 * Events are emitted whenever data is received.
 *
 * Basic usage example:
 *
 * ```javascript
 * const { ConsoleConnection } = require("@slippi/slippi-js");
 *
 * const connection = new ConsoleConnection();
 * connection.connect("localhost", 667); // You should set these values appropriately
 *
 * connection.on("data", (data) => {
 *   // Received data from console
 *   console.log(data);
 * });
 *
 * connection.on("statusChange", (status) => {
 *   console.log(`status changed: ${status}`);
 * });
 * ```
 */

class ConsoleConnection extends EventEmitter {
  constructor(options) {
    super();
    this.ipAddress = void 0;
    this.port = void 0;
    this.isRealtime = void 0;
    this.connectionStatus = ConnectionStatus.DISCONNECTED;
    this.connDetails = { ...defaultConnectionDetails
    };
    this.client = null;
    this.connection = null;
    this.options = void 0;
    this.shouldReconnect = false;
    this.ipAddress = "0.0.0.0";
    this.port = Ports.DEFAULT;
    this.isRealtime = false;
    this.options = Object.assign({}, consoleConnectionOptions, options);
  }
  /**
   * @returns The current connection status.
   */


  getStatus() {
    return this.connectionStatus;
  }
  /**
   * @returns The IP address and port of the current connection.
   */


  getSettings() {
    return {
      ipAddress: this.ipAddress,
      port: this.port
    };
  }
  /**
   * @returns The specific details about the connected console.
   */


  getDetails() {
    return { ...this.connDetails
    };
  }
  /**
   * Initiate a connection to the Wii or Slippi relay.
   * @param ip   The IP address of the Wii or Slippi relay.
   * @param port The port to connect to.
   * @param isRealtime Optional. A flag to tell the Wii to send data as quickly as possible
   * @param timeout Optional. The timeout in milliseconds when attempting to connect
   *                to the Wii or relay.
   */


  connect(ip, port, isRealtime = false, timeout = DEFAULT_CONNECTION_TIMEOUT_MS) {
    this.ipAddress = ip;
    this.port = port;
    this.isRealtime = isRealtime;

    this._connectOnPort(ip, port, timeout);
  }

  _connectOnPort(ip, port, timeout) {
    // set up reconnect
    const reconnect = inject(() => net.connect({
      host: ip,
      port: port,
      timeout: timeout
    })); // Indicate we are connecting

    this._setStatus(ConnectionStatus.CONNECTING); // Prepare console communication obj for talking UBJSON


    const consoleComms = new ConsoleCommunication(); // TODO: reconnect on failed reconnect, not sure how
    // TODO: to do this

    const connection = reconnect({
      initialDelay: 2000,
      maxDelay: 10000,
      strategy: "fibonacci",
      failAfter: Infinity
    }, client => {
      var _this$connDetails$cli;

      this.emit(ConnectionEvent.CONNECT); // We successfully connected so turn on auto-reconnect

      this.shouldReconnect = this.options.autoReconnect;
      this.client = client;
      let commState = CommunicationState.INITIAL;
      client.on("data", data => {
        if (commState === CommunicationState.INITIAL) {
          commState = this._getInitialCommState(data);
          console.log(`Connected to ${ip}:${port} with type: ${commState}`);

          this._setStatus(ConnectionStatus.CONNECTED);

          console.log(data.toString("hex"));
        }

        if (commState === CommunicationState.LEGACY) {
          // If the first message received was not a handshake message, either we
          // connected to an old Nintendont version or a relay instance
          this._handleReplayData(data);

          return;
        }

        try {
          consoleComms.receive(data);
        } catch (err) {
          console.error("Failed to process new data from server...", {
            error: err,
            prevDataBuf: consoleComms.getReceiveBuffer(),
            rcvData: data
          });
          client.destroy();
          this.emit(ConnectionEvent.ERROR, err);
          return;
        }

        const messages = consoleComms.getMessages(); // Process all of the received messages

        try {
          messages.forEach(message => this._processMessage(message));
        } catch (err) {
          // Disconnect client to send another handshake message
          console.error(err);
          client.destroy();
          this.emit(ConnectionEvent.ERROR, err);
        }
      });
      client.on("timeout", () => {
        // const previouslyConnected = this.connectionStatus === ConnectionStatus.CONNECTED;
        console.warn(`Attempted connection to ${ip}:${port} timed out after ${timeout}ms`);
        client.destroy();
      });
      client.on("end", () => {
        console.log("disconnect");

        if (!this.shouldReconnect) {
          client.destroy();
        }
      });
      client.on("close", () => {
        console.log("connection was closed");
      });
      const handshakeMsgOut = consoleComms.genHandshakeOut(this.connDetails.gameDataCursor, (_this$connDetails$cli = this.connDetails.clientToken) != null ? _this$connDetails$cli : 0, this.isRealtime);
      client.write(handshakeMsgOut);
    });

    const setConnectingStatus = () => {
      // Indicate we are connecting
      this._setStatus(this.shouldReconnect ? ConnectionStatus.RECONNECT_WAIT : ConnectionStatus.CONNECTING);
    };

    connection.on("connect", setConnectingStatus);
    connection.on("reconnect", setConnectingStatus);
    connection.on("disconnect", () => {
      if (!this.shouldReconnect) {
        connection.reconnect = false;
        connection.disconnect();

        this._setStatus(ConnectionStatus.DISCONNECTED);
      } // TODO: Figure out how to set RECONNECT_WAIT state here. Currently it will stay on
      // TODO: Connecting... forever

    });
    connection.on("error", err => {
      console.warn(`Connection on port ${port} encountered an error.`, err);

      this._setStatus(ConnectionStatus.DISCONNECTED);

      this.emit(ConnectionEvent.ERROR, `Connection on port ${port} encountered an error.\n${err}`);
    });
    this.connection = connection;
    connection.connect(port);
  }
  /**
   * Terminate the current connection.
   */


  disconnect() {
    // Prevent reconnections and disconnect
    if (this.connection) {
      this.connection.reconnect = false;
      this.connection.disconnect();
      this.connection = null;
    }

    if (this.client) {
      this.client.destroy();
    }
  }

  _getInitialCommState(data) {
    if (data.length < 13) {
      return CommunicationState.LEGACY;
    }

    const openingBytes = Buffer.from([0x7b, 0x69, 0x04, 0x74, 0x79, 0x70, 0x65, 0x55, 0x01]);
    const dataStart = data.slice(4, 13);
    return dataStart.equals(openingBytes) ? CommunicationState.NORMAL : CommunicationState.LEGACY;
  }

  _processMessage(message) {
    this.emit(ConnectionEvent.MESSAGE, message);

    switch (message.type) {
      case CommunicationType.KEEP_ALIVE:
        // console.log("Keep alive message received");
        // TODO: This is the jankiest shit ever but it will allow for relay connections not
        // TODO: to time out as long as the main connection is still receving keep alive messages
        // TODO: Need to figure out a better solution for this. There should be no need to have an
        // TODO: active Wii connection for the relay connection to keep itself alive
        const fakeKeepAlive = Buffer.from(NETWORK_MESSAGE);

        this._handleReplayData(fakeKeepAlive);

        break;

      case CommunicationType.REPLAY:
        const readPos = Uint8Array.from(message.payload.pos);
        const cmp = Buffer.compare(this.connDetails.gameDataCursor, readPos);

        if (!message.payload.forcePos && cmp !== 0) {
          // The readPos is not the one we are waiting on, throw error
          throw new Error(`Position of received data is incorrect. Expected: ${this.connDetails.gameDataCursor.toString()}, Received: ${readPos.toString()}`);
        }

        if (message.payload.forcePos) {
          console.warn("Overflow occured in Nintendont, data has likely been skipped and replay corrupted. " + "Expected, Received:", this.connDetails.gameDataCursor, readPos);
        }

        this.connDetails.gameDataCursor = Uint8Array.from(message.payload.nextPos);
        const data = Uint8Array.from(message.payload.data);

        this._handleReplayData(data);

        break;

      case CommunicationType.HANDSHAKE:
        const {
          nick,
          nintendontVersion
        } = message.payload;

        if (nick) {
          this.connDetails.consoleNick = nick;
        }

        const tokenBuf = Buffer.from(message.payload.clientToken);
        this.connDetails.clientToken = tokenBuf.readUInt32BE(0);

        if (nintendontVersion) {
          this.connDetails.version = nintendontVersion;
        }

        this.connDetails.gameDataCursor = Uint8Array.from(message.payload.pos);
        this.emit(ConnectionEvent.HANDSHAKE, this.connDetails);
        break;
    }
  }

  _handleReplayData(data) {
    this.emit(ConnectionEvent.DATA, data);
  }

  _setStatus(status) {
    // Don't fire the event if the status hasn't actually changed
    if (this.connectionStatus !== status) {
      this.connectionStatus = status;
      this.emit(ConnectionEvent.STATUS_CHANGE, this.connectionStatus);
    }
  }

}

export { ConsoleConnection, NETWORK_MESSAGE };
//# sourceMappingURL=consoleConnection.esm.js.map
