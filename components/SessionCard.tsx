import React from 'react';

import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {StudySession, Subject} from "../types";
import {Ionicons} from "@expo/vector-icons";
import {Colors} from "../constans/Colors";


interface SessionCardProps {
    session: StudySession;
    subject: Subject;
    onDelete?: (id: string) => void;
}
const SessionCard = ({session, subject, onDelete} : SessionCardProps) => {


    const formatSessionDate = (dateString: string): string => {
        const sessionDate = new Date(dateString);
        const today = new Date();

        today.setHours(0, 0, 0, 0);
        const sessionDateOnly = new Date(sessionDate);
        sessionDateOnly.setHours(0, 0, 0, 0);

        if (sessionDateOnly.getTime() === today.getTime()) {
            return "Today";
        }

        const day = sessionDate.getDate().toString().padStart(2, '0');
        const month = (sessionDate.getMonth() + 1).toString().padStart(2, '0');
        const year = sessionDate.getFullYear();

        return `${day}.${month}.${year}`;
    };

    return (
        <View style={styles.card}>
            <View style={styles.header}>
                <Text style={styles.title}>{subject.name}</Text>
                {onDelete && (
                    <TouchableOpacity onPress={() => onDelete(session.id)}>
                        <Ionicons name="trash-outline" size={24} color="#FF6B6B"/>
                    </TouchableOpacity>
                )}
            </View>
            <View style={{marginBottom: 5}}>
                <Text style={{color: Colors.grey}}>{formatSessionDate(session.date)}</Text>
            </View>
            <View style={styles.sessionInfo}>
                <Ionicons name="time-outline" size={24} color={Colors.primary}/>
                <Text style={{color: Colors.primary, fontWeight: "bold", fontSize: 22}}>{session.duration} min</Text>
            </View>
            <View style={{backgroundColor: Colors.grey, height: 1, marginVertical: 10}}/>
            <View style={styles.sessionInfo}>
                <Ionicons name="document-text-outline" size={24} color={Colors.grey}/>
                <Text style={{color: Colors.grey, fontSize: 20}}>{session.note}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 20,
        marginHorizontal: 16,
        marginVertical: 8,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 5,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.fontDark,
    },
    sessionInfo: {
        flexDirection: 'row',
        alignItems: "baseline",
        gap: 9
    },
});


export default SessionCard;