import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

/**
 * Footer básico reutilizable.
 * Ideal para mostrar branding, redes sociales o información de copyright.
 */
export const Footer = () => {
    const currentYear = new Date().getFullYear();

    const handleSocialPress = (platform) => {
        console.log(`Abrir ${platform}`);
        // Ejemplo: Linking.openURL('https://instagram.com/tu_cuenta');
    };

    return (
        <View style={styles.container}>
            {/* Sección del Logo / Nombre (Placeholder) */}
            <View style={styles.brandSection}>
                <View style={styles.logoPlaceholder}>
                    <Ionicons name="fitness" size={24} color="#6200ee" />
                </View>
                <Text style={styles.brandName}>Entrenos App</Text>
            </View>

            <Text style={styles.description}>
                Tu compañero ideal para alcanzar tus objetivos de entrenamiento.
            </Text>

            {/* Redes Sociales */}
            <View style={styles.socialRow}>
                <TouchableOpacity
                    style={styles.socialButton}
                    onPress={() => handleSocialPress('Instagram')}
                >
                    <Ionicons name="logo-instagram" size={22} color="#666" />
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.socialButton}
                    onPress={() => handleSocialPress('Twitter')}
                >
                    <Ionicons name="logo-twitter" size={22} color="#666" />
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.socialButton}
                    onPress={() => handleSocialPress('Web')}
                >
                    <Ionicons name="globe-outline" size={22} color="#666" />
                </TouchableOpacity>
            </View>

            {/* Copyright */}
            <View style={styles.copyrightSection}>
                <Text style={styles.copyrightText}>
                    © {currentYear} Entrenos v1. Todos los derechos reservados.
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 30,
        backgroundColor: '#f9f9f9',
        borderTopWidth: 1,
        borderTopColor: '#eee',
        alignItems: 'center',
    },
    brandSection: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    logoPlaceholder: {
        width: 40,
        height: 40,
        backgroundColor: '#fff',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
        // Sombra suave
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    brandName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    description: {
        fontSize: 14,
        color: '#777',
        textAlign: 'center',
        lineHeight: 20,
        marginBottom: 20,
    },
    socialRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 20,
    },
    socialButton: {
        width: 45,
        height: 45,
        borderRadius: 22.5,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 8,
        borderWidth: 1,
        borderColor: '#eee',
    },
    copyrightSection: {
        borderTopWidth: 1,
        borderTopColor: '#eee',
        paddingTop: 15,
        width: '100%',
    },
    copyrightText: {
        fontSize: 12,
        color: '#bbb',
        textAlign: 'center',
    },
});
