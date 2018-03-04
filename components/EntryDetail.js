import React, { Component } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { connect } from 'react-redux'
import { white } from '../utils/colors'
import ActivityCard from './ActivityCard'

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

	render() {
		const { activities } = this.props

		return (
			<View style={styles.container}>
				<ActivityCard activities={activities} />
				{/* <Text>
					Entry Detail – {this.props.navigation.state.params.entryID}{' '}
				</Text> */}
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

export default connect(mapStateToProps)(EntryDetail)
