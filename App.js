import React from 'react';
import {StackNavigator} from 'react-navigation';
import Options from "./components/Options";
import Home from "./components/Home";
import Sale from "./components/Sale";

const AppContent = StackNavigator(
    {
        Home: {
            screen: Home
        },
        Options: {
            screen: Options
        },
        Response: {
            screen: Options
        },
        Sale: {
            screen: Sale
        }
    }
);

export default class App extends React.Component {

    render() {
        return <AppContent/>
    }

}


