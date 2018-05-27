import React, { Component } from 'react';

export default class SingleLocation extends Component {
 
    render() {

        return (

            <li 
            role="button" 
            className="box" 
            tabIndex="0" 
            onKeyPress={this.props.openInfoWindow.bind(this, this.props.data.marker)} 
            onClick={this.props.openInfoWindow.bind(this, this.props.data.marker)}
            >

            {this.props.data.longname}

            </li>

        );
        
    }
}