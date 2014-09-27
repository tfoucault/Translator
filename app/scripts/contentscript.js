/**
 * Created by tfoucault on 27/09/14.
 */

//Namespace de l'application
TRANSLATOR_NS = {};

//Declaration d'un scope local
(function () {

    //Variable pour la configuration de l'API Microsoft Translator
    var TRANSLATOR_API = {
        ACCOUNT_KEY: 't1TEjjPDtmzfJsY4hwndo/1wIUfrazV4900sR5MMmH4',
        BASE_URL: 'https://api.datamarket.azure.com/Bing/MicrosoftTranslator/v1',
        TRANSLATE: {
            VERB: 'Translate',
            PARAMS: {
                Text: '',
                From: '',
                To: ''
            },
            PARAM: {
                TEXT: function (text) {
                    TRANSLATOR_API.TRANSLATE.PARAMS.Text = '';
                    TRANSLATOR_API.TRANSLATE.PARAMS.Text = text;
                },
                FROM: function (from) {
                    TRANSLATOR_API.TRANSLATE.PARAMS.From = '';
                    TRANSLATOR_API.TRANSLATE.PARAMS.From = from;
                },
                TO: function (to) {
                    TRANSLATOR_API.TRANSLATE.PARAMS.To = '';
                    TRANSLATOR_API.TRANSLATE.PARAMS.To = to;
                }
            }
        },
        LANGUAGES: {
            VERB: 'GetLanguagesForTranslation',
            PARAMS: []
        },
        DETECT: {
            VERB: 'Detect',
            PARAMS: {
                Text: ''
            },
            PARAM: {
                TEXT: function (text) {
                    TRANSLATOR_API.DETECT.PARAMS.Text = '';
                    TRANSLATOR_API.DETECT.PARAMS.Text = text;
                }
            }
        }
    };

    //Creation d'une classe pour gerer les exceptions
    var Exception = function (message) {
        this.name = 'Translator.error';
        this.message = message;
    };
    Exception.prototype = new Error();
    Exception.prototype.constructor = Exception;

    //Variable pour la configuration des preferences utilisateur
    TRANSLATOR_NS.USER_SETTINGS = {
        LANGUAGE: 'EN'
    };

    //Creation d'une enumeration pour les codes erreurs
    TRANSLATOR_NS.ERROR = {
        NO_CONTENT_TO_TRANSLATE: '',
        SOURCE_LANGUAGE_UNDEFINED: '',
        TARGET_LANGUAGE_UNDEFINED: '',
        LANGUAGE_ISO_UNDEFINED: '',
        API_BASE_URL_UNDEFINED: '',
        API_VERB_UNDEFINED: '',
        API_PARAMS_UNDEFINED: '',
        API_KEY_UNDEFINED: '',
        USER_LANGUAGE_UNDEFINED: '',
        NO_CONTENT_TO_DETECT: ''
    };

    //Creation d'une enumeration pour les codes erreurs
    TRANSLATOR_NS.FIELD = {
        TRANSLATION_OF: ''
    };

    //Enumeration pour les differente actions possibles
    TRANSLATOR_NS.ACTION = {
        GET_TRANSLATION_FILES: 0
    };

    //Creation d'un sous namespace pour les fonctions utils
    TRANSLATOR_NS.utils = TRANSLATOR_NS.utils || {};

    /**
     *
     * @param iso code iso du langage a parametrer
     */
    TRANSLATOR_NS.utils.setLanguage = function (iso) {

        //Pre conditions
        if (typeof (iso) === 'undefined' || iso === null || iso.length === 0) {

            throw new Exception(TRANSLATOR_NS.ERROR.LANGUAGE_ISO_UNDEFINED);
        }

        //Traitement - Mise a jour du langage de l'utilisateur pour la traduction
        TRANSLATOR_NS.USER_SETTINGS.LANGUAGE = iso;

        //Envoi d'un message a notre extension pour recuperer les fichiers i18n
        chrome.runtime.sendMessage({
            action: TRANSLATOR_NS.ACTION.GET_TRANSLATION_FILES,
            params: [iso]
        }, function (response) {

            if(typeof(response) === 'undefined' || response === null){

                throw new Exception("Sorry, this plugin is not translated for your language." +
                    "English is set as default language for fields and error message.");
            }

            //Mapping du fichier de traduction d'erreurs avec TRANSLATOR_NS.ERROR
            for(var key in TRANSLATOR_NS.ERROR) {
                TRANSLATOR_NS.ERROR[key] = response.ERROR[key] || '';
            }

            //Mapping du fichier de traduction des libelles avec TRANSLATOR_NS.FIELD
            for(var key in TRANSLATOR_NS.FIELD) {
                TRANSLATOR_NS.FIELD[key] = response.FIELD[key] || '';
            }
        });
    };

    /**
     *
     * @returns {string} le code ISO correspondant au language de l'utilisateur
     */
    TRANSLATOR_NS.utils.getUserLanguage = function () {

        //On determine le language utilisateur (IE) ou du navigateur (Chrome, Firefox)
        var language = window.navigator.userLanguage || window.navigator.language;

        if (typeof(language) === 'undefined' || language === null || language.length === 0) {

            throw new Exception(TRANSLATOR_NS.ERROR.USER_LANGUAGE_UNDEFINED);
        }

        //Traitement (on ne retourne que les deux premiers caracteres == code ISO)

        return language.substr(0,2);
    };

    /**
     *
     * @param text contenu a traduire
     * @param from code iso du language d'origine du contenu (ex: fr)
     * @param to code iso du language dans lequel traduire le contenu
     * @param successFn fonction de callback appelee en cas de succes
     * @param errorFn fonction de callback appelee en cas d'erreur
     */
    TRANSLATOR_NS.utils.translate = function (text, from, to, successFn, errorFn) {

        //Pre conditions
        if (typeof(text) === 'undefined' || text === null || text.length === 0) {

            throw new Exception(TRANSLATOR_NS.ERROR.NO_CONTENT_TO_TRANSLATE);
        }

        if (typeof(from) === 'undefined' || from === null || from.length === 0) {

            throw new Exception(TRANSLATOR_NS.ERROR.SOURCE_LANGUAGE_UNDEFINED);
        }

        if (typeof(to) === 'undefined' || to === null || to.length === 0) {

            throw new Exception(TRANSLATOR_NS.ERROR.TARGET_LANGUAGE_UNDEFINED);
        }

        //Traitement - Mapping des parametres
        TRANSLATOR_API.TRANSLATE.PARAM.TEXT(text);
        TRANSLATOR_API.TRANSLATE.PARAM.FROM(from);
        TRANSLATOR_API.TRANSLATE.PARAM.TO(to);

        //Envoi de la requete pour recuperer la traduction
        TRANSLATOR_NS.utils.sendRequest(
            TRANSLATOR_API.BASE_URL,
            TRANSLATOR_API.TRANSLATE.VERB,
            TRANSLATOR_API.TRANSLATE.PARAMS,
            TRANSLATOR_API.ACCOUNT_KEY,
            successFn, errorFn
        );
    };

    /**
     *
     * @param text texte dont on veut detecter la langue
     * @param successFn fonction de callback appelee en cas de succes
     * @param errorFn fonction de callback appelee en cas d'erreur
     */
    TRANSLATOR_NS.utils.getTextLanguage = function(text, successFn, errorFn){

        //Pre conditions
        if (typeof(text) === 'undefined' || text === null || text.length === 0) {

            throw new Exception(TRANSLATOR_NS.ERROR.NO_CONTENT_TO_DETECT);
        }

        //Mapping des parametres d'entree de l'API
        TRANSLATOR_API.DETECT.PARAM.TEXT(text);

        //Envoi d'une requete sur l'API DETECT
        TRANSLATOR_NS.utils.sendRequest(
            TRANSLATOR_API.BASE_URL,
            TRANSLATOR_API.DETECT.VERB,
            TRANSLATOR_API.DETECT.PARAMS,
            TRANSLATOR_API.ACCOUNT_KEY,
            successFn,errorFn
        );
    };

    /**
     *
     * @param baseUrl Url de base de l'api ou envoyer une requete
     * @param verb methode de l'api qui sera utilisee
     * @param params objet de type {param1: valeur1,param2: valeur2, ...}
     * @param key cle prive d'authentication pour utiliser l'API
     * @param successFn fonction de callback appelee en cas de succes
     * @param errorFn fonction de callback appelee en cas d'erreur
     */
    TRANSLATOR_NS.utils.sendRequest = function (baseUrl, verb, params, key, successFn, errorFn) {

        //Pre conditions
        if (typeof(baseUrl) === 'undefined' || baseUrl === null || baseUrl.length === 0) {

            throw new Exception(TRANSLATOR_NS.ERROR.API_BASE_URL_UNDEFINED);
        }

        if (typeof(verb) === 'undefined' || verb === null || verb.length === 0) {

            throw new Exception(TRANSLATOR_NS.ERROR.API_VERB_UNDEFINED);
        }

        if (typeof(params) === 'undefined' || params === null || params.length === 0) {

            throw new Exception(TRANSLATOR_NS.ERROR.API_PARAMS_UNDEFINED);
        }

        if (typeof(key) === 'undefined' || key === null || key.length === 0) {

            throw new Exception(TRANSLATOR_NS.ERROR.API_KEY_UNDEFINED);
        }

        //Traitement - Creation de la premiere partie de la requete
        var requestStr = baseUrl + "/" + verb + "?";

        //Ajout de tous les parametres de la requete
        for (var param in params) {
            requestStr += param + "='" + params[param] + "'";

            //On ajoute & pour separer les parametres
            requestStr += "&";
        }

        //On supprime le dernier caractere de la requete == &
        requestStr = requestStr.substr(0, requestStr.length - 1);

        //On encode la requete (gestion des caracteres speciaux)
        var request = encodeURI(requestStr);

        //Creation d'une requete ajax
        $.ajax({
            url: request,
            beforeSend: function (xhr) {
                var encodedKey = Base64.encode(":" + key);
                xhr.setRequestHeader('Authorization', "Basic " + encodedKey);
            },
            context: this,
            type: 'GET',
            success: successFn,
            error: errorFn
        });
    };

    //Point d'entree de l'application (fonction auto executee)
    var main = function (){

        var language = '';

        try{
            language = TRANSLATOR_NS.utils.getUserLanguage();
        }catch(e){
            console.log(e.toString());
            console.log('Set default language to en');
            //langage par defaut utilise == anglais (code iso en)
            language = 'en';
        }

        TRANSLATOR_NS.utils.setLanguage(language);
    }();

}())


