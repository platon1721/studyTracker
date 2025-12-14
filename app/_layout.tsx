import {Stack} from "expo-router"
import {GestureHandlerRootView} from "react-native-gesture-handler";


const InitialLayout = () => {
    return (
        <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
    );
}
const RootLayout = () => {
    return (

        <GestureHandlerRootView style={{flex: 1}}>
            <InitialLayout/>
        </GestureHandlerRootView>
    );
}
export default RootLayout;