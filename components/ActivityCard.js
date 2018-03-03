import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import DateHeader from './DateHeader'
import { gray } from '../utils/colors'
import { getActivityMetaInfo } from '../utils/helpers'

const ActivityCard = ({ date, activities }) => (
	<View>
		{date && <DateHeader date={date} />}
		{Object.keys(activities).map(activity => {
			const {
				getIcon,
				displayName,
				unit,
				backgroundColor,
			} = getActivityMetaInfo(activity)

			return (
				<View style={styles.activity} key={activity}>
					{getIcon()}
					<View>
						<Text style={{ fontSize: 20 }}>{displayName}</Text>
						<Text style={{ fontSize: 16, color: gray }}>
							{activities[activity]}
							{unit}
						</Text>
					</View>
				</View>
			)
		})}
	</View>
)

const styles = StyleSheet.create({
	activity: {
		flexDirection: 'row',
		marginTop: 12,
	},
})

export default ActivityCard
