import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

/**
 * Header básico reutilizable para la aplicación de entrenamiento.
 * 
 * @param {string} title - Título que se mostrará en el centro.
 * @param {boolean} showBackButton - Si se debe mostrar el botón de retroceso.
 * @param {string} rightIcon - Nombre del icono de Ionicons para mostrar a la derecha.
 * @param {function} onRightIconPress - Función a ejecutar al presionar el icono derecho.
 */
export const Header = ({
    title,
    showBackButton = false,
    rightIcon,
    onRightIconPress
}) => {
    const insets = useSafeAreaInsets();
    const router = useRouter();

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <View style={styles.headerContent}>
                <View style={styles.sideContainer}>
                    {showBackButton && (
                        <TouchableOpacity
                            style={styles.iconButton}
                            onPress={() => router.back()}
                            activeOpacity={0.7}
                        >
                            <Ionicons name="chevron-back" size={28} color="#333" />
                        </TouchableOpacity>
                    )}
                </View>

                <Text style={styles.title} numberOfLines={1}>
                    {title}
                </Text>

                <View style={styles.sideContainer}>
                    {rightIcon && (
                        <TouchableOpacity
                            style={[styles.iconButton, styles.alignRight]}
                            onPress={onRightIconPress}
                            activeOpacity={0.7}
                        >
                            <Ionicons name={rightIcon} size={24} color="#6200ee" />
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#ffffff',
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 3,
    },
    headerContent: {
        height: 60,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 8,
    },
    sideContainer: {
        width: 50,
        justifyContent: 'center',
    },
    iconButton: {
        padding: 8,
        borderRadius: 20,
    },
    alignRight: {
        alignItems: 'flex-end',
    },
    title: {
        flex: 1,
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1a1a1a',
        textAlign: 'center',
    },
});
