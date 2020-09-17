import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Menu from '_src/component/Menu';
import { withRouter, Link } from 'react-router-dom';
import { toLocale } from '_src/locale/react-locale';
import Icon from '_src/component/IconLite';
import { getLangURL } from '_src/utils/navigation';
import PageURL from '_constants/PageURL';
import * as walletActions from '_src/redux/actions/WalletAction';

import './index.less';

function mapStateToProps(state) { // 绑定redux中相关state
  const { WalletStore } = state;
  // step 创建钱包状态
  return {
    WalletStore
  };
}

function mapDispatchToProps(dispatch) {
  return {
    walletAction: bindActionCreators(walletActions, dispatch),
  };
}

@withRouter
@connect(mapStateToProps, mapDispatchToProps)
class DexLoginMenu extends React.Component {
  handleCreateWallet=() => {
    const { walletAction } = this.props;
    walletAction.updateCreateStep(1);
    // 重新走流程，需要出现安全提示
    walletAction.updateIsShowSafeTip(true);
  };

  render() {
    return (
      <Menu
        mode="horizontal"
        className="okdex-menu"
      >
        <Menu.Item key="createWallet">
          <Link to={getLangURL(`${PageURL.homePage}/wallet/create`)} >{toLocale('header_menu_create_wallet')}</Link>
        </Menu.Item>
        <Menu.Item key="importWallet" >
          <Link to={getLangURL(`${PageURL.homePage}/wallet/import`)} >{toLocale('header_menu_import_wallet')}</Link>
        </Menu.Item>
      </Menu>
    );
  }
}

export default DexLoginMenu;
