const SpotTradeActionType = {
  FETCH_PRODUCT_LIST: 'FETCH_PRODUCT_LIST',
  FETCH_SUCCESS_PRODUCT_LIST: 'FETCH_SUCCESS_PRODUCT_LIST',
  FETCH_ERROR_PRODUCT_LIST: 'FETCH_ERROR_PRODUCT_LIST',
  UPDATE_FAVORITE_LIST: 'UPDATE_FAVORITE_LIST', // // 桌面版新增，本地缓存收藏列表


  FETCH_CURRENCY_LIST: 'FETCH_CURRENCY_LIST',
  FETCH_SUCCESS_CURRENCY_LIST: 'FETCH_SUCCESS_CURRENCY_LIST',
  FETCH_ERROR_CURRENCY_LIST: 'FETCH_ERROR_CURRENCY_LIST',

  UPDATE_TICKER: 'UPDATE_TICKER',
  UPDATE_HOUR_RATE: 'UPDATE_HOUR_RATE',

  FETCH_IS_TRADEPWD: 'FETCH_IS_TRADEPWD',


  FETCH_ASSETS: 'FETCH_ASSETS',
  FETCH_UPDATE_ASSETS: 'FETCH_UPDATE_ASSETS',
  FETCH_SUCCESS_ASSETS: 'FETCH_SUCCESS_ASSETS',
  FETCH_ERROR_ASSETS: 'FETCH_ERROR_ASSETS',
  REFRESH_ASSETS: 'REFRESH_ASSETS',

  FETCH_DEPTH: 'FETCH_DEPTH',
  FETCH_CLEAR_UPDATE_DEPTH: 'FETCH_CLEAR_UPDATE_DEPTH',
  UPDATE_DEPTH: 'UPDATE_DEPTH',
  UPDATE_DEPTH200: 'UPDATE_DEPTH200',

  UPDATE_FULLDEPTH: 'UPDATE_FULLDEPTH',

  KNEW_AUTO_BORROW: 'KNEW_AUTO_BORROW',

  FETCH_DEALS: 'FETCH_DEALS',
  FETCH_SUCCESS_DEALS: 'FETCH_SUCCESS_DEALS',
  FETCH_ERROR_DEALS: 'FETCH_ERROR_DEALS',

  WS_UPDATE_DEALS: 'WS_UPDATE_DEALS',
  CLEAR_DEALS: 'CLEAR_DEALS',

  FETCH_CALLMARKET: 'FETCH_CALLMARKET',
  REMOVE_CALLMARKET_DATA: 'REMOVE_CALLMARKET_DATA',

  FETCH_ALLORDERS_SYMBOL_CHANGE: 'FETCH_ALLORDERS_SYMBOL_CHANGE',

  FETCH_MARGIN_HISTORY: 'FETCH_MARGIN_HISTORY',
  FETCH_SUCCESS_MARGIN_HISTORY: 'FETCH_SUCCESS_MARGIN_HISTORY',
  FETCH_ERROR_MARGIN_HISTORY: 'FETCH_ERROR_MARGIN_HISTORY',

  FETCH_UPDATE_MARGIN_HISTORY_CHK: 'FETCH_UPDATE_MARGIN_HISTORY_CHK',
  FETCH_CHANGE_PAG_MARGIN_HISTORY: 'FETCH_CHANGE_PAG_MARGIN_HISTORY',

  FETCH_BILLS: 'FETCH_BILLS',
  FETCH_SUCCESS_BILLS: 'FETCH_SUCCESS_BILLS',
  FETCH_ERROR_BILLS: 'FETCH_ERROR_BILLS',

  FETCH_BILLS_TYPES: 'FETCH_BILLS_TYPES',
  FETCH_SUCCESS_BILLS_TYPES: 'FETCH_SUCCESS_BILLS_TYPES',
  FETCH_ERROR_BILLS_TYPES: 'FETCH_ERROR_BILLS_TYPES',

  FETCH_MARGIN_BILLS_TYPES: 'FETCH_MARGIN_BILLS_TYPES',
  FETCH_SUCCESS_MARGIN_BILLS_TYPES: 'FETCH_SUCCESS_MARGIN_BILLS_TYPES',
  FETCH_ERROR_MARGIN_BILLS_TYPES: 'FETCH_ERROR_MARGIN_BILLS_TYPES',

  FETCH_UPDATE_BILLS_CHK: 'FETCH_UPDATE_BILLS_CHK',
  FETCH_CHANGE_PAG_BILLS: 'FETCH_CHANGE_PAG_BILLS',

  FETCH_USET_MARGIN_SETTING: 'FETCH_USET_MARGIN_SETTING',
  FETCH_SUCCESS_USER_MARGIN_SETTING: 'FETCH_SUCCESS_USER_MARGIN_SETTING',
  FETCH_ERROR_USER_MARGIN_SETTING: 'FETCH_ERROR_USER_MARGIN_SETTING',

  GET_SUCCESS_MARGIN_ACCOUNT: 'GET_SUCCESS_MARGIN_ACCOUNT',
  GET_ERROR_MARGIN_ACCOUNT: 'GET_ERROR_MARGIN_ACCOUNT',
  GET_SUCCESS_MARGIN_CANDY: 'GET_SUCCESS_MARGIN_CANDY',
  GET_ERROR_MARGIN_CANDY: 'GET_ERROR_MARGIN_CANDY',

  FETCH_KLINE_DATA: 'FETCH_KLINE_DATA',
  FETCH_SUCCESS_KLINE_DATA: 'FETCH_SUCCESS_KLINE_DATA',

  FETCH_UPDATE_WS_MARGINASSETS: 'FETCH_UPDATE_WS_MARGINASSETS',
  UPDATE_MARGIN_TRANSFER: 'UPDATE_MARGIN_TRANSFER',
  UPDATE_TRANSFER: 'UPDATE_TRANSFER',
  FETCH_UPDATE_MARGIN_LOAN: 'FETCH_UPDATE_MARGIN_LOAN',
  FETCH_UPDATE_MARGIN_REPAYMENT: 'FETCH_UPDATE_MARGIN_REPAYMENT',
  FETCH_UPDATE_MARGIN_REPAY_CANDY: 'FETCH_UPDATE_MARGIN_REPAY_CANDY',
  UPDATE_USER_MARGIN_SETTING: 'UPDATE_USER_MARGIN_SETTING',

  UPDATE_SPOT_OR_MARGIN: 'UPDATE_SPOT_OR_MARGIN',
  FETCH_SUCCESS_ENTRUST_PLAN: 'FETCH_SUCCESS_ENTRUST_PLAN',
  FETCH_ERROR_ENTRUST_PLAN: 'FETCH_ERROR_ENTRUST_PLAN',
  FETCH_SUCCESS_HISTORY_ENTRUST: 'FETCH_SUCCESS_HISTORY_ENTRUST',
  FETCH_ERROR_HISTORY_ENTRUST: 'FETCH_ERROR_HISTORY_ENTRUST',

  FETCH_ERROR: 'FETCH_ERROR',

  UPDATE_FEE: 'UPDATE_FEE' // 更新费率
};
export default SpotTradeActionType;
