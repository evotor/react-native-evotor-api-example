import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import styles from '../../res/styles';

const TitleItem = ({padding, color, onPress, text}) =>
    <View style={padding}>
        <TouchableOpacity style={styles[color]} onPress={onPress}>
            <View style={[styles.titleItem, styles.center]}>
                <View style={[styles.container, styles.row, styles.center]}>
                    <Text style={[styles.title, styles.white, styles.centerText]}>
                        {text}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    </View>;

export default TitleItem