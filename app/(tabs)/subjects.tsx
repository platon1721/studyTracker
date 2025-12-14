import React, {useCallback, useMemo, useRef, useState} from 'react';

import {Text, TouchableOpacity, View, StyleSheet, FlatList, RefreshControl} from 'react-native';
import {Ionicons} from "@expo/vector-icons";
import {Colors} from "../../constans/Colors";
import {Subject} from "../../types";
import {useFocusEffect} from "expo-router";
import {storageUtils} from "../../utils/storage"


import AddSubjectModal from "../../components/AddSubjectModal";

import {BottomSheetModal, BottomSheetModalProvider} from "@gorhom/bottom-sheet";
import {SafeAreaView} from "react-native-safe-area-context";


const Subjects = () => {

    const [subjects, setSubjects] = useState<Subject[]>([]);

    const {loadSubjects, saveSubjects} = storageUtils;
    const [refreshing, setRefreshing] = useState(false);
    const modalRef = useRef<BottomSheetModal>(null)
    const snapPoints = useMemo(() => ["70%"], []);

    useFocusEffect(useCallback(() => {
        getSubjects();
    }, []))

    const getSubjects = async () => {
        const data = await loadSubjects();
        setSubjects(data);
    }

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

    const ListItem = ({item}: { item: Subject }) => (
        <Text>{item.name}</Text>
    )

    const EmptyState = () => (
        <View style={styles.emptyStateContainer}>
            <Ionicons name="book-outline" size={100} color="lightgray"/>
            <Text style={styles.emptyListText}>No subjects yet</Text>
        </View>
    )

    return (
        <BottomSheetModalProvider>
            <SafeAreaView style={[styles.container]} edges={['top', 'bottom']}>
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
                            <RefreshControl refreshing={refreshing} onRefresh={getSubjects}/>
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
            </SafeAreaView>
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
    },
    container: {
        flex: 1,
    }
});
export default Subjects;