import {
    Payment,
    PaymentSystem,
    PaymentType,
    PrintReceipt,
    PaymentPerformer,
    SetExtra
} from "evotor-integration-library";
import Sale from "../components/Sale";

export const getRegisterReceiptData = () => {
    const payments = new Map();
    payments.set(
        new Payment(
            "02d37060-d446-11e7-a9fa-7bdae751ebe1",
            10,
            null,
            new PaymentPerformer(new PaymentSystem(PaymentType.ELECTRON, "Card", "ru.evotor.paymentSystem.cashless.base"), null, null, null, null),
            null,
            "2310acd1-000f-5000-a000-129820d53a08",
            "Некий аккаунт"
        ),
        10
    );
    return [
        [
            new PrintReceipt(
                null,
                Sale.positions,//позиции должны быть на сумму 10р
                payments,
                new Map(),
                null
            )
        ],
        new SetExtra({register: "receipt"}),
        "+88005553535",
        "mail@mail.ru"
    ];
};