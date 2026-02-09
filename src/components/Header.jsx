import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuthGlobal } from '../context/AuthContext';

export const Header = ({
    title,
    showBackButton = false,
    rightIcon,
    onRightIconPress
}) => {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const { user, logout } = useAuthGlobal();
    // Para obtener las iniciales del nombre del usuario para el avatar
    const getInitials = (name) => {
        if (!name) return "U";
        return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <View style={styles.headerContent}>

                <View style={styles.leftContainer}>
                    {showBackButton ? (
                        <TouchableOpacity
                            style={styles.iconButton}
                            onPress={() => router.back()}
                            activeOpacity={0.7}
                        >
                            <Ionicons name="chevron-back" size={28} color="#333" />
                        </TouchableOpacity>
                    ) : (
                        <View style={styles.userInfo}>
                            <View style={styles.avatar}>
                                <Text style={styles.avatarText}>{getInitials(user?.username)}</Text>
                            </View>
                            <View style={styles.textContainer}>
                                <Text style={styles.userName} numberOfLines={1}>
                                    {user?.username || "Usuario"}
                                </Text>
                                <Text style={styles.userRole}>
                                    {user?.role || "Sin rol"}
                                </Text>
                            </View>
                        </View>
                    )}
                </View>


                {title && (
                    <Text style={styles.title} numberOfLines={1}>
                        {title}
                    </Text>
                )}


                <View style={styles.rightContainer}>
                    {rightIcon && (
                        <TouchableOpacity
                            style={styles.iconButton}
                            onPress={onRightIconPress}
                            activeOpacity={0.7}
                        >
                            <Ionicons name={rightIcon} size={24} color="#6200ee" />
                        </TouchableOpacity>
                    )}

                    <TouchableOpacity
                        style={[styles.iconButton, styles.logoutButton]}
                        onPress={() => logout()}
                        activeOpacity={0.7}
                    >
                        <Ionicons name="log-out-outline" size={24} color="#ff3b30" />
                    </TouchableOpacity>
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
        height: 70,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
    },
    leftContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#f0f0f5',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
        borderWidth: 1,
        borderColor: '#e1e1e8',
    },
    avatarText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#6200ee',
    },
    textContainer: {
        justifyContent: 'center',
    },
    userName: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#1a1a1a',
    },
    userRole: {
        fontSize: 11,
        color: '#8e8e93',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    rightContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    iconButton: {
        padding: 8,
        marginLeft: 4,
    },
    logoutButton: {
        marginLeft: 8,
    },
    title: {
        position: 'absolute',
        left: 0,
        right: 0,
        textAlign: 'center',
        fontSize: 17,
        fontWeight: '600',
        color: '#1a1a1a',
        zIndex: -1,
    },
});
