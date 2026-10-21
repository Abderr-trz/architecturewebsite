# Kenza Rachadi — Architecture

Portfolio en français, construit par étapes. **Étapes 1 et 2 : ouverture, navigation, visuels complets et galerie de perspectives en 3D CSS.**

## Prévisualiser
Site statique sans dépendance ni compilation. Servir `dist/` avec un serveur HTTP (par exemple `python3 -m http.server 8000 --directory dist`). La racine publiée est `dist/`.

## Direction
Ivoire, sable, brun profond ; typographie éditoriale ; visuels fournis par le client. Introduction de moins de deux secondes, deux panneaux, titre révélé, cadrage intégral sans zoom ni parallaxe des images. Navigation modale native, sélection manuelle de trois perspectives. Aucun défilement automatique des images.

## Sources et limites
Les images sont les visuels transmis dans la conversation du 21 octobre 2026. Ce sont des perspectives de projets ; aucun nom, lieu, statut de réalisation ou donnée technique n’est attribué sans validation. Le client doit confirmer les droits de publication avant la version finale. Les intitulés des slides sont éditoriaux, pas des noms de projets.

Les principes de mouvement s’inspirent de l’analyse de Linoxa ; aucun code ni média de Linoxa n’est réutilisé. Les fontes sont les fontes système, sans chargement tiers.

Les projets et le contact renvoient provisoirement vers le compte Instagram fourni. Ne pas inventer un téléphone ou une adresse email. `noindex` reste actif pendant la validation du prototype.

## Galerie et images
Les quatre perspectives sont encodées en WebP sans perte à partir des fichiers transmis (environ 1100 px de large). Une comparaison des pixels valide l’absence de perte. Le hero est limité à 1104 px et utilise `object-fit: contain`. La visionneuse conserve le cadrage intégral. Les originaux haute résolution restent nécessaires pour une véritable version 4K.

Sur ordinateur avec pointeur fin, une galerie de quatre cartes planes suit le défilement sur un arc de 180 degrés, avec commandes précédent/suivant et visionneuse. Sur petit écran, sur appareil tactile et avec mouvement réduit, les images sont présentées en grille. La grille reste visible sans JavaScript.

## Suite, après validation
3. Cabinet, expertises et présentation de la démarche.
4. Fiches projet, contact confirmé, vérification finale et publication de présentation.

Chaque étape doit être validée avant de passer à la suivante.
