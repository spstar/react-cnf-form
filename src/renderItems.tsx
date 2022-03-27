import React, {ReactChild, ReactChildren, ReactElement, ReactNode} from 'react';
import {
    Cascader,
    Checkbox,
    DatePicker,
    Form,
    FormInstance,
    FormItemProps,
    Input,
    InputNumber,
    Mentions,
    Radio,
    Rate,
    Select,
    Switch,
    TimePicker,
    Transfer,
    Tree,
    TreeSelect,
    Upload
} from 'antd';
import {getCustomizeItem, noop} from './index';

const CheckBoxGroup = Checkbox.Group;
const RadioGroup = Radio.Group;
const {TextArea} = Input;
const {Item} = Form;
const {RangePicker} = DatePicker;
const {Password} = Input;

interface ItemProps {
    children?: ReactNode | ReactChildren;
    [prop:string]: any;
}

interface Option extends FormItemProps {
    // 默认是 'input'类型
    itemType?: string;
    itemProps?: ItemProps;
    itemRender?: (option: Option, fIns: FormInstance) => ReactChild | ReactChildren;
    beforeContent?: (option: Option, fIns: FormInstance, render: Render) => any;
    afterContent?: (option: Option, fIns: FormInstance, render: Render) => any;
    key?: any;
}

interface WrapOption {
    Wrap: ReactElement;
    items: ItemOptions;
    key?: any;
}

type Render = (args: ItemOption | ItemOptions, fIns: FormInstance) => ReactNode[];
type RenderFn = (render: Render, fIns: FormInstance) => ReactNode[];
type ItemOption = (Option | RenderFn | WrapOption);
export type ItemOptions = ItemOption[];

const render: Render = (arg, formIns: FormInstance) => {
    return renderItems(Array.isArray(arg) ? arg : [arg], formIns);
};

function renderItems(items: ItemOptions, fIns: FormInstance): ReactNode[] {
    return items.map((it, idx) => {
        if ("Wrap" in it && it.Wrap) {
            const Wrap: any = it.Wrap;

            return (
                <Wrap key={it.key || idx}>
                    {renderItems(it.items, fIns)}
                </Wrap>
            );
        }

        if (it && typeof it === 'object') {
            return renderItem(it, fIns);
        }

        if (typeof it === 'function') {
            return it(render, fIns);
        }

        // 如果配置项是 null/undefined/numbers/booleans/string / other 直接返回
        return it;
    });
}

function renderItem(option: Option, fIns: FormInstance): ReactElement {
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
            {beforeContent(option, fIns, render)}
            <Item noStyle name={name} rules={rules} {...rest}>
                {typeof itemRender === 'function'
                    ? itemRender(option, fIns)
                    : ItemTypeRender(itemType, itemProps)}
            </Item>
            {afterContent(option, fIns, render)}
        </Item>
    );
}

function ItemTypeRender(itemType: string | undefined, props = {} as ItemProps) {
    const {children, ...itemProps} = props;
    const CustomizeItem = itemType ? getCustomizeItem(itemType) : undefined;

    if (CustomizeItem) {
        return CustomizeItem(props);
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
        case 'checkbox':
            return <Checkbox {...itemProps}>{children}</Checkbox>;
        case 'checkboxGroup':
            return <CheckBoxGroup {...itemProps}>{children}</CheckBoxGroup>;
        case 'select':
            return <Select placeholder="请选择" {...itemProps}>{children}</Select>;
        case 'treeSelect':
            return <TreeSelect placeholder="请选择" {...itemProps}>{children}</TreeSelect>;
        case 'tree':
            return <Tree {...itemProps}>{children}</Tree>;
        case 'cascader':
            return <Cascader placeholder="请选择" {...itemProps}>{children as ReactElement}</Cascader>;
        case 'mentions':
            return <Mentions {...itemProps}>{children}</Mentions>;
        case 'transfer':
            return <Transfer {...itemProps}>{children as (props: any) => React.ReactNode}</Transfer>;
        case 'datePicker':
            return <DatePicker {...itemProps} />;
        case 'rangePicker':
            return <RangePicker {...itemProps} />;
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

export default render;
