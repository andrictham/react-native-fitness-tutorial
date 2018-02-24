import React, { Component } from 'react'
import { View } from 'react-native'
import { getActivityMetaInfo } from '../utils/helpers'

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
		return <View>{getActivityMetaInfo('bike').getIcon()}</View>
	}
}
