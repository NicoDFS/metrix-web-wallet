import qtumInfo from 'libs/nodes/qtumInfo'

let nodeConfigs = {
  qtumInfo
}

const defaultNodeId = 'qtumInfo'
let currentNodeId = defaultNodeId

export default {
  currentNode() {
    return nodeConfigs[currentNodeId]
  },

  setNodeId(nodeId) {
    if (nodeConfigs[nodeId]) {
      currentNodeId = nodeId
    }
  }
}
