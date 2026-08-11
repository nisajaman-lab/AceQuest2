from datetime import datetime

from sqlalchemy.orm import Session
from app.models import (
    Role,
    Skin,
    Badge,
    Subject,
    Chapter,
    Question,
    AnswerOption,
    AcceptedAnswer,
    NPC,
    Dialogue,
    QuestionTypeEnum,
    User,
    PlayerProfile,
)
from app.services.auth import get_password_hash


def seed_db(db: Session):
    # 1. Seed Roles
    roles_data = ["student", "teacher", "admin"]
    roles = {}
    for role_name in roles_data:
        role = db.query(Role).filter(Role.name == role_name).first()
        if not role:
            role = Role(name=role_name)
            db.add(role)
            db.commit()
            db.refresh(role)
        roles[role_name] = role

    admin_user = db.query(User).filter(User.username == "admin").first()
    if not admin_user:
        admin_user = User(
            username="admin",
            email="admin@acequest.local",
            password_hash=get_password_hash("admin"),
            role_id=roles["admin"].id,
            avatar_url="https://api.dicebear.com/7.x/pixel-art/svg?seed=admin",
        )
        db.add(admin_user)
        db.commit()
        db.refresh(admin_user)

    existing_profile = db.query(PlayerProfile).filter(PlayerProfile.user_id == admin_user.id).first()
    if not existing_profile:
        db.add(
            PlayerProfile(
                user_id=admin_user.id,
                total_exp=0,
                level=1,
                coins=50,
                achievement_points=0,
                login_streak=1,
                last_daily_claim=datetime.utcnow().date(),
            )
        )
        db.commit()

    # 2. Seed Default Skins
    skins_data = [
        {"name": "default", "description": "Standard Agent Ragam teal uniform.", "preview_url": "/assets/skins/default.png", "is_default": True},
        {"name": "skin-math-master", "description": "Unlocked by completing Mathematics.", "preview_url": "/assets/skins/math.png", "unlock_condition": "complete_subject_math"},
        {"name": "skin-science-lab", "description": "Unlocked by completing Science.", "preview_url": "/assets/skins/science.png", "unlock_condition": "complete_subject_science"},
        {"name": "skin-history-explorer", "description": "Unlocked by completing History.", "preview_url": "/assets/skins/history.png", "unlock_condition": "complete_subject_history"},
        {"name": "skin-tech-coder", "description": "Unlocked by completing Computer Science.", "preview_url": "/assets/skins/cs.png", "unlock_condition": "complete_subject_cs"},
        {"name": "skin-elite-agent", "description": "Reach Elite Agent level.", "preview_url": "/assets/skins/elite.png", "unlock_condition": "level_5"},
    ]
    for skin_info in skins_data:
        skin = db.query(Skin).filter(Skin.name == skin_info["name"]).first()
        if not skin:
            skin = Skin(**skin_info)
            db.add(skin)
    db.commit()

    badges_data = [
        {"name": "First Mission", "description": "Completed the introductory mission.", "badge_type": "chapter", "condition_key": "complete_chapter_intro"},
        {"name": "Perfect Score", "description": "Completed a chapter with a perfect score.", "badge_type": "achievement", "condition_key": "perfect_score"},
        {"name": "Math Master", "description": "Mastered the Mathematics subject.", "badge_type": "subject", "condition_key": "complete_subject_math"},
        {"name": "Tech Guardian", "description": "Mastered the Computer Science subject.", "badge_type": "subject", "condition_key": "complete_subject_cs"},
    ]
    for badge_info in badges_data:
        badge = db.query(Badge).filter(Badge.name == badge_info["name"]).first()
        if not badge:
            badge = Badge(**badge_info)
            db.add(badge)
    db.commit()

    # 3. Seed Subjects (Mathematics and Computer Science)
    subjects_data = [
        {
            "id": 1,
            "name": "Mathematics",
            "realm_name": "Logic Realm",
            "description": "Master numbers, algebra, and geometry in the clockwork Logic Realm.",
            "icon_url": "/assets/realm-icon-math.png",
        },
        {
            "id": 2,
            "name": "Computer Science",
            "realm_name": "Technology Realm",
            "description": "Decrypt systems, code algorithms, and hack firewalls in the server room tech realm.",
            "icon_url": "/assets/realm-icon-cs.png",
        },
        {
            "id": 3,
            "name": "Geography",
            "realm_name": "Terra Realm",
            "description": "Explore the lost world and restore geographic knowledge before GEO-X erases Earth from memory.",
            "icon_url": "/assets/realm-icon-geography.png",
        },
    ]
    subjects = {}
    for sub_info in subjects_data:
        sub = db.query(Subject).filter(Subject.id == sub_info["id"]).first()
        if not sub:
            sub = Subject(**sub_info)
            db.add(sub)
            db.commit()
            db.refresh(sub)
        subjects[sub_info["name"]] = sub

    # 4. Seed Chapters
    chapters_data = [
        # Math Chapters
        {
            "id": 1,
            "subject_id": 1,
            "chapter_number": 1,
            "title": "Numbers & Arithmetic",
            "description": "Unlock the gates of Logic Realm by solving number patterns and basic fractions.",
            "map_tileset_key": "tileset-logic-realm",
        },
        {
            "id": 2,
            "subject_id": 1,
            "chapter_number": 2,
            "title": "Algebra",
            "description": "Find the missing variables (X and Y) to restore power to the Logic Core.",
            "map_tileset_key": "tileset-logic-realm",
        },
        # CS Chapters
        {
            "id": 3,
            "subject_id": 2,
            "chapter_number": 1,
            "title": "Data Representation",
            "description": "Learn binary, hexadecimal, and text encoding to interface with the mainframes.",
            "map_tileset_key": "tileset-tech-realm",
        },
        {
            "id": 4,
            "subject_id": 2,
            "chapter_number": 2,
            "title": "Algorithm & Programming",
            "description": "Trace code structures, conditional loops, and logic gates to stop the security virus.",
            "map_tileset_key": "tileset-tech-realm",
        },
        # Geography Chapters (Theme 1: People and Environment)
        {
            "id": 5,
            "subject_id": 3,
            "chapter_number": 1,
            "title": "The Population Crisis Zone",
            "description": "Restore population data and understand human geography across the Terra Realm.",
            "map_tileset_key": "tileset-terra-realm",
        },
        {
            "id": 6,
            "subject_id": 3,
            "chapter_number": 2,
            "title": "The Famine Fields",
            "description": "Rescue food production knowledge and restore agricultural systems in Southeast Asia.",
            "map_tileset_key": "tileset-terra-realm",
        },
        {
            "id": 7,
            "subject_id": 3,
            "chapter_number": 3,
            "title": "The Crumbling City",
            "description": "Rebuild urban geography and restore settlement knowledge to chaotic cities.",
            "map_tileset_key": "tileset-terra-realm",
        },
        # Geography Chapters (Theme 2: The Natural Environment)
        {
            "id": 8,
            "subject_id": 3,
            "chapter_number": 4,
            "title": "The Tectonic Grounds",
            "description": "Master plate tectonics, volcanoes, and earthquakes in the shifting Terra Realm.",
            "map_tileset_key": "tileset-terra-realm",
        },
        {
            "id": 9,
            "subject_id": 3,
            "chapter_number": 5,
            "title": "The River & Coast Labyrinth",
            "description": "Navigate rivers and coasts to restore hydrological and coastal knowledge.",
            "map_tileset_key": "tileset-terra-realm",
        },
        {
            "id": 10,
            "subject_id": 3,
            "chapter_number": 6,
            "title": "The Storm & Jungle Frontier",
            "description": "Survive typhoons and protect tropical rainforests from climate destruction.",
            "map_tileset_key": "tileset-terra-realm",
        },
        # Geography Chapters (Theme 3: Economic Development)
        {
            "id": 11,
            "subject_id": 3,
            "chapter_number": 7,
            "title": "The Industrial Wasteland",
            "description": "Restore industrial geography and manage pollution across manufacturing zones.",
            "map_tileset_key": "tileset-terra-realm",
        },
        {
            "id": 12,
            "subject_id": 3,
            "chapter_number": 8,
            "title": "The Energy Fortress",
            "description": "Power up renewable energy and reduce carbon emissions before GEO-X wins.",
            "map_tileset_key": "tileset-terra-realm",
        },
        {
            "id": 13,
            "subject_id": 3,
            "chapter_number": 9,
            "title": "The Tourist Trap",
            "description": "Rescue sustainable tourism and protect Brunei's natural attractions.",
            "map_tileset_key": "tileset-terra-realm",
        },
    ]
    chapters = {}
    for ch_info in chapters_data:
        ch = db.query(Chapter).filter(Chapter.id == ch_info["id"]).first()
        if not ch:
            ch = Chapter(**ch_info)
            db.add(ch)
            db.commit()
            db.refresh(ch)
        chapters[f"{ch.subject_id}_{ch.chapter_number}"] = ch

    # 5. Seed Questions and Answer Options
    questions_data = [
        # Chapter 1: Math - Numbers & Arithmetic
        {
            "chapter_id": 1,
            "question_text": "What is the value of 3/5 + 1/4?",
            "question_type": QuestionTypeEnum.multiple_choice,
            "difficulty": "easy",
            "hint": "Find the common denominator, which is 20.",
            "options": [
                {"option_text": "17/20", "is_correct": True, "display_order": 1},
                {"option_text": "4/9", "is_correct": False, "display_order": 2},
                {"option_text": "3/20", "is_correct": False, "display_order": 3},
                {"option_text": "7/10", "is_correct": False, "display_order": 4},
            ]
        },
        {
            "chapter_id": 1,
            "question_text": "Find the prime factors of 60.",
            "question_type": QuestionTypeEnum.multiple_choice,
            "difficulty": "medium",
            "hint": "Divide 60 continuously by prime numbers: 2, 3, 5...",
            "options": [
                {"option_text": "2, 3, and 5", "is_correct": True, "display_order": 1},
                {"option_text": "2, 4, and 5", "is_correct": False, "display_order": 2},
                {"option_text": "3, 5, and 10", "is_correct": False, "display_order": 3},
                {"option_text": "2, 3, and 10", "is_correct": False, "display_order": 4},
            ]
        },
        {
            "chapter_id": 1,
            "question_text": "Is 97 a prime number?",
            "question_type": QuestionTypeEnum.true_false,
            "difficulty": "easy",
            "hint": "A prime number is only divisible by 1 and itself. Try dividing by 2, 3, 5, 7.",
            "options": [
                {"option_text": "True", "is_correct": True, "display_order": 1},
                {"option_text": "False", "is_correct": False, "display_order": 2},
            ]
        },
        # Chapter 2: Math - Algebra
        {
            "chapter_id": 2,
            "question_text": "Solve the equation for x: 3x + 7 = 22.",
            "question_type": QuestionTypeEnum.short_answer,
            "difficulty": "easy",
            "hint": "Subtract 7 from both sides, then divide by 3.",
            "accepted_answers": ["5", "x=5", "x = 5"]
        },
        {
            "chapter_id": 2,
            "question_text": "Factorise the quadratic expression: x^2 - 5x + 6.",
            "question_type": QuestionTypeEnum.multiple_choice,
            "difficulty": "medium",
            "hint": "Look for two numbers that multiply to 6 and add up to -5.",
            "options": [
                {"option_text": "(x - 2)(x - 3)", "is_correct": True, "display_order": 1},
                {"option_text": "(x + 2)(x + 3)", "is_correct": False, "display_order": 2},
                {"option_text": "(x - 1)(x - 6)", "is_correct": False, "display_order": 3},
                {"option_text": "(x + 1)(x - 6)", "is_correct": False, "display_order": 4},
            ]
        },
        # Chapter 3: CS - Data Representation
        {
            "chapter_id": 3,
            "question_text": "Convert the decimal number 13 into 4-bit binary.",
            "question_type": QuestionTypeEnum.short_answer,
            "difficulty": "easy",
            "hint": "Place values are 8, 4, 2, 1. 13 = 8 + 4 + 1.",
            "accepted_answers": ["1101", "1101₂"]
        },
        {
            "chapter_id": 3,
            "question_text": "Which of the following is the hexadecimal representation of the decimal number 254?",
            "question_type": QuestionTypeEnum.multiple_choice,
            "difficulty": "medium",
            "hint": "Divide 254 by 16. The quotient is 15 (F) and the remainder is 14 (E).",
            "options": [
                {"option_text": "FE", "is_correct": True, "display_order": 1},
                {"option_text": "FF", "is_correct": False, "display_order": 2},
                {"option_text": "EF", "is_correct": False, "display_order": 3},
                {"option_text": "E4", "is_correct": False, "display_order": 4},
            ]
        },
        {
            "chapter_id": 3,
            "question_text": "ASCII encoding uses 7 bits to represent character codes.",
            "question_type": QuestionTypeEnum.true_false,
            "difficulty": "easy",
            "hint": "Standard ASCII represents 128 characters (0 to 127). How many bits does it need?",
            "options": [
                {"option_text": "True", "is_correct": True, "display_order": 1},
                {"option_text": "False", "is_correct": False, "display_order": 2},
            ]
        },
        # Geography Questions - Chapter 1: Population Crisis Zone
        {
            "chapter_id": 5,
            "question_text": "What does HDI stand for?",
            "question_type": QuestionTypeEnum.multiple_choice,
            "difficulty": "easy",
            "hint": "HDI measures development using income, health, and education indicators.",
            "options": [
                {"option_text": "Human Development Index", "is_correct": True, "display_order": 1},
                {"option_text": "Health and Disease Index", "is_correct": False, "display_order": 2},
                {"option_text": "Human Diversity Indicator", "is_correct": False, "display_order": 3},
                {"option_text": "Housing Development Initiative", "is_correct": False, "display_order": 4},
            ]
        },
        {
            "chapter_id": 5,
            "question_text": "Name TWO push factors that cause rural-urban migration.",
            "question_type": QuestionTypeEnum.multiple_choice,
            "difficulty": "medium",
            "hint": "Push factors make people leave rural areas (lack of jobs, poverty, conflict).",
            "options": [
                {"option_text": "Drought and lack of employment", "is_correct": True, "display_order": 1},
                {"option_text": "Good schools and hospitals", "is_correct": False, "display_order": 2},
                {"option_text": "Clean water and modern roads", "is_correct": False, "display_order": 3},
                {"option_text": "Cultural traditions and family ties", "is_correct": False, "display_order": 4},
            ]
        },
        {
            "chapter_id": 5,
            "question_text": "What is one consequence of overpopulation in a city?",
            "question_type": QuestionTypeEnum.multiple_choice,
            "difficulty": "easy",
            "hint": "Think about housing, services, and environment when too many people live in one place.",
            "options": [
                {"option_text": "Increased homelessness and slum formation", "is_correct": True, "display_order": 1},
                {"option_text": "Better quality of life for all", "is_correct": False, "display_order": 2},
                {"option_text": "Reduction in pollution levels", "is_correct": False, "display_order": 3},
                {"option_text": "More job opportunities for everyone", "is_correct": False, "display_order": 4},
            ]
        },
        # Geography Questions - Chapter 2: Famine Fields
        {
            "chapter_id": 6,
            "question_text": "Name TWO physical factors that affect rice farming in Southeast Asia.",
            "question_type": QuestionTypeEnum.multiple_choice,
            "difficulty": "medium",
            "hint": "Think about climate, water, and soil conditions needed for rice growth.",
            "options": [
                {"option_text": "Warm climate and abundant rainfall", "is_correct": True, "display_order": 1},
                {"option_text": "Cold winters and dry seasons", "is_correct": False, "display_order": 2},
                {"option_text": "High altitude mountains", "is_correct": False, "display_order": 3},
                {"option_text": "Desert conditions with irrigation", "is_correct": False, "display_order": 4},
            ]
        },
        {
            "chapter_id": 6,
            "question_text": "What is aquaculture?",
            "question_type": QuestionTypeEnum.multiple_choice,
            "difficulty": "easy",
            "hint": "Aquaculture involves farming fish and other aquatic organisms.",
            "options": [
                {"option_text": "Farming fish and aquatic organisms in controlled environments", "is_correct": True, "display_order": 1},
                {"option_text": "Studying underwater ecosystems only", "is_correct": False, "display_order": 2},
                {"option_text": "Fishing with traditional nets", "is_correct": False, "display_order": 3},
                {"option_text": "Collecting water from the ocean", "is_correct": False, "display_order": 4},
            ]
        },
        {
            "chapter_id": 6,
            "question_text": "Give ONE challenge facing Brunei's fishing industry.",
            "question_type": QuestionTypeEnum.short_answer,
            "difficulty": "medium",
            "hint": "Consider overfishing, climate change, or marine pollution.",
            "accepted_answers": ["overfishing", "declining fish stocks", "marine pollution", "climate change", "depletion of resources"]
        },
        # Geography Questions - Chapter 3: Crumbling City
        {
            "chapter_id": 7,
            "question_text": "What is counter-urbanisation?",
            "question_type": QuestionTypeEnum.multiple_choice,
            "difficulty": "medium",
            "hint": "Counter-urbanisation is the opposite of urbanisation.",
            "options": [
                {"option_text": "Movement of people from cities to rural areas", "is_correct": True, "display_order": 1},
                {"option_text": "Rapid growth of large cities", "is_correct": False, "display_order": 2},
                {"option_text": "Construction of new urban infrastructure", "is_correct": False, "display_order": 3},
                {"option_text": "Government control of cities", "is_correct": False, "display_order": 4},
            ]
        },
        {
            "chapter_id": 7,
            "question_text": "State ONE reason for rural-urban migration.",
            "question_type": QuestionTypeEnum.multiple_choice,
            "difficulty": "easy",
            "hint": "People move to cities for opportunities and better services.",
            "options": [
                {"option_text": "To find better employment opportunities", "is_correct": True, "display_order": 1},
                {"option_text": "To experience extreme weather", "is_correct": False, "display_order": 2},
                {"option_text": "To reduce their access to services", "is_correct": False, "display_order": 3},
                {"option_text": "To escape modern technology", "is_correct": False, "display_order": 4},
            ]
        },
        # Geography Questions - Chapter 4: Tectonic Grounds
        {
            "chapter_id": 8,
            "question_text": "Name the type of plate boundary where two plates move apart.",
            "question_type": QuestionTypeEnum.multiple_choice,
            "difficulty": "easy",
            "hint": "At divergent boundaries, plates are pulled in opposite directions.",
            "options": [
                {"option_text": "Divergent boundary", "is_correct": True, "display_order": 1},
                {"option_text": "Convergent boundary", "is_correct": False, "display_order": 2},
                {"option_text": "Transform boundary", "is_correct": False, "display_order": 3},
                {"option_text": "Collision zone", "is_correct": False, "display_order": 4},
            ]
        },
        {
            "chapter_id": 8,
            "question_text": "What scale is used to measure the magnitude of an earthquake?",
            "question_type": QuestionTypeEnum.multiple_choice,
            "difficulty": "easy",
            "hint": "The Richter Scale measures the energy released by earthquakes.",
            "options": [
                {"option_text": "Richter Scale", "is_correct": True, "display_order": 1},
                {"option_text": "Beaufort Scale", "is_correct": False, "display_order": 2},
                {"option_text": "Fujita Scale", "is_correct": False, "display_order": 3},
                {"option_text": "Mohs Scale", "is_correct": False, "display_order": 4},
            ]
        },
        {
            "chapter_id": 8,
            "question_text": "State ONE positive impact of volcanic activity.",
            "question_type": QuestionTypeEnum.multiple_choice,
            "difficulty": "medium",
            "hint": "Volcanoes create fertile soil and new landforms.",
            "options": [
                {"option_text": "Volcanic ash and lava create fertile soil for farming", "is_correct": True, "display_order": 1},
                {"option_text": "Reduces population growth", "is_correct": False, "display_order": 2},
                {"option_text": "Destroys all ecosystems permanently", "is_correct": False, "display_order": 3},
                {"option_text": "Eliminates the need for geology studies", "is_correct": False, "display_order": 4},
            ]
        },
        # Geography Questions - Chapter 5: River & Coast Labyrinth
        {
            "chapter_id": 9,
            "question_text": "What process forms an oxbow lake?",
            "question_type": QuestionTypeEnum.multiple_choice,
            "difficulty": "medium",
            "hint": "Oxbow lakes form when a meander in a river is cut off.",
            "options": [
                {"option_text": "River meanders are cut off by erosion and deposition", "is_correct": True, "display_order": 1},
                {"option_text": "Heavy rainfall creates new lakes", "is_correct": False, "display_order": 2},
                {"option_text": "Tectonic activity splits the riverbed", "is_correct": False, "display_order": 3},
                {"option_text": "Human-built dams always form oxbow lakes", "is_correct": False, "display_order": 4},
            ]
        },
        {
            "chapter_id": 9,
            "question_text": "Name TWO processes of coastal erosion.",
            "question_type": QuestionTypeEnum.multiple_choice,
            "difficulty": "medium",
            "hint": "Think about how waves, weather, and water wear away rocks.",
            "options": [
                {"option_text": "Hydraulic action and attrition", "is_correct": True, "display_order": 1},
                {"option_text": "Deposition and sediment accumulation", "is_correct": False, "display_order": 2},
                {"option_text": "Plant growth and biological processes", "is_correct": False, "display_order": 3},
                {"option_text": "Tectonic plate movements", "is_correct": False, "display_order": 4},
            ]
        },
        {
            "chapter_id": 9,
            "question_text": "State ONE human cause of river flooding.",
            "question_type": QuestionTypeEnum.multiple_choice,
            "difficulty": "easy",
            "hint": "Human activities like deforestation or urbanisation increase flooding.",
            "options": [
                {"option_text": "Deforestation reduces water absorption by soil", "is_correct": True, "display_order": 1},
                {"option_text": "Planting more forests increases flooding", "is_correct": False, "display_order": 2},
                {"option_text": "Building more dams always prevents flooding", "is_correct": False, "display_order": 3},
                {"option_text": "Rivers never flood in developed countries", "is_correct": False, "display_order": 4},
            ]
        },
        # Geography Questions - Chapter 6: Storm & Jungle Frontier
        {
            "chapter_id": 10,
            "question_text": "State TWO conditions needed for a typhoon to form.",
            "question_type": QuestionTypeEnum.multiple_choice,
            "difficulty": "medium",
            "hint": "Typhoons need warm water, low pressure, and specific latitude conditions.",
            "options": [
                {"option_text": "Warm tropical ocean water and low atmospheric pressure", "is_correct": True, "display_order": 1},
                {"option_text": "Cold water and high pressure systems", "is_correct": False, "display_order": 2},
                {"option_text": "Desert conditions and extreme heat", "is_correct": False, "display_order": 3},
                {"option_text": "Polar ice and frozen atmospheres", "is_correct": False, "display_order": 4},
            ]
        },
        {
            "chapter_id": 10,
            "question_text": "What is biological weathering? Give ONE example.",
            "question_type": QuestionTypeEnum.multiple_choice,
            "difficulty": "medium",
            "hint": "Biological weathering is caused by living organisms breaking down rocks.",
            "options": [
                {"option_text": "Plant roots breaking through rock surfaces", "is_correct": True, "display_order": 1},
                {"option_text": "Water freezing and expanding in cracks", "is_correct": False, "display_order": 2},
                {"option_text": "Rainwater dissolving limestone", "is_correct": False, "display_order": 3},
                {"option_text": "Temperature changes causing rock expansion", "is_correct": False, "display_order": 4},
            ]
        },
        {
            "chapter_id": 10,
            "question_text": "Name TWO causes of deforestation.",
            "question_type": QuestionTypeEnum.multiple_choice,
            "difficulty": "easy",
            "hint": "People cut down forests for timber, agriculture, and development.",
            "options": [
                {"option_text": "Logging and agricultural expansion", "is_correct": True, "display_order": 1},
                {"option_text": "Tree growth and forest expansion", "is_correct": False, "display_order": 2},
                {"option_text": "Increased rainfall patterns", "is_correct": False, "display_order": 3},
                {"option_text": "Protected wildlife reserves", "is_correct": False, "display_order": 4},
            ]
        },
        # Geography Questions - Chapter 7: Industrial Wasteland
        {
            "chapter_id": 11,
            "question_text": "Name the FOUR sectors of industry.",
            "question_type": QuestionTypeEnum.multiple_choice,
            "difficulty": "medium",
            "hint": "Primary (extraction), Secondary (manufacturing), Tertiary (services), Quaternary (information).",
            "options": [
                {"option_text": "Primary, Secondary, Tertiary, and Quaternary", "is_correct": True, "display_order": 1},
                {"option_text": "Mining, Farming, Trading, and Banking", "is_correct": False, "display_order": 2},
                {"option_text": "Public, Private, Government, and Commercial", "is_correct": False, "display_order": 3},
                {"option_text": "Domestic, International, Industrial, and Service", "is_correct": False, "display_order": 4},
            ]
        },
        {
            "chapter_id": 11,
            "question_text": "State ONE factor that affects the location of a factory.",
            "question_type": QuestionTypeEnum.multiple_choice,
            "difficulty": "easy",
            "hint": "Factories need access to raw materials, labour, transport, and markets.",
            "options": [
                {"option_text": "Proximity to raw materials and transport links", "is_correct": True, "display_order": 1},
                {"option_text": "Proximity to mountains only", "is_correct": False, "display_order": 2},
                {"option_text": "Located far from cities to avoid people", "is_correct": False, "display_order": 3},
                {"option_text": "Always in deserts and remote areas", "is_correct": False, "display_order": 4},
            ]
        },
        {
            "chapter_id": 11,
            "question_text": "What is acid rain and how is it formed?",
            "question_type": QuestionTypeEnum.multiple_choice,
            "difficulty": "medium",
            "hint": "Acid rain forms when sulfur dioxide and nitrogen oxides mix with water in the atmosphere.",
            "options": [
                {"option_text": "Rain containing sulfuric and nitric acids from industrial pollution", "is_correct": True, "display_order": 1},
                {"option_text": "Normal rainwater that tastes acidic", "is_correct": False, "display_order": 2},
                {"option_text": "Only occurs in deserts", "is_correct": False, "display_order": 3},
                {"option_text": "A natural phenomenon that cannot be prevented", "is_correct": False, "display_order": 4},
            ]
        },
        # Geography Questions - Chapter 8: Energy Fortress
        {
            "chapter_id": 12,
            "question_text": "Name TWO renewable energy sources.",
            "question_type": QuestionTypeEnum.multiple_choice,
            "difficulty": "easy",
            "hint": "Renewable energy comes from natural sources that can be replenished.",
            "options": [
                {"option_text": "Solar and wind energy", "is_correct": True, "display_order": 1},
                {"option_text": "Coal and natural gas", "is_correct": False, "display_order": 2},
                {"option_text": "Nuclear and oil", "is_correct": False, "display_order": 3},
                {"option_text": "Diesel and petroleum", "is_correct": False, "display_order": 4},
            ]
        },
        {
            "chapter_id": 12,
            "question_text": "What gas is mainly responsible for the enhanced greenhouse effect?",
            "question_type": QuestionTypeEnum.multiple_choice,
            "difficulty": "easy",
            "hint": "CO₂ (carbon dioxide) is the primary greenhouse gas from human activities.",
            "options": [
                {"option_text": "Carbon dioxide (CO₂)", "is_correct": True, "display_order": 1},
                {"option_text": "Oxygen (O₂)", "is_correct": False, "display_order": 2},
                {"option_text": "Nitrogen (N₂)", "is_correct": False, "display_order": 3},
                {"option_text": "Helium (He)", "is_correct": False, "display_order": 4},
            ]
        },
        {
            "chapter_id": 12,
            "question_text": "State ONE advantage of solar energy.",
            "question_type": QuestionTypeEnum.multiple_choice,
            "difficulty": "easy",
            "hint": "Solar energy is renewable, clean, and abundant.",
            "options": [
                {"option_text": "It is renewable and produces no greenhouse gas emissions", "is_correct": True, "display_order": 1},
                {"option_text": "It works equally well in darkness", "is_correct": False, "display_order": 2},
                {"option_text": "It produces toxic waste", "is_correct": False, "display_order": 3},
                {"option_text": "It depletes natural resources", "is_correct": False, "display_order": 4},
            ]
        },
        # Geography Questions - Chapter 9: Tourist Trap
        {
            "chapter_id": 13,
            "question_text": "What is overtourism?",
            "question_type": QuestionTypeEnum.multiple_choice,
            "difficulty": "medium",
            "hint": "Overtourism occurs when too many tourists visit a location.",
            "options": [
                {"option_text": "Excessive tourism that damages the environment and local culture", "is_correct": True, "display_order": 1},
                {"option_text": "A type of adventure tourism", "is_correct": False, "display_order": 2},
                {"option_text": "Tourism that happens in winter only", "is_correct": False, "display_order": 3},
                {"option_text": "A tourism strategy that benefits everyone equally", "is_correct": False, "display_order": 4},
            ]
        },
        {
            "chapter_id": 13,
            "question_text": "Name ONE sustainable tourism practice.",
            "question_type": QuestionTypeEnum.multiple_choice,
            "difficulty": "easy",
            "hint": "Sustainable tourism minimizes environmental and cultural damage.",
            "options": [
                {"option_text": "Eco-lodges that use renewable energy and local staff", "is_correct": True, "display_order": 1},
                {"option_text": "Mass hotel development in natural areas", "is_correct": False, "display_order": 2},
                {"option_text": "Unlimited extraction of natural resources", "is_correct": False, "display_order": 3},
                {"option_text": "Ignoring local cultural customs and traditions", "is_correct": False, "display_order": 4},
            ]
        },
        {
            "chapter_id": 13,
            "question_text": "What makes Brunei a unique tourism destination?",
            "question_type": QuestionTypeEnum.multiple_choice,
            "difficulty": "medium",
            "hint": "Brunei has rainforests, oil wealth, and unique culture.",
            "options": [
                {"option_text": "Pristine rainforests, Islamic heritage, and oil-funded development", "is_correct": True, "display_order": 1},
                {"option_text": "Mountain ski resorts and arctic conditions", "is_correct": False, "display_order": 2},
                {"option_text": "Desert landscapes and ancient ruins", "is_correct": False, "display_order": 3},
                {"option_text": "Industrial manufacturing zones", "is_correct": False, "display_order": 4},
            ]
        },
    ]

    for q_info in questions_data:
        # Check if question text exists in this chapter
        exist_q = db.query(Question).filter(
            Question.chapter_id == q_info["chapter_id"],
            Question.question_text == q_info["question_text"]
        ).first()

        if not exist_q:
            new_q = Question(
                chapter_id=q_info["chapter_id"],
                question_text=q_info["question_text"],
                question_type=q_info["question_type"],
                difficulty=q_info["difficulty"],
                hint=q_info.get("hint"),
            )
            db.add(new_q)
            db.commit()
            db.refresh(new_q)

            if "options" in q_info:
                for opt in q_info["options"]:
                    option = AnswerOption(
                        question_id=new_q.id,
                        option_text=opt["option_text"],
                        is_correct=opt["is_correct"],
                        display_order=opt["display_order"]
                    )
                    db.add(option)

            if "accepted_answers" in q_info:
                for ans_text in q_info["accepted_answers"]:
                    ans = AcceptedAnswer(
                        question_id=new_q.id,
                        answer_text=ans_text
                    )
                    db.add(ans)

            db.commit()

    # 6. Seed NPCs and Dialogues
    npcs_data = [
        # Chapter 1 Math NPCs
        {
            "id": 1,
            "name": "Commander Sarah",
            "npc_type": "mission_giver",
            "sprite_key": "npc-commander",
            "chapter_id": 1,
            "dialogues": [
                {"trigger_condition": "on_approach", "dialogue_text": "Welcome to the field, Agent Ragam. The Forgetter has corrupted the Logic Realm! We need your analytical skills immediately.", "display_order": 1},
                {"trigger_condition": "on_approach", "dialogue_text": "Go speak with Dr. Amina to get a hint, and then tackle the Arithmetic gate to proceed.", "display_order": 2},
            ]
        },
        {
            "id": 2,
            "name": "Dr. Amina",
            "npc_type": "hint",
            "sprite_key": "npc-hint-lady",
            "chapter_id": 1,
            "dialogues": [
                {"trigger_condition": "on_approach", "dialogue_text": "Hello Agent. If you are struggling with fractions, always find the lowest common multiple for the denominators first!", "display_order": 1},
            ]
        },
        # Chapter 2 Math NPCs (Guardian Boss)
        {
            "id": 3,
            "name": "Guardian Algebra X",
            "npc_type": "guardian",
            "sprite_key": "guardian-algebra",
            "chapter_id": 2,
            "dialogues": [
                {"trigger_condition": "pre_question", "dialogue_text": "HALT! I am the variable guardian. You cannot restore the Logic Core unless you solve my equations!", "display_order": 1},
                {"trigger_condition": "post_correct", "dialogue_text": "Argh! You solved for X! My equations are broken!", "display_order": 1},
                {"trigger_condition": "post_wrong", "dialogue_text": "Incorrect! The unknown variable remains hidden, and you weaken!", "display_order": 1},
            ]
        },
        # Technology Realm Chapter 1 - Data Representation
        {
            "id": 24,
            "name": "Analyst Mira",
            "npc_type": "mission_giver",
            "sprite_key": "npc-scientist",
            "chapter_id": 3,
            "dialogues": [
                {"trigger_condition": "on_approach", "dialogue_text": "The Technology Realm's archives are unreadable. GEO-X has scrambled the binary, hexadecimal, and text codes that every system depends on.", "display_order": 1},
                {"trigger_condition": "on_approach", "dialogue_text": "Decode the data blocks and restore the message pathways before the mainframes lose their memory for good.", "display_order": 2},
            ]
        },
        # Technology Realm Chapter 2 - Algorithm & Programming
        {
            "id": 25,
            "name": "Engineer Kai",
            "npc_type": "mission_giver",
            "sprite_key": "npc-commander",
            "chapter_id": 4,
            "dialogues": [
                {"trigger_condition": "on_approach", "dialogue_text": "The security virus has broken every program into tangled instructions. Conditions and loops are now sending the system in circles.", "display_order": 1},
                {"trigger_condition": "on_approach", "dialogue_text": "Trace each algorithm carefully, repair the logic gates, and rebuild the code path that can stop the virus.", "display_order": 2},
            ]
        },
        # Geography Chapter 1 NPCs - Population Crisis Zone
        {
            "id": 4,
            "name": "Mayor Harith",
            "npc_type": "mission_giver",
            "sprite_key": "npc-mayor",
            "chapter_id": 5,
            "dialogues": [
                {"trigger_condition": "on_approach", "dialogue_text": "Agent Ragam! Welcome to the Population Crisis Zone. GEO-X has deleted all our demographic data!", "display_order": 1},
                {"trigger_condition": "on_approach", "dialogue_text": "We need to restore population knowledge before our cities collapse from the chaos!", "display_order": 2},
            ]
        },
        {
            "id": 5,
            "name": "Dr. Siti",
            "npc_type": "hint",
            "sprite_key": "npc-scientist",
            "chapter_id": 5,
            "dialogues": [
                {"trigger_condition": "on_approach", "dialogue_text": "Population growth depends on birth rate and death rate. When birth rate is high but death rate is low, the population grows fast!", "display_order": 1},
            ]
        },
        {
            "id": 6,
            "name": "Census Phantom",
            "npc_type": "guardian",
            "sprite_key": "boss-census",
            "chapter_id": 5,
            "dialogues": [
                {"trigger_condition": "pre_question", "dialogue_text": "I am GEO-X's servant! I have erased every number, every name, every life from the record. Without data, populations don't exist!", "display_order": 1},
                {"trigger_condition": "post_correct", "dialogue_text": "No! The data is being restored! My scrolls are filling with numbers again!", "display_order": 1},
            ]
        },
        # Geography Chapter 2 NPCs - Famine Fields
        {
            "id": 7,
            "name": "Farmer Haji Daud",
            "npc_type": "mission_giver",
            "sprite_key": "npc-farmer",
            "chapter_id": 6,
            "dialogues": [
                {"trigger_condition": "on_approach", "dialogue_text": "Agent, the Famine Fields are dying! GEO-X has taken away all knowledge of rice farming and food production!", "display_order": 1},
                {"trigger_condition": "on_approach", "dialogue_text": "Help us restore agricultural wisdom before the crops wither away forever!", "display_order": 2},
            ]
        },
        {
            "id": 8,
            "name": "Fisher Minah",
            "npc_type": "hint",
            "sprite_key": "npc-fisher",
            "chapter_id": 6,
            "dialogues": [
                {"trigger_condition": "on_approach", "dialogue_text": "Rice needs warm, wet soil and a long growing season. Think about where in Southeast Asia these conditions are found!", "display_order": 1},
            ]
        },
        {
            "id": 9,
            "name": "Hunger Titan",
            "npc_type": "guardian",
            "sprite_key": "boss-hunger",
            "chapter_id": 6,
            "dialogues": [
                {"trigger_condition": "pre_question", "dialogue_text": "I have eaten every harvest! I have dried every river! Without food knowledge, your world will starve!", "display_order": 1},
                {"trigger_condition": "post_correct", "dialogue_text": "The rain is returning! The fields are turning green again! I cannot hold back the abundance!", "display_order": 1},
            ]
        },
        # Geography Chapter 3 NPCs - Crumbling City
        {
            "id": 10,
            "name": "City Planner Azri",
            "npc_type": "mission_giver",
            "sprite_key": "npc-planner",
            "chapter_id": 7,
            "dialogues": [
                {"trigger_condition": "on_approach", "dialogue_text": "The city is in chaos! Roads connect nowhere, factories are in residential zones, and the slums are expanding!", "display_order": 1},
                {"trigger_condition": "on_approach", "dialogue_text": "We must restore urban planning knowledge to rebuild the order of the city!", "display_order": 2},
            ]
        },
        {
            "id": 11,
            "name": "Urban Colossus",
            "npc_type": "guardian",
            "sprite_key": "boss-urban",
            "chapter_id": 7,
            "dialogues": [
                {"trigger_condition": "pre_question", "dialogue_text": "Cities are CHAOS. Urban growth is DESTRUCTION. No settlement plan survives me!", "display_order": 1},
                {"trigger_condition": "post_correct", "dialogue_text": "My structure is breaking down! The city blocks are organizing themselves! No!", "display_order": 1},
            ]
        },
        # Geography Chapter 4 NPCs - Tectonic Grounds
        {
            "id": 12,
            "name": "Dr. Tectonica",
            "npc_type": "mission_giver",
            "sprite_key": "npc-geologist",
            "chapter_id": 8,
            "dialogues": [
                {"trigger_condition": "on_approach", "dialogue_text": "Agent, the plates are moving wildly! GEO-X has severed the knowledge of plate tectonics itself!", "display_order": 1},
                {"trigger_condition": "on_approach", "dialogue_text": "Volcanoes erupt without warning. Earthquakes strike without preparation. We need geological order restored!", "display_order": 2},
            ]
        },
        {
            "id": 13,
            "name": "Quake Lord",
            "npc_type": "guardian",
            "sprite_key": "boss-quake",
            "chapter_id": 8,
            "dialogues": [
                {"trigger_condition": "pre_question", "dialogue_text": "The earth obeys no one. Plates move, mountains rise, cities fall. GEO-X showed me humans are helpless against my fury!", "display_order": 1},
                {"trigger_condition": "post_correct", "dialogue_text": "The plates are aligning! My power is fading! The knowledge is sealing me away!", "display_order": 1},
            ]
        },
        # Geography Chapter 5 NPCs - River & Coast Labyrinth
        {
            "id": 14,
            "name": "River Guide Alia",
            "npc_type": "mission_giver",
            "sprite_key": "npc-guide",
            "chapter_id": 9,
            "dialogues": [
                {"trigger_condition": "on_approach", "dialogue_text": "The water systems are broken! Rivers flow the wrong way and coastlines have lost their identity!", "display_order": 1},
                {"trigger_condition": "on_approach", "dialogue_text": "Help me restore hydrological knowledge before a great flood destroys everything!", "display_order": 2},
            ]
        },
        {
            "id": 15,
            "name": "Flood Serpent",
            "npc_type": "guardian",
            "sprite_key": "boss-flood",
            "chapter_id": 9,
            "dialogues": [
                {"trigger_condition": "pre_question", "dialogue_text": "Rivers flow backwards. Coasts collapse into nothing. GEO-X has unwritten every hydrological law!", "display_order": 1},
                {"trigger_condition": "post_correct", "dialogue_text": "The river flows true again! The coasts are forming correctly! My dominion ends!", "display_order": 1},
            ]
        },
        # Geography Chapter 6 NPCs - Storm & Jungle Frontier
        {
            "id": 16,
            "name": "Climate Scientist Noor",
            "npc_type": "mission_giver",
            "sprite_key": "npc-scientist-2",
            "chapter_id": 10,
            "dialogues": [
                {"trigger_condition": "on_approach", "dialogue_text": "A typhoon is forming! The climate systems are corrupted and the rainforest is vanishing!", "display_order": 1},
                {"trigger_condition": "on_approach", "dialogue_text": "We must restore climate knowledge and save the forest before it's too late!", "display_order": 2},
            ]
        },
        {
            "id": 17,
            "name": "Typhoon Wraith",
            "npc_type": "guardian",
            "sprite_key": "boss-typhoon",
            "chapter_id": 10,
            "dialogues": [
                {"trigger_condition": "pre_question", "dialogue_text": "The climate is mine now. Typhoons answer to me. Forests fall at my command. GEO-X promised me a world without memory!", "display_order": 1},
                {"trigger_condition": "post_correct", "dialogue_text": "The storm is dissipating! The forest is growing back! Knowledge is defeating me!", "display_order": 1},
            ]
        },
        # Geography Chapter 7 NPCs - Industrial Wasteland
        {
            "id": 18,
            "name": "Factory Boss Hassan",
            "npc_type": "mission_giver",
            "sprite_key": "npc-factory-boss",
            "chapter_id": 11,
            "dialogues": [
                {"trigger_condition": "on_approach", "dialogue_text": "Factories are in the wrong places and workers don't know their sectors! The industrial knowledge is shattered!", "display_order": 1},
                {"trigger_condition": "on_approach", "dialogue_text": "Help us restore industrial order before the pollution destroys everything around us!", "display_order": 2},
            ]
        },
        {
            "id": 19,
            "name": "Smog Baron",
            "npc_type": "guardian",
            "sprite_key": "boss-smog",
            "chapter_id": 11,
            "dialogues": [
                {"trigger_condition": "pre_question", "dialogue_text": "Industry without knowledge is beautiful chaos! Every factory in the wrong place! Every river poisoned! Progress!", "display_order": 1},
                {"trigger_condition": "post_correct", "dialogue_text": "The smoke is clearing! The factories are organizing! The pollution is retreating!", "display_order": 1},
            ]
        },
        # Geography Chapter 8 NPCs - Energy Fortress
        {
            "id": 20,
            "name": "Energy Director Nabil",
            "npc_type": "mission_giver",
            "sprite_key": "npc-director",
            "chapter_id": 12,
            "dialogues": [
                {"trigger_condition": "on_approach", "dialogue_text": "The power is out! Energy knowledge is deleted and carbon emissions are skyrocketing!", "display_order": 1},
                {"trigger_condition": "on_approach", "dialogue_text": "We must power up renewable energy and reduce our carbon footprint before the world burns!", "display_order": 2},
            ]
        },
        {
            "id": 21,
            "name": "Carbon Colossus",
            "npc_type": "guardian",
            "sprite_key": "boss-carbon",
            "chapter_id": 12,
            "dialogues": [
                {"trigger_condition": "pre_question", "dialogue_text": "Fossil fuels are forever! Carbon fills the sky! GEO-X promised a world so warm all knowledge melts away!", "display_order": 1},
                {"trigger_condition": "post_correct", "dialogue_text": "Solar energy! Wind power! The fossil fuels are cooling! My reign is ending!", "display_order": 1},
            ]
        },
        # Geography Chapter 9 NPCs - Tourist Trap
        {
            "id": 22,
            "name": "Tourism Director",
            "npc_type": "mission_giver",
            "sprite_key": "npc-tourism",
            "chapter_id": 13,
            "dialogues": [
                {"trigger_condition": "on_approach", "dialogue_text": "Overtourism has destroyed our paradise! Beaches are trashed and Brunei's attractions are under threat!", "display_order": 1},
                {"trigger_condition": "on_approach", "dialogue_text": "Help us implement sustainable tourism practices to save our natural and cultural heritage!", "display_order": 2},
            ]
        },
        {
            "id": 23,
            "name": "Overcrowding Phantom",
            "npc_type": "guardian",
            "sprite_key": "boss-crowd",
            "chapter_id": 13,
            "dialogues": [
                {"trigger_condition": "pre_question", "dialogue_text": "Mass tourism brings chaos! Culture is commodified! Nature is trampled! This is GEO-X's plan!", "display_order": 1},
                {"trigger_condition": "post_correct", "dialogue_text": "Eco-lodges are appearing! Locals are smiling again! Sustainable practices are defeating me!", "display_order": 1},
            ]
        },
    ]

    for npc_info in npcs_data:
        exist_npc = db.query(NPC).filter(NPC.id == npc_info["id"]).first()
        if not exist_npc:
            new_npc = NPC(
                id=npc_info["id"],
                name=npc_info["name"],
                npc_type=npc_info["npc_type"],
                sprite_key=npc_info["sprite_key"],
                chapter_id=npc_info["chapter_id"]
            )
            db.add(new_npc)
            db.commit()
            db.refresh(new_npc)

            for diag in npc_info["dialogues"]:
                dialogue = Dialogue(
                    npc_id=new_npc.id,
                    trigger_condition=diag["trigger_condition"],
                    dialogue_text=diag["dialogue_text"],
                    display_order=diag["display_order"]
                )
                db.add(dialogue)
            db.commit()

    print("Database seeding completed successfully!")
