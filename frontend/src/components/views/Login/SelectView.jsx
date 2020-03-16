//Basic React Imports
import React, { Component } from 'react';

//Semantic
import { Button, Form, Grid, Header, Image, Message, Segment } from 'semantic-ui-react'

//Own css styling
import './Login.css';


class SelectView extends Component {
    constructor(props) {
        super(props);
        this.handleViewClick = this.handleViewClick.bind(this);
      }

    handleViewClick() {
       this.props.viewSelector();
        console.log("clicked");
    }

    render() {
        return (
            <>
                <Header as='h3' color='blue' textAlign='center'>
                    Please select your view
                </Header>

                <span className="selectViewButton" onClick={this.handleViewClick()}>
                    <Button size='massive' color='blue' circular icon='user'></Button>
                </span>
                <span className="selectViewButton">
                    <Button size='massive' color='blue' circular icon='settings'></Button>
                </span>
                <span className="selectViewButton">
                    <Button size='massive' color='blue' circular icon='motorcycle'></Button>
                </span>
                <span className="selectViewButton">
                    <Button size='massive' color='blue' circular icon='settings'></Button>
                </span>
            </>
        )
    }
}

export default SelectView