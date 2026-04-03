/* ============================================
   Knowledge Graph — Brain-Search Integration
   Daniel's driving wisdom + real-world context
   Enriches tutor responses with Founder DNA knowledge
   ============================================ */

const Knowledge = {
    // Brain-search endpoint (when Docker stack is running)
    brainSearchUrl: null,
    brainSearchAvailable: false,

    init() {
        // Check if brain-search is configured in settings
        const settings = Storage.getSettings();
        this.brainSearchUrl = settings.brainSearchUrl || null;

        // Probe brain-search availability (non-blocking)
        if (this.brainSearchUrl) {
            this.probeBrainSearch();
        }
    },

    async probeBrainSearch() {
        try {
            const controller = new AbortController();
            setTimeout(() => controller.abort(), 3000);
            const r = await fetch(`${this.brainSearchUrl}/health`, { signal: controller.signal });
            this.brainSearchAvailable = r.ok;
        } catch {
            this.brainSearchAvailable = false;
        }
    },

    // Get enriched context for a topic or question
    getContext(topicId, questionId) {
        const insights = [];

        // Topic-level knowledge
        const topicKnowledge = this.topicWisdom[topicId];
        if (topicKnowledge) {
            insights.push(...topicKnowledge);
        }

        // Question-specific knowledge
        const questionKnowledge = this.questionInsights[questionId];
        if (questionKnowledge) {
            insights.push(questionKnowledge);
        }

        return insights;
    },

    // Get a teaching insight to display alongside explanations
    getInsight(topicId, questionId) {
        const insights = this.getContext(topicId, questionId);
        if (insights.length === 0) return null;

        // Pick a relevant insight (rotate based on question ID hash)
        const hash = (questionId || '').split('').reduce((a, c) => a + c.charCodeAt(0), 0);
        return insights[hash % insights.length];
    },

    // Build enriched context string for the tutor worker
    enrichTutorContext(context) {
        if (!context.question) return context;

        const insights = this.getContext(context.question.topic, context.question.id);
        if (insights.length > 0) {
            context.knowledgeInsights = insights.slice(0, 3).map(i => i.text).join(' | ');
        }

        // Add Daniel's teaching style hints
        context.teachingStyle = this.getTeachingHint(context.isCorrect, context.question.topic);

        return context;
    },

    getTeachingHint(isCorrect, topic) {
        if (isCorrect === true) {
            const praise = this.praisePatterns[Math.floor(Math.random() * this.praisePatterns.length)];
            return praise;
        }
        if (isCorrect === false) {
            const correct = this.correctionPatterns[Math.floor(Math.random() * this.correctionPatterns.length)];
            return correct;
        }
        return null;
    },

    // Daniel's genuine praise patterns (specific, not generic)
    praisePatterns: [
        "Be specific about what she got right and connect it to the system behind the rule.",
        "Point out the pattern she's recognizing — Sara learns systems, not isolated facts.",
        "Brief, genuine acknowledgment — then build on it with a related concept.",
        "Reference a real driving scenario where this knowledge would save her.",
    ],

    // Daniel's correction patterns (direct but supportive)
    correctionPatterns: [
        "Direct correction: name the mistake, explain WHY the right answer is right, move forward.",
        "Connect the correction to the underlying system — help her see the logic, not just memorize.",
        "Use a real-world analogy: what would happen on the road if she made this mistake?",
        "Frame it as a common trap — she's not alone in getting this wrong, but now she knows.",
    ],

    // =============================================
    // Topic-Level Wisdom (from Daniel's BRAIN/)
    // =============================================
    topicWisdom: {
        'priorite': [
            {
                text: "Priorite a droite is France's DNA — when in doubt, the car on your right goes first. Think of it like this: at the chateau, when two tractors meet at the field crossing, the one coming from the right has the right of way. Simple.",
                tag: 'foundation'
            },
            {
                text: "Roundabouts override priorite a droite. Inside the circle = priority. It's like a river: you don't jump into a flowing river and expect the water to stop for you.",
                tag: 'roundabout'
            },
            {
                text: "STOP means STOP. Even at 3 AM with nobody around. This is a French absolute — rolling stops get you points deducted. Full wheels-stopped contact with the ground.",
                tag: 'stop'
            },
            {
                text: "Police officer > traffic lights > signs > road markings > priorite a droite. That's the hierarchy. An agent directing traffic overrides everything.",
                tag: 'hierarchy'
            },
            {
                text: "When exiting a parking lot, private road, or gas station onto a public road: you yield to EVERYONE — cars, bikes, pedestrians, even rollerbladers.",
                tag: 'private_exit'
            }
        ],
        'circulation': [
            {
                text: "Speed limits changed in 2018: 80 km/h on two-way roads without separator. This trips up anyone who studied with older materials. Remember: 80 is the new 90.",
                tag: '2018_reform'
            },
            {
                text: "Rain speed reductions: Motorway 130→110, dual carriageway 110→100. Regular roads stay at 80. The pattern: subtract 20 on fast roads.",
                tag: 'rain'
            },
            {
                text: "2-second rule for following distance. On the autoroute at 130 km/h, that's about 72 meters. Use the road markers — the white posts are 100m apart.",
                tag: 'distance'
            }
        ],
        'conducteur': [
            {
                text: "0.5 g/L blood alcohol limit. But for probationary drivers it's 0.2 g/L — essentially zero, because even one beer can put you over. Daniel's rule: if you're driving, don't drink. Period.",
                tag: 'alcohol'
            },
            {
                text: "Phone while driving: completely forbidden. Even holding it at a red light. Pull over safely first. EUR 135 fine and 3 points — not worth the text message.",
                tag: 'phone'
            }
        ],
        'route': [
            {
                text: "Breakdown on autoroute: hazard lights ON immediately, put on your hi-vis vest INSIDE the car before getting out, place triangle 30m behind the car, get behind the barrier.",
                tag: 'breakdown'
            },
            {
                text: "In fog (visibility < 50m): max 50 km/h, fog lights ON, dipped headlights, increase following distance to 4+ seconds. Allier gets thick fog in autumn — this is real.",
                tag: 'fog'
            }
        ],
        'autres_usagers': [
            {
                text: "Cyclists: 1m gap in town, 1.5m outside town when overtaking. If the road is too narrow, you wait. No squeezing past.",
                tag: 'cyclists'
            },
            {
                text: "Pedestrians at crossings: once they step onto the crossing, you MUST stop. Not slow down — stop. Even if they're on the other side of the road.",
                tag: 'pedestrians'
            }
        ],
        'croisement_depassement': [
            {
                text: "Overtake on the LEFT only. The only exception: when a vehicle ahead is signaling a left turn, or trams. Everything else: pass on the left.",
                tag: 'overtake'
            },
            {
                text: "Continuous white line: never cross it. Not to overtake, not to turn, not for any reason. If you need to get past, wait for a dashed section.",
                tag: 'white_line'
            }
        ],
        'arret_stationnement': [
            {
                text: "Parking near intersection: 5 meters minimum. Near bus stop: 10 meters. Near fire hydrant: 5 meters. These numbers come up on the exam constantly.",
                tag: 'distances'
            },
            {
                text: "Arret (stopping) = driver stays in/near car. Stationnement (parking) = driver leaves. Different signs, different rules, different penalties.",
                tag: 'definition'
            }
        ],
        'tunnels_passages_niveau': [
            {
                text: "Fire in tunnel: stop the car, turn OFF engine, leave keys in ignition, walk to the nearest emergency exit. Do NOT try to reverse out. Do NOT try to drive through.",
                tag: 'tunnel_fire'
            },
            {
                text: "Level crossing barriers down: STOP. Even if partially raised, even if no train visible. Some crossings have double barriers — the second can come down while you're between them.",
                tag: 'level_crossing'
            }
        ],
        'signalisation': [
            {
                text: "Sign shape tells the category: Triangle = warning, Circle with red = prohibition, Blue circle = obligation, Blue square = information. Learn the shapes and you can guess any sign's meaning.",
                tag: 'shapes'
            }
        ],
        'notions_diverses': [
            {
                text: "PAS protocol for first aid: Proteger (protect the scene), Alerter (call 112/15/17/18), Secourir (provide aid). In that order. Protect yourself and the scene first.",
                tag: 'first_aid'
            },
            {
                text: "12 points total (6 for probationary). You lose points for infractions. You can regain points through safe driving (1 point/6 months without infraction) or a road safety course (up to 4 points).",
                tag: 'points'
            }
        ]
    },

    // =============================================
    // Question-Specific Insights
    // =============================================
    questionInsights: {
        'prio-001': {
            text: "At the chateau, the unmarked crossing by the east field uses this exact rule. Any time there's no sign, no marking, nothing — the car on your right goes first. It's the default setting of French traffic.",
            tag: 'real_world'
        },
        'prio-003': {
            text: "The Moulins roundabout at the entrance to town — cars already circling have priority. You wait at the entry until there's a gap. Trying to force your way in is both dangerous and illegal.",
            tag: 'real_world'
        },
        'prio-005': {
            text: "The STOP at the bottom of the D945 before the bridge — even at 6 AM with nobody around, full stop. The gendarmes sometimes sit there at odd hours.",
            tag: 'real_world'
        },
        'prio-016': {
            text: "Every time we leave the Carrefour parking lot in Moulins, we yield to everything on the road. Private property → public road = you're the lowest priority.",
            tag: 'real_world'
        },
        'prio-019': {
            text: "When the lights went out at the intersection near Avermes last winter during the storm — everyone just applied priorite a droite. That's the fallback rule. Lights fail? Back to basics.",
            tag: 'real_world'
        },
        'circ-002': {
            text: "This is the 2018 change that catches everyone. On our road to Souvigny — no separator, two-way — it's 80 now, not 90. Sara, if you see 90 as an answer option, it's almost certainly the trap.",
            tag: 'trap_warning'
        },
    },
};
