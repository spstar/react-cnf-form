import React, {FunctionComponentElement} from 'react';
import {Form, FormInstance, FormProps} from 'antd';
import render, {ItemOptions} from './renderItems';
// import {useFormStorage} from './useStorage';

export const noop = () => {
};

/**
 * // 如果遇到form 表单中有需要分区块处理项目，需要增加wrap 可以像下面这样使用
 * [{
 *      Wrap: CollapsePanel,
 *      items: [{...config}]
 * }]
 */
export interface CnfFromProps extends FormProps {
    form: FormInstance;
    items: ItemOptions;
}

const CnfForm = function CnfForm({className, items, children, ...rest}: CnfFromProps) {
    return (
        <Form {...rest} className={`${className} react-cnf-form`}>
            {render(items, rest.form)}
            {children}
        </Form>
    );
}

export interface StorageCnfForm extends CnfFromProps {
    storage: object | boolean
}

// export function StorageCnfForm({storage, ...rest}: StorageCnfForm) {
//     rest.onValuesChange = useFormStorage(
//         rest.form,
//         storage,
//         rest.onValuesChange || noop
//     );
//
//     return <CnfForm {...rest} />;
// }

let CustomizeItems: Map<string, CMPFunc> = new Map();

type CMPFunc = <T>(props: T) => FunctionComponentElement<T>

export function addFormItem(itemTypeName: string, CmpFunc: CMPFunc) {
    if (CustomizeItems.has(itemTypeName)) {
        console.warn(
            `react-cnf-form::addFormItem:: A type name of "${itemTypeName}" already exists！`
        );
    }

    CustomizeItems.set(itemTypeName, CmpFunc);
}

export function getCustomizeItem(typeName: string) {
    return CustomizeItems.get(typeName);
}

export default CnfForm;
