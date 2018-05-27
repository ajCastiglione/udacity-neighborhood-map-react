import React, {Component} from 'react';
import SingleLocation from './SingleLocation';

export default class AllLocations extends Component {
    constructor(props) {
        super(props);
        this.state = {
            locations: [],
            query: '',
            suggestions: true,
        };

        this.filterLocations = this.filterLocations.bind(this);
        this.toggleSuggestions = this.toggleSuggestions.bind(this);
    }

    /**
     * Filter Locations based on user query
     */
    filterLocations(event) {
        this.props.closeInfoWindow();
        const {value} = event.target;
        let locations = [];
        this.props.allLocations.forEach(function (location) {
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
        this.setState({locations: this.props.allLocations});
    }

    /**
     * Show and hide suggestions
     */
    toggleSuggestions() {
        this.setState({ suggestions: !this.state.suggestions });
    }

    /**
     * Render function of LocationList
     */
    render() {
        if(this.state.locations) {
        let locationlist = this.state.locations.map(function (listItem, index) {
            return (
                <SingleLocation key={index} openInfoWindow={this.props.openInfoWindow.bind(this)} data={listItem}/>
            );
        }, this);

        return (
            <div className="search">
                <input role="search" aria-labelledby="filter" id="search-field" className="search-field" type="text" placeholder="Filter the list"
                       value={this.state.query} onChange={this.filterLocations}/>
                <ul>
                    {this.state.suggestions ? locationlist : null}
                </ul>
                <button className="button" onClick={this.toggleSuggestions}>{this.state.suggestions === true ? 'Hide' : 'Show'} Suggestions</button>
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