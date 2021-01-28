import React from 'react';
import { connect } from 'react-redux';
import { toLocale } from '_src/locale/react-locale';
import util from '_src/utils/util';
import calc from '_src/utils/calc';
import { getLangURL } from '_src/utils/navigation';
import PageURL from '_constants/PageURL';
import { Link } from 'react-router-dom';
import CoinItem from './CoinItem';
import { getCoinIcon, getDisplaySymbol } from '../../utils/coinIcon';
import * as api from './util/api';
import Confirm from '../../component/Confirm';
import { getDeadLine4sdk } from './util';
import getRef from '../../component/getRef';
import Tooltip from '../../component/Tooltip';
import { validateTxs } from '_src/utils/client';
import Message from '_src/component/Message';
import classNames from 'classnames';
import { Dialog } from '../../component/Dialog';

function mapStateToProps(state) {
  const { setting } = state.SwapStore;
  const { okexchainClient } = state.Common;
  return { okexchainClient, setting };
}

@connect(mapStateToProps)
@getRef
export default class SwapPanel extends React.Component {
  static exchangeInfo = {
    price: '',
    price_impact: '',
    fee: '',
    route: '',
    isReverse: false,
  };

  static defaultProps = {
    baseToken: {
      available: '',
      value: '',
      symbol: '',
      error: false,
    },
    targetToken: {
      available: '',
      value: '',
      symbol: '',
      error: false,
    },
  };

  constructor(props) {
    super(props);
    this.state = {
      baseToken: props.baseToken,
      targetToken: props.targetToken,
      exchangeInfo: { ...SwapPanel.exchangeInfo },
      isPoolEmpty: false,
      showConfirmDialog: false,
      active:false,
    };
  }

  exchange = async () => {
    const { baseToken, targetToken } = this.state;
    const data = {
      ...this.state,
      baseToken: targetToken,
      targetToken: baseToken,
    };
    data.targetToken.value = '';
    this.updateSwapInfo4RealTime(data, 'baseToken');
  };

  async updateSwapInfo(data, key, errTip = false) {
    const { value, symbol } = data[key];
    const target = key === 'baseToken' ? data.targetToken : data.baseToken;
    if (value && symbol && target.symbol) {
      try {
        const {
          buy_amount = '',
          price = '',
          price_impact = '',
          fee = '',
          route = '',
        } = await api.buyInfo({
          value,
          sell_token_amount: `${value}${symbol}`,
          token: target.symbol,
        });
        data.exchangeInfo = { price, price_impact, fee, route };
        target.value = buy_amount;
      } catch (e) {
        if (errTip) {
          let content = e.message || toLocale(`error.code.${e.code}`);
          if (e.code === 65014) {
            content = toLocale('pool empty');
            data.isPoolEmpty = true;
          }
          Message.error({
            content,
            duration: 3,
          });
        }
        data.exchange = { ...SwapPanel.exchangeInfo };
        target.value = '';
      }
    } else {
      target.value = '';
    }
    const {showConfirmDialog, targetToken} = this.state;
    if(showConfirmDialog && targetToken.value !== data.targetToken.value) data.active = true;
  }

  changeBase = (token) => {
    let baseToken = { ...this.state.baseToken, ...token };
    let targetToken = { ...this.state.targetToken, value: '' };
    const data = { ...this.state, baseToken, targetToken, isPoolEmpty: false };
    this.updateSwapInfo4RealTime(data, 'baseToken');
  };

  _clearTimer() {
    if (this.updateSwapInfo4RealTime.interval) {
      clearInterval(this.updateSwapInfo4RealTime.interval);
      this.updateSwapInfo4RealTime.interval = null;
    }
  }

  async updateSwapInfo4RealTime(data, key, time = 3000) {
    this._clearTimer();
    await this.updateSwapInfo(data, key, true);
    this.setState(data, () => {
      this._clearTimer();
      this.setState({});
      data[key].value &&
        (this.updateSwapInfo4RealTime.interval = setInterval(async () => {
          const temp = {
            baseToken: { ...this.state.baseToken },
            targetToken: { ...this.state.targetToken },
            exchangeInfo: { ...this.state.exchangeInfo },
          };
          await this.updateSwapInfo(temp, key);
          this.setState(temp);
        }, time));
    });
  }