//Scope defini apres initialisation du DOM
$(document).ready(function () {

    /**
     * Modele utilise pour l'affichage de la popup de traduction
     * Classes bootstrap http://getbootstrap.com/javascript/#popovers
     */

    var popup =
        '<div id="translate-popover" class="popover fade bottom in" role="tooltip">' +
        '<button type="button" class="close">' +
        '<span aria-hidden="true">×</span>' +
        '</button>' +
        '<div class="arrow"></div>' +
        '<h3 class="popover-title"></h3>' +
        '<div class="popover-content">' +
        '</div></div>';

    //Ajoute du model de popup au body de la page courante et ajout du sytle
    //TODO Rendre configurable la bordure de la popup (couleur, epaisseur)
    $(popup)
        .css('min-width','300px')
        .css('border-color','red')
        .css('position','absolute')
        .appendTo('body');

    $('#translate-popover')
        .find('.arrow')
        .css('border-bottom-color','red');

    $('#translate-popover')
        .find('.close')
        .css('margin','5px 8px')
        .hover(function(){
            $(this).css('background','transparent');
        })
        .click(function(){
            $('#translate-popover').hide();
        });

    /**
     *
     * @param content contenu a placer dans la popup de traduction
     */
    var setPopoverContent = function(content){
        $('#translate-popover').find('.popover-content').html(content);
        $('#translate-popover').show();
    }

    /**
     * Reiniialisation du titre et du contenu de la popup de traduction
     */
    var resetPopoverFields = function(){
        $('#translate-popover').find('.popover-title').empty();
        $('#translate-popover').find('.popover-content').empty();
    };

    /**
     * Quand on double click sur un mot, on ouvre la popup de traduction
     */
    $(document).dblclick(function (event) {

        //Reinitialisation de la popover
        resetPopoverFields();

        //Positionnement de la popover en dessous du mot selectionne
        $('#translate-popover')
            .css('left',event.clientX - $('#translate-popover').width()/2.0)
            .css('top',event.clientY + 10);

        //On recupere la selection a traduire
        var text = $.selection();

        //Ajout d'un titre a la popover avec le mot a traduire
        var title = TRANSLATOR_NS.FIELD.TRANSLATION_OF + " " + "<b>" + text + "</b>";
        $('#translate-popover').find('.popover-title').html(title);

        //On determine le language source de la selection a traduire
        try{
            TRANSLATOR_NS.utils.getTextLanguage(text,
            function(data,status){

                var gtProperties = $(data).find('content').children();
                var gtElements = $(gtProperties[0]).children();
                var from = $(gtElements[0]).text();

                try {
                    TRANSLATOR_NS.utils.translate(text, from, TRANSLATOR_NS.USER_SETTINGS.LANGUAGE,
                    function(data,status){

                        var tProperties = $(data).find('content').children();
                        var tElements = $(tProperties[0]).children();
                        var result = $(tElements[0]).text();

                        setPopoverContent(result);
                    },
                    function(jqXhr,status,errorThrown){
                        console.log(errorThrown);
                        setPopoverContent(errorThrown);
                    });
                }
                catch (e) {
                    console.log(e.toString());
                    setPopoverContent(e.message);
                }

            },
            function(jqXhr,status,errorThrown){
                console.log(errorThrown);
                setPopoverContent(errorThrown);
            });
        }catch(e){
            console.log(e.toString());
            setPopoverContent(e.message);
        }
    });
});

