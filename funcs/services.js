import {
    BeforePositionsEditedEventResult,
    IntegrationServiceEventType,
    Intent,
    PaymentPurpose,
    PaymentSelectedEventResult,
    PositionEdit,
    PrintGroup,
    PrintGroupRequiredEventResult,
    PrintGroupType,
    ServiceAPI,
    SetExtra,
    SetPrintGroup,
    TaxationSystem,
    PrintExtraRequiredEventResult,
    SetPrintExtra,
    PrintExtraPlacePrintGroupTop,
    PrintableText,
    PrintableBarcode,
    PrintableImage,
    BarcodeType,PrintExtraPlacePositionAllSubpositionsFooter
} from 'evotor-integration-library';
import {AsyncStorage} from "react-native";

const errorHandler = (event) => (error) => console.log("Error handling event " + event + ": " + error.message);

const processIntegration = async (event, callback, getResult) => {
    if (await AsyncStorage.getItem(event)) {
        callback
            .skip()
            .catch(errorHandler(event));
    } else {
        await callback
            .onResult(getResult())
            .catch(errorHandler(event));
        AsyncStorage
            .setItem(event, event)
            .catch(errorHandler(event));
    }
};

const beforePositionsEditedListener = (changes, callback) => {
    processIntegration(
        "BEFORE_POSITIONS_EDITED",
        callback,
        () => {
            if (changes.length) {
                const positionToEdit = changes[0].position;
                positionToEdit.quantity++;
                changes.push(new PositionEdit(positionToEdit));
            }
            return new BeforePositionsEditedEventResult(changes, new SetExtra({positions: "edited"}));
        }
    );
};

const receiptDiscountListener = (discount, receiptUuid, callback) => {
    callback
        .startActivity(
            new Intent()
                .setPackageName("com.reactintegrationapp")
                .setClassName("MainActivity")
                .putExtras({
                    discount: discount,
                    receiptUuid: receiptUuid
                }))
        .catch(errorHandler("RECEIPT_DISCOUNT"));
};

const paymentSelectedListener = (paymentSystem, callback) => {
    processIntegration(
        "PAYMENT_SELECTED",
        callback,
        () => new PaymentSelectedEventResult(
            new SetExtra({payment: "selected"}),
            [
                new PaymentPurpose("-1-", paymentSystem.paymentSystemId, 3, "0", "платёж клиента 1"),
                new PaymentPurpose("-2-", paymentSystem.paymentSystemId, 5, "0", null),
                new PaymentPurpose("-3-", paymentSystem.paymentSystemId, 2, null, "платёж клиента 3"),
                new PaymentPurpose("-4-", null, 3, "0", "платёж клиента 4"),
                new PaymentPurpose(null, paymentSystem.paymentSystemId, 5, "0", "платёж клиента 5"),
                new PaymentPurpose("-6-", paymentSystem.paymentSystemId, 2, "0", "платёж клиента 6"),
                new PaymentPurpose(null, null, 25, null, null),
            ]
        )
    );
};

const printGroupRequiredListener = (paymentSystem, callback) => {
    processIntegration(
        "PRINT_GROUP_REQUIRED",
        callback,
        () => new PrintGroupRequiredEventResult(
            new SetExtra({printGroup: "required"}),
            [
                new SetPrintGroup(
                    new PrintGroup(
                        "a1a90455-1630-4b74-8458-530b835ae813",
                        PrintGroupType.INVOICE,
                        "OOO \"Мои мечты\"",
                        "012345678901",
                        "Ул. Пушкина, д. Колотушкина",
                        TaxationSystem.PATENT,
                        true
                    ),
                    ["-1-", "-3-"],
                    []
                ),
                new SetPrintGroup(
                    new PrintGroup(
                        "43ac17f8-5a3e-444a-be4f-da6e5afcf83",
                        PrintGroupType.INVOICE,
                        "ЗАО \"Пустота небытия\"",
                        "012345678902",
                        "Ул. Есенина, д. Каруселина",
                        TaxationSystem.PATENT,
                        true
                    ),
                    ["-4-", "-6-"],
                    []
                )
            ]
        )
    );
};

const printExtraRequiredListener = (callback) => {
    processIntegration(
        "PRINT_EXTRA_REQUIRED",
        callback,
        () => new PrintExtraRequiredEventResult([
            new SetPrintExtra(
                new PrintExtraPlacePrintGroupTop("43ac17f8-5a3e-444a-be4f-da6e5afcf83"),
                [
                    new PrintableText("PrintExtraPlacePrintGroupTop"),
                    new PrintableBarcode("ABC-1234", BarcodeType.CODE39)
                ]
            ),
            new SetPrintExtra(
                new PrintExtraPlacePositionAllSubpositionsFooter(),
                [
                    new PrintableText("PrintExtraPlacePositionAllSubpositionsFooter"),
                    new PrintableImage('android.resource://com.revotor/drawable/ic_launcher')
                ]
            )
        ])
    );
};

export const addIntegrationServiceListeners = () => {
    AsyncStorage.removeItem("BEFORE_POSITIONS_EDITED").catch(errorHandler("BEFORE_POSITIONS_EDITED"));
    AsyncStorage.removeItem("RECEIPT_DISCOUNT").catch(errorHandler("RECEIPT_DISCOUNT"));
    AsyncStorage.removeItem("PAYMENT_SELECTED").catch(errorHandler("PAYMENT_SELECTED"));
    AsyncStorage.removeItem("PRINT_GROUP_REQUIRED").catch(errorHandler("PRINT_GROUP_REQUIRED"));
    AsyncStorage.removeItem("PRINT_EXTRA_REQUIRED").catch(errorHandler("PRINT_EXTRA_REQUIRED"));
    ServiceAPI.addEventListener(IntegrationServiceEventType.BEFORE_POSITIONS_EDITED, beforePositionsEditedListener);
    ServiceAPI.addEventListener(IntegrationServiceEventType.RECEIPT_DISCOUNT, receiptDiscountListener);
    ServiceAPI.addEventListener(IntegrationServiceEventType.PAYMENT_SELECTED, paymentSelectedListener);
    ServiceAPI.addEventListener(IntegrationServiceEventType.PRINT_GROUP_REQUIRED, printGroupRequiredListener);
    ServiceAPI.addEventListener(IntegrationServiceEventType.PRINT_EXTRA_REQUIRED, printExtraRequiredListener);
};