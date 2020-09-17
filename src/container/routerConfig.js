import PageURL from '_constants/PageURL';

import Home from '../pages/home/index';
import FullTrade from '../pages/fullTrade/FullTrade';
import OpenOrders from '../pages/orders/OpenList';
import HistoryOrders from '../pages/orders/HistoryList';
import DealOrders from '../pages/orders/DealsList';
import CreateWallet from '../pages/wallet/CreateWallet';
import ImportWallet from '../pages/wallet/ImportWallet';
import AssetsWallet from '../pages/wallet/Assets';
import NodeSetting from '../pages/nodeSetting';
import Register from '../pages/register';
import IssueToken from '../pages/issueToken';
import ListTokenpair from '../pages/listTokenpair';
import Dashboard from '../pages/dashboard';
import IssueDetail from '../pages/issueDetail';
import TokenpairDetail from '../pages/tokenpairDetail';
import Fees from '../pages/fees';

const routes = [
  {
    path: PageURL.homePage,
    component: Home,
  },
  {
    path: PageURL.spotFullPage,
    component: FullTrade,
  },
  {
    path: PageURL.spotOpenPage,
    component: OpenOrders,
  },
  {
    path: PageURL.spotHistoryPage,
    component: HistoryOrders,
  },
  {
    path: PageURL.spotDealsPage,
    component: DealOrders,
  },
  {
    path: PageURL.spotDefaultPage,
    component: FullTrade,
  },
  {
    path: PageURL.walletCreate,
    component: CreateWallet,
  },
  {
    path: PageURL.walletImport,
    component: ImportWallet,
  },
  {
    path: PageURL.walletAssets,
    component: AssetsWallet,
  },
  {
    path: PageURL.walletTransactions,
    component: AssetsWallet,
  },
  {
    path: PageURL.nodeSettingPage,
    component: NodeSetting,
  },
  {
    path: PageURL.registerPage,
    component: Register,
  },
  {
    path: PageURL.issueTokenPage,
    component: IssueToken,
  },
  {
    path: PageURL.listTokenpairPage,
    component: ListTokenpair,
  },
  {
    path: PageURL.dashboardPage,
    component: Dashboard,
  },
  {
    path: PageURL.issueDetailPage,
    component: IssueDetail,
  },
  {
    path: PageURL.tokenpairDetailPage,
    component: TokenpairDetail,
  },
  {
    path: PageURL.feesPage,
    component: Fees,
  },
];

export default routes;
