import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import styles from "./Layout.module.css";
// import Paws from "../../assets/images/footerPaws.png";
import RegisterModal from "../RegisterModal/RegisterModal";
import { useModalStore } from "../../store/useModalStore";
import LoginModal from "../LoginModal/LoginModal";
import { useAuthStore } from "../../store/useAuthStore";
import { useEffect, useState } from "react";

function Layout() {
    const location = useLocation();
    const navigate = useNavigate();

    // Модалки
    const { openLogin } = useModalStore();

    // Аутентификация
    const { isAuthenticated, user } = useAuthStore();

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleProfileClick = (e: React.MouseEvent) => {
        e.preventDefault();

        if (!isAuthenticated) {
            openLogin("/profile");
        } else {
            navigate("/profile");
        }
    };

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location.pathname]);

    return (
        <div className={styles.layout}>
            {/* Хедер */}
            <header className={styles.header}>
                <div className={styles.headerContent}>
                    <Link to="/" className={styles.home}>
                        <div className={styles.logo}>Хвост на время</div>
                    </Link>

                    <button
                        className={`${styles.burgerButton} ${isMenuOpen ? styles.active : ""}`}
                        onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>

                    <nav className={styles.nav}>
                        <Link
                            to="/map"
                            className={`${styles.navIcon} ${location.pathname === "/map" ? styles.active : ""}`}>
                            <svg
                                width="30"
                                height="30"
                                viewBox="0 0 30 30"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M13.7812 0H16.1908L16.216 0.0087421C16.4959 0.102967 17.0352 0.115332 17.3485 0.171107C17.9981 0.286755 18.6393 0.428522 19.2714 0.616831C23.1992 1.79147 26.479 4.5155 28.3547 8.16091C29.0068 9.43673 29.4735 10.799 29.741 12.2066C29.8008 12.5365 29.9273 13.6806 30 13.8912V16.1529L29.9915 16.1771C29.9036 16.4408 29.8354 17.2686 29.7791 17.5838C29.6728 18.1804 29.5494 18.7035 29.376 19.2862C28.1953 23.2098 25.4711 26.4853 21.8285 28.3614C20.6224 28.9848 19.3071 29.4366 17.9788 29.7205C17.6471 29.7917 16.4427 29.9136 16.2484 30H13.7891C13.6732 29.9487 12.3059 29.7639 12.0321 29.7111C11.1602 29.5368 10.306 29.2833 9.48 28.9542C5.29433 27.2914 2.07273 23.8423 0.698897 19.5531C0.510501 18.9599 0.38482 18.4075 0.254299 17.8024C0.177866 17.4481 0.131061 16.527 0 16.2497V13.7495C0.0725977 13.5942 0.218884 12.3866 0.284527 12.0657C0.541239 10.7679 0.969841 9.51023 1.559 8.32576C3.4072 4.5997 6.71959 1.8083 10.705 0.618319C11.3321 0.434792 11.9698 0.289325 12.6144 0.182711C12.9122 0.134474 13.5184 0.0962962 13.7812 0ZM15.112 23.778C15.7844 23.7071 16.3678 23.4643 16.7764 22.9108C17.1008 22.4713 17.4813 21.8616 17.778 21.3767C19.1792 19.0872 20.6891 16.6091 21.4226 14.0125C21.6 13.3842 21.6278 12.7251 21.5569 12.0851C21.3631 10.331 20.4737 8.72807 19.0881 7.63526C17.8989 6.69357 16.4192 6.19485 14.9027 6.22453C13.0604 6.2913 11.4078 6.98068 10.1426 8.34064C9.01834 9.54914 8.34501 11.2534 8.40519 12.9107C8.49319 15.3351 10.9972 19.4687 12.3507 21.5821C12.6901 22.1121 13.0134 22.7711 13.4762 23.1995C13.9287 23.6184 14.505 23.7842 15.112 23.778Z"
                                    fill="#f3f5ff"
                                />
                                <path
                                    d="M14.6104 10.0039C16.1608 9.7904 17.5912 10.8727 17.8073 12.4227C18.0234 13.9727 16.9435 15.4049 15.3939 15.6236C13.8406 15.8427 12.4043 14.7598 12.1877 13.2061C11.9711 11.6525 13.0564 10.218 14.6104 10.0039Z"
                                    fill="#f3f5ff"
                                />
                            </svg>
                        </Link>

                        <Link
                            to="/services"
                            className={`${styles.navIcon} ${location.pathname === "/services" ? styles.active : ""}`}>
                            <svg
                                width="30"
                                height="30"
                                viewBox="0 0 30 30"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M5.77088 0.00971866C6.2277 -0.00891752 6.75378 0.00497671 7.21474 0.00499866L9.89962 0.00504288L17.9816 0.00517484L22.3404 0.0047354L23.5958 0.00445003C24.0021 0.00438418 24.4002 -0.00349586 24.8032 0.0694904C25.6374 0.215419 26.4229 0.631473 27.0758 1.2732C28.0827 2.25978 28.6666 3.64632 28.7823 5.19119C28.8687 6.34819 28.9494 7.5062 29.0335 8.66345L29.5954 16.4498L29.852 20.0091C29.9347 21.1365 30.0748 22.3662 29.9511 23.4813C29.7978 24.8598 29.3274 26.1595 28.5929 27.2336C27.4655 28.8908 25.9694 29.7594 24.215 29.9706C24.1731 29.9752 24.1309 29.9787 24.0888 29.9809C23.6223 30.0048 23.0925 29.9912 22.6231 29.991L20.1465 29.9901H12.5133H8.17168C7.22204 29.9901 5.95752 30.0558 5.05923 29.8485C3.93228 29.588 2.88677 28.9589 2.03736 28.0304C0.80209 26.6811 0.0693863 24.7911 0.00402237 22.7852C-0.0137826 22.211 0.0308937 21.7235 0.0718853 21.1545L0.198472 19.4011L0.634292 13.3608L1.05017 7.60064L1.16768 5.96261C1.20712 5.40154 1.24056 4.82457 1.34925 4.27613C1.53875 3.35666 1.91711 2.50916 2.44958 1.81137C3.33391 0.669448 4.47765 0.0648589 5.77088 0.00971866ZM21.8677 7.76667C21.9597 7.42837 22.0532 7.09074 22.1485 6.75382C22.3187 6.14816 22.5252 5.62404 22.2656 4.99181C21.9666 4.2636 21.2334 4.0496 20.6493 4.41297C20.1967 4.69453 20.0907 5.28889 19.9418 5.83364L19.5485 7.25963C19.4316 7.68383 19.3181 8.12056 19.1618 8.52542C18.6484 9.83799 17.7302 10.8584 16.6023 11.3703C15.7064 11.7788 14.7255 11.8324 13.8026 11.5232C12.6253 11.1359 11.6233 10.2034 11.0157 8.92967C10.6068 8.07073 10.3726 6.88149 10.0931 5.93866C9.83103 5.05455 9.72179 4.25174 8.75352 4.24606C8.40083 4.27058 8.14883 4.36448 7.90476 4.69381C7.7048 4.96694 7.60063 5.3227 7.61415 5.68631C7.62807 6.01156 7.90174 6.91999 8.00775 7.2885C8.18256 7.89609 8.36254 8.6409 8.55504 9.22701C8.95984 10.4667 9.60542 11.5718 10.4378 12.4499C11.8335 13.9229 13.6622 14.6604 15.5137 14.4966C17.3296 14.3313 19.0189 13.3137 20.2169 11.6634C20.7631 10.9119 21.1931 10.0486 21.4859 9.11445C21.6253 8.67357 21.7365 8.21058 21.8677 7.76667Z"
                                    fill="#f3f5ff"
                                />
                            </svg>
                        </Link>

                        <Link
                            to="/community"
                            className={`${styles.navIcon} ${location.pathname === "/community" ? styles.active : ""}`}>
                            <svg
                                width="30"
                                height="30"
                                viewBox="0 0 30 30"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M0 15C0 6.71573 6.71573 0 15 0V0C23.2843 0 30 6.71573 30 15V15C30 23.2843 23.2843 30 15 30H1.875C0.839466 30 0 29.1605 0 28.125V15Z"
                                    fill="#E3E9FF"
                                />
                            </svg>
                        </Link>

                        {isAuthenticated ? (
                            <>
                                <Link
                                    to="/profile"
                                    className={`${styles.navIcon} ${styles.avatarIcon} ${location.pathname === "/profile" ? styles.active : ""}`}
                                    onClick={handleProfileClick}
                                    title={user?.name || "Личный кабинет"}>
                                    {user?.avatar ? (
                                        <img
                                            src={user.avatar}
                                            alt={user.name}
                                            className={styles.userAvatar}
                                        />
                                    ) : (
                                        <span
                                            className={
                                                styles.avatarPlaceholder
                                            }>
                                            {user?.name
                                                ?.charAt(0)
                                                .toUpperCase() || "👤"}
                                        </span>
                                    )}
                                </Link>
                            </>
                        ) : (
                            <Link
                                to="/profile"
                                className={`${styles.navIcon} ${location.pathname === "/profile" ? styles.active : ""}`}
                                onClick={handleProfileClick}
                                title="Войти">
                                <svg
                                    width="26"
                                    height="30"
                                    viewBox="0 0 26 30"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M4.89079 30C4.74182 29.9432 4.52577 29.9383 4.36303 29.9149C2.7563 29.6826 1.29694 28.7703 0.562513 27.342C0.328186 26.8852 0.167342 26.3966 0.0855194 25.8933C-0.0114926 25.2993 -0.00612 24.8001 0.00747141 24.2013C0.0277292 22.9986 0.169579 21.8005 0.430982 20.6243C0.901187 18.473 1.98081 16.08 4.15301 15.0737C4.46368 14.93 4.78608 14.811 5.11699 14.718C5.61519 14.5788 6.78161 14.3804 7.26348 14.5706C8.02691 14.8922 8.70569 15.4099 9.4217 15.8212C9.83467 16.0584 10.1715 16.17 10.6036 16.3383C12.4107 17.0416 14.3202 16.8681 16.0622 16.0793C16.6093 15.8315 17.1018 15.4897 17.6123 15.1789C17.9572 14.9751 18.5136 14.5782 18.9074 14.5218C19.6323 14.4181 20.6091 14.618 21.285 14.8465C22.9888 15.4226 24.103 16.7649 24.8168 18.3081C24.8951 18.4737 24.9661 18.6576 25.033 18.8304C25.7023 20.5644 25.9637 22.5173 25.9958 24.3604C26.0023 24.7339 26.0063 25.118 25.9682 25.4867C25.925 25.9525 25.8197 26.411 25.655 26.851C25.2115 28.0116 24.3079 28.9556 23.1425 29.476C22.753 29.6506 22.3894 29.7658 21.9727 29.8616C21.8147 29.898 21.2318 29.9496 21.1324 30H4.89079Z"
                                        fill="#f3f5ff"
                                    />
                                    <path
                                        d="M12.2262 0H13.3731C13.4511 0.0204142 13.5593 0.0352 13.6404 0.0425067C16.617 0.310443 19.259 2.50333 20.0448 5.27969C20.5478 7.05679 20.3373 9.166 19.3416 10.7924C18.3389 12.4303 16.6797 13.7427 14.7423 14.221C12.8826 14.6828 10.748 14.4608 9.08101 13.5131C7.37402 12.5427 6.01684 10.9416 5.53444 9.06948C5.05975 7.25098 5.2959 5.211 6.30008 3.59717C7.41477 1.78961 9.31689 0.43502 11.4931 0.104091C11.7155 0.0702641 12.0153 0.0547063 12.2262 0Z"
                                        fill="#f3f5ff"
                                    />
                                </svg>
                            </Link>
                        )}
                    </nav>
                </div>
            </header>

            {isMenuOpen && (
                <>
                    <div
                        className={styles.menuOverlay}
                        onClick={() => setIsMenuOpen(false)}
                    />
                    <div className={styles.mobileMenu}>
                        <Link
                            to="/map"
                            className={`${styles.mobileMenuLink} ${location.pathname === "/map" ? styles.active : ""}`}
                            onClick={() => setIsMenuOpen(false)}>
                            <svg
                                width="24"
                                height="24"
                                viewBox="0 0 30 30"
                                fill="none">
                                {/* ... иконка карты ... */}
                            </svg>
                            Карта
                        </Link>

                        <Link
                            to="/services"
                            className={`${styles.mobileMenuLink} ${location.pathname === "/services" ? styles.active : ""}`}
                            onClick={() => setIsMenuOpen(false)}>
                            <svg
                                width="24"
                                height="24"
                                viewBox="0 0 30 30"
                                fill="none">
                                {/* ... иконка услуг ... */}
                            </svg>
                            Услуги
                        </Link>

                        <Link
                            to="/community"
                            className={`${styles.mobileMenuLink} ${location.pathname === "/community" ? styles.active : ""}`}
                            onClick={() => setIsMenuOpen(false)}>
                            <svg
                                width="24"
                                height="24"
                                viewBox="0 0 30 30"
                                fill="none">
                                {/* ... иконка сообщества ... */}
                            </svg>
                            Сообщество
                        </Link>

                        {isAuthenticated ? (
                            <Link
                                to="/profile"
                                className={`${styles.mobileMenuLink} ${location.pathname === "/profile" ? styles.active : ""}`}
                                onClick={() => setIsMenuOpen(false)}>
                                <div className={styles.mobileMenuAvatar}>
                                    {user?.avatar ? (
                                        <img
                                            src={user.avatar}
                                            alt={user.name}
                                            className={styles.userAvatar}
                                        />
                                    ) : (
                                        <span
                                            className={
                                                styles.avatarPlaceholder
                                            }>
                                            {user?.name
                                                ?.charAt(0)
                                                .toUpperCase() || "👤"}
                                        </span>
                                    )}
                                    <span>{user?.name || "Профиль"}</span>
                                </div>
                            </Link>
                        ) : (
                            <Link
                                to="/profile"
                                className={styles.mobileMenuLink}
                                onClick={() => {
                                    setIsMenuOpen(false);
                                    openLogin("/profile");
                                }}>
                                <svg
                                    width="24"
                                    height="24"
                                    viewBox="0 0 26 30"
                                    fill="none">
                                    {/* ... иконка входа ... */}
                                </svg>
                                Войти
                            </Link>
                        )}
                    </div>
                </>
            )}

            <RegisterModal />
            <LoginModal />

            {/* Основной контент */}
            <main className={styles.main}>
                <Outlet />
            </main>

            {/* Footer */}
            <footer className={styles.footer}>
                <div className={styles.footerContainer}>
                    <div className={styles.footerContent}>
                        {/* Left side - Form */}
                        <div className={styles.footerLeft}>
                            <h3 className={styles.footerTitle}>
                                Свяжитесь с нами
                            </h3>
                            {/* <form className={styles.contactForm}>
                                <input
                                    type="text"
                                    placeholder="Имя"
                                    className={styles.formInput}
                                />
                                <input
                                    type="tel"
                                    placeholder="Телефон"
                                    className={styles.formInput}
                                />
                                <button
                                    type="submit"
                                    className={styles.submitButton}>
                                    Отправить
                                </button>
                            </form>

                            <div className={styles.footerInfo}>
                                <div className={styles.infoItem}>
                                    <span className={styles.infoIcon}>📍</span>
                                    <div>
                                        <div className={styles.infoLabel}>
                                            Адрес
                                        </div>
                                        <div className={styles.infoText}>
                                            Красноярский край, г. Норильск.
                                        </div>
                                    </div>
                                </div>
                                <div className={styles.infoItem}>
                                    <span className={styles.infoIcon}>🕐</span>
                                    <div>
                                        <div className={styles.infoLabel}>
                                            Часы работы
                                        </div>
                                        <div className={styles.infoText}>
                                            24 ч, без выходных
                                        </div>
                                    </div>
                                </div>
                            </div> */}

                            <p className={styles.footerContactText}>
                                По всем интересующим вопросам, вы можете
                                обратиться к нам на электронную почту
                            </p>
                            <div className={styles.footerContacts}>
                                {/* <a
                                    href="tel:+78005553535"
                                    className={styles.contactLink}>
                                    <span className={styles.contactIcon}>
                                        <svg
                                            width="23"
                                            height="23"
                                            viewBox="0 0 23 23"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M1.75775 2.48502L3.94997 0.2928C4.34049 -0.0977241 4.97366 -0.0977235 5.36418 0.292801L9.21312 4.14174C9.60365 4.53227 9.60365 5.16543 9.21312 5.55596L6.63139 8.13769C6.23812 8.53096 6.14063 9.13175 6.38935 9.6292C7.82719 12.5049 10.1589 14.8366 13.0346 16.2745C13.5321 16.5232 14.1329 16.4257 14.5261 16.0324L17.1079 13.4507C17.4984 13.0602 18.1315 13.0602 18.5221 13.4507L22.371 17.2996C22.7615 17.6902 22.7615 18.3233 22.371 18.7139L20.1788 20.9061C18.0674 23.0174 14.7249 23.255 12.3362 21.4634L8.60143 18.6624C6.8579 17.3547 5.30908 15.8059 4.00143 14.0624L1.20039 10.3277C-0.591153 7.93894 -0.353604 4.59637 1.75775 2.48502Z"
                                                fill="#5C5C5C"
                                            />
                                        </svg>
                                    </span>
                                    +7 (800) 555 35-35
                                </a> */}
                                <a
                                    href="mailto:123@mail.ru"
                                    className={styles.contactLink}>
                                    <span className={styles.contactIcon}>
                                        <svg
                                            width="37"
                                            height="30"
                                            viewBox="0 0 25 20"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M22.5 0H2.5C1.125 0 0 1.125 0 2.5V17.5C0 18.875 1.125 20 2.5 20H22.5C23.875 20 25 18.875 25 17.5V2.5C25 1.125 23.875 0 22.5 0ZM22.5 17.5H2.5V5L12.5 11.25L22.5 5V17.5ZM12.5 8.75L2.5 2.5H22.5L12.5 8.75Z"
                                                fill="#5C5C5C"
                                            />
                                        </svg>
                                    </span>
                                    hvostnavremya@mail.ru
                                </a>
                            </div>

                            <p className={styles.footerNote}>
                                Услуги предоставляются только на территории НПР
                                <br />© 2026 «Хвост на время». Все права
                                защищены.
                                <br />
                                Сайт разработан студентами группы ИЭ-22:
                                <br />
                                Бердников Константин, Крылова Александра
                            </p>
                        </div>

                        {/* Right side - Contacts */}
                        <div className={styles.footerRight}>
                            <div className={styles.heartDecoration}>
                                <svg
                                    width="748"
                                    height="506"
                                    viewBox="0 0 374 253"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M70.3778 0.201145C54.6347 -1.13136 37.7553 4.24697 25.1557 13.6517C11.8542 23.6279 3.06144 38.4723 0.711853 54.9219C-2.96874 80.8187 7.87829 103.221 27.3491 119.903C36.435 127.686 47.2821 134.17 57.3909 140.618C66.6651 146.445 75.6826 152.669 84.4176 159.275C101.344 172.105 117.949 187.085 132.323 202.753C137.384 208.27 142.218 214.614 146.699 220.584C143.508 224.457 140.059 229.339 137.677 233.738C133.966 240.593 134.784 250.633 143.714 252.667C147.116 253.448 150.69 252.843 153.645 250.985C157.704 248.377 159.607 243.448 159.228 238.795C158.783 233.334 154.845 226.919 151.884 222.448C183.038 175.48 244.175 157.618 297.889 167.077C313.806 169.964 329.209 175.184 343.599 182.567C348.497 185.065 353.274 187.791 357.916 190.736C362.839 193.882 367.459 197.258 372.112 200.772C372.557 201.107 373.13 201.312 373.686 201.366L373.999 201.088C374.164 198.465 357.028 185.102 354.476 183.242C323.181 160.433 283.869 152.896 245.975 159.271C213.744 164.694 185.052 180.29 161.997 203.262C157.781 207.436 151.971 213.344 148.55 218.143C145.075 212.538 136.312 202.34 131.976 197.456C112.634 176.049 91.8579 155.98 69.7936 137.386C60.2776 129.225 50.188 121.777 40.7833 113.501C28.8898 103.036 20.0649 91.8135 14.4863 76.8905C12.1602 70.6709 10.857 66.2328 10.5253 59.581C9.89834 46.2929 14.559 33.2964 23.4887 23.4276C32.3393 13.8639 44.5965 8.15428 57.622 7.528C80.5743 6.45627 103.612 20.379 118.76 36.6772C127.003 45.6081 133.939 55.6598 139.359 66.5329C141.366 70.4631 143.226 74.4679 144.933 78.5383C145.986 81.0714 147.52 85.8619 149.322 88.0071C149.737 88.5013 150.29 88.4816 150.893 88.407C155.851 85.0963 149.716 64.3488 148.068 59.3191C152.457 42.336 163.953 30.3266 178.547 21.0232C192.36 12.2168 211.028 10.0445 226.891 13.856C239.166 16.9045 249.713 24.724 256.189 35.5771C264.759 49.6199 265.561 66.6725 261.829 82.4075C255.353 109.707 229.847 126.399 205.68 137.22C202.033 138.84 198.345 140.367 194.619 141.798C192.237 142.718 187.797 144.288 185.779 145.537L185.518 145.701C187.951 145.312 191.73 143.734 194.178 142.895C225.705 132.077 259.645 115.751 270.185 81.3345C275.198 64.9657 275.367 48.0606 267.293 32.5371C260.361 19.0026 248.254 8.83592 233.715 4.34101C216.693 -1.01765 195.173 0.93644 179.338 9.17557C164.672 16.8081 148.601 32.8249 143.575 48.8681C139.881 42.0457 136.716 37.1746 131.608 31.2341C116.208 13.0852 94.1348 1.89895 70.3778 0.201145Z"
                                        fill="#E5E7FF"
                                    />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default Layout;
