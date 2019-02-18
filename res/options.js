import {AsyncStorage} from "react-native";
import {
    BarcodeType,
    DeviceServiceConnector,
    GrantSortOrder,
    GrantQuery,
    InventoryAPI,
    NavigationAPI,
    PositionBuilder,
    PrintableBarcode,
    PrintableImage,
    PrintableText,
    Printer,
    ProductType,
    ProductSortOrder,
    ProductQuery,
    ReceiptAPI,
    ReceiptType,
    Scales,
    SessionAPI,
    SetExtra,
    UserAPI,
    UserSortOrder,
    UserQuery,
    KktAPI
} from 'evotor-integration-library';
import {getRegisterReceiptData} from "../funcs/receipt"
import {
    addActivityResultListener,
    addCustomServiceEventListener,
    createIntentForCustomService,
    createIntentForNativeWindow,
    createIntentForReactWindow
} from "../funcs/navigation";
import {addDeviceListeners} from "../funcs/devices";
import {
    addReceiptBroadcastListeners,
    addReceiptPositionBroadcastListeners,
    addRestBroadcastListeners
} from "../funcs/broadcast";
import {
    addIntegrationServiceListeners
} from "../funcs/services";
import Sale from '../components/Sale';

addIntegrationServiceListeners();

const option = (title, onSelect, customResult) => {
    return {
        title: title,
        onSelect: async (navigate) => {
            let abort = false;
            const result = await onSelect(navigate).catch(
                (e) => {
                    abort = true;
                    navigate(e.message);
                }
            );
            if (!abort) {
                if (customResult) {
                    navigate(customResult);
                } else {
                    switch (typeof result) {
                        case 'undefined':
                            break;
                        case 'string':
                            navigate(result);
                            break;
                        default:
                            navigate(JSON.stringify(result))
                    }
                }
            }
        }
    }
};

export const receiptOptions = {
    title: "Чек",
    options: [
        option(
            "Сгенерировать позицию",
            async () => {
                const product = await InventoryAPI.getProductByUuid("cbe3216e-5418-4525-b474-60e5d7a68823");
                if (product) {
                    return PositionBuilder
                        .newInstance(product, 2)
                        .setMeasureName("бутылка")
                        .setUuid("cbe3216e-5418-4525-b474-60e5d7a68823")
                        .build();
                }
                return "Ничего не найдено";
            }
        ),
        option("Открыть чек продажи", () => ReceiptAPI.openSellReceipt(Sale.positions, new SetExtra({sell: "receipt"}))),
        option("Открыть чек возврата", () => ReceiptAPI.openPaybackReceipt(null, new SetExtra({payback: "receipt"}))),
        option("Открыть чек покупки", () => ReceiptAPI.openBuyReceipt(Sale.positions)),
        option("Открыть чек возврата покупки", () => ReceiptAPI.openBuybackReceipt()),
        option("Отправить электронный чек продажи", () => ReceiptAPI.registerSellReceipt(...getRegisterReceiptData())),
        option("Отправить электронный чек возврата", () => ReceiptAPI.registerPaybackReceipt(...getRegisterReceiptData())),
        option("Получить чек по типу", () => ReceiptAPI.getReceiptByType(ReceiptType.SELL)),
        option("Получить чек по идентификатору", () => ReceiptAPI.getReceiptByUuid("a39884f4-cfbc-4ed3-95d1-f15ec66ab8ee")),
        option("Получить список заголовков чека", () => ReceiptAPI.getReceiptHeaders(ReceiptType.SELL)),
        option(
            "Получить данные текущего чека",
            async () => {
                const receipt = await ReceiptAPI.getReceiptByType(ReceiptType.SELL);
                let result = null;
                if (receipt) {
                    result = "Позиции: " + JSON.stringify(receipt.getPositions()) +
                        "\n\nПлатежи: " + JSON.stringify(receipt.getPayments()) +
                        "\n\nСкидка чека: " + receipt.getDiscount();
                    if (receipt.printDocuments.length) {
                        result += "\n\nСкидка первой группы: " + receipt.printDocuments[0].getDiscount()
                    }
                }
                return result
            }
        )
    ]
};

export const inventoryOptions = {
    title: "Товароучёт",
    options: [
        option(
            "Запрос на получение товаров",
            () => new ProductQuery()
                .name.like("%пиво%")
                .or().type.equal(ProductType.ALCOHOL_MARKED)
                .union(new ProductQuery()
                    .name.like("%водка%")
                    .intersection(new ProductQuery()
                        .alcoholByVolume.greater(40, true)
                        .union(new ProductQuery()
                            .name.like("%одеколон%")
                            .or().name.like("%настойка боярышника 40/%%", '/')))
                    .intersection(new ProductQuery()
                        .price.lower(100)
                        .and().alcoholByVolume.lower(40)))
                .sortOrder(new ProductSortOrder()
                    .alcoholByVolume.asc()
                    .quantity.asc()
                    .tareVolume.asc()
                    .price.desc())
                .limit(2)
                .execute()
        ),
        option("Все штрихкоды товара", () => InventoryAPI.getAllBarcodesForProduct("cbe3216e-5418-4525-b474-60e5d7a68823")),
        option("Товар по идентификатору", () => InventoryAPI.getProductByUuid("cbe3216e-5418-4525-b474-60e5d7a68823")),
        option("Возможные дополнительные поля товара", () => InventoryAPI.getField("orgUuid")),
        option("Значения дополнительных полей товара", () => InventoryAPI.getProductExtras("cbe3216e-5418-4525-b474-60e5d7a68823"))
    ]
};

