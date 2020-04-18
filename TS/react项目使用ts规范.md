
## react项目使用TS相关规范和简单入门

### 基本规范
#### TS接口定义/枚举 命名规范
• 名字要具有语义化
• 枚举和接口首字母均要大写
• 接口：Ixxxx，首字母I 开头大写
• 枚举：xxxEnum，枚举以Enum 结尾
interface 命名规范：IXXX (例如：IStatusRecordModel)
定义枚举规范: enum XXXEnum  
例如：
```js
export enum AccountBankQueryEffectsEnum {
  /**
   * 账户行列表查询
   */
  RouteQueryFacade = 'routeQueryFacade',
}
```
#### 项目全局公共常量配置 
'src/constants/index.ts';
```js
/**
 * 项目路径前缀
 */
export const pathPre = '/pagegw';
```
#### 配置接口返回类型
#### types/utils.ts
```js
export interface ResponseType<T> {
  success: boolean;
  errorContext: any;
  resultObj: T;
  [key: string]: any;
}
export interface IRequestConfig<T = any> {
  showErrorMessage?: boolean;
  getErrorMsg?: (data: T) => string;
  isReject?: boolean;
}
/*
* 全局window 禁止配置
*/
 
declare global {
  interface Window {
    Tracker: Tracker;
    MOCK: boolean;
    ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION: any;
  }
}
```
#### DVA 全局配置
```js
import {
  ReducersMapObjectWithEnhancer,
  EffectsMapObject,
  SubscriptionsMapObject,
  RouterAPI,
} from 'dva';
import { Reducer } from 'redux';
// 使用redux-v4.x的ReducerMapObject会导致dva reducer中的action payload等参数无法确定类型（dva中使用的是3.x的redux）
// 这里从redux v3.x中找到了对应的ReducersMapObject以解决上述问题
export interface ReduxV3ReducersMapObject {
  [key: string]: Reducer<any>;
}
/**
 * @type P: Type of payload
 * @type C: Type of callback
 */
export type Dispatch = <P = any, C = (payload: P) => void>(action: {
  type: string;
  payload?: P;
  callback?: C;
  [key: string]: any;
}) => any;
declare global {
  interface DvaModel<T = any> {
    namespace: string;
    state?: T;
    // reducers?: ReducersMapObject | ReducersMapObjectWithEnhancer;
    reducers?: ReduxV3ReducersMapObject | ReducersMapObjectWithEnhancer;
    effects?: EffectsMapObject;
    subscriptions?: SubscriptionsMapObject;
  }
  interface DvaAction<P = any, C = any> {
    type: string;
    payload?: P;
    callback?: C;
    [key: string]: any;
  }
  interface ConnectProps<T extends Record<string, any> = {}> extends RouterAPI {
    dispatch: Dispatch;
  }
}
```

### 项目页面代码编写
#### 页面结构
• onepage(页面名称)
• index.tsx
• model.ts
• constant.tsx
• services.ts
• types.ts
#### index.tsx
```js
import { WrappedFormInternalProps } from 'antd/lib/form/Form';
import { connect } from '@alipay/bigfish/sdk';
import withPageForm from '@/component/withPageForm';
import { PaginationConfig } from 'antd/lib/table';
import { namespace, AccountBankQueryEffectsEnum } from './model';
import { getDictColumns, pageParams, effectRequestType } from './constant';
import { IStatusRecordModel } from './type';
// WrappedFormInternalProps： 继承form类，可以理解form所有属性都包含在此接口中. 
// ConnectProps：dva connect上所有属性。
/*
* BankQueryProps继承自WrappedFormInternalProps和ConnectProps和 自定义props属性{
*  pagination: PaginationConfig;
*  portfolioList: AccountBankModelState[];
*   }
*简单理解：BankQuery这个组件的props包含以上你定义的所有属性，这样在组件里就可以自由使用了
*/
export interface BankQueryProps extends WrappedFormInternalProps, ConnectProps {
  pagination: PaginationConfig;
  portfolioList: AccountBankModelState[];
}
// 新的react声明文件里，也定义了React.FC类型
const AccountBankQuery: React.FC<BankQueryProps> = ({ dispatch, IPortfolioList, pagination }) => {
  const tableQuery = (payload: object) => {
    dispatch({
      type: effectRequestType,
      payload,
    });
  };
  useEffect(() => {
    tableQuery(pageParams);
  }, []);
  const handleChange = (current: number) => {
    const queryParams = {
      ...pageParams,
      pageNum: current,
    };
    tableQuery(queryParams);
  };
  const paginationProps: PaginationConfig = {
    ...pagination,
    defaultPageSize: 10,
    onChange: handleChange,
    showTotal: (total: number) => `共 ${total} 条记录`,
  };
  return (
    <Table
      rowKey="key"
      columns={getDictColumns}
      dataSource={addKey(IPortfolioList || [])}
      pagination={paginationProps}
    />
  );
};
export default Form.create()(connect(({ accBankQuery, loading }: any) => ({
  ...accBankQuery,
  loading,
}))(
  withPageForm({
    title: '账户行',
    list: [effectRequestType],
  })(AccountBankQuery)
));
```

