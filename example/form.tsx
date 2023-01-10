import 'react-app-polyfill/ie11';
import * as React from 'react';
import CnfForm from '../.';
import { Button, Form, Input } from 'antd';
import items from './formOptions';
import { useElfSubscribe } from 'react-elf';
import './index.scss';

const { useState } = React;

export default function ExampleForm() {
  const [formIns] = Form.useForm();
  const [fieldsStr, setFieldsStr] = useState('');

  // 订阅searchOptions 的更新：
  const [[]] = useElfSubscribe('example', ['searchOptions', 'disabledBtn']);

  function onFinish(values) {
    setFieldsStr(JSON.stringify(values, null, 4));
  }

  function onReset() {
    formIns.resetFields();
  }

  return (
    <div className="example-form">
      <h2>介绍当前组件主要功能使用的示例</h2>
      <p>
        详细使用文档请参考{' '}
        <a
          href="https://ant-design.gitee.io/components/form-cn/"
          target="_blank"
        >
          antd From
        </a>{' '}
        的文档使用
      </p>
      <ul>
        <li>
          CnfForm 组件支持所有
          <a
            href="https://ant-design.gitee.io/components/form-cn/#Form"
            target="_blank"
          >
            antd Form
          </a>{' '}
          的配置
        </li>
        <li>
          每一条配置项支持所有{' '}
          <a href="https://ant-design.gitee.io/components/form-cn/#Form.Item">
            From.Item
          </a>{' '}
          的配置 在此基础上又增加了三个配置方法：
          <br />
          {`itemRender?: (option: Option, fIns: FormInstance) => ReactChild | ReactChildren;`}
          <br />
          {`beforeContent?: (option: Option, fIns: FormInstance, render: Render) => any;`}
          <br />
          {`afterContent?: (option: Option, fIns: FormInstance, render: Render) => any;`}
          <br />
        </li>
        <li>
          每一条项配置通过 itemType 指定组件类型，默认是'input'类型；
          <br />
        </li>
        <li>
          所有antd
          内置的组件配置项都放到itemProps对象下面，对应的组件配置项参考对应的配置即可；
        </li>
        <li>
          核心原则不影响antd
          组件的任何功能使用，只是同过配置项的方式让form表单页面实现更简单；
          最重要的是可以简单的拆分组件，让重复的代码自动渲染，使业务解耦；
        </li>
        <li>关于样式的问题，通过CSS来控制；</li>
        <li>关于表单项的控制通过配置；</li>
      </ul>
      <span>
        下面的表单样式有些丑陋，其主要是用来展示 react-cnf-form 如何配置使用
      </span>
      <hr />
      <CnfForm form={formIns} items={items} onFinish={onFinish}>
        <section className="mt-10 btn-group-container">
          <Button htmlType="submit" type="primary">
            提 交
          </Button>
          <Button className="ml-8" htmlType="button" onClick={onReset}>
            重 置
          </Button>
        </section>
      </CnfForm>
      <div className="mt-10" style={{ paddingBottom: 100 }}>
        <Input.TextArea
          autoSize={{ minRows: 10 }}
          value={fieldsStr}
          className="Textarea"
        />
      </div>
    </div>
  );
}
