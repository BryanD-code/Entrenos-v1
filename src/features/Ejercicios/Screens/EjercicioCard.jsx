import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const EjercicioCard = ({ ejercicio, onPress, onLongPress, onDelete }) => {


    return (
        <View style={styles.card}>
            {/* Presionar para editar instruccion del ejercicio 2 segundos */}
            <TouchableOpacity
                style={styles.cardContent}
                onPress={onPress}
                onLongPress={onLongPress}
                delayLongPress={2000}
                activeOpacity={0.7}
            >
                <View style={styles.header}>
                    <Text style={styles.titulo}>{ejercicio.nombre}</Text>
                </View>
                <Text style={styles.grupo}>Grupo: {ejercicio.grupo}</Text>
                {ejercicio.instrucciones && (
                    <Text style={styles.instrucciones} numberOfLines={2}>
                        {ejercicio.instrucciones}
                    </Text>
                )}
            </TouchableOpacity>

            <View style={styles.actions}>
                {onDelete && (
                    <TouchableOpacity
                        onPress={() => {
                            onDelete();
                        }}
                        style={styles.deleteButton}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                        <MaterialCommunityIcons name="trash-can-outline" size={24} color="#ff3b30" />
                    </TouchableOpacity>
                )}
                <MaterialCommunityIcons name="chevron-right" size={24} color="#ccc" />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        marginHorizontal: 16,
        marginVertical: 8,
        backgroundColor: '#fff',
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        flexDirection: 'row',
    },
    cardContent: {
        flex: 1,
        padding: 16,
    },
    actions: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingRight: 12,
    },
    deleteButton: {
        padding: 10,
        marginRight: 4,
    },
    header: {
        marginBottom: 4,
    },
    titulo: {
        fontWeight: 'bold',
        fontSize: 18,
        color: '#333',
    },
    grupo: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
    },
    instrucciones: {
        fontSize: 14,
        color: '#444',
    },
});

export default EjercicioCard;
