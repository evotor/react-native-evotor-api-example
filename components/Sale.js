import React from 'react';
import {View, ToastAndroid} from 'react-native';
import {ReceiptAPI, Scanner, ScannerEventType, UuidGenerator} from 'evotor-integration-library';
import styles from '../res/styles';
import {receiptOptions} from "../res/options";
import OptionsContainer from "./inner/OptionsContainer";
import RowItem from "./inner/RowItem";

export default class Sale extends React.Component {

    static navigationOptions = {
        title: "Продажа",
        headerStyle: styles.deepGrey,
        headerTintColor: 'white',
        headerLeft: null
    };

    static positions = [];

    constructor(props) {
        super(props);
        this.state = {names: []};
        this.addPosition = this.addPosition.bind(this)
    }

    async addPosition(barcode) {
        const positions = await ReceiptAPI.getPositionsByBarcode(barcode);
        if (positions.length) {
            positions.forEach(
                (position) => {
                    let abortAdd = false;
                    for (let i = 0; i < Sale.positions.length; i++) {
                        if (Sale.positions[i].name === position.name) {
                            Sale.positions[i].quantity++;
                            abortAdd = true;
                            break
                        }
                    }
                    if (!abortAdd) {
                        position.uuid = UuidGenerator.v4();
                        position.quantity = 1;
                        Sale.positions.push(position)
                    }
                }
            );
            const names = [];
            Sale.positions.forEach(
                (position) => names.push(position.name + " " + position.quantity.toString() + "шт")
            );
            this.setState({names})
        } else {
            ToastAndroid.show("Ничего не найдено", ToastAndroid.SHORT)
        }
    }

    removePosition(removeIndex) {
        Sale.positions = Sale.positions.filter((item, i) => i !== removeIndex);
        const names = this.state.names.filter((item, i) => i !== removeIndex);
        this.setState({names})
    }

    componentDidMount = () => Scanner.addEventListener(ScannerEventType.BARCODE_RECEIVED, this.addPosition);

    render = () =>
        <View style={[styles.container, styles.deepGrey]}>
            <View style={styles.container}>
                {this._renderPositions()}
            </View>
            <RowItem
                buttonColor='green'
                onPress={() => this.props.navigation.navigate('Options', receiptOptions)}
                text="Чек"/>
        </View>;

    _renderPositions() {
        const options = [];
        this.state.names.forEach(
            (item, i) => options.push(
                <RowItem
                    key={i}
                    text={item}
                    onPress={() => this.removePosition(i)}/>
            )
        );
        if (!options.length) {
            options.push(
                <RowItem
                    key={0}
                    text="Добавьте позиции"
                    onPress={() => ToastAndroid.show("Воспользуйтесь сканером", ToastAndroid.SHORT)}/>
            )
        }
        return <OptionsContainer options={options}/>
    }

    componentWillUnmount() {
        Scanner.removeEventListener(ScannerEventType.BARCODE_RECEIVED, this.addPosition);
        Sale.positions = []
    }

}
