import React, { Component } from 'react'
import { View, Text } from 'react-native'
import { connect } from 'react-redux'
import { receiveEntries, addEntry } from '../actions/index'
import { timeToString, getDailyReminderMessage } from '../utils/helpers'
import { fetchCalendarResults } from '../utils/api'
import UdaciFitnessCalendar from 'udacifitness-calendar'

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
							[timeToString()]: getDailyReminderMessage(),
						}),
					)
				}
			})
	}

	renderItem = ({ today, ...previousDays }, formattedDate, key) => (
		<View>
			{today ? (
				<Text>{JSON.stringify(today)}</Text>
			) : (
				<Text>{JSON.stringify(previousDays)}</Text>
			)}
		</View>
	)

	// Called if the specific date in our Redux state is null
	renderEmptyDate(formattedDate) {
		return (
			<View>
				<Text>No data for this date</Text>
			</View>
		)
	}

	render() {
		const { entries } = this.props
		return (
			<UdaciFitnessCalendar
				items={entries}
				renderItem={this.renderItem}
				renderEmptyDate={this.renderEmptyDate}
			/>
		)
	}
}

const mapStateToProps = entries => {
	return {
		entries,
	}
}

export default connect(mapStateToProps)(History)
