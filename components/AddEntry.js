import React, { Component } from 'react'
import { View, TouchableOpacity, Text } from 'react-native'
import { getActivityMetaInfo, timeToString } from '../utils/helpers'
import SliderComponent from './SliderComponent'
import SteppersComponent from './SteppersComponent'
import DateHeader from './DateHeader'
import TextButton from './TextButton'
import { Ionicons } from '@expo/vector-icons'

const SubmitButton = ({ onPress }) => {
	return (
		<TouchableOpacity onPress={onPress}>
			<Text>Submit</Text>
		</TouchableOpacity>
	)
}

export default class AddEntry extends Component {
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

		// TODO: Update Redux

		this.setState(() => ({
			run: 0,
			bike: 0,
			swim: 0,
			sleep: 0,
			eat: 0,
		}))

		// TODO: Navigate to home

		// TODO: Save to "DB"

		// TODO: Clear local notification
	}

	reset = () => {
		const key = timeToString()

		// TODO: Update Redux

		// TODO: Navigate to home

		// TODO: Update "DB"
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
			<View style={{ marginTop: 30 }}>
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
			</View>
		)
	}
}