  changeTarget = (token) => {
    let baseToken = { ...this.state.baseToken };
    let targetToken = { ...this.state.targetToken, ...token };
    const data = { ...this.state, targetToken, baseToken, isPoolEmpty: false };
    this.updateSwapInfo4RealTime(data, 'baseToken');
  };

  async searchToken(data, symbol) {
    if (!data) data = await api.swapTokens();
    if (!data) return null;
    let { native_token = '', tokens = [] } = data;
    tokens = tokens || [];
    symbol = symbol || native_token;
    const base = tokens.filter((d) => d.symbol === symbol)[0];
    return base || null;
  }

  initBaseToken = async () => {
    const base = await this.searchToken();
    if (!base) return;
    this.changeBase(base);
  };

  loadBaseCoinList = async () => {
    const {
      targetToken: { symbol },
    } = this.state;
    const data = await api.swapTokens({symbol});
    if (!data) return [];
    let { tokens = [] } = data;
    tokens = tokens || [];
    const { targetToken } = this.state;
    if (!targetToken.symbol) return tokens;
    return tokens.filter((d) => d.symbol !== targetToken.symbol);
  };

  loadTargetCoinList = async () => {
    const {
      baseToken: { symbol },
    } = this.state;
    const data = await api.swapTokens({ symbol });
    if (!data) return [];
    let { tokens = [] } = data;
    tokens = tokens || [];
    return tokens.filter((d) => d.symbol !== symbol);
  };

  revert = () => {
    let exchangeInfo = { ...this.state.exchangeInfo };
    exchangeInfo.isReverse = !exchangeInfo.isReverse;
    this.setState({ exchangeInfo });
  };

  confirmDialog = (showConfirmDialog = true) => {
    this.setState({ showConfirmDialog, active:false })
  };

  triggerConfirm = () => {
    this.confirmDialog(false);
    this.confirmInstance._onClick();
  };

  componentWillUnmount() {
    this._clearTimer();
  }

  componentDidMount() {
    this.init();
  }

  async init(data) {
    if (!data) {
      this.initBaseToken();
      return;
    }
    const tokens = await api.swapTokens();
    const temp = {
      ...this.state,
      baseToken: data.baseToken,
      targetToken: data.targetToken,
    };
    const baseToken = await this.searchToken(tokens, temp.baseToken.symbol);
    const targetToken = await this.searchToken(tokens, temp.targetToken.symbol);
    baseToken.value = '';
    targetToken.value = '';
    this.updateSwapInfo4RealTime(
      { ...temp, baseToken, targetToken },
      'baseToken'
    );
  }

