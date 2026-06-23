import { useState } from "react";
import LostPetCard from "../LostPetCard/LostPetCard";
import styles from "./MatchModal.module.css";

interface MatchedPetsModalProps {
    isOpen: boolean;
    onClose: () => void;
    matchedPets: any[];
}

function MatchedPetsModal({
    isOpen,
    onClose,
    matchedPets,
}: MatchedPetsModalProps) {
    const [isClosing, setIsClosing] = useState(false);

    // Если модалка не открыта и не закрывается — ничего не рендерим
    if (!isOpen && !isClosing) return null;

    const handleClose = () => {
        setIsClosing(true);
        // Ждём завершения анимации (400ms)
        setTimeout(() => {
            setIsClosing(false);
            onClose();
        }, 400);
    };

    return (
        <div
            className={`${styles.overlay} ${isClosing ? styles.overlayClosing : ""}`}
            onClick={handleClose}>
            <div
                className={`${styles.modal} ${isClosing ? styles.modalClosing : ""}`}
                onClick={(e) => e.stopPropagation()}>
                <button className={styles.closeButton} onClick={handleClose}>
                    ×
                </button>

                <div className={styles.header}>
                    <h2 className={styles.title}> Возможные совпадения</h2>
                    <p className={styles.subtitle}>
                        Наш ИИ-агент проанализировал объявление, и нашёл
                        совпадение среди потерявшихся животных.
                        <br />
                        Возможно, это один из них!
                    </p>
                </div>

                <div className={styles.content}>
                    {matchedPets.length > 0 ? (
                        <div className={styles.cards}>
                            {matchedPets.map((pet) => (
                                <div
                                    key={pet.id}
                                    className={styles.cardWrapper}>
                                    <LostPetCard pet={pet} />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className={styles.empty}>
                            <p>Похожих объявлений не найдено</p>
                        </div>
                    )}
                </div>

                <div className={styles.footer}>
                    <p className={styles.footerHint}>
                        В случае совпадения, свяжитесь с владельцем
                    </p>
                    <button className={styles.closeBtn} onClick={handleClose}>
                        Уведомить
                    </button>
                </div>
            </div>
        </div>
    );
}

export default MatchedPetsModal;
