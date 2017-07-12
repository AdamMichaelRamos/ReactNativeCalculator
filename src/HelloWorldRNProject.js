/**
 * Created by amram on 6/26/2017.
 */
// src/HelloWorldRNProject.js

import React, { Component } from 'react';
import Mathjs from 'mathjs';
import {
    Text,
    View,
    AppRegistry
} from 'react-native';
import Style from './Style';
import InputButton from './InputButton';

// Input to display in the calculator as buttons
const inputButtons = [
    ['','','C','CE'],
    [1,2,3,'/'],
    [4,5,6,'*'],
    [7,8,9,'-'],
    [0,'.','=','+']
];

export default class HelloWorldRNProject extends Component {

    constructor(props) {
        super(props);

        this.state = {
            decimalModifier: 0,
            selectedSymbol: null,
            equalsPressed: false,
            displayValue: []
        }
    }

    render() {
        console.log('Render Calculator Page');
        return (
            <View style={Style.rootContainer}>
                <View style={Style.displayContainer}>
                    <Text style={Style.displayText}>{this.state.displayValue}</Text>
                </View>
                <View style={Style.inputContainer}>
                    {this.renderInputButtons()}
                </View>
            </View>
        );
    }

    renderInputButtons() {
        let views = [];

        for (let rowIdx = 0; rowIdx < inputButtons.length; rowIdx ++) {
            let buttonRow = inputButtons[rowIdx];

            let inputRow = [];
            for (let cellIdx = 0; cellIdx < buttonRow.length; cellIdx ++) {
                let buttonTextValue = buttonRow[cellIdx];

                inputRow.push(
                    <InputButton
                        value={buttonTextValue}
                        highlight={this.state.selectedSymbol === buttonTextValue}
                        onPress={this.onInputButtonPressed.bind(this,buttonTextValue)}
                        key={rowIdx + "-" + cellIdx} />
                );
            }

            views.push(<View style={Style.inputRow} key={"row-" + rowIdx}>{inputRow}</View>)
        }

        return views;
    }

    onInputButtonPressed(buttonTextValue) {
        switch(typeof buttonTextValue) {
            case 'number':
                return this.handleNumberButton(buttonTextValue);
            case 'string':
                return this.handleOperatorButton(buttonTextValue);
        }
    }

    handleNumberButton(numberValue) {
        console.log("NUMBER PRESSED");

        if (this.state.equalsPressed) this.state.displayValue = [];

        let decimalModifier =  (this.state.decimalModifier/10);
        let periodPressed = decimalModifier > 0;
        let currentValue = this.getCurrentValue();
        console.log('\tCurrent Value: '+currentValue);

        let currentValueModified = (currentValue * (!periodPressed ? 10 : 1));
        let addedValueModified = (numberValue * (periodPressed ? decimalModifier : 1));
        let newInputValue = Mathjs.format((currentValueModified + addedValueModified),{precision:14});

        console.log('\tdecimal modified: '+decimalModifier);
        console.log('\tperiodPressed: '+periodPressed);
        console.log('\tCurrent Value Modified: '+currentValueModified+' | Added Value Modified: '+addedValueModified);
        console.log('\tNew Value: '+newInputValue);

        this.state.displayValue.push(newInputValue);

        this.setState({
            decimalModifier: decimalModifier,
            equalsPressed: false
        });
    }

    handleOperatorButton(operatorValue) {
        console.log("OPERATOR PRESSED");
        switch(operatorValue) {
            case 'C':
                this.clearButtonPressed();
                this.state.equalsPressed = false;
                break;
            case '.':
                this.periodButtonPressed();
                break;
            case '=':
                this.equalsButtonPressed();
                break;
            case '/':
            case '*':
            case '+':
            case '-':
                this.arithmeticOperatorPressed(operatorValue);
                console.log("\tDisplay Value: "+this.state.displayValue);
                console.log("\tDisplay Value String: "+this.createDisplayValueString(this.state.displayValue));
                this.state.equalsPressed = false;
                break;
        }
    }

    periodButtonPressed() {
        console.log("\tDECIMAL BUTTON PRESSED");
        if (this.state.decimalModifier <= 0) {
            let temp = this.getCurrentValue();
            temp += ".0";
            this.state.displayValue.push(temp);

            this.setState({
                decimalModifier: 1
            });
        }
    }

    clearButtonPressed() {
        console.log("\tCLEAR BUTTON PRESSED");
        this.setState({
            decimalModifier: 0,
            displayValue: []
        });
    }

    equalsButtonPressed() {
        console.log("\tEQUALS BUTTON PRESSED");
        console.log("\tDisplay Value Array: "+this.state.displayValue);
        let displayValueString = this.createDisplayValueString(this.state.displayValue);
        console.log("\tDisplay Value: "+displayValueString);
        let newDisplayValue = Mathjs.eval(displayValueString);
        console.log("\tNew Display Value: "+newDisplayValue);

        this.setState({
            decimalModifier: 0,
            selectedSymbol: null,
            displayValue: [newDisplayValue],
            equalsPressed: true
        });
    }

    arithmeticOperatorPressed(operator)
    {
        console.log("\tARITHMETIC OPERATOR BUTTON PRESSED");

        this.state.displayValue.push(operator);

        this.setState({
            decimalModifier: 0,
            selectedSymbol: operator,
        });
    }

    createDisplayValueString(displayValues)
    {
        let displayValueString = "";

        displayValues.forEach((value) => {
            displayValueString += value;
        });

        return displayValueString;
    }

    getCurrentValue()
    {

        let currentValue = 0;

        if (this.state.displayValue.length > 0) {
            console.log("\tdisplay values has values try to get last one");
            let temp = this.state.displayValue.pop();
            if (this.isANumber(temp)) {
                console.log("\tget current value from list of display values");
                currentValue = temp;
            }
            else {
                console.log("\tSymbol was pressed recently so just return 0");
                this.state.displayValue.push(temp);
            }
        }
        return currentValue;
        // return this.state.displayValue.length > 0 && !this.state.selectedSymbol ?
        //     this.state.displayValue.pop() : 0;
    }

    isANumber(value)
    {
        console.log("\t\ttest if this value is a number: "+value);
        return /^\d*.?\d+$/.test(value);
    }
}

AppRegistry.registerComponent('HelloWorldRNProject', () => HelloWorldRNProject);


