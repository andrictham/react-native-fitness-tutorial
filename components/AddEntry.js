import React, { Component } from 'react'
import { ScrollView, View, TouchableOpacity, Text } from 'react-native'
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

const SubmitButton = ({ onPress }) => {
	return (
		<TouchableOpacity onPress={onPress}>
			<Text>Submit</Text>
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

		// TODO: Navigate to home

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

		// TODO: Navigate to home

		// Update AsyncStorage
		removeEntry(key)
	}

	render() {
		const metaInfo = getActivityMetaInfo()

		if (this.props.alreadyLogged) {
			return (
				<View>
					<Ionicons name="ios-happy-outline" size={100} />
					<Text>You already logged your information for today</Text>
					<TextButton onPress={this.reset}>Reset</TextButton>
				</View>
			)
		}

		return (
			<ScrollView style={{ marginTop: 30 }}>
				<DateHeader date={new Date().toLocaleDateString()} />
				{Object.keys(metaInfo) // Return us an array which will have all the activities in it
					.map(activity => {
						const { getIcon, type, ...rest } = metaInfo[activity]
						const value = this.state[activity]
						return (
							<View key={activity}>
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
			</ScrollView>
		)
	}
}

function mapStateToProps(state) {
	const key = timeToString()
	return {
		alreadyLogged: state[key] && typeof state[key].today === 'undefined',
	}
}

export default connect(mapStateToProps)(AddEntry)
