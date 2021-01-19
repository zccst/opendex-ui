import React, { Component } from 'react';
import { toLocale } from '_src/locale/react-locale';
import PageURL from '_constants/PageURL';
import ComboBox from '_src/component/ComboBox/ComboBox';
import env from '../../constants/env';
import './index.less';

const netTypeList = [
  {
    get url() {
      if(!env.envConfig.isTest) return window.location.href;
      return PageURL.getCurrent().replace(new RegExp(`^/${env.testnet.pagePath}`),`/${env.mainnet.pagePath}`);
    },
    type: `/${env.mainnet.pagePath}`,
    get label() {
      return toLocale('mainnet');
    },
  },
  {
    get url() {
      if(env.envConfig.isTest) return window.location.href;
      return PageURL.getCurrent().replace(new RegExp(`/${env.mainnet.pagePath}`),`/${env.testnet.pagePath}`);
    },
    type: `/${env.testnet.pagePath}`,
    get label() {
      return toLocale('testnet');
    },
  },
];

class DesktopNetMenu extends Component {
  constructor(props) {
    super(props);
    this.netTypeList = netTypeList;
  }

  render() {
    const current = env.envConfig.isTest ? netTypeList[1] : netTypeList[0];
    return (
      <div className="net-info-title">
        <div className="current-net-title">
          {current.label}
          <a
            className={`down-arrow${
              this.netTypeList.length > 1 ? ' has-more' : ''
            }`}
            style={{ display: 'inline-block' }}
          />
          <div className="combo-box-wrap">
            <div className="combo-box">
              <ComboBox
                current={current}
                comboBoxDataSource={
                  this.netTypeList.length > 1 ? this.netTypeList : []
                }
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default DesktopNetMenu;
