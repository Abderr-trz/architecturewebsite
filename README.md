# Kenza Rachadi — Architecture

Portfolio en français, construit par étapes. **Étapes 1 à 4 : accueil, galerie 3D CSS, cabinet, expertises, démarche, quatre fiches de perspectives et contact Instagram.**

## Prévisualiser
Site statique sans dépendance ni compilation. Servir `dist/` avec un serveur HTTP (par exemple `python3 -m http.server 8000 --directory dist`). La racine publiée est `dist/`.

## Direction
Ivoire, sable, brun profond ; typographie éditoriale ; visuels fournis par le client. Introduction de moins de deux secondes, deux panneaux, titre révélé, cadrage intégral sans zoom ni parallaxe des images. Navigation modale native, sélection manuelle de trois perspectives. Aucun défilement automatique des images.

## Sources et limites
Les images sont les visuels transmis dans la conversation du 21 octobre 2026. Ce sont des perspectives de projets ; aucun nom, lieu, statut de réalisation ou donnée technique n’est attribué sans validation. Le client doit confirmer les droits de publication avant la version finale. Les intitulés des slides sont éditoriaux, pas des noms de projets.

Les principes de mouvement s’inspirent de l’analyse de Linoxa ; aucun code ni média de Linoxa n’est réutilisé. Les fontes sont les fontes système, sans chargement tiers.

La galerie est intégrée au site ; les liens de contact renvoient provisoirement vers le compte Instagram fourni. Ne pas inventer un téléphone ou une adresse email. `noindex` reste actif pendant la validation du prototype.

## Galerie et images
Les quatre perspectives sont encodées en WebP sans perte à partir des fichiers transmis (environ 1100 px de large). Une comparaison des pixels valide l’absence de perte. Le hero est limité à 1104 px et utilise `object-fit: contain`. La visionneuse conserve le cadrage intégral. Les originaux haute résolution restent nécessaires pour une véritable version 4K.

Sur ordinateur avec pointeur fin, une scène spatiale CSS présente une image centrale et quatre vues contextuelles plus petites, inspirées de la composition de Linoxa. Les vues périphériques peuvent répéter les quatre sources pour assurer la continuité ; elles sont décoratives et non accessibles au focus. Le titre et les commandes restent hors de la scène. Les rotations sont bornées à 74 degrés pour éviter les versos ; aucune légende ne subit de rotation. La progression est calculée à partir de la piste sticky (320 vh), interpolée par requestAnimationFrame avec arrêt à convergence. Les flèches permettent de rejoindre les quatre positions. Sur petit écran, sur appareil tactile et avec mouvement réduit, une grille remplace la scène. La grille reste visible sans JavaScript.

## Cabinet, expertises et démarche
La présentation se limite à l’identité, à Marrakech et aux trois domaines confirmés. Les textes de positionnement et le déroulement en trois étapes sont des propositions éditoriales à faire valider par Kenza avant publication finale ; aucune ancienneté, qualification supplémentaire, référence client ou mission de chantier n’est inventée.

Les expertises utilisent des disclosures natifs exclusifs, disponibles sans JavaScript et au clavier. Le survol sur ordinateur et les ouvertures au clic/clavier synchronisent une illustration et sa légende. La vue paysagère illustre un rapport aux espaces, sans être présentée comme une référence d’urbanisme. Le design intérieur utilise la sélection de perspectives fournie, conservée intégralement en WebP sans perte.

Les révélations de section sont finies (700–800 ms), limitées aux éléments hors écran, déclenchées par IntersectionObserver et désactivées avec mouvement réduit. Le contenu reste visible sans JavaScript. Les observateurs et temporisations sont nettoyés, avec restauration après BFCache.

## Fiches et contact
Quatre fiches HTML indépendantes dans `dist/projets/` décrivent uniquement ce qui est visible dans les perspectives fournies. Les titres restent des intitulés éditoriaux : ne pas leur attribuer de nom de commande, lieu, date, surface, client ou statut de chantier sans confirmation. Les liens du carrousel et de la grille ouvrent ces pages ; la visionneuse d’image reste disponible.

Le contact utilise exclusivement le compte Instagram fourni. Le formulaire prépare un message local, permet de le copier et propose d’ouvrir Instagram ; il n’envoie rien automatiquement et ne prétend pas recevoir des demandes. Aucune donnée de formulaire n’est enregistrée dans un serveur ou dans le stockage local. Une adresse email ou un numéro WhatsApp vérifié permettra d’ajouter un canal direct ultérieurement.

## Validation de présentation
Le prototype reste `noindex` en attendant la validation de Kenza : droits des images, vrais noms de projets, textes de positionnement et coordonnées. Les sources autour de 1100 px ne constituent pas des originaux 4K.

Les pages, les liens internes, les états de la galerie, l’ouverture des fiches, le retour vers le contact, la préparation/copie du message et les compositions mobile/tablette ont été contrôlés dans le navigateur. Le contrôle de mouvement réduit est implémenté ; aucun test sur téléphone physique ni audit complet d’accessibilité n’est revendiqué.

