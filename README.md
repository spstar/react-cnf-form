### react-cnf-form


[![][bundlesize-js-image]][unpkg-js-url]

[bundlesize-js-image]: https://img.badgesize.io/https:/unpkg.com/react-cnf-form/dist/react-cnf-form.cjs.production.min.js?label=react%20cnf%20form.min.js&compression=gzip&style=flat
[unpkg-js-url]: https://unpkg.com/react-cnf-form/dist/react-cnf-form.cjs.production.min.js


### 功能说明 
本（CnfForm）表单组件是在 antd form组件的基础上封装; 其目的是为了通过配置化实现form表单功能，简化form表单页的实现
让业务能够方便的拆分为各种组件。实现功能的解耦；

### 简单实用示例
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
    function (render) {
        const {searchOptions} = getElfState('example');

        return render([
            {
                itemType: 'select',
                label: '带搜索功能的选择框',
                name: 'agentCode',
                required: true,
                rules: required,
                // className: 'flex-item-control-hidden',
                itemProps: {
                    filterOption: false,
                    showSearch: true,
                    onSearch: searchAction(),
                    dropdownMatchSelectWidth: false,
                    options: searchOptions
                }
            }
        ]);
    }, {
        Wrap: Wrap,
        items: [{
            label: '模块内的项',
            name: 'modelItem',
            itemProps: {
                maxLength: 5
            }
        }, function (render) {
            const {disabledBtn} = getElfState('example');

            return render([
                {
                    itemType: 'radioGroup',
                    name: 'trigger',
                    label: '开关',
                    required: true,
                    rules: required,
                    beforeContent() {
                        function onChange(checked) {
                            getElfDispatch('example')('setDisabledBtn', !checked);
                        }

                        return (
                            <div style={{marginTop: 6}}>
                                <Switch defaultChecked onChange={onChange}/>
                            </div>
                        );
                    },
                    itemProps: {
                        disabled: disabledBtn,
                        style: {marginTop: 6},
                        options: [
                            {
                                label: '开启',
                                value: '1'
                            },
                            {
                                label: '关闭',
                                value: '0'
                            }
                        ]
                    },
                    afterContent(option, formIns, render) {
                        return (
                            <div>可以动态控制该字段是否启用</div>
                        );
                    }
                }
            ]);
        }]
    },
    {
        label: '自定义组件',
        name: 'customizeCMP',
        className: 'mt-10',
        itemRender() {
            return <CompanySelect/>
        }
    },
    {
        itemType: 'customizeSelect',
        label: '自定义组件类型',
        name: 'customizeSelect',
        className: 'mt-10'
    }
];

