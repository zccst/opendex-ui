import React from 'react';
import { connect } from 'react-redux';
import Enum from '../../utils/Enum';
import util from '../../utils/util';
import FullTradeHead from './FullTradeHead';
import FullTradeData from './FullTradeData';
import downloadDialog from './DownloadDialog';
import SpotAsset from '../trade/SpotAsset';
import SpotOrder from '../trade/SpotOrder';
import FullTradeKLine from './FullTradeKLine';
import FullDepth from './FullDepth';
import SpotPlaceOrder from '../trade/SpotPlaceOrder';
import FullTradeDeals from './FullTradeDeals';
import './FullTrade.less';
import { bindActionCreators } from 'redux';
import * as CommonAction from '../../redux/actions/CommonAction';

function mapStateToProps(state) {
  const { product, productObj } = state.SpotTrade;
  const { privateKey } = state.Common;
  return { product, productObj, privateKey };
}

function mapDispatchToProps(dispatch) {
  return {
    commonAction: bindActionCreators(CommonAction, dispatch),
  };
}

@connect(mapStateToProps, mapDispatchToProps)
export default class FullTradeFrame extends React.Component {
  constructor(props) {
    super(props);
    window.OK_GLOBAL.tradeType = Enum.tradeType.fullTrade;
    window.OK_GLOBAL.isMarginType = false;
    window.addEventListener('resize', this.onResize);
  }

  componentWillMount() {
    downloadDialog();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onResize);
  }

  onResize = util.debounce(() => {
    if (window.innerWidth >= 1280) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflowX = 'scroll';
    }
    if (window.innerHeight >= 600) {
      document.body.style.overflowY = 'hidden';
    } else {
      document.body.style.overflowY = 'scroll';
    }
  });

  render() {
    return (
      <div className="full-wrap">
        <div className="full-head">
          <FullTradeHead />
        </div>
        <div className="trade-container">
          <div className="full-left">
            <div className="full-left-top">
              <div className="full-left-top-right">
                <div className="full-ticker-kline">
                  <FullTradeKLine />
                </div>
              </div>
            </div>
            <div className="full-left-bottom">
              <SpotAsset />
              <SpotOrder />
            </div>
          </div>
          <div className="full-right">
            <div className="full-right-left">
              <FullDepth />
              <SpotPlaceOrder />
            </div>
            <div className="full-right-right">
              <FullTradeDeals />
            </div>
          </div>
        </div>
        <FullTradeData />
      </div>
    );
  }
}