export const userOptions = {
    title: "Пользователи",
    options: [
        option(
            "Запрос на получение пользователей",
            () => new UserQuery()
                .noFilters()
                .execute()
        ),
        option(
            "Запрос на получение прав пользователей",
            () => new GrantQuery(true)
                .title.like("%REPORT%")
                .execute()
        ),
        option("Данные всех пользователей", UserAPI.getAllUsers),
        option("Данные авторизованного пользователя", UserAPI.getAuthenticatedUser),
        option("Список всех доступных прав", UserAPI.getAllGrants),
        option("Список прав авторизованного пользователя", UserAPI.getGrantsOfAuthenticatedUser)
    ]
};

export const navigationOptions = {
    title: "Навигация",
    options: [
        option("Форма настроек кассового чека", () => NavigationAPI.startActivity(NavigationAPI.createIntentForCashReceiptSettings())),
        option("Форма наполнения чека возврата", () => NavigationAPI.startActivity(NavigationAPI.createIntentForPaybackReceiptEdit())),
        option("Форма наполнения чека продажи", () => NavigationAPI.startActivity(NavigationAPI.createIntentForSellReceiptEdit())),
        option("Форма кассового отчёта", () => NavigationAPI.startActivity(NavigationAPI.createIntentForCashRegisterReport())),
        option("Форма оплаты чека продажи", () => NavigationAPI.startActivity(NavigationAPI.createIntentForSellReceiptPayment())),
        option("Форма оплаты чека возврата", () => NavigationAPI.startActivity(NavigationAPI.createIntentForPaybackReceiptPayment())),
        option("Форма выбора пользователя", () => NavigationAPI.startActivity(NavigationAPI.createIntentForChangeUser())),
        option("Форма редактирования товара", () => NavigationAPI.startActivity(NavigationAPI.createIntentForEditProduct("9e80cbc4-1fdd-445c-8b3f-a536e9a74927"))),
        option("Форма создания товара", () => NavigationAPI.startActivity(NavigationAPI.createIntentForNewProduct("2000000000051"))),
        option(
            "React window",
            (navigate) => {
                addActivityResultListener(navigate);
                return NavigationAPI.startActivityForResult(createIntentForReactWindow(), 1)
            }
        ),
        option(
            "Native window",
            (navigate) => {
                addActivityResultListener(navigate);
                return NavigationAPI.startActivity(createIntentForNativeWindow().putExtra("native readable", new SetExtra({hello: "world"}).toBundle()))
            }
        ),
        option(
            "Custom service",
            (navigate) => {
                addCustomServiceEventListener(navigate);
                return NavigationAPI.startService(createIntentForCustomService())
            }
        )
    ]
};

addDeviceListeners();
export const deviceOptions = {
    title: "Устройства",
    options: [
        option(
            "Подключить принтер и весы",
            () => DeviceServiceConnector.startInitConnections(),
            "Устройства подключены"
        ),
        option("Проверить подключенность принтера", () => AsyncStorage.getItem("printer")),
        option("Проверить подключенность весов", () => AsyncStorage.getItem("scales")),
        option("Проверить отсканированный штрихкод", () => AsyncStorage.getItem("scanner")),
        option("Максимальная длина строки в пикселях", Printer.getAllowablePixelLineLength),
        option("Максимальная длина строки в символах", Printer.getAllowableSymbolsLineLength),
        option(
            "Распечатать текст, штрихкод, картинку",
            () => Printer.print([
                new PrintableText('Text'),
                new PrintableBarcode('ABC-1135', BarcodeType.CODE39),
                new PrintableImage('android.resource://com.revotor/drawable/ic_launcher')
            ]),
            "Успешная печать"
        ),
        option("Вес товара", Scales.getWeight),
        option(
            "Очистить список событий",
            async () => {
                await AsyncStorage.removeItem("printer");
                await AsyncStorage.removeItem("scales");
                await AsyncStorage.removeItem("scanner");
            },
            "Список событий очищен"
        )
    ]
};

export const sessionOptions = {
    title: "Смена",
    options: [
        option("Номер последней смены", SessionAPI.getLastSessionNumber),
        option("Проверка открытия смены", SessionAPI.isSessionOpened),
        option("Напечатать Z-отчет", SessionAPI.printZReport, "Смена закрыта")
    ]
};

