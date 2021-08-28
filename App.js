import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/Home/HomeScreen';
import {
  ApplicationProvider,
  Icon,
  Text,
  TopNavigation,
  TopNavigationAction,
  IconRegistry,
} from '@ui-kitten/components';
import SelectInterestsScreen from './screens/SelectInterestsScreen';

import * as eva from '@eva-design/eva';
import { StyleSheet } from 'react-native';
import { EvaIconsPack } from '@ui-kitten/eva-icons';

const Stack = createNativeStackNavigator();
function App() {
  return (
    <>
      <IconRegistry icons={EvaIconsPack} />
      <ApplicationProvider {...eva} theme={eva.dark}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Home">
            <Stack.Screen
              name="Interests"
              component={SelectInterestsScreen}
              options={{
                header: () => (
                  <TopNavigation
                    style={styles.header}
                    title={evaProps => (
                      <Text {...evaProps} style={styles.headerTitle}>
                        Interests
                      </Text>
                    )}
                    alignment="center"
                  />
                ),
              }}
            />
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{
                header: ({ navigation }) => (
                  <TopNavigation
                    accessoryRight={
                      <TopNavigationAction
                        onPress={() => navigation.navigate('Interests')}
                        icon={<Icon name="settings-outline" />}
                      />
                    }
                    style={styles.header}
                    title={evaProps => (
                      <Text {...evaProps} style={styles.headerTitle}>
                        NewsKitty
                      </Text>
                    )}
                    alignment="center"
                  />
                ),
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </ApplicationProvider>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#1A2138',
  },
  headerTitle: {
    fontSize: 20,
    letterSpacing: 1.1,
    textTransform: 'uppercase',
  },
});

export default App;
