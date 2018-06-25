import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import styles from '../../res/styles';

const RowItem = ({buttonColor, onPress, textColor, text}) =>
    <TouchableOpacity style={buttonColor ? styles[buttonColor] : null} onPress={onPress}>
        <View style={[styles.rowItem, styles.center]}>
            <View style={[styles.container, styles.row, styles.center]}>
                <Text style={[styles.title, textColor ? styles[textColor] : styles.white]}>
                    {text}
                </Text>
            </View>
        </View>
    </TouchableOpacity>;

export default RowItem