#### model.ts
```js
// types/utils.ts
export interface ResponseType<T> {
  success: boolean;
  errorContext: any;
  resultObj: T;
  [key: string]: any;
}
/*
*ResponseType 定义返回结果类型，泛型使用时候自定义，具体示例参考查询账户列表返回值写法：
*const { resultObj, paginator }: ResponseType<portfolioList[]>
*/
import { PaginationConfig } from 'antd/lib/table';
import { ResponseType } from '@/types/utils';
import { routeQueryFacade } from './service';
import { IStatusRecordModel } from './type';
export interface IAccountBankModelState {
  IPortfolioList: IStatusRecordModel[];
  pagination: PaginationConfig;
}
  
export enum AccountBankQueryEffectsEnum {
  /**
   * 账户行列表查询
   */
  RouteQueryFacade = 'routeQueryFacade',
}
export const namespace = 'accBankQuery'; 
  
  // types/env/dva.d.ts
  /*
   interface DvaModel<T = any> {
    namespace: string;
    state?: T;
    reducers?: ReduxV3ReducersMapObject | ReducersMapObjectWithEnhancer;
    effects?: EffectsMapObject;
    subscriptions?: SubscriptionsMapObject;
  }
  */ 
const ModelNameModel: DvaModel<IAccountBankModelState> = {
  namespace,
  state: {
    portfolioList: [],
    pagination: {
      current: 0,
      total: 0,
    },
  },
  effects: {
    *[AccountBankQueryEffectsEnum.RouteQueryFacade]({ payload }, { call }) {
      // 查询账户列表
      const { resultObj, paginator }: ResponseType<IStatusRecordModel[]> = yield call(
        routeQueryFacade,
        payload,
        {
          showErrorMessage: true,
        },
       // put...
      );
     
      return resultObj;
    },
  },
  reducers: {
    save(state, { payload = {} }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};
export default ModelNameModel;
```
#### service.ts
```js
import request from '@/util/request';
import { IRequestConfig } from '@/types/utils';
export async function routeQueryFacade(data = {}, errFlag: IRequestConfig) {
  return request(
    `interfaceName接口名称`,
    {
      data: {
        ...data,
        aa: 'aaa',
        bb: 'bbb',
      },
    },
    errFlag,
  );
}
```
#### constant.tsx
```js
import React from '@alipay/bigfish/react';
import Link from '@alipay/bigfish/link';
import { ColumnProps } from 'antd/lib/table';
import { pathPre } from '@/constants';
import { IStatusRecordModel } from './type';
import { namespace, AccountBankQueryEffectsEnum } from './model';
export const getDictColumns: ColumnProps<IStatusRecordModel>[] = [
  {
    title: '开户币种',
    dataIndex: 'creditorCurrency',
  },
  {
    title: '操作',
    dataIndex: 'operation',
    fixed: 'right',
    // text 未使用到，使用下划线_text ts会认为不使用任何参数
    render: (_text: string, { routeId }: IStatusRecordModel): React.ReactNode => {
      /*
      *'@/constants'; pathPre 公共项目路径前缀 
      */
      const detailsUrl = `${pathPre}/xxx?routeId=${routeId}`;
      return (
          <Link to={saveUrl} target="_blank">去处理</Link>
      );
    }
  },
].map(item => ({
  ...item,
  align: 'center'
}));
export const effectRequestType = `${namespace}/${aa}`
```
#### type.ts
```ts
export interface IStatusRecordModel {
  creditorCurrency: string;
  routeId: string;
  name: string;
  receiveAgent?: object;
}
```

#### 组建封装
• 保留内部组建的可扩展性，不要把内部组建给封装死
• 一个封装drawer的示例，内部封装 提供确认和取消按钮
```js
import React, { memo } from '@alipay/bigfish/react';
import { Drawer, Button } from '@alipay/bigfish/antd';
import { DrawerProps } from 'antd/lib/drawer';
export interface ConfirmDrawerProps {
  onOk(data?: any): void;
  showFooter?: boolean;
  visible:boolearn
  // 保留住Drawer 原有的配置扩展
  drawerProps:DrawerProps
}
const ConfirmDrawer: React.FC<ConfirmDrawerProps> = memo(
  ({ showFooter, onOk, children, drawerProps={},visiable }) => (
    <Drawer
      width={520}
      maskClosable
      bodyStyle={{
        paddingBottom: 0,
        display: 'flex',
        flexDirection: 'column',
        height: 'calc(100vh - 55px)',
      }}
            visiable={visiable}
            // 保留住Drawer 原有的配置扩展
      {...drawerProps}
    >
      <div
        style={{
          flex: 1,
          paddingBottom: 20,
          height: `calc(100vh - ${showFooter !== false ? 108 : 0}px)`,
          overflowY: 'auto',
        }}
      >
        {children}
      </div>
      {showFooter !== false && (
        <div
          style={{
            left: 0,
            bottom: 0,
            width: '100%',
            borderTop: '1px solid #e8e8e8',
            padding: '10px 16px',
            textAlign: 'right',
            background: '#fff',
            borderRadius: '0 0 4px 4px',
            zIndex: 90,
          }}
        >
          <Button
            style={{ marginRight: 8 }}
            onClick={rest.onClose as React.MouseEventHandler<HTMLElement>}
          >
            取消
          </Button>
          <Button onClick={onOk} type="primary">
            确定
          </Button>
        </div>
      )}
    </Drawer>
  ),
);
ConfirmDrawer.defaultProps = {
  showFooter: true,
  onOk: () => {},
} as Partial<ConfirmDrawerProps>;
export default ConfirmDrawer;
```