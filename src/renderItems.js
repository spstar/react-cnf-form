
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
    Form,
    Select,
    DatePicker,
    Input,
    Switch,
    Checkbox,
    Radio,
    Upload,
    InputNumber,
    Cascader,
    Rate,
    TimePicker,
    TreeSelect,
    Tree,
    Transfer,
    Mentions
} from 'antd';
import { getCustomizeItem } from './index.js';
import noop from 'lodash/noop';

const CheckBoxGroup = Checkbox.Group;
const RadioGroup = Radio.Group;
const { TextArea } = Input;
const { Item } = Form;
const { RangePicker } = DatePicker;
const { Password } = Input;

function ItemType(itemType, props = {}) {
    const { children, ...itemProps } = props;
    const CustomizeItem = getCustomizeItem(itemType);

    if (CustomizeItem) {
        return CustomizeItem(itemProps);
    }

    switch (itemType) {
        case 'upload':
            return <Upload {...itemProps}>{children}</Upload>;
        case 'radio':
            return <Radio {...itemProps}>{children}</Radio>;
        case 'radioGroup':
            return <RadioGroup {...itemProps}>{children}</RadioGroup>;
        case 'switch':
            return <Switch {...itemProps} />;
        case 'customizeRadioGroup': {
            const { syncUpdate = noop } = itemProps;
            return (
                <CustomizeRadioGroup syncUpdate={syncUpdate} {...itemProps}>
                    {children}
                </CustomizeRadioGroup>
            );
        }
        case 'checkbox':
            return <Checkbox {...itemProps}>{children}</Checkbox>;
        case 'checkboxGroup':
            return <CheckBoxGroup {...itemProps}>{children}</CheckBoxGroup>;
        case 'select': {
            const { options, optionsDataTransKey, ...restProps } = itemProps;
            let data = options;

            if (Array.isArray(options) && optionsDataTransKey) {
                data = options.map((it) => ({
                    label: it[optionsDataTransKey.label],
                    value: it[optionsDataTransKey.value]
                }));
            }

            return (
                <Select placeholder="请选择" options={data} {...restProps}>
                    {children}
                </Select>
            );
        }
        case 'treeSelect': {
            return (
                <TreeSelect placeholder="请选择" {...itemProps}>
                    {children}
                </TreeSelect>
            );
        }
        case 'tree': {
            return (
                <Tree placeholder="请选择" {...itemProps}>
                    {children}
                </Tree>
            );
        }
        case 'cascader':
            return (
                <Cascader placeholder="请选择" {...itemProps}>
                    {children}
                </Cascader>
            );
        case 'mentions':
            return <Mentions {...itemProps}>{children}</Mentions>;
        case 'transfer':
            return <Transfer {...itemProps}>{children}</Transfer>;
        case 'datePicker':
            return <DatePicker {...itemProps} />;
        case 'rangePicker':
            return <RangePicker {...itemProps} />;
        case 'rangeTimePicker':
            return <RangePicker {...itemProps} showTime />;
        case 'timePicker':
            return <TimePicker {...itemProps} />;
        case 'rate':
            return <Rate {...itemProps} />;
        case 'textarea':
            return <TextArea placeholder="请输入" {...itemProps} />;
        case 'inputNumber':
            return <InputNumber {...itemProps} />;

        case 'password':
            return <Password {...itemProps} />;

        default:
            return <Input placeholder="请输入" {...itemProps} />;
    }
}

// render beforeContent afterContent key itemProps itemType
function renderItem(option, form) {
    const {
        itemRender,
        itemProps,
        itemType,
        beforeContent = noop,
        afterContent = noop,
        key,
        name,
        rules,
        ...rest
    } = option;

    return (
        <Item {...rest} key={key || name}>
            {beforeContent(option, form, renderItem)}
            <Item noStyle name={name} rules={rules} {...rest}>
                {typeof itemRender === 'function'
                    ? itemRender(option, form)
                    : ItemType(itemType, itemProps, form)}
            </Item>
            {afterContent(option, form, renderItem)}
        </Item>
    );
}

/**
 * 这是一个递归渲染表单项的功能组件：
 *  1. 支持配置项传递一个函数； 函数接收一个渲染函数和当前form对象（如果有传递）；
 *  2. 支持块级嵌套，表单可以分区分块；
 *  3. 支持普通的Json 配置对象；
 *
 *  [
 *      {
 *        itemType: 'Select',
 *        name: 'field1',
 *        itemProps: {
 *          options: [{
 *            label: '中国',
 *            value: 'zh-cn'
 *          }]
 *        }
 *      },
 *      function (render) {
 *        return render([{name: 'name', itemType: 'text' }])
 *      }
 *  ]
 * @param formItems {Array}
 * @param form {Object|undefined}
 * @returns {any[]}
 */
export default function renderItems(formItems, form) {
    return formItems.map((it, idx) => {
        // 如果配置项是 null/undefined/numbers/booleans/string 直接返回
        if (!['object', 'function'].includes(typeof it) || !it) return it;

        // -1. (!!不建议外部使用) 配置项是一个数组会递归当前项；文档说明里面不提供此种用法，不建议配置项传递数组；
        /** !! 数组配置可能随时会被考虑去掉！ */
        if (Array.isArray(it)) {
            return renderItems(it, form);
        }
        // 1. 当前配置项是一个函数
        if (typeof it === 'function') {
            return it((configs) => renderItems(configs, form), form);
        }
        // 2. 当前配置项是一个快
        if (it.Wrap) {
            return (
                <it.Wrap key={it.key || idx}>
                    {renderItems(it.items, form)}
                </it.Wrap>
            );
        }
        //  3. 当前配置项 是一个普通JSON 对象进入以下处理；
        return renderItem(it, form);
    });
}

/**
 * 包装一次RadioGroup 主要解决同步修改RaidoGroup 状态和值的问题；
 * 直接使用RadioGroup 无法同步更新值；（使用自带RaidoGroup 在鼠标点击之后 raido 已经选中）
 *      注意：
 *          1） 使用 syncUpdate 设置radio 的值；可以返回Promise 也可以直接返回一个值后面使用setFieldValue() 设置该字段值；
 *          2) 不要使用 onChange 使用syncUpdate方法代替；
 * @param value
 * @param setValue
 * @param rest
 * @returns {*}
 * @constructor
 */
function CustomizeRadioGroup({ value, syncUpdate, ...rest }) {
    const [innerValue, setInnerValue] = useState(value);

    async function innerChange(e, ...args) {
        await syncUpdate(setInnerValue, e, ...args);
    }

    return <RadioGroup {...rest} value={innerValue} onChange={innerChange} />;
}

CustomizeRadioGroup.propTypes = {
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    syncUpdate: PropTypes.func.isRequired
};