export const kktOptions = {
    title: "Касса",
    options: [
        option("Поддерживаемая версия ФФД", KktAPI.getSupportedFfdVersion),
        option("Зарегистрированные типы агентов", KktAPI.getRegisteredAgentTypes),
        option("Зарегистрированные типы субагентов", KktAPI.getRegisteredSubagentTypes),
        option("Доступна ли ставка НДС 20%", KktAPI.isVatRate20Available),
    ]
};

addReceiptBroadcastListeners();
export const receiptBroadcastOptions = {
    title: "События чека",
    options: [
        option("Открыт чек продажи", () => AsyncStorage.getItem("evotor.intent.action.receipt.sell.OPENED")),
        option("Открыт чек возврата", () => AsyncStorage.getItem("evotor.intent.action.receipt.payback.OPENED")),
        option("Очищен чек продажи", () => AsyncStorage.getItem("evotor.intent.action.receipt.sell.CLEARED")),
        option("Очищен чек возврата", () => AsyncStorage.getItem("evotor.intent.action.receipt.payback.CLEARED")),
        option("Закрыт чек продажи", () => AsyncStorage.getItem("evotor.intent.action.receipt.sell.RECEIPT_CLOSED")),
        option("Закрыт чек возврата", () => AsyncStorage.getItem("evotor.intent.action.receipt.payback.RECEIPT_CLOSED")),
        option(
            "Очистить список событий",
            async () => {
                await AsyncStorage.removeItem("evotor.intent.action.receipt.sell.OPENED");
                await AsyncStorage.removeItem("evotor.intent.action.receipt.payback.OPENED");
                await AsyncStorage.removeItem("evotor.intent.action.receipt.sell.CLEARED");
                await AsyncStorage.removeItem("evotor.intent.action.receipt.payback.CLEARED");
                await AsyncStorage.removeItem("evotor.intent.action.receipt.sell.RECEIPT_CLOSED");
                await AsyncStorage.removeItem("evotor.intent.action.receipt.payback.RECEIPT_CLOSED");
            },
            "Список событий очищен"
        )
    ]
};

addReceiptPositionBroadcastListeners();
export const receiptPositionBroadcastOptions = {
    title: "События\n\nпозиций чека",
    options: [
        option("Позиция добавлена в чек продажи", () => AsyncStorage.getItem("evotor.intent.action.receipt.sell.POSITION_ADDED")),
        option("Позиция добавлена в чек возврата", () => AsyncStorage.getItem("evotor.intent.action.receipt.payback.POSITION_ADDED")),
        option("Позиция в чеке продажи изменена", () => AsyncStorage.getItem("evotor.intent.action.receipt.sell.POSITION_EDITED")),
        option("Позиция в чеке возврата изменена", () => AsyncStorage.getItem("evotor.intent.action.receipt.payback.POSITION_EDITED")),
        option("Позиция удалена из чека продажи", () => AsyncStorage.getItem("evotor.intent.action.receipt.sell.POSITION_REMOVED")),
        option("Позиция удалена из чека возврата", () => AsyncStorage.getItem("evotor.intent.action.receipt.payback.POSITION_REMOVED")),
        option(
            "Очистить список событий",
            async () => {
                await AsyncStorage.removeItem("evotor.intent.action.receipt.sell.POSITION_ADDED");
                await AsyncStorage.removeItem("evotor.intent.action.receipt.payback.POSITION_ADDED");
                await AsyncStorage.removeItem("evotor.intent.action.receipt.sell.POSITION_EDITED");
                await AsyncStorage.removeItem("evotor.intent.action.receipt.payback.POSITION_EDITED");
                await AsyncStorage.removeItem("evotor.intent.action.receipt.sell.POSITION_REMOVED");
                await AsyncStorage.removeItem("evotor.intent.action.receipt.payback.POSITION_REMOVED");
            },
            "Список событий очищен"
        )
    ]
};

addRestBroadcastListeners();
export const restBroadcastOptions = {
    title: "Остальные\n\nсобытия",
    options: [
        option("Получено push-уведомление", () => AsyncStorage.getItem("pushNotification")),
        option("Открыта информация о товаре", () => AsyncStorage.getItem("evotor.intent.action.inventory.CARD_OPEN")),
        option("Открыт денежный ящик", () => AsyncStorage.getItem("evotor.intent.action.cashDrawer.OPEN")),
        option("Деньги внесены", () => AsyncStorage.getItem("evotor.intent.action.cashOperation.IN")),
        option("Деньги изъяты", () => AsyncStorage.getItem("evotor.intent.action.cashDrawer.CASH_OUT")),
        option(
            "Очистить список событий",
            async () => {
                await AsyncStorage.removeItem("pushNotification");
                await AsyncStorage.removeItem("evotor.intent.action.inventory.CARD_OPEN");
                await AsyncStorage.removeItem("evotor.intent.action.cashDrawer.OPEN");
                await AsyncStorage.removeItem("evotor.intent.action.cashOperation.IN");
                await AsyncStorage.removeItem("evotor.intent.action.cashOperation.CASH_OUT");
            },
            "Список событий очищен"
        )
    ]
};