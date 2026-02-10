import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  RefreshControl,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import Icon from 'react-native-vector-icons/MaterialIcons';
import NotificationService from '../../../services/Notification/NotificationService';
import { resetNotificationBadge } from '../../../services/Notification/PushNotificationService';
import NotificationStyles from '../../../styles/Notification.css';
import { Sizes } from '@/styles/Common.css';

export default function NotificationPage() {
	const router = useRouter();
	const [notifications, setNotifications] = useState<any[]>([]);
	const [refreshing, setRefreshing] = useState(false);
	const [loading, setLoading] = useState(true);
	const [showDeleteAllModal, setShowDeleteAllModal] = useState(false);

	const loadNotifications = async () => {
		try {
			const data = await NotificationService.getNotifications();
			setNotifications(data);
		
			await resetNotificationBadge();
		} catch (error) {
			console.error('Erreur chargement notifications:', error);
		} finally {
			setLoading(false);
			setRefreshing(false);
		}
	};

	useEffect(() => {
		loadNotifications();
	}, []);

	const onRefresh = () => {
		setRefreshing(true);
		loadNotifications();
	};

	const handleMarkAsRead = async (id: string) => {
		await NotificationService.markAsViewed(id);
		loadNotifications();
	};

	const handleMarkAllAsRead = async () => {
		Alert.alert(
			'Marquer tout comme lu',
			'Voulez-vous marquer toutes les notifications comme lues ?',
			[
				{ text: 'Annuler', style: 'cancel' },
				{
				text: 'Marquer',
				onPress: async () => {
					await NotificationService.markAllAsViewed();
					loadNotifications();
				},
				},
			]
		);
	};

	const handleDeleteNotification = async (id: string) => {
		Alert.alert(
			'Supprimer',
			'Voulez-vous supprimer cette notification ?',
			[
				{ text: 'Annuler', style: 'cancel' },
				{
				text: 'Supprimer',
				style: 'destructive',
				onPress: async () => {
					await NotificationService.deleteNotification(id);
					loadNotifications();
				},
				},
			]
		);
	};

	const handleDeleteAll = async () => {
		setShowDeleteAllModal(false);
		await NotificationService.deleteAllNotifications();
		loadNotifications();
	};

	const formatDate = (date: Date) => {
		const now = new Date();
		const diffMs = now.getTime() - date.getTime();
		const diffMins = Math.round(diffMs / 60000);
		const diffHours = Math.round(diffMs / 3600000);
		const diffDays = Math.round(diffMs / 86400000);

		if (diffMins < 60) {
			return `Il y a ${diffMins} min`;
		} else if (diffHours < 24) {
			return `Il y a ${diffHours} h`;
		} else if (diffDays < 7) {
			return `Il y a ${diffDays} j`;
		} else {
			return date.toLocaleDateString('fr-FR');
		}
	};

	const renderNotification = ({ item }: { item: any }) => (
		<TouchableOpacity
			style={[
				NotificationStyles.notificationCard,
				!item.vue && NotificationStyles.notificationUnread,
			]}
			onPress={() => handleMarkAsRead(item.id!)}
			activeOpacity={0.7}
		>
			<View style={NotificationStyles.notificationHeader}>
				<View style={NotificationStyles.titleContainer}>
					<Icon
						name={item.vue ? "notifications" : "notifications-active"}
						size={16}
						style={NotificationStyles.notificationIcon}
				/>
					<Text style={NotificationStyles.notificationTitle}>{item.titre}</Text>
				</View>
				<TouchableOpacity
					onPress={() => handleDeleteNotification(item.id!)}
					style={NotificationStyles.deleteButton}
				>
					<Icon name="close" size={18} color="#999" />
				</TouchableOpacity>
			</View>
			
			<Text style={NotificationStyles.notificationText}>{item.texte}</Text>
			
			<View style={NotificationStyles.notificationFooter}>
				<Text style={NotificationStyles.dateText}>
					{formatDate(item.dateHeure)}
				</Text>
				{!item.vue && (
					<View style={NotificationStyles.unreadBadge}>
						<Text style={NotificationStyles.unreadBadgeText}>Nouveau</Text>
					</View>
				)}
			</View>
		</TouchableOpacity>
	);

	const DeleteAllModal = () => (
		<Modal
			visible={showDeleteAllModal}
			transparent={true}
			animationType="fade"
			onRequestClose={() => setShowDeleteAllModal(false)}
		>
			<View style={NotificationStyles.modalOverlay}>
				<View style={NotificationStyles.modalContent}>
					<Icon name="warning" size={40} color="#E53E3E" style={{ alignSelf: 'center', marginBottom: Sizes.md }} />
					<Text style={NotificationStyles.modalTitle}>
						Supprimer toutes les notifications
					</Text>
					<Text style={NotificationStyles.modalMessage}>
						Êtes-vous sûr de vouloir supprimer toutes vos notifications ? Cette action est irréversible.
					</Text>
					<View style={NotificationStyles.modalButtons}>
						<TouchableOpacity
							style={[NotificationStyles.modalButton, NotificationStyles.modalCancelButton]}
							onPress={() => setShowDeleteAllModal(false)}
						>
							<Text style={[NotificationStyles.modalButtonText, NotificationStyles.modalCancelButtonText]}>
								Annuler
							</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={[NotificationStyles.modalButton, NotificationStyles.modalConfirmButton]}
							onPress={handleDeleteAll}
						>
							<Text style={[NotificationStyles.modalButtonText, NotificationStyles.modalConfirmButtonText]}>
								Supprimer
							</Text>
						</TouchableOpacity>
					</View>
				</View>
			</View>
		</Modal>
	);

	if (loading) {
		return (
		<View style={[NotificationStyles.loadingContainer, { flex: 1 }]}>
			<ActivityIndicator size="large" color="#4299E1" />
			<Text style={NotificationStyles.loadingText}></Text>
		</View>
		);
	}

	return (
		<View style={NotificationStyles.container}>
		
			<View style={NotificationStyles.header}>
				<Text style={NotificationStyles.headerTitle}>Notifications</Text>
				<View style={NotificationStyles.headerActions}>
					<TouchableOpacity 
						onPress={handleMarkAllAsRead}
						style={{ marginRight: 15 }}
					>
						<Icon name="done-all" size={24} color="#4299E1" />
					</TouchableOpacity>
					<TouchableOpacity onPress={() => setShowDeleteAllModal(true)}>
						<Icon name="delete-sweep" size={24} color="#E53E3E" />
					</TouchableOpacity>
				</View>
			</View>

			{notifications.length > 0 ? (
				<FlatList
					data={notifications}
					renderItem={renderNotification}
					keyExtractor={(item) => item.id!}
					contentContainerStyle={NotificationStyles.listContainer}
					refreshControl={
						<RefreshControl
							refreshing={refreshing}
							onRefresh={onRefresh}
							colors={['#4299E1']}
							tintColor="#4299E1"
						/>
					}
					showsVerticalScrollIndicator={false}
				/>
			) : (
				<View style={NotificationStyles.emptyState}>
					<Icon name="notifications-off" size={80} color="#CBD5E0" />
					<Text style={NotificationStyles.emptyStateTitle}>
						Aucune notification
					</Text>
					<Text style={NotificationStyles.emptyStateText}>
						Vous serez notifié quand vos pannes seront réparées
					</Text>
					<TouchableOpacity
						style={NotificationStyles.actionButton}
						onPress={onRefresh}
					>
						<Text style={NotificationStyles.actionButtonText}>
							Actualiser
						</Text>
					</TouchableOpacity>
				</View>
			)}

			<DeleteAllModal />
		</View>
	);
}
