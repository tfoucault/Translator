/**
 * Created by tfoucault on 27/09/14.
 */

//Namespace de l'application
TRANSLATOR_NS = {};

//Declaration d'un scope local
(function () {

    //Tableau qui indexe les differentes traductions disponibles dans le dossier _locales
    TRANSLATOR_NS.I18N = {
        EN: {
            ERROR: ERRORS_EN,
            FIELD: FIELDS_EN
        },
        FR: {
            ERROR: ERRORS_FR,
            FIELD: FIELDS_FR
        }
    };

    /**
     * Enumeration pour les differentes actions possibles de recevoir du content script
     * Documentation extensions chrome (https://developer.chrome.com/extensions/messaging
     */
    TRANSLATOR_NS.ACTION = {
        GET_TRANSLATION_FILES: 0
    };

    //Routeur des requetes recues depuis le content script
    chrome.runtime.onMessage.addListener(
        function (request, sender, sendResponse) {

            //Parametre de retour
            var response = {};

            switch (request.action){
                case TRANSLATOR_NS.ACTION.GET_TRANSLATION_FILES :
                    response = getTranslationFiles(request.params[0]);
                break;

                default:
                    response = {};
            }

            sendResponse(response);
        });


    /**
     *
     * @param iso code iso du langage dont on veut recuperer les fichier de trad
     * @returns {Object} Liste des variables de traduction de l'application
     */
    var getTranslationFiles = function(iso){

        return TRANSLATOR_NS.I18N[iso.toUpperCase()];
    };

})()