```

## 常规使用示例

## 关于表单字段的布局

## FAQ

1. 支持哪些组件?
    `Cascader`: (itemType: 'cascader')\
    `Checkbox`: (itemType: 'checkbox')\
    `CheckboxGroup`: (itemType: 'checkboxGroup')\
    `Radio`: (itemType: 'radio')\
    `RadioGroup`: (itemType: 'radioGroup')\
    `Rate`: (itemType: 'rate')\
    `Switch`: (itemType: 'switch')\
    `DatePicker`: (itemType: 'datePicker')\
    `RangePicker`: (itemType: 'rangePicker')\
    `TimePicker`: (itemType: 'timePicker')\
    `Select`: (itemType: 'select')\
    `TreeSelect`: (itemType: 'treeSelect')\
    `Mentions`: (itemType: 'mentions')\
    `Transfer`: (itemType: 'transfer')\
    `Upload`: (itemType: 'upload')\
    
    `InputNumber`: (itemType: 'inputNumber')\
    `Input`: (itemType: 'input')可以不用填，默认就是'input'\
    
    对于支持的组件应该如何配置：\
    - 常规配置 `option`
    所有配置项均为可选字段，但是当name 和 key（被用作ReactElement.key使用） 都不存在时渲染之后会生成一个警告当所有字段都不传，将生成一个空的Input字段；
    `[{
        // 除了默认的 "input" 类型无需指定外，其它类型需要通过"itemType"指定当前字段类型
       itemType: 'select' ,
       // Form.Item 内的内容渲染，返回的内容放到"item"之前； 接收两个参数
       // option: {Object} 当前配置项的对象
       // FormIns: {Form} 传入Form 组件的 form 对象（一般是使用useForm生成的指定当前Form的对象）
       beforeContent: (option: Object, form: FormIns) => React.Node,
       // Form.Item 内放到Item之后的内容；
       afterContent: (option: Object, form: FormIns) => React.Node,
       // itemRender 用来动态渲染Form.Item内的内容（当有些字段除了表单字段外还需要一些不能通过beforeContent/afterContent实现之外的功能）
       itemRender: (option: Object, from: FormIns) => Item,
       // 所有组件需要的属性全部放入itemProps中；antd 的组件，支持所有antd官方支持的属性；
       // 除了antd 的配置项之外，还增加了一个 children 属性，该属性放到组件内部；
       // 注意:: 有很多组件（如：input/textarea/rate）是不支持children属性的，所以即使传入children也不支持； 
       itemProps: {...IetmProps},
       // 当前组件的唯一标识，该值被用作React.key使用，如果没有该字段，会使用name字段做key;
       key,
       // 其它字段都会被用作Form.Item的属性使用！
       ...
    }]`
     
    其它常用组件内置支持：
    支持隐藏字段(Form.Item 本身就支持隐藏字段)，配置如下：
    `
        {
             itemType: 'input', // 该项可以省略，默认就是 'input';
             hidden: true,
             name: 'id'
         }
     `
     支持展示字段（Input 字段可以设置无边框样式），配置如下：
     `
     {
        name: 'description',
        itemProps: {
            bordered: false
        }
     }
     `
     - 函数配置：\
     可能经常会遇到动态关联的字段，这时候需要使用函数配置项；\
     当有些字段内置没有，也不想通过(动态添加)[#动态添加字段]或者更常见的场景：有关联关系字段，这时候可以使用函数渲染\
     `
     // 如果当前配置项是一个函数，则：该函数接收一个render函数，调用该render函数传递对应的配置项；
     // 接收form 对象，该对象即创建form组件传入的form对象，如果没有传入为undefined；
     // 该函数一般直接返回 render 函数作为返回值；
     // render([...configs]) => renderItems(configs)
     function (render: (configs) => renderItems(configs), form: FormIns) => Item
     `
     
     - 表单组件分组：\
     当表单字段过多的时候，需要使用字段分组；这里的实现是传入一个`Wrap`组件，当前配置项下面的items会渲染到`Wrap`组件内\
     配置项说明：\
     `
     {
        key: 'section1',
        Wrap: ReactNode,
        items: [{
            name: 'mobile'
        }, {
            name: 'user'
        }, ...otherOptions]
     }
     `
     
    
2. 不支持的antd中的Form组件 (不支持的组件，可以通过(自定组件)[#]追加进去)
    `AutoComplete`/`Form.List`/`Slider`
    
3. 如何动态增加一个自定义的组件
 
一般情况下并不需要添加自定义类型，如果是当前系统自定义的业务组件可能需要使用该功能\
```typescript
    import {addCustomizeItem} from 'customize-form';
    
    // addCustomizeItem 第一个参数是当前项的配置对象；接收的第二个参数是一个HOC函数
    // 该类型返回值最终会被渲染到 Form.Item 下面，作为Form.Item的children
    addCustomizeItem('myItemTypeName', (option: Object, itemProps: Object) => React.Node);
```
注意，如果你需要自定义组件，那么你需要遵守ant-form 自定义Form.Item组件的规范，详细参考antd 的文档

4. 其它关于antd `Form`/`Form.Item` 的功能说明

有些字段其值并不是通过value 获取，如：`Switch`组件 可以通过Form.Item 的`valuePropName`来指定；
Form.Item 内的组件如果不是`只有`一个children ，则需要指定单独的\
`<Form.Item nostyle ><Input /> </Form.Item>` 包裹；在当前Form组件内部已经处理；但是如果配置项中使用`itemRender` 或者其它自定义的
`Item`项，需要接收value值并正确处理其值的改变；

    ...
    ...


