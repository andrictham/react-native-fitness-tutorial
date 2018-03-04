import React, { Component } from 'react'
import { View, StyleSheet } from 'react-native'
import { connect } from 'react-redux'
import { white } from '../utils/colors'
import ActivityCard from './ActivityCard'
import { addEntry } from '../actions'
import { removeEntry } from '../utils/api'
import { timeToString, getDailyReminderMessage } from '../utils/helpers'
import TextButton from './TextButton'

class EntryDetail extends Component {
	static navigationOptions = ({ navigation }) => {
		const { entryID } = navigation.state.params

		const year = entryID.slice(0, 4)
		const month = entryID.slice(5, 7)
		const day = entryID.slice(8)

		return {
			title: `${month}/${day}/${year}`,
		}
	}

	reset = () => {
		const { remove, goBack, entryID } = this.props

		remove() // remove from store
		goBack() // navigate back
		removeEntry(entryID) // remove from AsyncStorage
	}

	shouldComponentUpdate(nextProps) {
		return nextProps.activities !== null && !nextProps.activities.today
	}

	render() {
		const { activities } = this.props

		return (
			<View style={styles.container}>
				<ActivityCard activities={activities} />
				<TextButton onPress={this.reset} style={{ margin: 20 }}>
					Reset
				</TextButton>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: white,
		padding: 15,
	},
})

const mapStateToProps = (state, { navigation }) => {
	// We get passed the state from Redux and navigation from our local component props
	const { entryID } = navigation.state.params

	return {
		entryID,
		activities: state[entryID],
	}
}

const mapDispatchToProps = (dispatch, { navigation }) => {
	const { entryID } = navigation.state.params

	return {
		remove: () =>
			dispatch(
				addEntry({
					[entryID]:
						timeToString() === entryID // If this entry is today’s
							? getDailyReminderMessage() // Set it to the reminder message
							: null, // or else, just set it to null
				}),
			),
		goBack: () => navigation.goBack(),
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(EntryDetail)
