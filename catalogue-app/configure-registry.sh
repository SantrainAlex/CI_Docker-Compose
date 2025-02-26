#!/bin/bash

echo "Configuration du GitHub Container Registry"
echo "----------------------------------------"

# Demande des informations
read -p "Entrez votre nom d'utilisateur GitHub : " github_username
read -s -p "Collez votre token GitHub (il ne sera pas affiché) : " github_token
echo

# Connexion à GitHub Container Registry
echo "$github_token" | docker login ghcr.io -u "$github_username" --password-stdin

if [ $? -eq 0 ]; then
    echo "✅ Connexion réussie au GitHub Container Registry"
    echo "🚀 Vous pouvez maintenant exécuter : docker compose up -d"
else
    echo "❌ Erreur de connexion"
    echo "Veuillez vérifier vos identifiants et réessayer"
fi
