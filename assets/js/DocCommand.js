const DOCS = [
    {
        group: 'Prise en main',
        items: [
            {
                id: 'introduction',
                title: 'Introduction',
                icon: 'rocket',
                summary: 'ValoBot apporte les stats Valorant dans ton serveur Discord : rang, historique de parties, agents joués et rotation de boutique, sans quitter le salon.',
                body: `
          <h2>Ce que fait le bot</h2>
          <p>ValoBot interroge l'API Riot et met en forme les résultats directement dans Discord. Toutes les commandes sont des commandes slash : tape <code>/</code> dans un salon et Discord affiche la liste avec l'autocomplétion des paramètres.</p>
          <ul>
            <li>Consulter un rang et un pic de rang sur la saison en cours</li>
            <li>Relire les dernières parties avec K/D/A et RR</li>
            <li>Comparer les joueurs avec un leaderboard</li>
          </ul>
          <h2>Avant de commencer</h2>
          <p>Invite le bot, puis lie ton compte Riot une seule fois avec <code>/link</code>. Toutes les commandes accepteront ensuite d'être lancées sans pseudo.</p>
        `,
                notes: [{
                    type: 'info',
                    text: 'Le bot a besoin des permissions <strong>Envoyer des messages</strong> et <strong>Intégrer des liens</strong> dans les salons où il répond.'
                }]
            },
            {
                id: 'installation',
                title: 'Installation',
                icon: 'bolt',
                summary: 'Invite ValoBot sur ton serveur et vérifie que les commandes slash sont bien enregistrées.',
                body: `
          <h2>Inviter le bot</h2>
          <p>Ouvre le lien d'invitation, choisis le serveur, puis valide la liste des permissions. Il faut être <strong>administrateur</strong> du serveur pour ajouter une application.</p>
          <h2>Vérifier l'installation</h2>
          <p>Tape <code>/ping</code> dans n'importe quel salon. Si le bot répond avec sa latence, les commandes sont enregistrées. Sinon, retire puis réinvite l'application : Discord met parfois jusqu'à une heure à propager les commandes globales.</p>
        `,
                examples: [{code: '/ping', caption: 'Vérifier que le bot répond'}],
                notes: [{
                    type: 'warn',
                    text: 'Si les commandes n\'apparaissent pas après une heure, vérifie que le rôle du bot n\'est pas bloqué par une permission de salon.'
                }]
            },
            {
                id: 'link',
                title: '/link',
                icon: 'link',
                summary: 'Associe ton compte Riot à ton compte Discord pour lancer les autres commandes sans jamais retaper ton pseudo.',
                usage: '/link <riot_id>',
                scope: 'Serveur et messages privés',
                params: [
                    {
                        name: 'riot_id',
                        type: 'string',
                        required: true,
                        description: 'Ton identifiant Riot complet, au format pseudo#tag.'
                    }
                ],
                examples: [
                    {code: '/link riot_id:Sova#EUW', caption: 'Liaison du compte'},
                ],
                returns: '<p>Un message éphémère de confirmation, visible de toi seul, avec le pseudo.</p>',
                notes: [
                    {
                        type: 'ok',
                        text: 'Une fois lié, <code>/rank</code>, <code>/matches</code> et <code>/stats</code> fonctionnent sans argument.'
                    },
                    {
                        type: 'info',
                        text: 'Relancer <code>/link</code> écrase la liaison précédente. Utilise <code>/unlink</code> pour supprimer tes données.'
                    }
                ]
            },
            {
                id: 'unlink',
                title: '/unlink',
                icon: 'unlink',
                summary: 'Dissocie ton compte Riot et ton compte Discord.',
                usage: '/unlink',
                scope: 'Serveur et messages privés',
                params: [],
                examples: [
                    {code: '/unlink', caption: 'Dissociation du compte'},
                ],
                returns: '<p>Un message éphémère de confirmation, visible de toi seul, avec le pseudo.</p>',
                notes: [
                    {
                        type: 'ok',
                        text: 'Une fois délié, <code>/rank</code>, <code>/matches</code> et <code>/stats</code> nécessite obligatoirement un pseudo pour fonctionner.'
                    },
                    {
                        type: 'info',
                        text: 'Lancer <code>/link</code> pour associer ton compte Riot à ton compte Discord pour lancer les autres commandes sans jamais retaper ton pseudo.'
                    }
                ]
            }
        ]
    },
    {
        group: 'Joueur',
        items: [
            {
                id: 'rank',
                title: '/rank',
                icon: 'trophy',
                summary: 'Affiche le rang actuel, le nombre de RR et le nombre de RR gagner ou perdu lors du dernier match.',
                usage: '/rank [riot_id]',
                params: [
                    {
                        name: 'riot_id',
                        type: 'string',
                        required: false,
                        description: 'Joueur à consulter. Omis, la commande utilise ton compte lié.'
                    }
                ],
                examples: [
                    {code: '/rank', caption: 'Ton propre rang'},
                    {code: '/rank riot_id:Jett#1337', caption: 'Le rang d\'un autre joueur'}
                ],
                returns: '<p>Une carte avec le rang, les RR actuelles et le nombre de RR gagner ou perdu lors du dernier match.</p>',
                notes: [{
                    type: 'warn',
                    text: 'Un joueur sans partie classée sur la saison en cours renvoie l\'erreur <code>UNRANKED</code>.'
                }]
            },
            {
                id: 'matches',
                title: '/matches',
                icon: 'swords',
                summary: 'Liste les dernières parties d\'un joueur avec la carte, le K/D/A, le nombres de tire à la tête et l\'agent joué.',
                usage: '/matches [riot_id] [mode] [limite]',
                params: [
                    {
                        name: 'riot_id',
                        type: 'string',
                        required: false,
                        description: 'Joueur à consulter. Par défaut, ton compte lié.'
                    },
                    {
                        name: 'mode',
                        type: 'choice',
                        required: false,
                        description: 'Filtre sur un mode : competitive, unrated, swiftplay, deathmatch.',
                        default: 'competitive'
                    },
                    {
                        name: 'limite',
                        type: 'integer',
                        required: false,
                        description: 'Nombre de parties à afficher, entre 1 et 10.',
                        default: '5'
                    }
                ],
                examples: [
                    {code: '/matches limite:3', caption: 'Les trois dernières parties'},
                    {code: '/matches riot_id:Sage#EUW mode:competitive', caption: 'Uniquement les parties classées'}
                ],
                returns: '<p>Une ligne par partie : carte, le % de tire à la tête, agent et K/D/A.</p>'
            },
            {
                id: 'stats',
                title: '/stats',
                icon: 'chart',
                summary: 'Agrège les performances d\'un joueur.',
                usage: '/stats [riot_id] [agent]',
                params: [
                    {
                        name: 'riot_id',
                        type: 'string',
                        required: false,
                        description: 'Joueur à analyser. Par défaut, ton compte lié.'
                    },
                    {name: 'agent', type: 'string', required: false, description: 'Limite le calcul à un seul agent.'}
                ],
                examples: [
                    {code: '/stats riot_id:Goat#67', caption: 'Performances sur le joueur'},
                    {code: '/stats riot_id:Omen#EUW agent:Omen', caption: 'Performances sur Omen'}
                ],
                returns: '<p>Un résumé chiffré : K/D ratio, KDA global, agent le plus joué et les 3 derniers matchs compétitifs.</p>',
                notes: [{
                    type: 'info',
                    text: 'Les données sont mises en cache 15 minutes : une partie tout juste terminée peut manquer à l\'appel.'
                }]
            },
            {
                id: 'leaderboard',
                title: '/leaderboard',
                icon: 'user',
                summary: 'Classe les membres du serveur qui ont lié leur compte, du rang le plus élevé au plus bas.',
                usage: '/leaderboard [limite]',
                scope: 'Serveur uniquement',
                params: [
                    {
                        name: 'limite',
                        type: 'integer',
                        required: false,
                        description: 'Nombre de joueurs affichés, entre 5 et 25.',
                        default: '10'
                    }
                ],
                examples: [{code: '/leaderboard limite:25', caption: 'Classement du top 25 du serveur'}],
                returns: '<p>Un classement numéroté avec le pseudo Discord, le rang et les RR de chaque membre lié.</p>'
            },
            {
                id: 'notify',
                title: '/notify',
                icon: 'bell',
                summary: 'Envoie un message dans un salon quand un membre change de rang.',
                usage: '/notify <salon> [riot_id] [rôle] [seuil]',
                scope: 'Serveur uniquement',
                permission: 'Gérer le serveur',
                params: [
                    {
                        name: 'salon',
                        type: 'channel',
                        required: true,
                        description: 'Salon qui recevra les annonces de changement de rang.'
                    },
                    {
                        name: 'riot_id',
                        type: 'string',
                        required: false,
                        description: 'Joueur à suivre. Omis, la commande utilise ton compte lié.'
                    },
                    {name: 'rôle', type: 'role', required: false, description: 'Rôle mentionné à chaque annonce.'},
                    {
                        name: 'seuil',
                        type: 'choice',
                        required: false,
                        description: 'Déclenche à chaque palier ou uniquement au changement de rang complet.',
                        default: 'chaque palier'
                    }
                ],
                examples: [{code: '/notify salon:#valorant rôle:@Joueurs', caption: 'Annonces avec mention'}],
                notes: [{
                    type: 'info',
                    text: 'Relancer la commande sur un autre salon déplace les annonces sur ce joueur au lieu de les dupliquer.'
                }]
            }
        ]
    },
    {
        group: 'Jeu',
        items: [
            {
                id: 'agent',
                title: '/agent',
                icon: 'shield',
                summary: 'Donne la fiche d\'un agent : rôle, compétences, coût des charges et temps de recharge.',
                usage: '/agent <nom>',
                params: [
                    {
                        name: 'nom',
                        type: 'string',
                        required: true,
                        description: 'Nom de l\'agent. L\'autocomplétion propose la liste complète.'
                    }
                ],
                examples: [{code: '/agent nom:Killjoy', caption: 'Fiche complète d\'un agent'}],
                returns: '<p>Le rôle, la description des quatre compétences et le coût en crédits des charges achetables.</p>'
            },
            {
                id: 'maps',
                title: '/maps',
                icon: 'map',
                summary: 'Affiche les informations et le plan détaillé d\'une carte donnée.',
                usage: '/maps [nom]',
                params: [
                    {
                        name: 'nom',
                        type: 'string',
                        required: false,
                        description: 'Carte à détailler. Omis, la commande renvoie la rotation compétitive en cours.'
                    }
                ],
                examples: [
                    {code: '/maps', caption: 'Rotation actuelle'},
                    {code: '/maps nom:Ascent', caption: 'Plan d\'une carte'}
                ]
            }
        ]
    },
    {
        group: 'Système',
        items: [
            {
                id: 'errors',
                title: 'Codes d\'erreur',
                icon: 'alert',
                summary: 'La liste des erreurs renvoyées par le bot et ce qu\'il faut faire dans chaque cas.',
                body: `
          <h2>Erreurs de compte</h2>
          <ul>
            <li><code>NO_LINKED_ACCOUNT</code> — aucun compte lié. Lance <code>/link</code> une première fois.</li>
            <li><code>RIOT_ID_NOT_FOUND</code> — le pseudo#tag n'existe pas. Vérifie la casse (majuscule et minuscule) et le tag.</li>
            <li><code>UNRANKED</code> — le joueur n'a pas terminé ses parties de placement sur la saison.</li>
          </ul>
          <h2>Erreurs de service</h2>
          <ul>
            <li><code>RATE_LIMITED</code> — trop d'appels d'affilée. Le message indique le délai d'attente restant.</li>
            <li><code>RIOT_API_DOWN</code> — l'API Riot ne répond pas. Rien à faire côté serveur, réessaie plus tard.</li>
            <li><code>MISSING_PERMISSIONS</code> — le bot ne peut pas écrire ou intégrer un lien dans ce salon.</li>
          </ul>
        `,
                notes: [{
                    type: 'info',
                    text: 'Chaque erreur affichée dans Discord reprend ce code : cherche-le sur cette page pour trouver la marche à suivre.'
                }]
            }
        ]
    }
];