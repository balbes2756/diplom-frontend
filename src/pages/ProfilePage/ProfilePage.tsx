import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";
import { useState, useEffect } from "react";
import styles from "./ProfilePage.module.css";
import PetProfileModal from "../../components/ProfilePetModal/PetProfileModal";
import type { PetProfile, PetProfileForm } from "../../schemas/petProfile";
import { usePetStore } from "../../store/usePetStore";
import { useToastStore } from "../../store/useToastStore";
import PetInfoModal from "../../components/PetInfoModal/PetInfoModal";

function ProfilePage() {
    const navigate = useNavigate();
    const { user, logout } = useAuthStore();
    const { addToast } = useToastStore();
    const [selectedPet, setSelectedPet] = useState<PetProfile | null>(null);

    const {
        addPetProfile,
        isProfilesLoading,
        profilesError,
        petProfiles,
        fetchMyPets,
        deletePetProfile,
        updatePetProfile,
    } = usePetStore();
    const [isPetModalOpen, setIsPetModalOpen] = useState(false);
    const [editingPet, setEditingPet] = useState<PetProfile | null>(null);

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    // const handleAddPet = async (formData: PetProfileForm) => {
    //     console.log("✅ Данные питомца:", formData);
    //     await addPetProfile(formData);
    // };

    const handleEditPet = (pet: PetProfile) => {
        setEditingPet(pet);
        setIsPetModalOpen(true);
    };

    const handleDeletePet = async (id: number) => {
        if (
            window.confirm(
                "Удалить карточку питомца? Это действие нельзя отменить.",
            )
        ) {
            try {
                await deletePetProfile(id);
                addToast({ message: "Питомец удалён", type: "success" });
            } catch (err) {
                console.error("❌ Ошибка удаления:", err);
                addToast({ message: "Ошибка удаления", type: "error" });
            }
        }
    };

    const handleModalSubmit = async (formData: PetProfileForm) => {
        if (editingPet) {
            // Режим редактирования
            await updatePetProfile(editingPet.id, formData);
        } else {
            // Режим добавления
            await addPetProfile(formData);
        }
        setEditingPet(null);
        setIsPetModalOpen(false);
    };

    useEffect(() => {
        fetchMyPets();
    }, [fetchMyPets]);

    if (!user) {
        return <div className={styles.container}>Загрузка профиля...</div>;
    }

    const avatarFallback = user?.name?.[0]?.toUpperCase() || "👤";

    const convertToFormFormat = (pet: PetProfile): Partial<PetProfileForm> => ({
        name: pet.name,
        type: pet.type,
        breed: pet.breed || "",
        birthDate: pet.birth_date || "",
        color: pet.color || "",
        avatar: pet.avatar || "",
        notes: pet.notes || "",
        isChipped: pet.is_chipped,
    });

    return (
        <div className={styles.container}>
            <section className={styles.gridSection}>
                <div className={styles.gridContainer}>
                    {/* 👤 КАРТОЧКА ПРОФИЛЯ (доработана) */}
                    <div className={`${styles.gridItem} ${styles.cardProfile}`}>
                        <div className={styles.profileHeader}>
                            <div className={styles.avatarWrapper}>
                                {user?.avatar ? (
                                    <img
                                        src={user.avatar}
                                        alt={user.name}
                                        className={styles.avatar}
                                    />
                                ) : (
                                    <div
                                        className={`${styles.avatar} ${styles.avatarFallback}`}>
                                        {avatarFallback}
                                    </div>
                                )}
                            </div>

                            <div className={styles.profileInfo}>
                                <h2 className={styles.userName}>
                                    {user?.name || "Пользователь"}
                                </h2>
                                <p className={styles.userEmail}>
                                    {user?.email}
                                </p>
                            </div>
                        </div>
                        <div className={styles.btnGroup}>
                            <button
                                onClick={() => navigate("/settings")}
                                className={styles.editProfileBtn}>
                                Редактировать профиль
                            </button>
                            <button
                                className={styles.logoutButton}
                                onClick={handleLogout}>
                                Выйти из аккаунта
                            </button>
                        </div>
                    </div>
                    <div
                        className={`${styles.gridItem} ${styles.cardMessages}`}>
                        СООБЩЕНИЯ
                    </div>
                    <div className={`${styles.gridItem} ${styles.cardPets}`}>
                        <div className={styles.petsHeader}>
                            <h3 className={styles.cardTitle}>МОИ ПИТОМЦЫ</h3>
                            <button
                                className={styles.addPetBtn}
                                onClick={() => setIsPetModalOpen(true)}
                                title="Добавить питомца">
                                <span className={styles.addIcon}>+</span>
                            </button>
                        </div>
                        <div className={styles.petsList}>
                            {isProfilesLoading && petProfiles.length === 0 ? (
                                <div className={styles.loading}>
                                    Загрузка...
                                </div>
                            ) : petProfiles.length === 0 ? (
                                <div className={styles.empty}>
                                    <span className={styles.emptyIcon}>🐾</span>
                                    <p>Нет питомцев</p>
                                </div>
                            ) : (
                                petProfiles.map((pet) => (
                                    <div
                                        key={pet.id}
                                        className={styles.petItem}
                                        onClick={() => setSelectedPet(pet)}>
                                        <div className={styles.wrapp}>
                                            <div className={styles.petAvatar}>
                                                {pet.avatar ? (
                                                    <img
                                                        src={pet.avatar}
                                                        alt={pet.name}
                                                    />
                                                ) : (
                                                    <span>
                                                        {pet.name[0]?.toUpperCase()}
                                                    </span>
                                                )}
                                            </div>
                                            <div className={styles.petInfo}>
                                                <span
                                                    className={styles.petName}>
                                                    {pet.name}
                                                </span>
                                                <span
                                                    className={styles.petBreed}>
                                                    {pet.type === "dog"
                                                        ? "🐕"
                                                        : pet.type === "cat"
                                                          ? "🐈"
                                                          : "🐾"}
                                                    {pet.breed || pet.type}
                                                </span>
                                            </div>
                                        </div>

                                        <div className={styles.petActions}>
                                            <button
                                                className={styles.actionBtn}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleEditPet(pet);
                                                }}
                                                title="Редактировать">
                                                ✏️
                                            </button>
                                            <button
                                                className={`${styles.actionBtn} ${styles.deleteBtn}`}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDeletePet(pet.id);
                                                }}
                                                title="Удалить">
                                                🗑️
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                    <div className={`${styles.gridItem} ${styles.cardOrders}`}>
                        ЗАКАЗЫ
                    </div>

                    <div
                        className={`${styles.gridItem} ${styles.cardFavorites}`}>
                        ИЗБРАННОЕ
                    </div>
                    <div
                        className={`${styles.gridItem} ${styles.cardSettings}`}>
                        НАСТРОЙКИ
                    </div>
                </div>
            </section>

            <PetProfileModal
                isOpen={isPetModalOpen}
                onClose={() => {
                    setIsPetModalOpen(false);
                    setEditingPet(null);
                }}
                onSubmit={handleModalSubmit}
                initialData={
                    editingPet ? convertToFormFormat(editingPet) : undefined
                }
                isSubmitting={isProfilesLoading} // ← передаём загрузку из стора
                error={profilesError} // ← передаём ошибку из стора
            />
            <PetInfoModal
                isOpen={!!selectedPet}
                onClose={() => setSelectedPet(null)}
                pet={selectedPet}
            />
        </div>
    );
}

export default ProfilePage;
