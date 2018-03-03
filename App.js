import React from 'react'
import { View } from 'react-native'
import AddEntry from './components/AddEntry'
import History from './components/History'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import reducer from './reducers'

const store = createStore(reducer)

export default class App extends React.Component {
	render() {
		return (
			<Provider store={store}>
				<View style={{ flex: 1 }}>
					<View style={{ height: 20 }} />
					{/* <AddEntry /> */}
					<History />
				</View>
			</Provider>
		)
	}
}
