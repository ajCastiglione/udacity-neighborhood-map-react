import React, {Component} from 'react';
import SingleLocation from './SingleLocation';

export default class Locations extends Component {
    constructor(props) {
        super(props);
        this.state = {
            locations: [],
            query: '',
            suggestions: true,
        };
    }

    /* Filters locations based on user input */
    filterLocations = (event) => {
        this.props.closeMarkerWindow();
        const {value} = event.target;
        let locations = [];
        this.props.POIs.forEach(function (location) {
            if (location.longname.toLowerCase().indexOf(value.toLowerCase()) >= 0) {
                location.marker.setVisible(true);
                locations.push(location);
            } else {
                location.marker.setVisible(false);
            }
        });

        this.setState({
            locations: locations,
            query: value
        });
    }

    componentWillMount () {
        this.setState({locations: this.props.POIs});
    }

    /* Toggles suggestions box */
    toggleSuggestions = () => {
        this.setState({ suggestions: !this.state.suggestions });
    }

    render() {
        
        if(this.state.locations) {

        let locationlist = this.state.locations.map(function (listItem, index) {
            return (
                <SingleLocation key={index} openMarkerWindow={this.props.openMarkerWindow} data={listItem}/>
            );
        }, this);

        return (
            <div className="search">
                <input role="search" aria-labelledby="filter" id="search-field" className="search-field" type="text" placeholder="Filter the list"
                       value={this.state.query} onChange={this.filterLocations}/>
                <ul>
                    {this.state.suggestions ? locationlist : null}
                </ul>
                <button className="button" onClick={this.toggleSuggestions}>{this.state.suggestions ? 'Hide' : 'Show'} Suggestions</button>
            </div>
        );

    }
        else {

        return (
            <div>
                <p>Error retrieving data, please try again</p>
            </div>
        )
    } 
}
}