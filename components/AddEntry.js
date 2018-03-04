import React, { Component } from 'react'
import {
	View,
	TouchableOpacity,
	Text,
	Platform,
	StyleSheet,
} from 'react-native'
import {
	getActivityMetaInfo,
	timeToString,
	getDailyReminderMessage,
} from '../utils/helpers'
import SliderComponent from './SliderComponent'
import SteppersComponent from './SteppersComponent'
import DateHeader from './DateHeader'
import TextButton from './TextButton'
import { Ionicons } from '@expo/vector-icons'
import { submitEntry, removeEntry } from '../utils/api'
import { connect } from 'react-redux'
import { addEntry } from '../actions'
import { white, purple } from '../utils/colors'
import { NavigationActions } from 'react-navigation'

const SubmitButton = ({ onPress }) => {
	return (
		<TouchableOpacity
			onPress={onPress}
			style={
				Platform.OS === 'ios'
					? styles.iosSubmitButton
					: styles.androidSubmitButton
			}
		>
			<Text style={styles.submitButtonText}>Submit</Text>
		</TouchableOpacity>
	)
}

class AddEntry extends Component {
	state = {
		run: 0,
		bike: 0,
		swim: 0,
		sleep: 0,
		eat: 0,
	}

	increment = activity => {
		const { max, step } = getActivityMetaInfo(activity)
		this.setState(state => {
			const count = state[activity] + step

			return {
				...state,
				[activity]: count > max ? max : count,
			}
		})
	}

	decrement = activity => {
		const { step } = getActivityMetaInfo(activity)
		this.setState(state => {
			const count = state[activity] - step

			return {
				...state,
				[activity]: count < 0 ? 0 : count,
			}
		})
	}

	slide = (activity, value) => {
		this.setState(() => ({
			[activity]: value,
		}))
	}

	submit = () => {
		const key = timeToString() // Today’s date
		const entry = this.state // Our activities’ metrics

		// Update Redux
		this.props.dispatch(
			addEntry({
				[key]: entry,
			}),
		)

		this.setState(() => ({
			run: 0,
			bike: 0,
			swim: 0,
			sleep: 0,
			eat: 0,
		}))

		// Navigate to home
		this.toHome()

		// Set item in AsyncStorage
		submitEntry({ key, entry })

		// TODO: Clear local notification
	}

	reset = () => {
		const key = timeToString()

		// Update Redux
		this.props.dispatch(
			addEntry({
				[key]: getDailyReminderMessage(),
			}),
		)

		// Navigate to home
		this.toHome()

		// Update AsyncStorage
		removeEntry(key)
	}

	toHome = () => {
		this.props.navigation.dispatch(
			NavigationActions.back({
				key: 'AddEntry',
			}),
		)
	}

	render() {
		const metaInfo = getActivityMetaInfo()

		if (this.props.alreadyLogged) {
			return (
				<View style={styles.center}>
					<Ionicons
						name={Platform.OS === 'ios' ? 'ios-happy-outline' : 'md-happy'}
						size={100}
					/>
					<Text>You already logged your information for today</Text>
					<TextButton onPress={this.reset} style={{ padding: 20 }}>
						Reset
					</TextButton>
				</View>
			)
		}

		return (
			<View style={styles.container}>
				<DateHeader date={new Date().toLocaleDateString()} />
				{Object.keys(metaInfo) // Return us an array which will have all the activities in it
					.map(activity => {
						const { getIcon, type, ...rest } = metaInfo[activity]
						const value = this.state[activity]
						return (
							<View key={activity} style={styles.row}>
								{getIcon()}
								{type === 'slider' ? (
									<SliderComponent
										value={value}
										onChange={value => this.slide(activity, value)}
										{...rest}
									/>
								) : (
									<SteppersComponent
										value={value}
										onIncrement={() => this.increment(activity)}
										onDecrement={() => this.decrement(activity)}
										{...rest}
									/>
								)}
							</View>
						)
					})}
				<SubmitButton onPress={this.submit} />
			</View>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1, // its children will take up all of the space
		padding: 20,
		backgroundColor: white,
	},
	row: {
		flexDirection: 'row',
		flex: 1,
		alignItems: 'center',
	},
	iosSubmitButton: {
		backgroundColor: purple,
		padding: 10,
		borderRadius: 7,
		height: 45,
		marginLeft: 40,
		marginRight: 40,
	},
	androidSubmitButton: {
		backgroundColor: purple,
		padding: 10,
		paddingLeft: 30,
		paddingRight: 30,
		height: 45,
		borderRadius: 2,
		alignSelf: 'flex-end',
		justifyContent: 'center',
		alignItems: 'center',
	},
	submitButtonText: {
		color: white,
		fontSize: 22,
		textAlign: 'center',
	},
	center: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		marginRight: 30,
		marginLeft: 30,
	},
})

function mapStateToProps(state) {
	const key = timeToString()
	return {
		alreadyLogged: state[key] && typeof state[key].today === 'undefined',
	}
}

export default connect(mapStateToProps)(AddEntry)
