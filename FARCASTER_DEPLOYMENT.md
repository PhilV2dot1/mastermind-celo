# 🚀 Guide de Déploiement Farcaster Mini-App

Ce guide vous aidera à déployer votre jeu Mastermind sur Farcaster.

## Étape 1: Déployer sur Vercel

### 1.1 Créer un projet Vercel

1. Allez sur [vercel.com](https://vercel.com) et connectez-vous
2. Cliquez sur "Add New Project"
3. Importez votre repository GitHub: `https://github.com/PhilV2dot1/mastermind-celo`
4. **Important**: Utilisez un nom simple sans caractères spéciaux, par exemple: `mastermindcelo` ou `celo-mastermind`

### 1.2 Configurer les Variables d'Environnement

Dans les paramètres du projet Vercel, ajoutez ces variables d'environnement:

```
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=5f078af7c0b95758c7a628a3840cd9c1
NEXT_PUBLIC_URL=https://VOTRE-DOMAINE.vercel.app
```

**Note**: Remplacez `VOTRE-DOMAINE` par le domaine que Vercel vous attribue après le déploiement.

### 1.3 Déployer

1. Cliquez sur "Deploy"
2. Attendez que le build se termine
3. Notez l'URL de production (ex: `https://mastermindcelo.vercel.app`)

### 1.4 Mettre à jour NEXT_PUBLIC_URL

1. Retournez dans les paramètres Vercel
2. Mettez à jour `NEXT_PUBLIC_URL` avec votre vraie URL de production
3. Redéployez l'application

## Étape 2: Enregistrer la Mini-App sur Farcaster

### 2.1 Accéder au Developer Portal

1. Allez sur [developers.farcaster.xyz](https://developers.farcaster.xyz/)
2. Connectez-vous avec votre compte Farcaster/Warpcast

### 2.2 Créer une Nouvelle Mini-App

1. Cliquez sur "Create Mini-App" ou "New Application"
2. Remplissez les informations:
   - **Name**: Mastermind on Celo
   - **Description**: Crack the 4-color secret code in 10 attempts! Play free or compete on-chain with Celo blockchain.
   - **App URL**: Votre URL Vercel (ex: `https://mastermindcelo.vercel.app`)
   - **Icon**: Uploadez une icône 512x512px (utilisez l'emoji 🎯 ou créez une icône)
   - **Category**: Games

3. Soumettez la demande

### 2.3 Obtenir le UUID

Après l'enregistrement, vous recevrez un **UUID** unique pour votre mini-app.
Exemple: `a1b2c3d4-e5f6-7890-abcd-ef1234567890`

## Étape 3: Mettre à Jour next.config.mjs

### 3.1 Copier le UUID

1. Copiez le UUID fourni par Farcaster
2. Dans votre code, ouvrez `next.config.mjs`
3. Remplacez `YOUR_UUID_HERE` par votre UUID réel:

```javascript
{
  source: '/.well-known/farcaster.json',
  destination: 'https://api.farcaster.xyz/miniapps/hosted-manifest/VOTRE-UUID-ICI',
  permanent: false,
  statusCode: 307,
}
```

### 3.2 Commit et Push

```bash
git add next.config.mjs .env.local.example FARCASTER_DEPLOYMENT.md
git commit -m "Configure Farcaster mini-app UUID and deployment guide"
git push
```

Vercel déploiera automatiquement les changements.

## Étape 4: Tester la Mini-App

### 4.1 Test dans Warpcast

1. Ouvrez l'application Warpcast sur mobile
2. Allez dans l'onglet "Mini Apps" ou "Discover"
3. Cherchez "Mastermind on Celo"
4. Lancez l'application
5. Testez les deux modes (Free et On-Chain)

### 4.2 Vérifications

- ✅ La mini-app se charge correctement
- ✅ Le design est optimisé pour mobile
- ✅ Les couleurs et le layout correspondent au design Blackjack
- ✅ Le mode Free fonctionne sans wallet
- ✅ Le mode On-Chain permet de connecter le wallet Farcaster
- ✅ Les transactions sur Celo fonctionnent correctement
- ✅ Le partage sur Farcaster fonctionne

## Étape 5: Partager!

### 5.1 Créer un Cast

Dans Warpcast, créez un cast pour annoncer votre jeu:

```
🎯 Nouveau jeu sur Farcaster: Mastermind on Celo!

Cassez le code secret en 10 tentatives ou moins.
🆓 Mode gratuit pour s'entraîner
⛓️ Mode on-chain sur Celo pour compétition

Essayez-le maintenant!
```

### 5.2 Ajouter le lien

Ajoutez le lien de votre mini-app dans le cast.

## Troubleshooting

### Erreur: "Mini-app not found"

- Vérifiez que le UUID dans `next.config.mjs` est correct
- Assurez-vous que l'app est déployée sur Vercel
- Attendez quelques minutes pour la propagation DNS

### Erreur: "Failed to connect wallet"

- Vérifiez que `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` est bien configuré
- Testez d'abord le mode Free pour isoler le problème

### Le design ne s'affiche pas correctement

- Vérifiez que tous les fichiers CSS sont déployés
- Nettoyez le cache de Vercel et redéployez
- Testez dans le simulateur mobile de Chrome DevTools

## Support

Si vous rencontrez des problèmes:
- Documentation Farcaster: https://docs.farcaster.xyz/
- Discord Farcaster: https://discord.gg/farcaster
- Issues GitHub: https://github.com/PhilV2dot1/mastermind-celo/issues

---

🤖 Generated with [Claude Code](https://claude.com/claude-code)
