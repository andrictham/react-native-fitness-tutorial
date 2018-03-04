import React, { Component } from 'react'
import { View, Text } from 'react-native'

class EntryDetail extends Component {
	render() {
		return (
			<View>
				<Text>
					Entry Detail – {this.props.navigation.state.params.entryID}{' '}
				</Text>
			</View>
		)
	}
}

export default EntryDetail
