import {Payment, PrintReceipt, SetExtra} from "evotor-integration-library";
import Sale from "../components/Sale";

export const getRegisterReceiptData = () => [
    [
        new PrintReceipt(
            null,
            Sale.positions,
            new Map([[new Payment("-1-", 550, null, null, null, null), 550]]),
            new Map(),
            null
        )
    ],
    new SetExtra({register: "receipt"}),
    "+88005553535",
    "mail@mail.ru",
    10
];