import React from 'react';
import {View} from 'react-native';
import SaleButton from './inner/SaleButton';
import TitleItem from './inner/TitleItem';
import styles from '../res/styles';
import {
    deviceOptions,
    inventoryOptions,
    navigationOptions,
    receiptBroadcastOptions,
    receiptPositionBroadcastOptions,
    restBroadcastOptions,
    sessionOptions,
    userOptions,
} from '../res/options';

export default class Home extends React.Component {

    static navigationOptions = {
        header: null
    };

    render() {
        return (
            <View style={[styles.container, styles.deepGrey]}>
                {this._renderTitle()}
            </View>
        )
    }

    _renderTitle() {
        return [
            <View key={0} style={styles.bottomPadding}>
                <SaleButton onPress={() => this.props.navigation.navigate('Sale')}/>
            </View>,
            this._renderTitleRow(
                [
                    {color: 'orange', data: inventoryOptions},
                    {color: 'blue', data: userOptions},
                    {color: 'blue', data: navigationOptions}
                ],
                1
            ),
            this._renderTitleRow(
                [
                    {color: 'orange', data: deviceOptions},
                    {color: 'blue', data: sessionOptions},
                    {color: 'grey', data: receiptBroadcastOptions},
                ],
                2
            ),
            this._renderTitleRow(
                [
                    {color: 'grey', data: receiptPositionBroadcastOptions},
                    {color: 'grey', data: restBroadcastOptions}
                ],
                3
            )
        ]
    }

    _renderTitleRow(items, count) {
        const row = [];
        items.forEach(
            (item, i) => {
                const padding = [styles.topPadding, styles.bottomPadding];
                switch (i) {
                    case 0:
                        padding.push(styles.rightPadding);
                        break;
                    case 1:
                        padding.push(styles.leftPadding);
                        padding.push(styles.rightPadding);
                        break;
                    case 2:
                        padding.push(styles.leftPadding);
                }
                row.push(
                    <TitleItem
                        key={(i + 1) * count}
                        color={item.color}
                        padding={padding}
                        onPress={() => this.props.navigation.navigate('Options', item.data)}
                        text={item.data.title}/>
                )
            }
        );
        return (
            <View key={count} style={styles.row}>
                {row}
            </View>
        )
    }

}
