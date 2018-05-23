import React from 'react';
import {View} from 'react-native';
import RowItem from './inner/RowItem';
import OptionsContainer from './inner/OptionsContainer';
import ResponseContainer from './inner/ResponseContainer';
import styles from '../res/styles';

export default class Options extends React.Component {

    static navigationOptions = ({navigation}) => {
        return {
            title: navigation.state.params.title,
            headerStyle: styles.deepGrey,
            headerTintColor: 'white',
        }
    };

    render() {
        return (
            <View style={[styles.container, styles.deepGrey]}>
                {this._renderContent()}
            </View>
        )
    }

    _renderContent() {
        const {state, navigate} = this.props.navigation;
        if (state.params.options) {
            const options = [];
            state.params.options.forEach(
                (item, i) =>
                    options.push(
                        <RowItem
                            key={i}
                            onPress={() => item.onSelect(data =>
                                navigate('Response', {title: item.title, response: data})
                            )}
                            textColor={item.title === "Очистить список событий" ? 'red' : null}
                            text={item.title}/>
                    )
            );
            return <OptionsContainer options={options}/>
        }
        return <ResponseContainer response={state.params.response}/>
    }

}