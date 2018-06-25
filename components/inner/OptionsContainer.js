import React from 'react';
import {View} from 'react-native';
import styles from '../../res/styles';

const OptionsContainer = ({options}) =>
    <View style={[styles.container, styles.row, styles.center]}>
        <View>
            {options}
        </View>
    </View>;

export default OptionsContainer