import React from 'react';
import {Text, View, StyleSheet, TouchableOpacity} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {Colors} from '../constans/Colors';
import {Subject} from '../types';

interface SubjectCardProps {
    subject: Subject;
    hoursThisWeek: number;
    onDelete?: (id: string) => void;
}

const SubjectCard = ({subject, hoursThisWeek, onDelete}: SubjectCardProps) => {
    const progressPercentage = Math.min(
        Math.round((hoursThisWeek / subject.weeklyGoal) * 100),
        100
    );

    return (
        <View style={styles.card}>
            <View style={styles.header}>
                <Text style={styles.title}>{subject.name}</Text>
                {onDelete && (
                    <TouchableOpacity onPress={() => onDelete(subject.id)}>
                        <Ionicons name="trash-outline" size={24} color="#FF6B6B"/>
                    </TouchableOpacity>
                )}
            </View>

            <View style={styles.progressContainer}>
                <Text style={styles.progressText}>
                    {hoursThisWeek.toFixed(1)}h / {subject.weeklyGoal}h this week
                </Text>
                <Text style={styles.percentage}>{progressPercentage}%</Text>
            </View>

            <View style={styles.progressBarBackground}>
                <View
                    style={[
                        styles.progressBarFill,
                        {width: `${progressPercentage}%`}
                    ]}
                />
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
        marginBottom: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.fontDark,
    },
    progressContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    progressText: {
        fontSize: 16,
        color: Colors.grey,
    },
    percentage: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.fontDark,
    },
    progressBarBackground: {
        height: 8,
        backgroundColor: '#E8E8E8',
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: Colors.primary,
        borderRadius: 4,
    },
});

export default SubjectCard;