// S41 P2: 20 scenario-based questions with Imagen driving situation images
// 2 questions per image, 10 images total
// Each question references a media object with type, url, alt

const SCENARIO_QUESTIONS = [
    // === ROUNDABOUT (2 questions) ===
    {
        id: "scen-001", topic: "priorite", difficulty: 3,
        media: { type: "image", url: "./assets/images/scenarios/roundabout.webp", alt: "Approaching a busy roundabout with multiple cars and a blue roundabout sign" },
        questionFr: "Vous approchez de ce rond-point. Quelles actions devez-vous effectuer ?",
        questionEn: "You are approaching this roundabout. What actions should you take?",
        options: {
            A: { fr: "Céder le passage aux véhicules déjà engagés dans le rond-point", en: "Give way to vehicles already in the roundabout" },
            B: { fr: "Mettre le clignotant à gauche pour entrer", en: "Signal left to enter" },
            C: { fr: "Accélérer pour s'insérer rapidement avant les autres", en: "Accelerate to merge quickly before others" },
            D: { fr: "Ralentir et vérifier la circulation venant de la gauche", en: "Slow down and check traffic coming from the left" }
        },
        correctAnswers: ["A","D"], answerCount: 2,
        explanationFr: "À l'approche d'un rond-point, vous devez céder le passage aux véhicules engagés et ralentir pour vérifier la circulation. Le clignotant à gauche n'est pas obligatoire pour entrer.",
        explanationEn: "When approaching a roundabout, you must give way to vehicles in it and slow down to check traffic. Left signal is not required to enter."
    },
    {
        id: "scen-002", topic: "circulation", difficulty: 2,
        media: { type: "image", url: "./assets/images/scenarios/roundabout.webp", alt: "Approaching a busy roundabout with multiple cars and a blue roundabout sign" },
        questionFr: "Dans cette situation au rond-point, quelles affirmations sont correctes ?",
        questionEn: "In this roundabout situation, which statements are correct?",
        options: {
            A: { fr: "Le panneau bleu rond indique un sens giratoire obligatoire", en: "The round blue sign indicates a mandatory roundabout" },
            B: { fr: "La circulation s'effectue dans le sens inverse des aiguilles d'une montre", en: "Traffic flows counterclockwise" },
            C: { fr: "La priorité à droite s'applique ici", en: "Priority to the right applies here" },
            D: { fr: "Vous devez utiliser le clignotant droit pour sortir", en: "You must use the right indicator to exit" }
        },
        correctAnswers: ["A","B","D"], answerCount: 3,
        explanationFr: "Le panneau AB25 impose le sens giratoire (antihoraire). Les véhicules dans le rond-point ont priorité (pas la priorité à droite). Le clignotant droit est obligatoire pour sortir.",
        explanationEn: "Sign AB25 imposes roundabout direction (counterclockwise). Vehicles in the roundabout have priority (not priority to the right). Right indicator is mandatory to exit."
    },

    // === INTERSECTION RED LIGHT (2 questions) ===
    {
        id: "scen-003", topic: "priorite", difficulty: 2,
        media: { type: "image", url: "./assets/images/scenarios/intersection-red-light.webp", alt: "Car stopped at a red light with pedestrians crossing on a zebra crossing" },
        questionFr: "Face à cette situation, quelles sont vos obligations ?",
        questionEn: "Facing this situation, what are your obligations?",
        options: {
            A: { fr: "S'arrêter avant la ligne d'arrêt", en: "Stop before the stop line" },
            B: { fr: "Attendre que tous les piétons aient fini de traverser", en: "Wait until all pedestrians have finished crossing" },
            C: { fr: "Avancer lentement pour se préparer au feu vert", en: "Move forward slowly to prepare for the green light" },
            D: { fr: "Ne pas s'engager sur le passage piéton", en: "Not enter the pedestrian crossing" }
        },
        correctAnswers: ["A","B","D"], answerCount: 3,
        explanationFr: "Au feu rouge : arrêt obligatoire avant la ligne, ne pas s'engager sur le passage piéton, et attendre que tous les piétons aient traversé avant de repartir.",
        explanationEn: "At a red light: mandatory stop before the line, do not enter the crossing, and wait for all pedestrians to finish crossing before moving."
    },
    {
        id: "scen-004", topic: "autres_usagers", difficulty: 2,
        media: { type: "image", url: "./assets/images/scenarios/intersection-red-light.webp", alt: "Car stopped at a red light with pedestrians crossing on a zebra crossing" },
        questionFr: "Observez les piétons dans cette scène. Quelles affirmations sont correctes ?",
        questionEn: "Observe the pedestrians in this scene. Which statements are correct?",
        options: {
            A: { fr: "Les piétons sur le passage ont la priorité absolue", en: "Pedestrians on the crossing have absolute priority" },
            B: { fr: "Même au feu vert, il faut vérifier qu'aucun piéton ne traverse encore", en: "Even at green, you must check no pedestrian is still crossing" },
            C: { fr: "Les piétons doivent attendre que la route soit libre pour traverser", en: "Pedestrians must wait until the road is clear to cross" },
            D: { fr: "Un piéton engagé a la priorité même si votre feu passe au vert", en: "A pedestrian already crossing has priority even if your light turns green" }
        },
        correctAnswers: ["A","B","D"], answerCount: 3,
        explanationFr: "Les piétons engagés sur un passage ont priorité absolue. Même au vert, vérifiez qu'ils ont fini de traverser. Ici c'est le feu qui autorise leur traversée.",
        explanationEn: "Pedestrians on a crossing have absolute priority. Even at green, check they've finished crossing. Here the traffic light authorises their crossing."
    },

    // === HIGHWAY MERGE (2 questions) ===
    {
        id: "scen-005", topic: "circulation", difficulty: 3,
        media: { type: "image", url: "./assets/images/scenarios/highway-merge.webp", alt: "Driving on a French highway with a car merging from a slip road" },
        questionFr: "Vous circulez sur l'autoroute et un véhicule s'insère par la droite. Que devez-vous faire ?",
        questionEn: "You are driving on the motorway and a vehicle is merging from the right. What should you do?",
        options: {
            A: { fr: "Faciliter son insertion si possible en changeant de voie", en: "Facilitate their merge if possible by changing lanes" },
            B: { fr: "Maintenir votre vitesse car vous avez la priorité", en: "Maintain your speed as you have priority" },
            C: { fr: "Adapter votre vitesse pour laisser de l'espace", en: "Adapt your speed to leave space" },
            D: { fr: "Klaxonner pour signaler votre présence", en: "Honk to signal your presence" }
        },
        correctAnswers: ["A","B","C"], answerCount: 3,
        explanationFr: "Sur autoroute, vous avez bien la priorité, mais la courtoisie impose de faciliter l'insertion (changer de voie ou adapter la vitesse). Le klaxon n'est pas approprié.",
        explanationEn: "On the motorway, you do have priority, but courtesy requires facilitating the merge (lane change or speed adjustment). Honking is not appropriate."
    },
    {
        id: "scen-006", topic: "route", difficulty: 2,
        media: { type: "image", url: "./assets/images/scenarios/highway-merge.webp", alt: "Driving on a French highway with a car merging from a slip road" },
        questionFr: "Sur cette autoroute, quelles règles de circulation devez-vous respecter ?",
        questionEn: "On this motorway, which traffic rules must you follow?",
        options: {
            A: { fr: "Respecter la distance de sécurité de 2 secondes minimum", en: "Maintain minimum 2-second safety distance" },
            B: { fr: "Rouler sur la voie de droite sauf pour dépasser", en: "Drive in the right lane except to overtake" },
            C: { fr: "La vitesse minimale est de 80 km/h sur la voie de gauche", en: "Minimum speed is 80 km/h in the left lane" },
            D: { fr: "Ne pas s'arrêter sur la bande d'arrêt d'urgence sauf urgence", en: "Do not stop on the hard shoulder except in emergencies" }
        },
        correctAnswers: ["A","B","D"], answerCount: 3,
        explanationFr: "Autoroute : distance de sécurité 2 s, voie de droite par défaut, BAU réservée aux urgences. La vitesse minimale sur la voie de gauche n'est pas fixée à 80 km/h.",
        explanationEn: "Motorway: 2-second safety distance, right lane by default, hard shoulder for emergencies only. Minimum speed in the left lane is not fixed at 80 km/h."
    },

    // === RAIN DRIVING (2 questions) ===
    {
        id: "scen-007", topic: "route", difficulty: 2,
        media: { type: "image", url: "./assets/images/scenarios/rain-driving.webp", alt: "Driving in heavy rain on a highway with reduced visibility and wet road" },
        questionFr: "Dans ces conditions de pluie, quelles précautions devez-vous prendre ?",
        questionEn: "In these rainy conditions, what precautions should you take?",
        options: {
            A: { fr: "Réduire la vitesse et augmenter les distances de sécurité", en: "Reduce speed and increase safety distances" },
            B: { fr: "Allumer les feux de croisement", en: "Turn on dipped headlights" },
            C: { fr: "Allumer les feux de brouillard arrière", en: "Turn on rear fog lights" },
            D: { fr: "Éviter les freinages brusques", en: "Avoid sudden braking" }
        },
        correctAnswers: ["A","B","D"], answerCount: 3,
        explanationFr: "Sous la pluie : réduire la vitesse, feux de croisement obligatoires, pas de freinages brusques. Les feux de brouillard arrière ne sont autorisés que par brouillard ou chute de neige, pas sous la pluie.",
        explanationEn: "In rain: reduce speed, dipped headlights mandatory, no sudden braking. Rear fog lights are only for fog or snowfall, not rain."
    },
    {
        id: "scen-008", topic: "conducteur", difficulty: 3,
        media: { type: "image", url: "./assets/images/scenarios/rain-driving.webp", alt: "Driving in heavy rain on a highway with reduced visibility and wet road" },
        questionFr: "Observez la situation. Quels risques spécifiques cette conduite sous la pluie présente-t-elle ?",
        questionEn: "Observe the situation. What specific risks does driving in rain present?",
        options: {
            A: { fr: "Risque d'aquaplanage à partir de 80 km/h", en: "Risk of aquaplaning from 80 km/h" },
            B: { fr: "Distance de freinage qui peut doubler", en: "Braking distance that can double" },
            C: { fr: "Les marquages au sol deviennent plus visibles", en: "Road markings become more visible" },
            D: { fr: "Projection d'eau des autres véhicules réduisant la visibilité", en: "Water spray from other vehicles reducing visibility" }
        },
        correctAnswers: ["A","B","D"], answerCount: 3,
        explanationFr: "Sous la pluie : aquaplanage possible dès 80 km/h, distance de freinage doublée, projections d'eau des véhicules. Les marquages au sol deviennent MOINS visibles, pas plus.",
        explanationEn: "In rain: aquaplaning possible from 80 km/h, double braking distance, water spray from vehicles. Road markings become LESS visible, not more."
    },

    // === LEVEL CROSSING (2 questions) ===
    {
        id: "scen-009", topic: "tunnels_passages_niveau", difficulty: 2,
        media: { type: "image", url: "./assets/images/scenarios/level-crossing.webp", alt: "Approaching a level crossing with barriers down and red lights flashing" },
        questionFr: "Vous arrivez devant ce passage à niveau. Que devez-vous faire ?",
        questionEn: "You arrive at this level crossing. What should you do?",
        options: {
            A: { fr: "S'arrêter avant la barrière et attendre", en: "Stop before the barrier and wait" },
            B: { fr: "Contourner la barrière si aucun train n'est visible", en: "Go around the barrier if no train is visible" },
            C: { fr: "Ne pas s'engager tant que les feux clignotent", en: "Do not proceed while lights are flashing" },
            D: { fr: "Couper le moteur en attendant", en: "Turn off the engine while waiting" }
        },
        correctAnswers: ["A","C"], answerCount: 2,
        explanationFr: "Barrières fermées et feux clignotants : arrêt obligatoire, ne jamais contourner. Il n'est pas nécessaire de couper le moteur (garder le véhicule prêt à manœuvrer si besoin).",
        explanationEn: "Barriers down and lights flashing: mandatory stop, never go around. No need to turn off the engine (keep the vehicle ready to manoeuvre if needed)."
    },
    {
        id: "scen-010", topic: "tunnels_passages_niveau", difficulty: 3,
        media: { type: "image", url: "./assets/images/scenarios/level-crossing.webp", alt: "Approaching a level crossing with barriers down and red lights flashing" },
        questionFr: "Quelles affirmations sont correctes concernant ce passage à niveau ?",
        questionEn: "Which statements are correct about this level crossing?",
        options: {
            A: { fr: "Les feux rouges clignotants interdisent le franchissement", en: "Flashing red lights prohibit crossing" },
            B: { fr: "Un train peut arriver dans les deux sens", en: "A train may come from either direction" },
            C: { fr: "Les barrières se relèvent automatiquement après le passage du train", en: "Barriers raise automatically after the train passes" },
            D: { fr: "Le franchissement des barrières est un délit pénal", en: "Crossing the barriers is a criminal offence" }
        },
        correctAnswers: ["A","B","C","D"], answerCount: 4,
        explanationFr: "Toutes sont correctes : feux rouges = interdiction, trains dans les deux sens possibles, barrières automatiques, et franchir les barrières est un délit pénal grave.",
        explanationEn: "All are correct: red lights = prohibition, trains from either direction, automatic barriers, and crossing barriers is a serious criminal offence."
    },

    // === NIGHT DEER (2 questions) ===
    {
        id: "scen-011", topic: "route", difficulty: 3,
        media: { type: "image", url: "./assets/images/scenarios/night-deer.webp", alt: "Driving at night on a country road with a deer standing on the roadside illuminated by headlights" },
        questionFr: "Vous roulez de nuit et un animal apparaît dans vos phares. Que devez-vous faire ?",
        questionEn: "You are driving at night and an animal appears in your headlights. What should you do?",
        options: {
            A: { fr: "Ralentir progressivement sans freinage brusque", en: "Slow down gradually without sudden braking" },
            B: { fr: "Ne pas faire de manœuvre brusque d'évitement", en: "Do not make sudden evasive manoeuvres" },
            C: { fr: "Klaxonner brièvement pour faire fuir l'animal", en: "Honk briefly to scare the animal away" },
            D: { fr: "Utiliser les feux de route pour mieux voir", en: "Use full beams to see better" }
        },
        correctAnswers: ["A","B","C"], answerCount: 3,
        explanationFr: "Face à un animal : ralentir progressivement, éviter les manœuvres brusques (risque de sortie de route), klaxonner brièvement. Les feux de route peuvent éblouir l'animal et le paralyser.",
        explanationEn: "Facing an animal: slow down gradually, avoid sudden manoeuvres (risk of leaving the road), honk briefly. Full beams can dazzle the animal and freeze it."
    },
    {
        id: "scen-012", topic: "conducteur", difficulty: 2,
        media: { type: "image", url: "./assets/images/scenarios/night-deer.webp", alt: "Driving at night on a country road with a deer standing on the roadside illuminated by headlights" },
        questionFr: "Quels sont les dangers spécifiques de la conduite de nuit illustrés par cette scène ?",
        questionEn: "What are the specific dangers of night driving illustrated by this scene?",
        options: {
            A: { fr: "Le champ de vision est limité à la portée des phares", en: "The field of vision is limited to the headlight range" },
            B: { fr: "La perception des distances est altérée", en: "Distance perception is impaired" },
            C: { fr: "La fatigue augmente les risques d'accident", en: "Fatigue increases the risk of accidents" },
            D: { fr: "Les obstacles sont aussi visibles que de jour", en: "Obstacles are as visible as during the day" }
        },
        correctAnswers: ["A","B","C"], answerCount: 3,
        explanationFr: "De nuit : vision limitée aux phares, distances trompeuses, fatigue accrue. Les obstacles ne sont absolument PAS aussi visibles que de jour.",
        explanationEn: "At night: vision limited to headlights, deceptive distances, increased fatigue. Obstacles are absolutely NOT as visible as during the day."
    },

    // === SCHOOL ZONE (2 questions) ===
    {
        id: "scen-013", topic: "autres_usagers", difficulty: 2,
        media: { type: "image", url: "./assets/images/scenarios/school-zone.webp", alt: "School zone with children crossing, crossing guard present, 30 km/h speed limit sign" },
        questionFr: "Vous traversez cette zone scolaire. Quelles précautions prendre ?",
        questionEn: "You are driving through this school zone. What precautions should you take?",
        options: {
            A: { fr: "Respecter la limitation à 30 km/h", en: "Respect the 30 km/h speed limit" },
            B: { fr: "Être prêt à s'arrêter à tout moment", en: "Be ready to stop at any time" },
            C: { fr: "Klaxonner pour prévenir les enfants de votre présence", en: "Honk to warn children of your presence" },
            D: { fr: "Obéir aux instructions du personnel de surveillance", en: "Obey the crossing guard's instructions" }
        },
        correctAnswers: ["A","B","D"], answerCount: 3,
        explanationFr: "Zone scolaire : respecter la vitesse, être très vigilant, obéir au personnel. Ne pas klaxonner — cela peut effrayer les enfants et provoquer des réactions imprévisibles.",
        explanationEn: "School zone: respect the speed limit, be very vigilant, obey the staff. Don't honk — it can scare children and cause unpredictable reactions."
    },
    {
        id: "scen-014", topic: "circulation", difficulty: 2,
        media: { type: "image", url: "./assets/images/scenarios/school-zone.webp", alt: "School zone with children crossing, crossing guard present, 30 km/h speed limit sign" },
        questionFr: "Quelles affirmations sont vraies concernant les zones 30 comme celle-ci ?",
        questionEn: "Which statements are true about 30 km/h zones like this one?",
        options: {
            A: { fr: "La vitesse est limitée à 30 km/h dans toute la zone", en: "Speed is limited to 30 km/h throughout the zone" },
            B: { fr: "Les piétons ont une priorité renforcée", en: "Pedestrians have enhanced priority" },
            C: { fr: "Le stationnement est libre dans les zones 30", en: "Parking is free in 30 km/h zones" },
            D: { fr: "Elles sont signalées par un panneau d'entrée et de sortie de zone", en: "They are marked by entry and exit zone signs" }
        },
        correctAnswers: ["A","B","D"], answerCount: 3,
        explanationFr: "Zone 30 : 30 km/h max, piétons prioritaires, signalée par panneaux d'entrée/sortie. Le stationnement n'est pas automatiquement libre dans ces zones.",
        explanationEn: "30 km/h zone: 30 km/h max, pedestrians have priority, marked by entry/exit signs. Parking is not automatically free in these zones."
    },

    // === TUNNEL ENTRY (2 questions) ===
    {
        id: "scen-015", topic: "tunnels_passages_niveau", difficulty: 2,
        media: { type: "image", url: "./assets/images/scenarios/tunnel-entry.webp", alt: "Driving inside a well-lit tunnel with speed limit signs and emergency exit markings" },
        questionFr: "Vous circulez dans ce tunnel. Quelles règles devez-vous respecter ?",
        questionEn: "You are driving in this tunnel. Which rules must you follow?",
        options: {
            A: { fr: "Garder les feux de croisement allumés", en: "Keep dipped headlights on" },
            B: { fr: "Respecter les distances de sécurité indiquées", en: "Maintain the indicated safety distances" },
            C: { fr: "Dépasser le véhicule devant si la voie est large", en: "Overtake the vehicle ahead if the road is wide" },
            D: { fr: "Repérer les issues de secours", en: "Note the emergency exits" }
        },
        correctAnswers: ["A","B","D"], answerCount: 3,
        explanationFr: "En tunnel : feux de croisement obligatoires, distances de sécurité renforcées, repérer les issues de secours. Le dépassement est généralement interdit en tunnel.",
        explanationEn: "In tunnels: dipped headlights mandatory, reinforced safety distances, note emergency exits. Overtaking is generally prohibited in tunnels."
    },
    {
        id: "scen-016", topic: "tunnels_passages_niveau", difficulty: 3,
        media: { type: "image", url: "./assets/images/scenarios/tunnel-entry.webp", alt: "Driving inside a well-lit tunnel with speed limit signs and emergency exit markings" },
        questionFr: "En cas de bouchon dans ce tunnel, que devez-vous faire ?",
        questionEn: "In case of a traffic jam in this tunnel, what should you do?",
        options: {
            A: { fr: "Laisser au moins 5 mètres avec le véhicule devant", en: "Leave at least 5 metres to the vehicle ahead" },
            B: { fr: "Couper le moteur si l'arrêt se prolonge", en: "Turn off the engine if the stop is extended" },
            C: { fr: "Écouter les instructions sur la fréquence radio du tunnel", en: "Listen to instructions on the tunnel radio frequency" },
            D: { fr: "Quitter le tunnel par l'issue de secours la plus proche immédiatement", en: "Leave the tunnel via the nearest emergency exit immediately" }
        },
        correctAnswers: ["A","B","C"], answerCount: 3,
        explanationFr: "En bouchon dans un tunnel : garder une distance de manœuvre, couper le moteur (gaz d'échappement), écouter la radio du tunnel. N'évacuer que sur instruction ou en cas de danger.",
        explanationEn: "In a tunnel traffic jam: keep manoeuvre distance, turn off engine (exhaust fumes), listen to tunnel radio. Only evacuate on instruction or in case of danger."
    },

    // === MOUNTAIN ROAD (2 questions) ===
    {
        id: "scen-017", topic: "croisement_depassement", difficulty: 3,
        media: { type: "image", url: "./assets/images/scenarios/mountain-road.webp", alt: "Narrow mountain road with an oncoming vehicle approaching around a bend, steep drop on one side" },
        questionFr: "Un véhicule arrive en face sur cette route de montagne étroite. Que devez-vous faire ?",
        questionEn: "A vehicle is coming towards you on this narrow mountain road. What should you do?",
        options: {
            A: { fr: "Si vous descendez, c'est vous qui devez manœuvrer", en: "If you are going downhill, you must manoeuvre" },
            B: { fr: "Serrer le plus possible à droite", en: "Keep as far right as possible" },
            C: { fr: "Le véhicule le plus gros a la priorité", en: "The bigger vehicle has priority" },
            D: { fr: "Reculer jusqu'à une aire de croisement si nécessaire", en: "Reverse to a passing place if necessary" }
        },
        correctAnswers: ["A","B","D"], answerCount: 3,
        explanationFr: "En montagne : le descendant cède au montant, serrer à droite, reculer si nécessaire vers une aire de croisement. La taille du véhicule est un facteur mais pas un droit de priorité absolu.",
        explanationEn: "On mountain roads: the descending vehicle yields to the ascending one, keep right, reverse to a passing place if needed. Vehicle size is a factor but not an absolute right of way."
    },
    {
        id: "scen-018", topic: "route", difficulty: 3,
        media: { type: "image", url: "./assets/images/scenarios/mountain-road.webp", alt: "Narrow mountain road with an oncoming vehicle approaching around a bend, steep drop on one side" },
        questionFr: "Quels dangers spécifiques cette route de montagne présente-t-elle ?",
        questionEn: "What specific dangers does this mountain road present?",
        options: {
            A: { fr: "Risque de chute de pierres", en: "Risk of falling rocks" },
            B: { fr: "Virages serrés avec visibilité réduite", en: "Tight bends with reduced visibility" },
            C: { fr: "Les freins sont plus efficaces en descente", en: "Brakes are more effective going downhill" },
            D: { fr: "Verglas possible même en période douce", en: "Ice possible even in mild weather" }
        },
        correctAnswers: ["A","B","D"], answerCount: 3,
        explanationFr: "Route de montagne : chutes de pierres, virages sans visibilité, verglas. Les freins sont MOINS efficaces en descente prolongée (surchauffe = fading).",
        explanationEn: "Mountain roads: falling rocks, blind bends, ice. Brakes are LESS effective on prolonged descents (overheating = brake fade)."
    },

    // === CYCLIST AHEAD (2 questions) ===
    {
        id: "scen-019", topic: "autres_usagers", difficulty: 2,
        media: { type: "image", url: "./assets/images/scenarios/cyclist-ahead.webp", alt: "Following a cyclist on a French city street with parked cars on both sides" },
        questionFr: "Vous suivez ce cycliste en ville. Comment devez-vous le dépasser ?",
        questionEn: "You are following this cyclist in the city. How should you overtake?",
        options: {
            A: { fr: "Laisser au moins 1 mètre d'écart en agglomération", en: "Leave at least 1 metre gap in urban areas" },
            B: { fr: "Vérifier l'angle mort et les rétroviseurs avant de déboîter", en: "Check blind spot and mirrors before pulling out" },
            C: { fr: "Klaxonner pour prévenir le cycliste", en: "Honk to warn the cyclist" },
            D: { fr: "Attendre une zone sûre pour dépasser", en: "Wait for a safe area to overtake" }
        },
        correctAnswers: ["A","B","D"], answerCount: 3,
        explanationFr: "Pour dépasser un cycliste : 1 m minimum en ville, vérifier miroirs et angles morts, attendre un endroit sûr. Le klaxon peut effrayer le cycliste.",
        explanationEn: "To overtake a cyclist: minimum 1m in town, check mirrors and blind spots, wait for a safe spot. Honking can startle the cyclist."
    },
    {
        id: "scen-020", topic: "autres_usagers", difficulty: 3,
        media: { type: "image", url: "./assets/images/scenarios/cyclist-ahead.webp", alt: "Following a cyclist on a French city street with parked cars on both sides" },
        questionFr: "Quels risques supplémentaires sont présents dans cette scène avec des voitures garées ?",
        questionEn: "What additional risks are present in this scene with parked cars?",
        options: {
            A: { fr: "Une portière de voiture garée peut s'ouvrir devant le cycliste", en: "A parked car door may open in front of the cyclist" },
            B: { fr: "Le cycliste peut dévier brusquement pour éviter un obstacle", en: "The cyclist may swerve suddenly to avoid an obstacle" },
            C: { fr: "Un piéton peut surgir entre les voitures garées", en: "A pedestrian may appear between parked cars" },
            D: { fr: "Le cycliste doit obligatoirement rouler sur la piste cyclable", en: "The cyclist must ride in the cycle lane" }
        },
        correctAnswers: ["A","B","C"], answerCount: 3,
        explanationFr: "Voitures garées : risque d'ouverture de portière (emportiérage), cycliste qui dévie, piéton qui surgit. Le cycliste n'est pas obligé d'utiliser la piste cyclable si elle existe.",
        explanationEn: "Parked cars: risk of door opening (dooring), cyclist swerving, pedestrian emerging. Cyclists are not required to use the cycle lane even if one exists."
    }
];

module.exports = SCENARIO_QUESTIONS;
