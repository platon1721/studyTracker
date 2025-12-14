import React, {useCallback, useMemo, useRef, useState} from 'react';

import {Text, TouchableOpacity, View, StyleSheet, FlatList, RefreshControl, Alert} from 'react-native';
import {Ionicons} from "@expo/vector-icons";
import {Colors} from "../../constans/Colors";
import {StudySession, Subject} from "../../types";
import {useFocusEffect} from "expo-router";
import {storageUtils} from "../../utils/storage"


import AddSubjectModal from "../../components/AddSubjectModal";

import {BottomSheetModal, BottomSheetModalProvider} from "@gorhom/bottom-sheet";
import {SafeAreaView} from "react-native-safe-area-context";
import SubjectCard from "../../components/SubjectCard";


const Subjects = () => {

    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [sessions, setSessions] = useState<StudySession[]>([]);

    const {loadSubjects, saveSubjects, loadSessions} = storageUtils;
    const [refreshing, setRefreshing] = useState(false);
    const modalRef = useRef<BottomSheetModal>(null)
    const snapPoints = useMemo(() => ["70%"], []);

    useFocusEffect(useCallback(() => {
        getData();
    }, []))

    const getData = async () => {
        const [subjectsData, sessionsData] = await Promise.all([
            loadSubjects(),
            loadSessions()
        ]);
        setSubjects(subjectsData)
        setSessions(sessionsData)
    }

    const getWeeklyHours = (subjectId: string): number => {
        const now = new Date();
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay()); // Start of week (Sunday)
        startOfWeek.setHours(0, 0, 0, 0);

        const weekSessions = sessions.filter(session => {
            const sessionDate = new Date(session.date);
            return session.subjectId === subjectId && sessionDate >= startOfWeek;
        });

        const totalMinutes = weekSessions.reduce((sum, session) => sum + session.duration, 0);
        return totalMinutes / 60; // Convert minutes to hours
    };

    const showModal = ()=> {
        console.log('Add subject pressed')
        modalRef.current?.present();
    }

    const closeModal = () => {
        modalRef.current?.close();
    }

    const handleSaveSubject = async (newSubject: Subject) => {
        const next = [newSubject, ...subjects];
        setSubjects(next);
        await saveSubjects(next);
        closeModal();
    };

    const deleteSubject = async (id: string) => {
        const next = subjects.filter(s => s.id !== id);
        setSubjects(next);
        await saveSubjects(next);
    }

    const ListItem = ({item}: { item: Subject }) => (
        <SubjectCard
            subject={item}
            hoursThisWeek={getWeeklyHours(item.id)}
            onDelete={deleteSubject}
        />
    )

    const EmptyState = () => (
        <View style={styles.emptyStateContainer}>
            <Ionicons name="book-outline" size={100} color="lightgray"/>
            <Text style={styles.emptyListText}>No subjects yet</Text>
        </View>
    )

    return (
        <BottomSheetModalProvider>
                <View style={{flex: 1}}>
                    <FlatList
                        data={subjects}
                        style={styles.list}
                        keyExtractor={item => item.id}
                        ListEmptyComponent={EmptyState}
                        contentContainerStyle={
                            subjects.length === 0 && styles.emptyList
                        }
                        ItemSeparatorComponent={() => <View style={{height: 2, backgroundColor: "lightgray"}}/>}
                        renderItem={ListItem}
                        refreshControl={
                            <RefreshControl refreshing={refreshing} onRefresh={getData}/>
                        }
                    />
                    <TouchableOpacity
                        style={styles.addButton}
                        onPress={() => showModal()}>
                        <Ionicons name="add" size={24} color="white"/>
                    </TouchableOpacity>
                </View>
                <BottomSheetModal
                    ref={modalRef}
                    snapPoints={snapPoints}>
                    <AddSubjectModal onBack={closeModal} onSave={handleSaveSubject}/>
                </BottomSheetModal>
        </BottomSheetModalProvider>
    );
};

const styles = StyleSheet.create({
    addButton: {
        borderRadius: 100 / 2,
        height: 50,
        width: 50,
        backgroundColor: Colors.primary,
        position: 'absolute',
        right: 15,
        bottom: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    list: {
    },
    emptyStateContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    emptyList: {
        flex: 1,
        justifyContent: 'center'
    },
    emptyListText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.grey
    }
});
export default Subjects;