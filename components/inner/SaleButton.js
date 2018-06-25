import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import styles from '../../res/styles';

const SaleButton = ({onPress}) =>
    <TouchableOpacity style={styles.green} onPress={onPress}>
        <View style={[styles.titleItem, styles.fullWidth, styles.center, styles.green]}>
            <View style={[styles.container, styles.row, styles.center]}>
                <Text style={[styles.title, styles.white]}>
                    Продажа
                </Text>
            </View>
        </View>
    </TouchableOpacity>;

export default SaleButton