  getExchangeInfo(isConfirm) {
    const { baseToken, targetToken, exchangeInfo } = this.state;
    const fee = Number(exchangeInfo.fee.replace(baseToken.symbol, ''));
    if (baseToken.symbol && targetToken.symbol) {
      if (!baseToken.value || !targetToken.value) {
        return (
          <div className="coin-exchange-detail">
            <div className="info">
              <div className="info-name">{toLocale('Price')}</div>
              <div className="info-value">
                <i className="exchange" />
                {!isConfirm ? <>
                  1{getDisplaySymbol(baseToken.symbol)}{' '}
                ≈ -{getDisplaySymbol(targetToken.symbol)}
                </> :
                <>
                - {getDisplaySymbol(targetToken.symbol)}/{getDisplaySymbol(baseToken.symbol)}
                </>
                }
              </div>
            </div>
          </div>
        );
      } else {
        let priceInfo;
        if(isConfirm) {
          priceInfo = `${util.precisionInput(exchangeInfo.price, 8)} ${getDisplaySymbol(
            targetToken.symbol
          )}/${getDisplaySymbol(
            baseToken.symbol
          )}`
        } else {
          priceInfo = `1${getDisplaySymbol(
            baseToken.symbol
          )} ≈ ${util.precisionInput(exchangeInfo.price, 8)}${getDisplaySymbol(
            targetToken.symbol
          )}`
        }
        if (exchangeInfo.isReverse)
          if(!isConfirm) {
            priceInfo = `1${getDisplaySymbol(
              targetToken.symbol
            )} ≈ ${util.precisionInput(
              calc.div(1, exchangeInfo.price),
              8
            )}${getDisplaySymbol(baseToken.symbol)}`;
          } else {
            priceInfo = `${util.precisionInput(
              calc.div(1, exchangeInfo.price),
              8
            )} ${getDisplaySymbol(targetToken.symbol)}/${getDisplaySymbol(
              baseToken.symbol
            )} `;
          }
        return (
          <div className="coin-exchange-detail">
            <div className="info">
              <div className="info-name">{toLocale('Price')}</div>
              <div className="info-value">
                <i className="exchange" onClick={this.revert} />
                {priceInfo}
                <i />
              </div>
            </div>
            <div className="info">
              <div className="info-name">
                {toLocale('Minimum received')}
                {!isConfirm && <Tooltip
                  placement="right"
                  overlay={toLocale('Minimum received help')}
                >
                  <i className="help" />
                </Tooltip>}
              </div>
              <div className="info-value">
                {this.getMinimumReceived(8)}{' '}
                {getDisplaySymbol(targetToken.symbol)}
              </div>
            </div>
            <div className="info">
              <div className="info-name">
                {toLocale('Price Impact')}
                {!isConfirm && <Tooltip
                  placement="right"
                  overlay={toLocale('Price Impact help')}
                >
                  <i className="help" />
                </Tooltip>
      }
              </div>
              <div className="info-value">
                {calc.mul(exchangeInfo.price_impact, 100).toFixed(2)}%
              </div>
            </div>
            <div className="info">
              <div className="info-name">
                {toLocale('Liquidity Provider Fee')}
                {!isConfirm && <Tooltip
                  placement="right"
                  overlay={toLocale('Liquidity Provider Fee help')}
                >
                  <i className="help" />
                </Tooltip>
      }
              </div>
              <div className="info-value">
                {!fee && '≈'}
                {util.precisionInput(fee, 8)}{' '}
                {getDisplaySymbol(baseToken.symbol)}
              </div>
            </div>
            {exchangeInfo.route && (
              <div className="info">
                <div className="info-name">
                  {toLocale('Route')}
                  <Tooltip
                    placement="right"
                    overlay={toLocale(
                      "Current pair can only swap through OKT, there's no direct pair for the 2 tokens."
                    )}
                  >
                    <i className="help" />
                  </Tooltip>
                </div>
                <div className="info-value">
                  <img className="coin" src={getCoinIcon(baseToken.symbol)} />
                  {getDisplaySymbol(baseToken.symbol)} &gt;{' '}
                  <img className="coin" src={getCoinIcon(exchangeInfo.route)} />
                  {getDisplaySymbol(exchangeInfo.route)} &gt;
                  <img className="coin" src={getCoinIcon(targetToken.symbol)} />
                  {getDisplaySymbol(targetToken.symbol)}
                </div>
              </div>
            )}
          </div>
        );
      }
    }
    return null;
  }

  getMinimumReceived(precision = 16) {
    const { targetToken } = this.state;
    const {
      setting: { slippageTolerance },
    } = this.props;
    return util.precisionInput(
      calc.mul(targetToken.value, 1 - slippageTolerance * 0.01),
      precision
    );
  }

  getBtn() {
    const { baseToken, targetToken, isPoolEmpty } = this.state;
    let btn;
    if (!util.isLogined()) {
      btn = (
        <Link to={getLangURL(PageURL.walletCreate)}>
          <div className="btn">{toLocale('Connect Wallet')}</div>
        </Link>
      );
    } else if (!baseToken.symbol || !targetToken.symbol) {
      btn = <div className="btn disabled">{toLocale('Invalid Pair')}</div>;
    } else if (isPoolEmpty) {
      btn = <div className="btn disabled">{toLocale('pool empty')}</div>;
    } else if (!Number(baseToken.value) || !Number(targetToken.value)) {
      btn = <div className="btn disabled">{toLocale('Input an amount')}</div>;
    } else if (baseToken.error) {
      btn = (
        <div className="btn disabled">
          {toLocale('insufficient', {
            coin: getDisplaySymbol(baseToken.symbol),
          })}
        </div>
      );
    } else {
      btn = <div className="btn" onClick={() => this.confirmDialog()}>{toLocale('Confirm')}</div>
    }
    return <div className="btn-wrap">{btn}</div>;
  }

