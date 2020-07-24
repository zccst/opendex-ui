import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Tabs, { TabPane } from 'rc-tabs';
import { toLocale } from '_src/locale/react-locale';
import * as NodeActions from '_src/redux/actions/NodeAction';
import { getNodeLatency, getNodeRenderName } from '_src/utils/node';
import NodeItem from './NodeItem';
import NodeList from './NodeList';
import TabLocal from './TabLocal';
import TabCustomerlize from './TabCustomerlize';
import './index.less';

const loopTime = 10000;

function mapStateToProps(state) { // 绑定redux中相关state
  const {
    currentNode, remoteList, customList
  } = state.NodeStore;
  return {
    currentNode,
    remoteList,
    customList,
  };
}

function mapDispatchToProps(dispatch) { // 绑定action，以便向redux发送action
  return {
    nodeActions: bindActionCreators(NodeActions, dispatch)
  };
}

@connect(mapStateToProps, mapDispatchToProps) // 与redux相关的组件再用connect修饰，容器组件
class NodeSetting extends Component {
  constructor() {
    super();
    this.state = {
    };
  }

  componentDidMount() {
    const fetchNodesLatency = () => {
      const { remoteList, customList } = this.props;
      const hasVisited = {};

      const updateLatency = (list, updateList, updateNode, currentNode, node, latency) => {
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
        updateLatency(this.props.remoteList, nodeActions.updateRemoteList, nodeActions.updateCurrentNode, currentNode, node, latency);
      };

      const updateCustom = (node, latency) => {
        const { nodeActions, currentNode } = this.props;
        updateLatency(this.props.customList, nodeActions.updateCustomList, nodeActions.updateCurrentNode, currentNode, node, latency);
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
      fetchListLatency(remoteList);
      fetchListLatency(customList);
    };

    fetchNodesLatency();
    this.timer = setInterval(fetchNodesLatency, loopTime);
  }

  componentWillUnmount() {
    this.timer && clearInterval(this.timer);
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
          <Tabs defaultActiveKey="2" prefixCls="node-select">
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
