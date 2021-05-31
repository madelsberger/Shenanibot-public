const httpServer = require("./server");

const statusUrl = '/overlay/status';
const levelsUrl = '/overlay/levels';
const queueVisibilityUrl = '/overlay/queueVisibility';

const state = {
  prefix: "",
  acceptCreatorCode: false,
  levels: "[]",
  status: "",
  queueHidingEnabled: false
};

const setStatus = open => {
  state.status = (JSON.stringify({
    status: open ? "open" : "closed",
    command: `${state.prefix}add`,
    acceptCreatorCode: state.acceptCreatorCode
  }));
};

const setLevels = queue => {
  state.levels = JSON.stringify(queue.map(e => ({
    type: e ? e.type : "mark",
    entry: e || undefined
  })));
};

module.exports = {
  init: () => {
    const config = httpServer.getConfig();
    state.prefix = config.prefix;
    state.acceptCreatorCode = config.creatorCodeMode !== 'reject';
    setStatus(true);
    setLevels([]);

    console.log(`Go to http://localhost:${config.httpPort}/overlay/ for overlay setup instructions`);

    httpServer.register(levelsUrl, ws => {
      ws.send(state.levels);
    });
    httpServer.register(statusUrl, ws => {
      ws.send(state.status);
    });
  },

  sendStatus: open => {
    setStatus(open);
    httpServer.broadcast(statusUrl, state.status);
  },

  sendLevels: queue => {
    setLevels(queue);
    httpServer.broadcast(levelsUrl, state.levels);
  },
  
  registerQueueVisbilityWs: () => {
    state.queueHidingEnabled = true;
    httpServer.register(queueVisibilityUrl);
  },
  
  // sends a signal to a queue overlay telling it to be visible.
  // The queue overlay makes itself invisible again after a while
  // if queue hiding is not enabled it returns false
  sendQueueVisible: () => {
    if(state.queueHidingEnabled) { // state.queueHidingEnable's only purpose is for this check
      httpServer.broadcast(queueVisibilityUrl, JSON.stringify(true));
      return true;
    }
    return false;
  }
};
