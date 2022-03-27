import React from "react";
import {getElfDispatch, getElfState, useElfSubscribe} from 'react-elf';
import {delay, noop} from './utils';
import {getSearchData} from './fetchData';
import {required} from './rules'
import {Select, SelectProps, Switch} from 'antd';
import {addFormItem} from '../.';


addFormItem('customizeSelect', function (props) {
    return <CompanySelect {...props} />;
});
const searchAction = function () {
    const dispatch = getElfDispatch('example');

    return delay(function (val) {
        // 这里模拟一个请求获取数据；
        getSearchData({key: val}).then((data) => {
            dispatch('setSearchOptions', data);
        });
    }, 300);
};

export default [{
    hidden: true,
    name: 'id',
}, {
    name: 'no_border_item',
    label: '无边框表单项',
    // className: 'auto-label-width important',
    itemProps: {
        // 无边框项一般多用于数据展示，因此这里 disabled 一般设置为true;
        disabled: true,
        // 无数据展示内容
        placeholder: '--',
        bordered: false
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


function Wrap({children}) {
    return (
        <section className="wrap-container" style={{border: '1px solid #f2f2f2', padding: 10}}>
            这里是一块区域
            <div style={{marginTop: 10}}>
                {children}
            </div>
        </section>
    )
}


function CompanySelect({onChange = noop, ...restProps}: SelectProps) {
    const [[searchOptions], dispatch] = useElfSubscribe(
        'example',
        'searchOptions'
    );

    function onValChange(val, item) {
        onChange(val, item);


        // TODO: some other things
    }

    return (
        <Select
            {...restProps}
            allowClear
            onSearch={searchAction()}
            options={searchOptions}
            filterOption={false}
            showSearch={true}
            dropdownMatchSelectWidth={false}
            onChange={onValChange}
        />
    );
}
