import { StyleSheet } from 'react-native';
export const styles = StyleSheet.create({
    container: {
        padding: 1,
        backgroundColor: '#1A1A1A',
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
        width: 20,
        height: 20,
        backgroundColor: '#fff',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    brandName: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#fff',
    },
    description: {
        fontSize: 14,
        color: '#777',
        textAlign: 'center',
        lineHeight: 20,
        marginBottom: 10,
    },
    socialRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 10,
    },
    socialButton: {
        width: 25,
        height: 25,
        borderRadius: 22.5,
        backgroundColor: '#FF5722',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 8,
        borderWidth: 1,
        borderColor: '#FF5722',
    },
    copyrightSection: {
        borderTopWidth: 1,
        borderTopColor: '#eee',
        paddingTop: 15,
        width: '100%',
    },
    copyrightText: {
        fontSize: 9,
        color: '#bbb',
        textAlign: 'center',
    },
    
});