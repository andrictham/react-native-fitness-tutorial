import React, { Component } from 'react'
import {
	View,
	Text,
	StyleSheet,
	Platform,
	TouchableOpacity,
} from 'react-native'
import { connect } from 'react-redux'
import { receiveEntries, addEntry } from '../actions/index'
import { timeToString, getDailyReminderMessage } from '../utils/helpers'
import { fetchCalendarResults } from '../utils/api'
import UdaciFitnessCalendar from 'udacifitness-calendar'
import { white } from '../utils/colors'
import DateHeader from './DateHeader'
import ActivityCard from './ActivityCard'

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
		<View style={styles.item}>
			{today ? (
				<View>
					<DateHeader date={formattedDate} />
					<Text style={styles.noDataText}>{today}</Text>
				</View>
			) : (
				<TouchableOpacity onPress={() => alert('pressed')}>
					<ActivityCard activities={previousDays} date={formattedDate} />
				</TouchableOpacity>
			)}
		</View>
	)

	// Called if the specific date in our Redux state is null
	renderEmptyDate(formattedDate) {
		return (
			<View style={styles.item}>
				<DateHeader date={formattedDate} />
				<Text style={styles.noDataText}>
					You didn’t log any data on this day.
				</Text>
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

const styles = StyleSheet.create({
	item: {
		backgroundColor: white,
		borderRadius: Platform.OS === 'ios' ? 16 : 2,
		padding: 10,
		marginLeft: 10,
		marginRight: 10,
		marginTop: 17,
		justifyContent: 'center',
		shadowRadius: 3,
		shadowOpacity: 0.8,
		shadowColor: 'rgba(0,0,0,0.2)',
		shadowOffset: {
			width: 0,
			height: 3,
		},
	},
	noDataText: {
		fontSize: 20,
		paddingTop: 20,
		paddingBottom: 20,
	},
})

const mapStateToProps = entries => {
	return {
		entries,
	}
}

export default connect(mapStateToProps)(History)
