import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Tabs, { TabPane } from 'rc-tabs';
import { toLocale } from '_src/locale/react-locale';
import * as NodeActions from '_app/redux/actions/NodeAction';
import * as LocalNodeAction from '_app/redux/actions/LocalNodeAction';
import { getNodeLatency, getNodeRenderName } from '_src/utils/node';
import { NODE_TYPE } from '_constants/Node';
import NodeItem from './NodeItem';
import NodeList from './NodeList';
import TabLocal from './TabLocal';
import TabCustomerlize from './TabCustomerlize';
import './index.less';

const loopTime = 10000;

function mapStateToProps(state) {
  const { currentNode, remoteList, customList } = state.NodeStore;
  const { isStarted } = state.LocalNodeStore;
  return {
    currentNode,
    remoteList,
    customList,
    isStarted,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    nodeActions: bindActionCreators(NodeActions, dispatch),
    localNodeAction: bindActionCreators(LocalNodeAction, dispatch),
  };
}

@connect(mapStateToProps, mapDispatchToProps)
class NodeSetting extends Component {
  constructor() {
    super();
    this.state = {};
  }

  componentDidMount() {
    this.fetchNodesLatency();
    this.timer = setInterval(this.fetchNodesLatency, loopTime);
  }

  componentDidUpdate(prevProps) {
    const { remoteList: oldRemoteList, customList: oldCustomList } = prevProps;
    const { remoteList, customList } = this.props;
    const isRemoteListEqual = oldRemoteList.length === remoteList.length;
    const isCustomListEqual = customList.length === oldCustomList.length;
    if (!isRemoteListEqual || !isCustomListEqual) {
      this.timer && clearInterval(this.timer);
      this.timer = setInterval(this.fetchNodesLatency, loopTime);
    }
  }

  componentWillUnmount() {
    this.timer && clearInterval(this.timer);
  }

  fetchNodesLatency = () => {
    const { remoteList, customList } = this.props;
    const hasVisited = {};

    const fetchLocalNode = () => {
      const { currentNode } = this.props;
      if (currentNode.type === NODE_TYPE.LOCAL) {
        getNodeLatency(currentNode).then((latency) => {
          const { nodeActions } = this.props;
          nodeActions.updateCurrentNode({
            ...currentNode,
            latency,
          });
        });
      }
    };

    const updateLatency = (
      list,
      updateList,
      updateNode,
      currentNode,
      node,
      latency
    ) => {
      let hasNode = false;
      const newList = list.slice();
      for (let i = 0; i < newList.length; i++) {
        if (newList[i].wsUrl === node.wsUrl) {
          newList[i].latency = latency;
          hasNode = true;
        }
      }
      hasNode && updateList(newList);
      if (currentNode.wsUrl === node.wsUrl) {
        updateNode({ ...currentNode, latency });
      }
    };

    const updateRemote = (node, latency) => {
      const { nodeActions, currentNode } = this.props;
      updateLatency(
        this.props.remoteList,
        nodeActions.updateRemoteList,
        nodeActions.updateCurrentNode,
        currentNode,
        node,
        latency
      );
    };

    const updateCustom = (node, latency) => {
      const { nodeActions, currentNode } = this.props;
      updateLatency(
        this.props.customList,
        nodeActions.updateCustomList,
        nodeActions.updateCurrentNode,
        currentNode,
        node,
        latency
      );
    };

    const fetchListLatency = (list) => {
      list.forEach((node) => {
        if (!hasVisited[node.wsUrl]) {
          hasVisited[node.wsUrl] = true;
          getNodeLatency(node).then((latency) => {
            updateRemote(node, latency);
            updateCustom(node, latency);
          });
        }
      });
    };

    fetchLocalNode();
    fetchListLatency(remoteList);
    fetchListLatency(customList);
  };

  changeTab = key => {
    const { isStarted, localNodeAction } = this.props;
    if(!isStarted) return;
    if(key === '2') localNodeAction.startTerminal();
    else localNodeAction.stopTerminal();
    return;
  }

  componentWillUnmount() {
    const { isStarted, localNodeAction } = this.props;
    if(isStarted) localNodeAction.stopTerminal();
  }

  render() {
    const { currentNode } = this.props;
    const { wsUrl, latency, httpUrl } = currentNode;
    const name = getNodeRenderName(currentNode);
    return (
      <div className="node-container">
        <h1 className="node-title">{toLocale('node.main.title')}</h1>
        <div className="node-active-container">
          <h2 className="node-active-title">{toLocale('node.active.title')}</h2>
          <NodeItem
            name={name}
            ws={wsUrl || '- -'}
            http={httpUrl || '- -'}
            delayTime={latency}
            disabled
          />
        </div>
        <div className="node-select-container">
          <Tabs defaultActiveKey="1" prefixCls="node-select" onChange={this.changeTab}>
            <TabPane tab={toLocale('node.tab.wellenow')} key="1">
              <NodeList />
            </TabPane>
            <TabPane tab={toLocale('node.tab.local')} key="2">
              <TabLocal />
            </TabPane>
            <TabPane tab={toLocale('node.tab.customerlize')} key="3">
              <TabCustomerlize />
            </TabPane>
          </Tabs>
        </div>
      </div>
    );
  }
}

export default NodeSetting;
