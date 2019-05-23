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
    BarcodeType,
    PrintExtraPlacePositionAllSubpositionsFooter,
    PaymentSystemPaymentOkResult,
    PaymentDelegatorSelectedEventResult,
    ReceiptAPI
} from 'evotor-integration-library';
import {AsyncStorage} from "react-native";

const errorHandler = (event) => (error) => console.log("Error handling event " + event + ": " + error.message);

const processRecallableIntegration = async (event, callback, getResult) => {
    const processCount = parseInt(await AsyncStorage.getItem(event));
    if (processCount > 2) {
        callback
            .skip()
            .catch(errorHandler(event));
    } else {
        const result = getResult();
        if (result) {
            await callback
                .onResult(getResult())
                .catch(errorHandler(event));
            AsyncStorage
                .setItem(event, (processCount + 1).toString())
                .catch(errorHandler(event));
        } else {
            callback
                .skip()
                .catch(errorHandler(event));
        }
    }
};

const beforePositionsEditedListener = (changes, callback) =>
    processRecallableIntegration(
        IntegrationServiceEventType.BEFORE_POSITIONS_EDITED,
        callback,
        () => {
            if (changes.length) {
                const positionToEdit = changes[0].position;
                console.log("Changes: " + JSON.stringify(changes[0]));
                positionToEdit.quantity++;
                return new BeforePositionsEditedEventResult([new PositionEdit(positionToEdit)], new SetExtra({positions: "edited"}));
            }
        }
    );

const receiptDiscountListener = (discount, receiptUuid, callback) =>
    callback
        .startActivity(
            new Intent()
                .setPackageName("com.reactintegrationapp")
                .putExtra("event", IntegrationServiceEventType.RECEIPT_DISCOUNT))
        .catch(errorHandler(IntegrationServiceEventType.RECEIPT_DISCOUNT));

const paymentSystemListener = (operationType, event, callback) =>
    callback
        .onResult(new PaymentSystemPaymentOkResult("123", ["Привет мир"], null))
        .catch(errorHandler(IntegrationServiceEventType.PAYMENT_SYSTEM));

const paymentDelegatorListener = async (receiptUuid, callback) =>
    callback
        .onResult(
            new PaymentDelegatorSelectedEventResult(
                new PaymentPurpose(
                    "123",
                    "com.revotor",
                    (await ReceiptAPI.getAllPaymentPerformers()).filter(item => item.appUuid === "6daf41fa-2aa5-4be9-8ee9-486f111eea6e")[0],
                    10,
                    null,
                    "Пока, мир"
                )
            ))
        .catch(errorHandler(IntegrationServiceEventType.PAYMENT_DELEGATOR));

const paymentSelectedListener = (paymentPurpose, callback) => {
    const paymentParts = [paymentPurpose, paymentPurpose];
    paymentParts[0].total = paymentPurpose.total / 4;
    paymentParts[1].total = paymentPurpose.total - paymentParts[0].total;
    callback
        .onResult(
            new PaymentSelectedEventResult(
                new SetExtra({payment: "selected"}),
                paymentParts
            )
        )
        .catch(errorHandler(IntegrationServiceEventType.PAYMENT_SELECTED));
};

const printGroupRequiredListener = (paymentSystem, callback) =>
    callback
        .onResult(
            new PrintGroupRequiredEventResult(
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
        )
        .catch(errorHandler(IntegrationServiceEventType.PRINT_GROUP_REQUIRED));

const printExtraRequiredListener = (callback) =>
    callback
        .onResult(
            new PrintExtraRequiredEventResult([
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
        )
        .catch(errorHandler(IntegrationServiceEventType.PRINT_EXTRA_REQUIRED));

export const addIntegrationServiceListeners = () => {
    AsyncStorage
        .setItem(IntegrationServiceEventType.BEFORE_POSITIONS_EDITED, "0")
        .catch(errorHandler(IntegrationServiceEventType.BEFORE_POSITIONS_EDITED));
    ServiceAPI.addEventListener(IntegrationServiceEventType.BEFORE_POSITIONS_EDITED, beforePositionsEditedListener);
    ServiceAPI.addEventListener(IntegrationServiceEventType.RECEIPT_DISCOUNT, receiptDiscountListener);
    ServiceAPI.addEventListener(IntegrationServiceEventType.PAYMENT_SELECTED, paymentSelectedListener);
    ServiceAPI.addEventListener(IntegrationServiceEventType.PAYMENT_SYSTEM, paymentSystemListener);
    ServiceAPI.addEventListener(IntegrationServiceEventType.PAYMENT_DELEGATOR, paymentDelegatorListener);
    ServiceAPI.addEventListener(IntegrationServiceEventType.PRINT_GROUP_REQUIRED, printGroupRequiredListener);
    ServiceAPI.addEventListener(IntegrationServiceEventType.PRINT_EXTRA_REQUIRED, printExtraRequiredListener);
};