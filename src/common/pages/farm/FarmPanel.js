import React from 'react';
import { toLocale } from '_src/locale/react-locale';
import util from '_src/utils/util';
import { getCoinIcon } from './util/coinIcon';
import { getLangURL } from '_src/utils/navigation';
import Tooltip from '../../component/Tooltip';
import PageURL from '_constants/PageURL';
import { Link } from 'react-router-dom';
import WatchlistPanel from './WatchlistPanel';
import SimpleBtnDialog from './SimpleBtnDialog';
import Stake from './Stake';
import * as api from './util/api'; 

export default class FarmPanel extends React.Component {

  constructor() {
    super();
    this.state = {
      data:[],
    }
  }

  componentDidMount() {
    this.init();
  }

  async init() {
    const {data=[]} = await api.whitelist();
    this.setState({data});
  }

  render() {
    const isLogined = util.isLogined();
    const {data} = this.state;
    return (
      <div className="panel-farm">
        {!isLogined && 
        <div className="space-between connect-wallet">
          <div className="left">
            <div className="connect-wallet-tip">{toLocale('You haven’t connected a wallet.')}</div>
          </div>
          <div className="right">
            <Link to={getLangURL(PageURL.walletCreate)}>
              <div className="farm-btn">{toLocale('Connect Wallet')}</div>
            </Link>
          </div>
        </div>
        }
        <div className="title-wrap">
          {toLocale('White listed')}
          <Tooltip
            placement="right"
            overlay={toLocale('Minimum received help')}
          >
            <i className="help" />
          </Tooltip>
        </div>
        <div className="info-items">
          {data.map((d,index) => (
            <div className="info-item" key={index}>
              <div className="tag active"></div>
              <div className="coin2coin">
                <img src={getCoinIcon(d.lock_symbol)} />
                <img src={getCoinIcon(d.yield_symbol)} />
                <Tooltip
                placement="right"
                overlay={d.pool_name_dis}
              >
                <span>
                  {d.lock_symbol_dis}/{d.yield_symbol_dis}
                </span>
              </Tooltip>
              </div>
              <div className="rate">{d.total_apy}</div>
              <div className="rate-tip">{d.farm_apy_dis}</div>
              <div className="info-detail">{toLocale('Total staked：')}{d.total_staked_dis}</div>
              <div className="info-detail">{toLocale('Pool rate：')}{d.pool_rate_dis}/1Day</div>
              <SimpleBtnDialog component={() => Stake.getStake(d)}>
                <div className="farm-btn">{toLocale('STAKE')}&nbsp;<span className="timer">01{toLocale('d')} 08{toLocale('h')} 36{toLocale('m')} 52{toLocale('s')}</span></div>
              </SimpleBtnDialog>
            </div>
          ))}
          </div>
        <div className="title-wrap">
          <div className="space-between">
            <div className="left">
              {toLocale('Other pools')}
              <Tooltip
                placement="right"
                overlay={toLocale('Minimum received help')}
              >
                <i className="help" />
              </Tooltip>
            </div>
            <div className="right">
              <div className="search-wrap iconfont">
                <input
                  placeholder={toLocale('Search name')}
                />
              </div>
            </div>
          </div>
        </div>
        <WatchlistPanel />
      </div>
    );
  }
}
