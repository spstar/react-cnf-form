import React, {ComponentType, ReactElement} from 'react';
import {Form, FormInstance, FormProps} from 'antd';
import render, {ItemOptions} from './renderItems';

export {ItemOptions} from './renderItems';
export const noop = () => void 0;
// import {useFormStorage} from './useStorage';

/* Not recommended */
type CMPFunc = <T>(props: T) => ReactElement<T>
/* Not recommended */
let CustomizeItems: Map<string, CMPFunc> = new Map();
/* Recommended */
let ComponentItems: Map<string, ComponentType> = new Map();


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
};

/* Not recommended */
export function addFormItem(itemTypeName: string, CmpFunc: CMPFunc) {
    if (CustomizeItems.has(itemTypeName)) {
        console.warn(
            `react-cnf-form::addFormItem:: A type name of "${itemTypeName}" already exists！`
        );
    }

    CustomizeItems.set(itemTypeName, CmpFunc);
}

/* Recommended */
export function addItemType(itemTypeName: string, CMP: ComponentType) {
    if (ComponentItems.has(itemTypeName)) {
        console.warn(
            `react-cnf-form::addItemType:: A type name of "${itemTypeName}" already exists！`
        );
    }

    ComponentItems.set(itemTypeName, CMP);
}

export function getCustomizeItem(typeName: string): CMPFunc | undefined {
    return CustomizeItems.get(typeName);
}

export function getComponentItem(typeName: string): ComponentType | undefined {
    return ComponentItems.get(typeName);
}

export default CnfForm;

// export interface StorageCnfForm extends CnfFromProps {
//     storage: object | boolean
// }
// export function StorageCnfForm({storage, ...rest}: StorageCnfForm) {
//     rest.onValuesChange = useFormStorage(
//         rest.form,
//         storage,
//         rest.onValuesChange || noop
//     );
//
//     return <CnfForm {...rest} />;
// }
