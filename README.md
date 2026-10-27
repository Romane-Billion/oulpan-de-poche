# Oulpan de poche

Appli d'hébreu pour iPhone, installable depuis Safari sur l'écran d'accueil (appli web plein écran, fonctionne hors-ligne).
Construite à partir de la méthode d'apprentissage définie avec Romane : la leçon avant l'exercice, l'audio partout, un parcours dans l'ordre.

- `index.html`, `css/app.css`, `js/app.js` : l'appli (sans outil de construction, fichiers servis tels quels par GitHub Pages)
- `js/data.js` : le contenu des leçons et le vocabulaire
- `sw.js` : le cache hors-ligne (changer `CACHE` à chaque mise à jour importante)
- `test.html` : page test de la voix et de l'installation

La progression est enregistrée sur le téléphone (localStorage), rien n'est envoyé ailleurs.
