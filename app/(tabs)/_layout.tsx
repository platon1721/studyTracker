import { Stack, Tabs } from "expo-router"
import { Colors } from "../../constans/Colors";
import {Ionicons} from "@expo/vector-icons";

const Layout = () => {

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: Colors.primary,
                headerStyle: {
                    backgroundColor: Colors.primary,
                },
                headerTitleStyle: {
                    color: "white"
                }
            }}>
            <Tabs.Screen name="subjects" options={{
                title: "Subjects",
                tabBarIcon: ({size, color}) => (
                    <Ionicons
                        name="book"
                        size={size}
                        color={color}/>)
            }}/>
            <Tabs.Screen name="sessions"
                         options={{
                             title: "Sessions",
                             tabBarIcon: ({size, color}) => (
                                 <Ionicons
                                     name="time"
                                     size={size}
                                     color={color}/>)
                         }}/>
        </Tabs>
    )
}

export default Layout;