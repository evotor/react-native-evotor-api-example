import React from 'react';
import {StyleSheet, Dimensions} from 'react-native';

const fullWidth = Dimensions.get('window').width;
const fullHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    row: {
        flexDirection: 'row'
    },
    center: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    centerText: {
        textAlign: 'center'
    },
    title: {
        fontWeight: 'bold'
    },
    fullWidth: {
        width: fullWidth
    },
    titleItem: {
        width: fullWidth / 3 - 2.5,
        height: fullWidth / 3 - 2.5
    },
    rowItem: {
        width: fullWidth,
        height: fullHeight / 15
    },
    leftPadding: {
        paddingLeft: 2.5
    },
    topPadding: {
        paddingTop: 2.5
    },
    rightPadding: {
        paddingRight: 2.5
    },
    bottomPadding: {
        paddingBottom: 2.5
    },
    responsePadding: {
        padding: 2
    },
    green: {
        backgroundColor: '#67A420'
    },
    orange: {
        backgroundColor: '#FF7800'
    },
    blue: {
        backgroundColor: '#448AFF'
    },
    deepGrey: {
        backgroundColor: '#252525'
    },
    grey: {
        backgroundColor: '#8d8d8d'
    },
    red: {
        color: '#ff5f40'
    },
    white: {
        color: 'white'
    }
});

export default styles;