  confirm = () => {
    const { okexchainClient } = this.props;
    const { baseToken, targetToken } = this.state;
    const params = [
      util.precisionInput(baseToken.value),
      baseToken.symbol,
      this.getMinimumReceived(),
      targetToken.symbol,
      getDeadLine4sdk(),
      util.getMyAddr(),
      '',
      null,
    ];
    return new Promise((resolve, reject) => {
      okexchainClient
        .sendSwapTokenTransaction(...params)
        .then((res) => {
          resolve(res);
          if (validateTxs(res)) {
            this.changeBase({ ...baseToken, value: '' });
          }
        })
        .catch((err) => reject(err));
    });
  };

  render() {
    const { baseToken, targetToken,showConfirmDialog,active } = this.state;
    const exchangeInfo = this.getExchangeInfo();
    const exchangeInfoConfirm = this.getExchangeInfo(true);
    const btn = this.getBtn();
    return (
      <div className="panel panel-swap">
        <CoinItem
          label={toLocale('From')}
          token={baseToken}
          onChange={this.changeBase}
          loadCoinList={this.loadBaseCoinList}
          max={true}
        />
        <div className="sep transformation-sep">
          <i onClick={this.exchange} />
        </div>
        <CoinItem
          label={toLocale('To(estimated)')}
          disabled={true}
          token={targetToken}
          onChange={this.changeTarget}
          loadCoinList={this.loadTargetCoinList}
        />
        {exchangeInfo}
        {btn}
        <Dialog visible={showConfirmDialog} hideCloseBtn>
          <div className="panel-dialog-info">
            <div className="panel-dialog-info-title">
              {toLocale('Confirm Swap')}
              <span className="close" onClick={() => this.confirmDialog(false)}>
                ×
              </span>
            </div>
            <div className="panel-dialog-info-content">
              <div className="panel-confirm">
                <div className="space-between coin">
                  <div className="left">
                    <img src={getCoinIcon(baseToken.symbol)}/>
                    {getDisplaySymbol(baseToken.symbol)}
                  </div>
                  <div className="right">
                    {util.precisionInput(baseToken.value, 8)}
                  </div>
                </div>
                <div className="down" />
                <div className="space-between coin">
                <div className="left">
                  <img src={getCoinIcon(targetToken.symbol)}/>
                  {getDisplaySymbol(targetToken.symbol)}
                </div>
                <div className={classNames('right',{red:active})}>
                  {util.precisionInput(targetToken.value, 8)}
                </div>
              </div>
              {active && <div className="space-between tip-info-warn tip-info-accept">
                <div className="left">{toLocale('Price Updated')}</div>
                <div className="right"><div className="btn" onClick={() => this.setState({active: false})}>{toLocale('Accept')}</div></div>
              </div>
              }
              <div className="tip-info-warn">
                {toLocale('swap warn tip',{num:this.getMinimumReceived(8),quote: getDisplaySymbol(targetToken.symbol)})}
              </div>
              {exchangeInfoConfirm}
              </div>
            </div>
            <div
              className='panel-dialog-info-footer'
            >
              <div className="btn1 cancel" onClick={() => this.confirmDialog(false)}>
                {toLocale('cancel')}
              </div>
              <div className={classNames('btn1',{loading: active})} onClick={this.triggerConfirm}>
                {toLocale('Confirm Swap')}
              </div>
            </div>
          </div>
        </Dialog>
        <Confirm
        onClick={this.confirm}
        loadingTxt={toLocale('pending transactions')}
        successTxt={toLocale('transaction confirmed')}
        getRef={(instance) => (this.confirmInstance = instance)}
      ></Confirm>
      </div>
    );
  }
}
