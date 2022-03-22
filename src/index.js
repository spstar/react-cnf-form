/**
 * create by li.xiang on 2021/6/29
 * @Author: li.xiang
 * @Date: 2021/6/29
 * @Version:
 * @Last Modified time: 2021/6/29 10:03 下午
 */
import PropTypes from 'prop-types';
import React from 'react';
import { Form } from 'antd';
import renderItems from './renderItems';
import './index.css';
import Storage, { useFormStorage } from '@/utils/useStorage';
import noop from 'lodash/lodash';

/**
 * // 如果遇到form 表单中有需要分区块处理项目，需要增加wrap 可以像下面这样使用
 * [{
 *      Wrap: CollapsePanel,
 *      items: [{...config}]
 * }]
 */

export default function CustomizeForm({ className, items, children, ...rest }) {
    return (
        <Form {...rest} className={`${className} cmp-customize-form`}>
            {renderItems(items, rest.form)}
            {children}
        </Form>
    );
}

CustomizeForm.propTypes = {
    items: PropTypes.array.isRequired,
    // form: PropTypes.object,
    onValuesChange: PropTypes.func,
    storage: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
    className: PropTypes.string
};

export function StorageForm({ storage, ...rest }) {
    rest.onValuesChange = useFormStorage(
        rest.form,
        storage,
        rest.onValuesChange || noop
    );

    return <CustomizeForm {...rest} />;
}

StorageForm.propTypes = {
    storage: PropTypes.oneOfType([PropTypes.object, PropTypes.bool])
};

/**
 * {
 *     name: (option) => <Component {...option} />
 *     name2: (option) => <Component2 {...option} />
 * }
 *
 * @type {Map<any, any>}
 */
let CustomizeItems = new Map();

/**
 * 添加一个HOC map的配置对象；
 * field: HOC
 * @param config
 */
export function addCustomizeItem(typeName, itemHOC) {
    // 暂时去掉报错改成一个警告
    // if (CustomizeItems.has(typeName)) {
    //     throw new Error(
    //         `Form::addCustomizeItem:: A type name of ${typeName} already exists！`
    //     );
    // }
    if (CustomizeItems.has(typeName)) {
        console.warn(
            `Form::addCustomizeItem:: A type name of ${typeName} already exists！`
        );
    }

    CustomizeItems.set(typeName, itemHOC);
}

export function getCustomizeItem(typeName) {
    return CustomizeItems.get(typeName);
}
