import React from 'react';
import { toLocale } from '_src/locale/react-locale';
import InputNum from '_component/InputNum';
import SelectCoin from '../SelectCoin';
import { getCoinIcon } from '../util/coinIcon';

export default class CoinItem extends React.Component {
  constructor() {
    super();
    this.state = {
      show: false,
    };
    this.hideCoinSelectList = this.hideCoinSelectList.bind(this);
  }

  onInputChange = (value) => {
    const { token } = this.props;
    this.props.onChange({ ...token, value });
  };

  setMaxValue = () => {
    const { token } = this.props;
    this.onInputChange(token.available);
  };

  showCoinSelectList = async (e) => {
    e.nativeEvent.stopImmediatePropagation();
    if (this.state.show) return;
    this.setState({ show: true });
  };

  hideCoinSelectList() {
    this.setState({ show: false });
  }

  componentDidMount() {
    this._bindEvent();
  }

  componentWillUnmount() {
    this._bindEvent(false);
  }

  _bindEvent(bind = true) {
    if (bind) {
      document.addEventListener('click', this.hideCoinSelectList, false);
    } else {
      document.removeEventListener('click', this.hideCoinSelectList, false);
    }
  }

  select = (coin) => {
    const { token } = this.props;
    this.hideCoinSelectList();
    this.props.onChange({ ...token, ...coin });
  };

  render() {
    const {
      label,
      token: { available, symbol, value },
      loadCoinList,
      disabled,
    } = this.props;
    const { show } = this.state;
    return (
      <div className="coin-item">
        <div className="coin-item-title">
          <div>{label}</div>
          <div className="txt">
            {toLocale('Balance')}: {available || '0.000000'}
            {available && !disabled && (
              <span className="max" onClick={this.setMaxValue}>
                MAX
              </span>
            )}
          </div>
        </div>
        <div className="coin-item-content">
          <div className="input">
            <InputNum
              type="text"
              value={value}
              onChange={this.onInputChange}
              placeholder="0.000000"
              disabled={disabled}
            />
          </div>
          <div className="coin-select" onClick={this.showCoinSelectList}>
            <img className="coin-icon" src={getCoinIcon(symbol)} />
            {symbol ? (
              <span className="text active">{symbol}</span>
            ) : (
              <span className="text">{toLocale('Select a token')}</span>
            )}
            <i className="iconfont" />
            {show && (
              <SelectCoin onSelect={this.select} loadCoinList={loadCoinList} />
            )}
          </div>
        </div>
      </div>
    );
  }
}
