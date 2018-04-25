import {AsyncStorage} from 'react-native';
import {
    BroadcastReceiver,
    PositionEventType,
    ReceiptEventType,
    ProductEventType,
    CashDrawerEventType,
    CashOperationEventType
} from 'evotor-integration-library';

const listener = async (event) => {
    let abort = false;
    await AsyncStorage.setItem(event.action, JSON.stringify(event)).catch(
        (e) => {
            abort = true;
            console.log("Error writing " + event.action + ". " + e.message);
        }
    );
    if(!abort) {
        console.log("Successfully wrote " + event.action + ".");
    }
};

export const addReceiptBroadcastListeners = () => {
    BroadcastReceiver.addEventListener(ReceiptEventType.SELL_RECEIPT_OPENED, listener);
    BroadcastReceiver.addEventListener(ReceiptEventType.PAYBACK_RECEIPT_OPENED, listener);
    BroadcastReceiver.addEventListener(ReceiptEventType.SELL_RECEIPT_CLEARED, listener);
    BroadcastReceiver.addEventListener(ReceiptEventType.PAYBACK_RECEIPT_CLEARED, listener);
    BroadcastReceiver.addEventListener(ReceiptEventType.SELL_RECEIPT_CLOSED, listener);
    BroadcastReceiver.addEventListener(ReceiptEventType.PAYBACK_RECEIPT_CLOSED, listener);
};

export const addReceiptPositionBroadcastListeners = () => {
    BroadcastReceiver.addEventListener(PositionEventType.SELL_RECEIPT_POSITION_ADDED, listener);
    BroadcastReceiver.addEventListener(PositionEventType.PAYBACK_RECEIPT_POSITION_ADDED, listener);
    BroadcastReceiver.addEventListener(PositionEventType.SELL_RECEIPT_POSITION_EDITED, listener);
    BroadcastReceiver.addEventListener(PositionEventType.PAYBACK_RECEIPT_POSITION_EDITED, listener);
    BroadcastReceiver.addEventListener(PositionEventType.SELL_RECEIPT_POSITION_REMOVED, listener);
    BroadcastReceiver.addEventListener(PositionEventType.PAYBACK_RECEIPT_POSITION_REMOVED, listener);
};

export const addRestBroadcastListeners = () => {
    BroadcastReceiver.addEventListener(ProductEventType.PRODUCT_CARD_OPEN, listener);
    BroadcastReceiver.addEventListener(CashDrawerEventType.CASH_DRAWER_OPEN, listener);
    BroadcastReceiver.addEventListener(CashOperationEventType.CASH_IN, listener);
    BroadcastReceiver.addEventListener(CashOperationEventType.CASH_OUT, listener);
};