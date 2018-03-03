import React, { Component } from 'react'
import { View, Text } from 'react-native'
import { connect } from 'react-redux'
import { receiveEntries, addEntry } from '../actions/index'
import { timeToString, getDailyReminderMessage } from '../utils/helpers'
import { fetchCalendarResults } from '../utils/api'

class History extends Component {
	componentDidMount() {
		const { dispatch } = this.props

		fetchCalendarResults()
			.then(entries => dispatch(receiveEntries(entries)))
			.then(({ entries }) => {
				if (!entries[timeToString()]) {
					// if there are no entries for today, then set the value in our Redux store for today’s date to be our “daily reminder message”
					dispatch(
						addEntry({
							[timeToString()]: getDailyReminderMessage,
						}),
					)
				}
			})
	}
	render() {
		return (
			<View>
				<Text>{JSON.stringify(this.props)}</Text>
			</View>
		)
	}
}

const mapStateToProps = entries => {
	return {
		entries,
	}
}

export default connect(mapStateToProps)(History)
