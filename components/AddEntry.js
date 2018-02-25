import React, { Component } from 'react'
import { View } from 'react-native'
import { getActivityMetaInfo } from '../utils/helpers'
import Slider from './Slider'
import Steppers from './Steppers'
import DateHeader from './DateHeader'

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

	render() {
		const metaInfo = getActivityMetaInfo()
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
									<Slider
										value={value}
										onChange={value => this.slide(activity, value)}
										{...rest}
									/>
								) : (
									<Steppers
										value={value}
										onIncrement={() => this.increment(activity)}
										onDecrement={() => this.decrement(activity)}
										{...rest}
									/>
								)}
							</View>
						)
					})}
			</View>
		)
	}
}
