import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
    en: {
        translation: {
            welcome: "Hi {{name}}, Welcome Back",
            profile: "Your Profile",
            uploadPhoto: "Upload Photo",
            fullName: "Full Name",
            email: "Email",
            phone: "Phone Number",
            language: "Language Preference",
            updates: "Get instant updates on the latest offers, deals, and exclusive offers.",
            save: "Save Changes",
            saving: "Saving...",


            home: "Home",
            fundraisingProducts: "Fundraising Products",
            about: "About",
            ourTeam: "Our Team",
            contact: "Contact",
            news: "News",
            blog: "Blog",

            banner: {
                title: "Your Game. Your Half. Your Win.",
                tagLine: "COULD YOU BE OUR NEXT WINNER?"
            }



        },
    },
    es: {
        translation: {
            welcome: "Hola {{name}}, Bienvenido de nuevo",
            profile: "Tu Perfil",
            uploadPhoto: "Subir Foto",
            fullName: "Nombre Completo",
            email: "Correo electrónico",
            phone: "Número de Teléfono",
            language: "Preferencia de Idioma",
            updates: "Recibe actualizaciones instantáneas sobre las últimas ofertas, promociones y ofertas exclusivas.",
            save: "Guardar Cambios",
            saving: "Guardando...",

            home: "Inicio",
            fundraisingProducts: "Productos para Recaudación de Fondos",
            about: "Acerca de",
            ourTeam: "Nuestro Equipo",
            contact: "Contacto",
            news: "Noticias",
            blog: "Blog",

            banner: {
                title: "Tu juego. Tu mitad. Tu victoria.",
                tagLine: "¿Podrías ser nuestro próximo ganador?",
            }

        },
    },
};

i18n.use(initReactI18next).init({
    resources,
    lng: "en", // default language
    interpolation: {
        escapeValue: false,
    },
});

export default i18n;
