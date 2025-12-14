import React, {useCallback, useMemo, useRef, useState} from 'react';

import {FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Ionicons} from "@expo/vector-icons";
import {Colors} from "../../constans/Colors";
import {StudySession, Subject} from "../../types";
import {useFocusEffect} from "expo-router";
import {storageUtils} from "../../utils/storage";
import {BottomSheetModal, BottomSheetModalProvider} from "@gorhom/bottom-sheet";
import AddSessionModal from "../../components/AddSessionModal";
import SessionCard from "../../components/SessionCard";

const Sessions = () => {

    const [sessions, setSessions] = useState<StudySession[]>([]);
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const {loadSessions, saveSessions, loadSubjects} = storageUtils;
    const [refreshing, setRefreshing] = useState(false);
    const modalRef = useRef<BottomSheetModal>(null)
    const snapPoints = useMemo(() => ["100%"], []);

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

    const showModal = ()=> {
        console.log('Add session pressed')
        modalRef.current?.present();
    }

    const closeModal = () => {
        modalRef.current?.close();
    }

    const handleSaveSubject = async (newSession: StudySession) => {
        const next = [newSession, ...sessions];
        setSessions(next);
        await saveSessions(next);
        closeModal();
    }

    const deleteSession = async (id: string) => {
        const next = sessions.filter(s => s.id !== id);
        setSessions(next);
        await saveSessions(next);
    }

    const ListItem = ({item}: { item: StudySession }) => (
        <SessionCard
            session={item}
            subject={subjects.find(s => s.id === item.subjectId)}
            onDelete={deleteSession}
        />
    )

    const EmptyState = () => (
        <View style={styles.emptyStateContainer}>
            <Ionicons name="time-outline" size={100} color={Colors.grey}/>
            <Text style={styles.emptyListText}>No sessions yet</Text>
            <Text style={{color: Colors.grey}}>Start tracking your progress</Text>
        </View>
    )
    return (
        <BottomSheetModalProvider>
                <View style={{flex: 1}}>
                    <FlatList
                        data={sessions}
                        style={styles.list}
                        keyExtractor={item => item.id}
                        ListEmptyComponent={EmptyState}
                        contentContainerStyle={
                            sessions.length === 0 && styles.emptyList
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
                    <AddSessionModal onBack={closeModal} onSave={handleSaveSubject}/>
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
    list: {},
    emptyStateContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    emptyList: {
        flex: 1,
    },
    emptyListText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.grey
    },
    container: {
        flex: 1,
    }

});

export default Sessions;