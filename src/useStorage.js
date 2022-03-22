import { useEffect, useMemo } from 'react';
import { delay, throttle } from './index';
import noop from 'lodash/noop';

// 默认存储间隔30s
const STORAGE_INTERVAL = 30 * 1000;

function watchingData(data, handler) {
    Object.keys(data).forEach((p) => {
        let v = data[p];
        Object.defineProperty({
            get() {
                return v;
            },
            set(nv) {
                console.log(p, ':', v, '监听数据改变了', nv);
                handler();
                v = nv;
            }
        });
    });
}

function storageAction(storageName, storageData) {
    try {
        localStorage.setItem(storageName, JSON.stringify(storageData));
    } catch (err) {
        console.log(`存储数据"${storageName}" 出现异常：：`, err);
    }
}

function useProcessFn(formIns, storage) {
    return useMemo(() => {
        if (!storage || storage.disabled) {
            return delay(noop, STORAGE_INTERVAL);
        }

        const {
            storageName,
            storageDataProcess,
            storageInterval = STORAGE_INTERVAL
        } = storage;

        return throttle((allValues) => {
            storageAction(
                storageName,
                storageDataProcess(
                    allValues || formIns.getFieldsValue(true),
                    storage.watchAdditionalData
                )
            );
        }, storageInterval);
    }, []);
}

function useLoadStorage(formIns, storage) {
    return useMemo(() => {
        if (!storage || storage.disabled || storage.autoLoadStorage === false) {
            return undefined;
        }

        loadFormStorage(formIns, storage);
    }, []);
}

export function loadFormStorage(formIns, storage) {
    const { storageName, fillBackDataProcess } = storage;

    try {
        const storageDataStr = localStorage.getItem(storageName) || '{}';
        const storageData = fillBackDataProcess(JSON.parse(storageDataStr));

        formIns.setFieldsValue(storageData);
    } catch (err) {
        console.log(`载入存储数据"${storageName}" 出现异常：：`, err);
    }
}

export function clearFormStorage(storageName) {
    try {
        localStorage.removeItem(storageName);
    } catch (err) {
        console.log(`清除存储数据"${storageName}" 出现异常：：`, err);
    }
}

export function useFormStorage(formIns, storage, sourceDataCallback) {
    const processFn = useProcessFn(formIns, storage);

    useLoadStorage(formIns, storage);
    // 当前useEffect 只能执行一次；
    useEffect(() => {
        if (!storage || storage.disabled) {
            return noop;
        }

        const { watchAdditionalData, storageInterval = STORAGE_INTERVAL } =
            storage;

        if (watchAdditionalData && typeof watchAdditionalData === 'object') {
            watchingData(watchAdditionalData, processFn);
        }

        // 如果没有配置sourceDataCallback 需要制订一个定时器，定时获取表单数据存储；
        let intervalTimer;
        if (!sourceDataCallback) {
            intervalTimer = setInterval(processFn.now, storageInterval);
        }

        return () => {
            console.log('~~~~~ 解除：当前存储对象 ~~~');
            clearInterval(intervalTimer);
            // 销毁前执行数据存储；
            processFn.now();
        };
    }, []);

    return useMemo(() => {
        if (!storage || storage.disabled || !sourceDataCallback) {
            return sourceDataCallback;
        }

        return (changedValues, allValues) => {
            processFn(allValues);
            return sourceDataCallback(changedValues, allValues);
        };
    }, [sourceDataCallback]);
}
