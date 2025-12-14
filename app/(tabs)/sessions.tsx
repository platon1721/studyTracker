import React, {useCallback, useMemo, useRef, useState} from 'react';

import {FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Ionicons} from "@expo/vector-icons";
import {Colors} from "../../constans/Colors";
import {StudySession} from "../../types";
import {useFocusEffect} from "expo-router";
import {storageUtils} from "../../utils/storage";
import {BottomSheetModal, BottomSheetModalProvider} from "@gorhom/bottom-sheet";
import {SafeAreaView} from "react-native-safe-area-context";
import AddSubjectModal from "../../components/AddSubjectModal";
import AddSessionModal from "../../components/AddSessionModal";

const Sessions = () => {

    const [sessions, setSessions] = useState<StudySession[]>([]);
    const {loadSessions, saveSessions} = storageUtils;
    const [refreshing, setRefreshing] = useState(false);
    const modalRef = useRef<BottomSheetModal>(null)
    const snapPoints = useMemo(() => ["100%"], []);

    useFocusEffect(useCallback(() => {
        getSessions();
    }, []))

    const getSessions = async () => {
        const data = await loadSessions();
        setSessions(data);
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

    const ListItem = ({item}: { item: StudySession }) => (
        <Text>{item.id}</Text>
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
                            <RefreshControl refreshing={refreshing} onRefresh={getSessions}/>
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