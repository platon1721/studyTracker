import React, {useEffect, useState} from "react";
import {
    ActivityIndicator, Alert,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import {StudySession, Subject} from "../types";
import {Colors} from "../constans/Colors";
import {storageUtils} from "../utils/storage";
import BottomSheet, {BottomSheetFlatList, BottomSheetScrollView, BottomSheetView} from "@gorhom/bottom-sheet";

interface AddSessionModalProps {
    onBack?: () => void;
    onSave: (session: StudySession) => Promise<void> | void;
}

const AddSessionModal = ({onBack, onSave}: AddSessionModalProps) => {
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);

    const {loadSubjects} = storageUtils;

    const [durationInput, setDurationInput] = useState("");
    const [note, setNote] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const getSubjects = async () => {
            const data = await loadSubjects();
            setSubjects(data);
        };
        getSubjects();
    }, [loadSubjects]);

    const durationHandler = (text: string) => {
        setDurationInput(text.replace(/[^0-9]/g, ""));
    };

    const handInsertSession = async () => {
        const duration = Number(durationInput);
        if (!selectedSubjectId) {
            Alert.alert("Missing subject", "Please select a subject.");
            return;
        }
        if (!durationInput || Number.isNaN(duration) || duration <= 0) {
            Alert.alert("Invalid duration", "Duration must be a positive number.");
            return;
        }
        const now = new Date().toISOString();

        const session: StudySession = {
            id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
            subjectId: selectedSubjectId!,
            duration: Number(durationInput),
            date: now,
            note,
            createdAt: now,
        };
        try {
            setLoading(true);
            await onSave(session);
            onBack?.();
        } catch (e) {
            Alert.alert("Save failed", "Could not save the session. Try again.");
        } finally {
            setLoading(false);
        }

    };

    return (
        <BottomSheetView style={styles.container}>
                <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>Add Study Session</Text>
                </View>

                <Text style={styles.inputTitle}>Subject</Text>

                {subjects.length === 0 ? (
                    <Text style={{ color: Colors.grey }}>No subjects yet. Create one first.</Text>
                ) : (
                    <View style={styles.subjectListBox}>
                        <BottomSheetFlatList
                            data={subjects}
                            keyExtractor={(item) => item.id}
                            keyboardShouldPersistTaps="handled"
                            showsVerticalScrollIndicator={true}
                            nestedScrollEnabled
                            keyboardDismissMode="on-drag"
                            scrollEventThrottle={16}
                            overScrollMode="never"
                            renderItem={({ item }) => {
                                const selected = selectedSubjectId === item.id;

                                return (
                                    <TouchableOpacity
                                        style={[styles.inputRow, selected && styles.inputRowSelected]}
                                        onPress={() => setSelectedSubjectId(item.id)}
                                        activeOpacity={0.7}
                                    >
                                        <View style={styles.radioOuter}>
                                            {selected && <View style={styles.radioInner} />}
                                        </View>
                                        <Text style={styles.inputText}>{item.name}</Text>
                                    </TouchableOpacity>
                                );
                            }}
                        />
                    </View>
                )}


                <Text style={styles.inputTitle}>Duration (minutes)</Text>
                <TextInput
                    style={styles.input}
                    placeholder="e.g. 60"
                    keyboardType="number-pad"
                    onChangeText={durationHandler}
                    value={durationInput}
                    editable={!loading}
                />

                <Text style={styles.inputTitle}>Note</Text>
                <TextInput
                    style={styles.input}
                    placeholder="What did you study?"
                    onChangeText={setNote}
                    value={note}
                    editable={!loading}
                />

                <View style={styles.modalFooter}>
                    <TouchableOpacity style={styles.cancelButton} onPress={() => onBack?.()}>
                        <Text style={{ fontWeight: "bold", fontSize: 16 }}>Cancel</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.addButton} onPress={handInsertSession} disabled={loading}>
                        {loading ? <ActivityIndicator /> : (
                            <Text style={{ fontWeight: "bold", fontSize: 16, color: "white" }}>
                                Add session
                            </Text>
                        )}
                    </TouchableOpacity>
                </View>
        </BottomSheetView>
    );

};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        gap: 16,
    },
    subjectListBox: {
        maxHeight: 110,
    },
    content: {
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
        justifyContent: "space-between"
    },

    inputTitle: {
        fontSize: 20,
        fontWeight: "bold"
    },
    modalTitle: {
        fontSize: 30,
        fontWeight: "bold",
        color: Colors.fontDark
    },
    modalHeader: {
        flexDirection: "row",
        position: "relative"
    },

    input: {
        borderWidth: 1,
        borderRadius: 8,
        padding: 16,
        fontSize: 16,
        borderColor: Colors.grey,
    },

    inputRow: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 14,
        paddingHorizontal: 14,
        borderWidth: 1,
        borderColor: Colors.grey,
        borderRadius: 12,
        backgroundColor: "white",
        marginBottom: 10,
    },
    inputRowSelected: {borderColor: Colors.primary},

    inputText: {fontSize: 16, fontWeight: "500", marginLeft: 12, flex: 1},

    radioOuter: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: Colors.primary,
        alignItems: "center",
        justifyContent: "center",
    },
    radioInner: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: Colors.primary,
    },
});

export default AddSessionModal;
