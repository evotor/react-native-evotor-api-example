import React from 'react';
import {View, ScrollView, Text} from 'react-native';
import styles from '../../res/styles';

const ResponseContainer = ({response}) =>
    <ScrollView style={[styles.container, styles.padding]}>
        <View>
            <Text style={styles.white}>
                {response}
            </Text>
        </View>
    </ScrollView>;

export default ResponseContainer