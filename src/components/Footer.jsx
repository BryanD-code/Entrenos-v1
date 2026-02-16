import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {styles} from './estilos/EstiloFooter'

/**
 * Footer básico reutilizable
 */

export const Footer = () => {
    const currentYear = new Date().getFullYear();

    const handleSocialPress = (platform) => {
        console.log(`Abrir ${platform}`);
        Linking.openURL('https://www.instagram.com/brrryang/');
    };

    return (
        <View style={styles.container}>
            {/* Sección del Logo / Nombre (Placeholder) */}
            <View style={styles.brandSection}>
                <View style={styles.logoPlaceholder}>
                    <Ionicons name="fitness" size={24} color="#FF5722" />
                </View>
                <Text style={styles.brandName}>Entreno-v1</Text>
            </View>

            <Text style={styles.description}>
                Tu compañero ideal para alcanzar tus objetivos de entrenamiento.
            </Text>
            <Text style={styles.texto}>
                Hola
            </Text>

            {/* Redes Sociales */}
            <View style={styles.socialRow}>
                <TouchableOpacity
                    style={styles.socialButton}
                    onPress={() => handleSocialPress('Instagram')}
                >
                    <Ionicons name="logo-instagram" size={22} color="#fff" />
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.socialButton}
                    onPress={() => handleSocialPress('x')}
                >
                    <Ionicons name="logo-whatsapp" size={22} color="#fff" />
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.socialButton}
                    onPress={() => handleSocialPress('Web')}
                >
                    <Ionicons name="globe-outline" size={22} color="#fff" />
                </TouchableOpacity>
            </View>

            {/* Copyright */}

        </View>
    );
};


