#!/bin/bash

echo "🔍 Vérification de l'état de l'application"
echo "========================================="

# Couleurs pour le formatage
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'
YELLOW='\033[1;33m'

# Fonction pour afficher les résultats
print_result() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✓ $2${NC}"
    else
        echo -e "${RED}✗ $2${NC}"
        echo -e "${YELLOW}  → $3${NC}"
    fi
}

echo -e "\n1️⃣  Vérification des conteneurs"
echo "-----------------------------"

# Vérifier si tous les conteneurs sont en cours d'exécution
docker compose ps --format json | grep -q "catalogue-db.*running"
print_result $? "Base de données en cours d'exécution" "La base de données n'est pas en cours d'exécution"

docker compose ps --format json | grep -q "catalogue-server.*running"
print_result $? "Serveur en cours d'exécution" "Le serveur n'est pas en cours d'exécution"

docker compose ps --format json | grep -q "catalogue-client.*running"
print_result $? "Client en cours d'exécution" "Le client n'est pas en cours d'exécution"

echo -e "\n2️⃣  Vérification de la base de données"
echo "--------------------------------"

# Vérifier la connexion à MySQL
docker compose exec -T db mysqladmin -u cataloguser -puserpass -h localhost ping &>/dev/null
print_result $? "Connexion MySQL réussie" "Impossible de se connecter à MySQL"

# Vérifier la base catalogue_db
docker compose exec -T db mysql -u cataloguser -puserpass -e "USE catalogue_db; SELECT COUNT(*) FROM items;" &>/dev/null
print_result $? "Base de données catalogue_db accessible" "La base catalogue_db n'est pas accessible"

echo -e "\n3️⃣  Vérification du serveur"
echo "-------------------------"

# Vérifier l'API
response=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:5000/api/items)
if [ "$response" = "200" ]; then
    print_result 0 "API /api/items accessible" ""
else
    print_result 1 "API /api/items accessible" "Code de réponse: $response"
fi

# Test d'ajout d'un item
test_item='{"title":"Test Health Check","description":"Test automatique","category":"Test"}'
add_response=$(curl -s -X POST -H "Content-Type: application/json" -d "$test_item" http://localhost:5000/api/items)
if echo "$add_response" | grep -q "succès"; then
    print_result 0 "Ajout d'item via API réussi" ""
else
    print_result 1 "Ajout d'item via API réussi" "Réponse: $add_response"
fi

echo -e "\n4️⃣  Vérification du client"
echo "-------------------------"

# Vérifier si le client web est accessible
response=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000)
if [ "$response" = "200" ]; then
    print_result 0 "Interface web accessible" ""
else
    print_result 1 "Interface web accessible" "Code de réponse: $response"
fi

echo -e "\n📊 Logs récents"
echo "-------------"
echo -e "${YELLOW}Logs de la base de données :${NC}"
docker compose logs --tail 5 db
echo -e "\n${YELLOW}Logs du serveur :${NC}"
docker compose logs --tail 5 server
echo -e "\n${YELLOW}Logs du client :${NC}"
docker compose logs --tail 5 client
