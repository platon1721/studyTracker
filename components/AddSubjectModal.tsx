import React, {useState} from 'react';

import {Text, View, StyleSheet, TextInput, Alert, TouchableOpacity, ActivityIndicator} from 'react-native';
import {BottomSheetView} from "@gorhom/bottom-sheet";
import {Colors} from "../constans/Colors";
import {Subject} from "../types";


interface AddSubjectModalProps {
    onBack?: () => void;
    onSave: (subject: Subject) => Promise<void> | void;
}

const AddSubjectModal = ({onBack, onSave}: AddSubjectModalProps) => {

    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);

    const [weeklyGoalInput, setWeeklyGoalInput] = useState("");
    const weeklyGoal = Number(weeklyGoalInput);
    const weeklyGoalChangeHandler = (text: string) => {
        const numericText = text.replace(/[^0-9]/g, "");
        setWeeklyGoalInput(numericText);
    };
    const handInsertSubject = async () => {
        const cleanName = name.trim();
        const weeklyGoal = Number(weeklyGoalInput);

        if (!cleanName) {
            Alert.alert("Invalid subject name", "Please enter a subject name.");
            return;
        }
        if (!weeklyGoalInput || Number.isNaN(weeklyGoal) || weeklyGoal <= 0) {
            Alert.alert("Invalid weekly goal", "Weekly goal must be a positive number.");
            return;
        }

        const now = new Date().toISOString();

        const subject: Subject = {
            id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
            name: cleanName,
            weeklyGoal: weeklyGoal,
            createdAt: now
        };

        try {
            setLoading(true);
            await onSave(subject);
            onBack?.();
        } catch (e) {
            Alert.alert("Save failed", "Could not save the subject. Try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <BottomSheetView style={styles.modalContainer}>
            <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Add subject</Text>
            </View>
            <Text style={styles.inputTitle}>Subject Name</Text>
            <TextInput style={styles.input}
                       placeholder={"e.g. Mathematics"}
                       onChangeText={setName}
                       editable={!loading}
                       value={name}/>
            <Text style={styles.inputTitle}>Weekly Goal (hours)</Text>
            <TextInput style={styles.input}
                       placeholder={"0"}
                       keyboardType="number-pad"
                       onChangeText={weeklyGoalChangeHandler}
                       value={weeklyGoalInput}
                       editable={!loading}/>
            <View style={styles.modalFooter}>
                <TouchableOpacity style={styles.cancelButton} onPress={() => {
                    onBack()
                }}>
                    <Text style={{fontWeight: "bold", fontSize: 16}}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.addButton} onPress={handInsertSubject} disabled={loading}>
                    {loading ? (
                        <ActivityIndicator/>
                    ) : (
                        <Text style={{fontWeight: "bold", fontSize: 16, color: "white"}}>Add subject</Text>
                    )}
                </TouchableOpacity>
            </View>
        </BottomSheetView>

    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        padding: 20,
        gap: 16,
    },
    addButton: {
        backgroundColor: Colors.primary,
        borderRadius: 8,
        height: 50,
        minWidth: 140,
        maxWidth: "100%",
        justifyContent: "center",
        alignItems: "center",
    },
    cancelButton: {
        backgroundColor: Colors.grey,
        borderRadius: 8,
        height: 50,
        minWidth: 140,
        maxWidth: "100%",
        justifyContent: "center",
        alignItems: "center",
    },
    modalFooter: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    inputTitle: {
        fontSize: 20,
        fontWeight: "bold",
    },
    modalTitle: {
        fontSize: 30,
        fontWeight: "bold",
        color: Colors.fontDark
    },
    modalHeader: {
        flexDirection: "row",
        position: "relative",
    },
    input: {
        borderWidth: 1,
        borderRadius: 8,
        padding: 16,
        fontSize: 16,
        borderColor: Colors.grey
    },
});
export default AddSubjectModal;