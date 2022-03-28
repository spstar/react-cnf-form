### react-cnf-form

[![][bundlesize-js-image]][unpkg-js-url]

[bundlesize-js-image]: https://img.badgesize.io/https:/unpkg.com/react-cnf-form/dist/react-cnf-form.cjs.production.min.js?label=react_cnf_form.min.js&compression=gzip&style=flat
[unpkg-js-url]: https://unpkg.com/react-cnf-form/dist/react-cnf-form.cjs.production.min.js

react-cnf-form组件是在 antd form组件的基础上封装; 其目的是为了通过配置化实现form表单功能，简化form表单页的实现
让业务能够方便的拆分为各种组件。实现业务功能的解耦；方便其维护；

### 简单示例
```js
// options.js 配置项文件
export default [{
    hidden: true,
    name: 'id',
}, {
    // itemType: 'input',   // 默认类型为'input'可以省略；
    name: 'account',
    label: 'account',
    itemProps: {    // 如果不需要 对组件传入参数，该项也可以省略
    }
},
function (render) { // 一般在需要动态获取配置项数据时使用函数渲染
    return render([
        {
            itemType: 'password',
            label: 'password',
            name: 'password',
            required: true,
            rules: [{ required: true, message: 'Please input your password!' }],
            itemProps: {
                maxLength: 20
            }
        }
    ]);
}];
```
```js
// 在组件中使用 react-cnf-form 
import CnfForm from 'react-cnf-form';
import {Form, Button} from 'antd';
import items from './options';

export function Form() {
    const [formIns] = Form.useForm();
  
    function onFinish(values) {
        // TODO: process values;
    }
    return (
        <CnfForm form={formIns} items={items} onFinish={onFinish}>
            <section className="mt-10 btn-group-container">
                <Button htmlType="submit" type="primary">
                    submit
                </Button>
            </section>
        </CnfForm>    
    );
}
```


#### 说明
主要思想：
1. 不影响ant组件功能的所有配置，只提供配置化渲染功能
2. 增加几个额外必要的配置项来处理结构问题；以下是每条配置项中增加的配置项说明：\
    `itemType` 指定组件类型\
    `itemRender` 一般用来定义不能复用功能的组件（模块），提供该配置，itemType 会忽略；\
    `beforeContent` 用来渲染组件之前的内容\
    `afterContent` 用来渲染组件之后的内容\
    `itemProps` 配置 itemType 指定组件的配置项\
3. 通过提供一个`Wrap`组件来实现表单项目的分块\
```typescript
interface WrapOption {
    Wrap: ReactElement;
    items: ItemOptions;
    key?: any;
}
```
4. CnfForm 组件支持所有[antd From组件](https://ant-design.gitee.io/components/form-cn/#Form)的配置
```typescript
export interface CnfFromProps extends FormProps {
    form: FormInstance;
    items: ItemOptions;
}
```
由于form实例（FormInstance）在表单项中可能会经常遇到这里设置为了必选项；

5. `ItemOption` 配置项支持3中类型：对象、渲染函数、WrapOption
```typescript
type ItemOption = (Option | RenderFn | WrapOption);

type Render = (args: ItemOption | ItemOptions, fIns: FormInstance) => ReactNode[];
type RenderFn = (render: Render, fIns: FormInstance) => ReactNode[];
```
   `对象 Option` 支持所有antd [From.Item](https://ant-design.gitee.io/components/form-cn/#Form.Item) 的配置项
   `渲染函数RenderFn` 一般用于需要动态控制配置项的使用使用；
   `WrapOption` 对于复杂的表单经常需要分区块展示，这里提供了一个包裹组件配置来实现这种功能
   
6. 有些常用组件（文件上传预览模块等）可以通过`addFormItem`添加到组件库
```typescript
type CMPFunc = <T>(props: T) => ReactElement<T>;
type AddFormItem = (itemTypeName: string, CmpFunc: CMPFunc) => void;
```
```js
import {addFormItem} from 'react-cnf-form';

addFormItem('customizeSelect', function (props) {
    return <CSelect {...props} />;
});
```
```js
// options.js

[...,
{
    itemType: 'customizeSelect',
    label: 'customizeCMP',
    name: 'customize'
},...]
```

## FAQ
1. 支持哪些组件?
    
    `Input`: (itemType: 'input')可以不用填，默认就是'input'\
    `InputNumber`: (itemType: 'inputNumber')\
    `Input.TextArea`: (itemType: 'textarea')\
    `Input.Password`: (itemType: 'password')\
    `Cascader`: (itemType: 'cascader')\
    `Checkbox`: (itemType: 'checkbox')\
    `Checkbox.Group`: (itemType: 'checkboxGroup')\
    `Radio`: (itemType: 'radio')\
    `Radio.Group`: (itemType: 'radioGroup')\
    `Rate`: (itemType: 'rate')\
    `Switch`: (itemType: 'switch')\
    `DatePicker`: (itemType: 'datePicker')\
    `DatePicker.RangePicker`: (itemType: 'rangePicker')\
    `TimePicker`: (itemType: 'timePicker')\
    `Select`: (itemType: 'select')\
    `TreeSelect`: (itemType: 'treeSelect')\
    `Tree`: (itemType: 'tree')\
    `Mentions`: (itemType: 'mentions')\
    `Transfer`: (itemType: 'transfer')\
    `Upload`: (itemType: 'upload')
     
2. 隐藏字段怎么配置？\
    支持隐藏字段(Form.Item 本身就支持隐藏字段)，配置如下：\
    `{
        hidden: true,
        name: 'id'
     }`
3. 无边框展示字段，如果不想自定义一个特别的组件可以使用无边框Input:\
     支持展示字段（Input 字段可以设置无边框样式），配置如下：\
     `
     {
        name: 'description',
        itemProps: {
            disabled: true,
            bordered: false
        }
     }
     `
4. 如何动态增加一个自定义的组件?\
    参加上面说明中的第6条\
    注意，如果你需要自定义组件，那么你需要遵守ant-form 自定义Form.Item组件的规范，详细参考antd 的文档


其它关于antd `Form.Item` 的说明

有些字段其值并不是通过value 获取，如：`Switch`组件 可以通过[Form.Item](https://ant-design.gitee.io/components/form-cn/#Form.Item) 的`valuePropName`来指定；
Form.Item 内的组件如果不是`只有`一个children ，则需要指定单独的\
`<Form.Item nostyle ><Input /> </Form.Item>` \
包裹；在当前Form组件内部已经处理；但是如果配置项中使用`itemRender` 或者其它自定义的
`Item`项，需要接收value值并正确处理其值的改变；


