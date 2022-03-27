import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import CnfForm from '../.';
import {Form} from 'antd';
import items from './formOptions';
import Store, {useElfSubscribe} from 'react-elf';
import reducers from "./reducers";
// parcel 引入less 错误提示：：Inline JavaScript is
// not enabled 暂时先使用css
import 'antd/dist/antd.css';
import ExampleForm from './form';

const App = () => {
    return (
        <>
            <Store reducers={reducers}/>
            <ExampleForm />
        </>
    );
};

ReactDOM.render(<App/>, document.getElementById('root'));

console.log('hello');
