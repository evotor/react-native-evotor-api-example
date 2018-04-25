import {
    Intent,
    NavigationAPI,
    NavigationEventType,
    ServiceAPI
} from 'evotor-integration-library';

let navigate;

const listener = (data) => navigate(JSON.stringify(data));

const activityResultListener = (requestCode, resultCode, data) =>
    listener({requestCode: requestCode, resultCode: resultCode, data: data});

export const addActivityResultListener = (n) => {
    navigate = n;
    NavigationAPI.addEventListener(NavigationEventType.ACTIVITY_RESULT, activityResultListener);
};

export const addCustomServiceEventListener = (n) => {
    navigate = n;
    ServiceAPI.addEventListener("MyEvent", listener);
};

const createIntent = () => new Intent().putExtras({key1: "hello", key2: ["world", true, {key3: 123.456}]});

export const createIntentForReactWindow = () => createIntent().setPackageName('com.reactintegrationapp');

export const createIntentForNativeWindow = () => createIntent().setClassName('com.revotor.NativeActivity');

export const createIntentForCustomService = () => createIntent().setCustomServiceEventName('MyEvent');