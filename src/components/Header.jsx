import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator, Modal, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { useAuthGlobal } from '../context/AuthContext';
import { useThemeGlobal } from '../context/ThemeContext';

export const Header = ({
    title,
    showBackButton = false,
    rightIcon,
    onRightIconPress
}) => {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const { user, logout, updateProfileImage } = useAuthGlobal();
    const { theme, toggleTheme, isDark } = useThemeGlobal();

    const [uploading, setUploading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const cameraInputRef = useRef(null);

    const getInitials = (name) => {
        if (!name) return "U";
        return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
    };

    const handleSelectFromGallery = async () => {
        try {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                alert('Se requieren permisos de acceso a la galería para cambiar tu foto.');
                return;
            }

            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ['images'],
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.8,
            });

            if (!result.canceled && result.assets && result.assets[0].uri) {
                setModalVisible(false);
                setUploading(true);
                try {
                    await updateProfileImage(result.assets[0].uri);
                    console.log('✅ Avatar actualizado desde galería');
                } catch (uploadErr) {
                    console.error('Error subiendo desde galería:', uploadErr);
                    alert('Error al subir la imagen. Inténtalo de nuevo.');
                } finally {
                    setUploading(false);
                }
            }
        } catch (err) {
            console.error(err);
            alert('Ocurrió un error al seleccionar la imagen: ' + err.message);
            setUploading(false);
        }
    };

    // Handler para cuando se captura foto desde el input nativo (web/iOS)
    const handleCameraInputChange = async (event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setModalVisible(false);
        setUploading(true);
        try {
            // Crear una URL local del archivo capturado
            const uri = URL.createObjectURL(file);
            await updateProfileImage(uri);
            console.log('✅ Avatar actualizado desde cámara (web)');
        } catch (uploadErr) {
            console.error('Error subiendo desde cámara:', uploadErr);
            alert('Error al subir la imagen. Inténtalo de nuevo.');
        } finally {
            setUploading(false);
            // Resetear el input para poder seleccionar la misma foto de nuevo
            if (cameraInputRef.current) cameraInputRef.current.value = '';
        }
    };

    const handleTakeNewPhoto = async () => {
        if (Platform.OS === 'web') {
            // En web (incluido iOS Safari), usar input nativo con capture
            // Esto abre directamente la cámara del iPhone/dispositivo
            if (cameraInputRef.current) {
                cameraInputRef.current.click();
            }
            return;
        }

        // En nativo (Expo Go / build nativo)
        try {
            const { status } = await ImagePicker.requestCameraPermissionsAsync();
            if (status !== 'granted') {
                alert('Se requieren permisos de cámara para cambiar tu foto.');
                return;
            }

            let result = await ImagePicker.launchCameraAsync({
                mediaTypes: ['images'],
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.8,
            });

            if (!result.canceled && result.assets && result.assets[0].uri) {
                setModalVisible(false);
                setUploading(true);
                try {
                    await updateProfileImage(result.assets[0].uri);
                    console.log('✅ Avatar actualizado desde cámara');
                } catch (uploadErr) {
                    console.error('Error subiendo desde cámara:', uploadErr);
                    alert('Error al subir la imagen. Inténtalo de nuevo.');
                } finally {
                    setUploading(false);
                }
            }
        } catch (err) {
            console.error('Error con la cámara:', err);
            alert('La cámara no está disponible en este dispositivo. Usa la galería en su lugar.');
            setUploading(false);
        }
    };

    return (
        <View style={[
            styles.container, 
            { 
                paddingTop: insets.top, 
                backgroundColor: theme.card, 
                borderBottomColor: theme.border,
                shadowColor: isDark ? '#000' : '#888'
            }
        ]}>
            {/* Input nativo oculto para capturar foto desde cámara en web/iOS */}
            {Platform.OS === 'web' && (
                <input
                    ref={cameraInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handleCameraInputChange}
                    style={{ display: 'none' }}
                />
            )}

            <View style={styles.headerContent}>

                <View style={styles.leftContainer}>
                    {showBackButton ? (
                        <TouchableOpacity
                            style={styles.iconButton}
                            onPress={() => router.back()}
                            activeOpacity={0.7}
                        >
                            <Ionicons name="chevron-back" size={28} color={theme.primary} />
                        </TouchableOpacity>
                    ) : (
                        <View style={styles.userInfo}>
                            <TouchableOpacity
                                activeOpacity={0.8}
                                onPress={() => setModalVisible(true)}
                                style={[styles.avatar, { backgroundColor: theme.inputBackground, borderColor: theme.border }]}
                                disabled={uploading}
                            >
                                {uploading ? (
                                    <ActivityIndicator size="small" color={theme.primary} />
                                ) : user?.photoURL ? (
                                    <Image 
                                        key={user.photoURL} 
                                        source={{ uri: user.photoURL, cache: 'reload' }} 
                                        style={styles.avatarImage} 
                                    />
                                ) : (
                                    <Text style={[styles.avatarText, { color: theme.primary }]}>
                                        {getInitials(user?.username)}
                                    </Text>
                                )}
                            </TouchableOpacity>
                            <View style={styles.textContainer}>
                                <Text style={[styles.userName, { color: theme.text }]} numberOfLines={1}>
                                    {user?.username || "Usuario"}
                                </Text>
                                <Text style={[styles.userRole, { color: theme.textMuted }]}>
                                    {user?.role || "Sin rol"}
                                </Text>
                            </View>
                        </View>
                    )}
                </View>

                {title && (
                    <Text style={[styles.title, { color: theme.text }]} numberOfLines={1}>
                        {title}
                    </Text>
                )}

                <View style={styles.rightContainer}>
                    {/* Botón dinámico para cambiar el tema */}
                    <TouchableOpacity
                        style={styles.iconButton}
                        onPress={toggleTheme}
                        activeOpacity={0.7}
                    >
                        <Ionicons 
                            name={isDark ? "sunny" : "moon"} 
                            size={22} 
                            color={theme.primary} 
                        />
                    </TouchableOpacity>

                    {rightIcon && (
                        <TouchableOpacity
                            style={styles.iconButton}
                            onPress={onRightIconPress}
                            activeOpacity={0.7}
                        >
                            <Ionicons name={rightIcon} size={22} color={theme.primary} />
                        </TouchableOpacity>
                    )}

                    <TouchableOpacity
                        style={[styles.iconButton, styles.logoutButton]}
                        onPress={() => logout()}
                        activeOpacity={0.7}
                    >
                        <Ionicons name="log-out-outline" size={22} color="#ff3b30" />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Modal de Vista Ampliada y Opciones de Avatar */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
                        {/* Botón de cerrar superior */}
                        <TouchableOpacity 
                            style={styles.modalCloseIconBtn} 
                            onPress={() => setModalVisible(false)}
                            activeOpacity={0.7}
                        >
                            <Ionicons name="close" size={24} color={theme.text} />
                        </TouchableOpacity>

                        {/* Avatar Ampliado */}
                        <View style={[
                            styles.largeAvatar, 
                            { 
                                backgroundColor: theme.inputBackground, 
                                borderColor: theme.primary 
                            }
                        ]}>
                            {user?.photoURL ? (
                                <Image 
                                    key={`modal-${user.photoURL}`} 
                                    source={{ uri: user.photoURL, cache: 'reload' }} 
                                    style={styles.largeAvatarImage} 
                                />
                            ) : (
                                <Text style={[styles.largeAvatarText, { color: theme.primary }]}>
                                    {getInitials(user?.username)}
                                </Text>
                            )}
                        </View>

                        {/* Nombre del Usuario */}
                        <Text style={[styles.modalUserName, { color: theme.text }]}>
                            {user?.username || "Usuario"}
                        </Text>
                        <Text style={[styles.modalUserEmail, { color: theme.textMuted }]}>
                            {user?.email}
                        </Text>

                        {/* Divisor */}
                        <View style={[styles.modalDivider, { backgroundColor: theme.border }]} />

                        <Text style={[styles.modalSectionTitle, { color: theme.text }]}>Cambiar Foto de Perfil</Text>

                        {/* Botones para actualizar foto */}
                        {Platform.OS === 'web' ? (
                            /* En web: un solo botón que abre el selector de archivos.
                               En iPhone Safari, este selector ofrece "Hacer foto" o "Fototeca" automáticamente */
                            <TouchableOpacity
                                style={[styles.modalOptionBtnFull, { backgroundColor: theme.inputBackground }]}
                                onPress={handleSelectFromGallery}
                                activeOpacity={0.8}
                            >
                                <Ionicons name="cloud-upload-outline" size={20} color={theme.primary} style={{ marginRight: 8 }} />
                                <Text style={[styles.modalOptionTextSmall, { color: theme.text }]}>Subir Foto</Text>
                            </TouchableOpacity>
                        ) : (
                            /* En nativo: dos botones separados */
                            <View style={styles.modalButtonsRow}>
                                <TouchableOpacity
                                    style={[styles.modalOptionBtnHalf, { backgroundColor: theme.inputBackground }]}
                                    onPress={handleTakeNewPhoto}
                                    activeOpacity={0.8}
                                >
                                    <Ionicons name="camera-outline" size={20} color={theme.primary} style={{ marginRight: 8 }} />
                                    <Text style={[styles.modalOptionTextSmall, { color: theme.text }]}>Cámara</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[styles.modalOptionBtnHalf, { backgroundColor: theme.inputBackground }]}
                                    onPress={handleSelectFromGallery}
                                    activeOpacity={0.8}
                                >
                                    <Ionicons name="image-outline" size={20} color={theme.primary} style={{ marginRight: 8 }} />
                                    <Text style={[styles.modalOptionTextSmall, { color: theme.text }]}>Galería</Text>
                                </TouchableOpacity>
                            </View>
                        )}

                        <TouchableOpacity
                            style={[styles.modalCloseBtn, { backgroundColor: theme.border }]}
                            onPress={() => setModalVisible(false)}
                            activeOpacity={0.8}
                        >
                            <Text style={[styles.modalCloseText, { color: theme.text }]}>Cerrar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        borderBottomWidth: 1,
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
        flex: 1.2,
        flexDirection: 'row',
        alignItems: 'center',
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 38,
        height: 38,
        borderRadius: 19,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
        borderWidth: 1.5,
        overflow: 'hidden',
    },
    avatarText: {
        fontSize: 13,
        fontWeight: 'bold',
    },
    avatarImage: {
        width: '100%',
        height: '100%',
        borderRadius: 18,
    },
    textContainer: {
        justifyContent: 'center',
    },
    userName: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    userRole: {
        fontSize: 10,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginTop: 1,
    },
    rightContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    iconButton: {
        padding: 8,
        marginLeft: 2,
    },
    logoutButton: {
        marginLeft: 6,
    },
    title: {
        position: 'absolute',
        left: 0,
        right: 0,
        textAlign: 'center',
        fontSize: 16,
        fontWeight: '700',
        zIndex: -1,
    },
    // Estilos del Modal de Avatar Ampliado
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.75)',
    },
    modalCard: {
        width: '85%',
        maxWidth: 340,
        borderRadius: 24,
        padding: 24,
        alignItems: 'center',
        borderWidth: 1,
        position: 'relative',
    },
    modalCloseIconBtn: {
        position: 'absolute',
        top: 16,
        right: 16,
        padding: 4,
        zIndex: 10,
    },
    largeAvatar: {
        width: 140,
        height: 140,
        borderRadius: 70,
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        marginTop: 8,
        marginBottom: 16,
    },
    largeAvatarImage: {
        width: '100%',
        height: '100%',
        borderRadius: 68,
    },
    largeAvatarText: {
        fontSize: 48,
        fontWeight: 'bold',
    },
    modalUserName: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalUserEmail: {
        fontSize: 13,
        textAlign: 'center',
        marginTop: 2,
    },
    modalDivider: {
        width: '100%',
        height: 1,
        marginVertical: 18,
    },
    modalSectionTitle: {
        fontSize: 14,
        fontWeight: '700',
        alignSelf: 'flex-start',
        marginBottom: 12,
    },
    modalButtonsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 18,
    },
    modalOptionBtnHalf: {
        flexDirection: 'row',
        width: '48%',
        height: 48,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalOptionBtnFull: {
        flexDirection: 'row',
        width: '100%',
        height: 48,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 18,
    },
    modalOptionTextSmall: {
        fontSize: 14,
        fontWeight: '600',
    },
    modalCloseBtn: {
        width: '100%',
        height: 48,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalCloseText: {
        fontSize: 15,
        fontWeight: 'bold',
    },
});
