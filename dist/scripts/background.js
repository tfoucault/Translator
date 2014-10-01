var ERRORS_EN={NO_CONTENT_TO_TRANSLATE:"There is no selected word to translate.",SOURCE_LANGUAGE_UNDEFINED:"Source language isn undefined.",TARGET_LANGUAGE_UNDEFINED:"Target language is undefined",LANGUAGE_ISO_UNDEFINED:"Undefined language iso code.",API_BASE_URL_UNDEFINED:"Base url for api call is undefined",API_VERB_UNDEFINED:"Method to join on API is undefined",API_PARAMS_UNDEFINED:"Params to call API method are undefined",API_KEY_UNDEFINED:"The account key for Microsoft Translate API is undefined",USER_LANGUAGE_UNDEFINED:"User language is undefined",NO_CONTENT_TO_DETECT:"No content provided for detecting source language"},FIELDS_EN={TRANSLATION_OF:"Translation for"},ERRORS_FR={NO_CONTENT_TO_TRANSLATE:"Aucun mot n'est selectionné pour la traduction.",SOURCE_LANGUAGE_UNDEFINED:"La langue d'origine n'est pas definie.",TARGET_LANGUAGE_UNDEFINED:"Le langage cible n'est pas défini",LANGUAGE_ISO_UNDEFINED:"Code iso du langage non défini",API_BASE_URL_UNDEFINED:"L'url de base pour l'appel a l'API n'est pas déinie",API_VERB_UNDEFINED:"La méthode à appeler n'est pas définie",API_PARAMS_UNDEFINED:"Les paramètres pour joindre la methode de l'API sont manquants",API_KEY_UNDEFINED:"La cle de compte primaire pour l'API Microsoft Translate est manquante",USER_LANGUAGE_UNDEFINED:"La langue de l'utilisateur n'est pas définie",NO_CONTENT_TO_DETECT:"Aucun contenu pour la detection de la langue source"},FIELDS_FR={TRANSLATION_OF:"Traduction de"};TRANSLATOR_NS={},function(){TRANSLATOR_NS.I18N={EN:{ERROR:ERRORS_EN,FIELD:FIELDS_EN},FR:{ERROR:ERRORS_FR,FIELD:FIELDS_FR}},TRANSLATOR_NS.ACTION={GET_TRANSLATION_FILES:0},chrome.runtime.onMessage.addListener(function(b,c,d){var e={};switch(b.action){case TRANSLATOR_NS.ACTION.GET_TRANSLATION_FILES:e=a(b.params[0]);break;default:e={}}d(e)});var a=function(a){return TRANSLATOR_NS.I18N[a.toUpperCase()]}}();