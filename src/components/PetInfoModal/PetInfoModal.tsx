import { useState, useEffect } from "react";
import type { PetProfile } from "../../schemas/petProfile";
import styles from "./PetInfoModal.module.css";

interface PetInfoModalProps {
    isOpen: boolean;
    onClose: () => void;
    pet: PetProfile | null;
}

function PetInfoModal({ isOpen, onClose, pet }: PetInfoModalProps) {
    const [isClosing, setIsClosing] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (isOpen && pet) {
            setIsVisible(true);
            setIsClosing(false);
            document.body.style.overflow = "hidden";
        } else {
            setIsClosing(true);
            setTimeout(() => {
                setIsVisible(false);
                setIsClosing(false);
                document.body.style.overflow = "";
            }, 300);
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen, pet]);

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            setIsVisible(false);
            setIsClosing(false);
            onClose();
        }, 300);
    };

    if (!isVisible || !pet) return null;

    // Форматирование дат
    const formatDate = (dateStr: string | null | undefined) => {
        if (!dateStr) return "Не указано";
        return new Date(dateStr).toLocaleDateString("ru-RU", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });
    };

    const getTypeLabel = (type: string) => {
        switch (type) {
            case "dog":
                return "🐕 Собака";
            case "cat":
                return "🐈 Кошка";
            default:
                return "🐾 Другое";
        }
    };

    return (
        <div
            className={`${styles.overlay} ${isClosing ? styles.overlayClosing : ""}`}>
            <div className={styles.backdrop} onClick={handleClose} />

            <div
                className={`${styles.modal} ${isClosing ? styles.modalClosing : ""}`}>
                <button className={styles.closeBtn} onClick={handleClose}>
                    ×
                </button>

                <div className={styles.header}>
                    <div className={styles.avatarWrapper}>
                        {pet.avatar ? (
                            <img
                                src={pet.avatar}
                                alt={pet.name}
                                className={styles.avatar}
                            />
                        ) : (
                            <div className={styles.avatarPlaceholder}>
                                {pet.name[0]?.toUpperCase()}
                            </div>
                        )}
                    </div>
                    <div className={styles.titleBlock}>
                        <h2 className={styles.name}>{pet.name}</h2>
                        <span className={styles.type}>
                            {getTypeLabel(pet.type)}
                        </span>
                    </div>
                </div>

                <div className={styles.content}>
                    {pet.breed && (
                        <div className={styles.field}>
                            <span className={styles.label}>Порода</span>
                            <span className={styles.value}>{pet.breed}</span>
                        </div>
                    )}
                    {pet.color && (
                        <div className={styles.field}>
                            <span className={styles.label}>
                                Окрас / Приметы
                            </span>
                            <span className={styles.value}>{pet.color}</span>
                        </div>
                    )}

                    <div className={styles.field}>
                        <span className={styles.label}>Дата рождения</span>
                        <span className={styles.value}>
                            {formatDate(pet.birth_date)}
                        </span>
                    </div>

                    <div className={styles.field}>
                        <span className={styles.label}>Чипирован</span>
                        <span className={styles.value}>
                            {pet.is_chipped ? "✅ Да" : "❌ Нет"}
                        </span>
                    </div>

                    {pet.chip_number && (
                        <div className={styles.field}>
                            <span className={styles.label}>Номер чипа</span>
                            <span className={`${styles.value} ${styles.mono}`}>
                                {pet.chip_number}
                            </span>
                        </div>
                    )}

                    {pet.notes && (
                        <div className={styles.field}>
                            <span className={styles.label}>Заметки</span>
                            <p className={styles.notes}>{pet.notes}</p>
                        </div>
                    )}

                    <div className={styles.meta}>
                        <span>Добавлен: {formatDate(pet.created_at)}</span>
                        <span>Обновлён: {formatDate(pet.updated_at)}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PetInfoModal;
