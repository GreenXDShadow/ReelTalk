import random
from datetime import datetime, timedelta
from api import app
from extensions import db
from models import User, Movie, Transaction, Rating, Comment

# --- Data Source ---

# EXACT usernames and images as requested
USERS_DATA = [
    {"username": "Snoopy", "image": "https://i.pinimg.com/474x/e7/81/dd/e781dd9c8be51d8225948f15b5b2555d.jpg"},
    {"username": "Kirby", "image": "https://wallpapers-clan.com/wp-content/uploads/2022/09/kirby-pfp-6.jpg"},
    {"username": "Woodstock", "image": "https://i.pinimg.com/564x/8a/d8/b0/8ad8b04761820d25c110cf36ec84e226.jpg"},
    {"username": "Untitled Goose",
     "image": "https://pbs.twimg.com/profile_images/1181802667628212225/-2XbH9yn_400x400.jpg"},
    {"username": "Alex",
     "image": "https://ih1.redbubble.net/image.1520300156.5173/flat,750x,075,f-pad,750x1000,f8f8f8.jpg"},
    {"username": "Chief", "image": "https://i.redd.it/wg5qzdwze9m71.jpg"},
    {"username": "Avery Johnson",
     "image": "https://static.wikia.nocookie.net/halo/images/1/17/SSgt_Avery_Johnson%2C_UNSC_Marine_Corps.JPG/revision/latest?cb=20150411074609"},
    {"username": "Senna",
     "image": "https://img.redbull.com/images/c_limit,w_1500,h_1000/f_auto,q_auto/redbullcom/2014/04/28/1331647894650_2/ayrton-senna-1991"},
    {"username": "Ash Ketchup",
     "image": "https://wallpapers.com/images/thumbnail/ash-ketchum-pokemon-profile-7g3vddx1ma1rs3ay.webp"},
    {"username": "MrMeow", "image": "https://i.pinimg.com/236x/3d/ec/95/3dec9505b88a9c600582f5f19657cd81.jpg"},
    {"username": "AnonymouseCapybara",
     "image": "https://www.rainforest-alliance.org/wp-content/uploads/2021/06/capybara-square-1.jpg.optimal.jpg"},
    {"username": "Toshihiro Mibe",
     "image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTWPNW4GUPTBIcozT4SFVcnFCKa8CUj-pzr2g&s"},
    {"username": "NotAnAI",
     "image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR920SEZIp3hdXRDmVZxixaKvZijYF0bJboTg&s"},
    {"username": "Laufey",
     "image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRF0wu_cKMTM8R8wW6DzvEr-_uOVvqs0JjU0g&s"},
    {"username": "Parkilimer",
     "image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQn8bCs5fnTrW42cPlLySqFdafLbryRtRCPIw&s"},
]

MOVIES_DATA = [
    {
        "title": "Zootopia 2",
        "image_link": "https://www.cinematerial.com/media/box-office/26443597.jpg",
        "release_date": "2025-01-26",
        "description": "Judy Hopps and Nick Wilde return to crack a new case that tests their partnership and leads them into unexpected parts of the mammal metropolis.",
        "rental_price": 5.99, "purchase_price": 24.99
    },
    {
        "title": "Wicked: For Good",
        "image_link": "https://www.cinematerial.com/media/box-office/19847976.jpg",
        "release_date": "2025-01-21",
        "description": "The second chapter of the Wicked saga, exploring the destiny of Elphaba and Glinda as they face the Wizard and change Oz forever.",
        "rental_price": 5.99, "purchase_price": 24.99
    },
    {
        "title": "Now You See Me: Now You Dont",
        "image_link": "https://www.cinematerial.com/media/box-office/4712810.jpg",
        "release_date": "2025-01-14",
        "description": "The Four Horsemen return for their most impossible heist yet, introducing a new generation of magicians to the world of illusion.",
        "rental_price": 4.99, "purchase_price": 19.99
    },
    {
        "title": "Predator: Badlands",
        "image_link": "https://www.cinematerial.com/media/box-office/31227572.jpg",
        "release_date": "2025-01-07",
        "description": "Set in the future, a new Predator hunt begins on a distant world, challenging humanity's survival instincts like never before.",
        "rental_price": 5.99, "purchase_price": 24.99
    },
    {
        "title": "The Running Man",
        "image_link": "https://www.cinematerial.com/media/box-office/14107334.jpg",
        "release_date": "2025-01-22",
        "description": "In a dystopian 2025, a man must participate in a deadly reality show where he is hunted by professional killers to save his family.",
        "rental_price": 4.99, "purchase_price": 19.99
    },
    {
        "title": "A Minecraft Movie",
        "image_link": "https://cdn.cinematerial.com/p/297x/vdi4tpf9/a-minecraft-movie-movie-poster-md.jpg?v=1741066497",
        "release_date": "2025-01-04",
        "description": "Four misfits are pulled through a mysterious portal into the Overworld, a bizarre, cubic wonderland that thrives on imagination.",
        "rental_price": 4.99, "purchase_price": 19.99
    },
    {
        "title": "F1: The Movie",
        "image_link": "https://cdn.cinematerial.com/p/297x/l94wgadr/f1-the-movie-movie-poster-md.jpg?v=1748905004",
        "release_date": "2025-01-27",
        "description": "A retired Formula 1 driver comes out of retirement to mentor a younger driver and take a final stab at glory on the track.",
        "rental_price": 5.99, "purchase_price": 24.99
    },
    {
        "title": "How to Train Your Dragon",
        "image_link": "https://cdn.cinematerial.com/p/297x/s9fjcmfo/how-to-train-your-dragon-movie-poster-md.jpg?v=1739366731",
        "release_date": "2025-01-13",
        "description": "A live-action reimagining of the tale of Hiccup, a young Viking who befriends a dragon named Toothless, changing their worlds forever.",
        "rental_price": 4.99, "purchase_price": 19.99
    },
    {
        "title": "Dracula: A Love Tale",
        "image_link": "https://cdn.cinematerial.com/p/297x/0w4rmyru/dracula-a-love-tale-french-movie-poster-md.jpg?v=1749141076",
        "release_date": "2025-01-25",
        "description": "Luc Besson's romantic and gothic retelling of the classic vampire myth, focusing on Dracula's eternal search for his reincarnated wife.",
        "rental_price": 3.99, "purchase_price": 14.99
    },
    {
        "title": "Mission: Impossible - The Final Reckoning",
        "image_link": "https://cdn.cinematerial.com/p/297x/mfglvqlo/mission-impossible-the-final-reckoning-movie-poster-md.jpg?v=1747862253",
        "release_date": "2025-01-23",
        "description": "Ethan Hunt and his IMF team embark on their most dangerous mission yet to track down a terrifying new weapon that threatens all of humanity.",
        "rental_price": 5.99, "purchase_price": 24.99
    },
    {
        "title": "Demon Slayer: Infinity Castle",
        "image_link": "https://cdn.cinematerial.com/p/297x/gbytp3gv/gekijo-ban-kimetsu-no-yaiba-mugen-jo-hen-japanese-movie-poster-md.jpg?v=1746664401",
        "release_date": "2025-01-01",
        "description": "Tanjiro and the Hashira invade the Infinity Castle for the final, epic confrontation against Muzan Kibutsuji and the Upper Moons.",
        "rental_price": 4.99, "purchase_price": 19.99
    },
    {
        "title": "Sinners",
        "image_link": "https://www.cinematerial.com/movies/sinners-i31193180",
        "release_date": "2025-01-18",
        "description": "Twin brothers return to their hometown in the 1930s Jim Crow South, only to discover that something even more terrifying is waiting for them.",
        "rental_price": 4.99, "purchase_price": 19.99
    },
    {
        "title": "Jurassic World Rebirth",
        "image_link": "https://www.cinematerial.com/movies/jurassic-world-rebirth-i31036941",
        "release_date": "2025-01-02",
        "description": "A team races to secure DNA from the last three massive dinosaurs left on the planet, unlocking a secret that could save humanity.",
        "rental_price": 5.99, "purchase_price": 24.99
    },
    {
        "title": "Mickey 17",
        "image_link": "https://cdn.cinematerial.com/p/297x/utx2cwih/mickey-17-movie-poster-md.jpg?v=1737562314",
        "release_date": "2025-01-28",
        "description": "Mickey 17 is an 'expendable', a disposable employee on a human expedition to colonize the ice world Niflheim, who refuses to let his clone take his place.",
        "rental_price": 4.99, "purchase_price": 19.99
    },
    {
        "title": "Superman",
        "image_link": "https://cdn.cinematerial.com/p/297x/uswr97ps/superman-movie-poster-md.jpg?v=1752526133",
        "release_date": "2025-01-11",
        "description": "Clark Kent reconciles his Kryptonian heritage with his human upbringing as the embodiment of truth, justice, and the American way.",
        "rental_price": 5.99, "purchase_price": 24.99
    }
]


# --- Helper Functions ---

def get_comment_text(username, movie_title):
    # Mapping comments directly to the specific Username
    comments_map = {
        "Snoopy": [
            f"Woof! Loved {movie_title}!", "Bark bark! (Translation: Good movie)",
            "I fell asleep on my doghouse watching this.", "Needs more flying aces.",
            "My owner liked this one."
        ],
        "Kirby": [
            "Poyo!", "Poyo poyo!", "Delicious visuals!", "I inhaled the popcorn.", "Poyo..."
        ],
        "Woodstock": [
            "||| ||| ||", "|||| | |||!", "!!!", "Chirp chirp.", "|| |||"
        ],
        "Untitled Goose": [
            "HONK!", "*Steals the projector*", "Honk honk.", "I caused chaos in the theater.", "Messy plot."
        ],
        "Alex": [
            "Not enough cubes.", "Crafting recipe for this movie: 5 stars.",
            "Better than the Nether.", "Steve would like this.", "The graphics were too round."
        ],
        "Chief": [
            "Objective complete: Watched movie.", "I need a weapon.", "Cortana would enjoy this.",
            "Finishing the fight.", "Good tactical visuals."
        ],
        "Avery Johnson": [
            "Oorah!", "I know what the ladies like!", "Send me out with a bang!",
            "This movie is what we fight for!", "Double time, marines!"
        ],
        "Senna": [
            "Fast paced.", "Driven.", "Pole position quality.", "A bit slow in the corners.",
            "Pure focus."
        ],
        "Ash Ketchup": [
            f"I choose you, {movie_title}!", "Pika!", "Team Rocket would hate this.",
            "Gotta watch 'em all!", "It was super effective!"
        ],
        "MrMeow": [
            "Meow.", "Purr...", "Hissed at the villain.", "Knocked my drink over.", "Slept through half of it."
        ],
        "AnonymouseCapybara": [
            "Okay I pull up.", "Very chill vibes.", "Hanging out.", "Nice water scenes.", "Relaxing."
        ],
        "Toshihiro Mibe": [
            "The engine of this film is strong.", "Efficient storytelling.", "Synergy.",
            "Powered by dreams.", "We can learn from this performance."
        ],
        "NotAnAI": [
            "My processors processed this efficiently.", "I am definitely a human enjoying this.",
            "Beep boop-- I mean, haha.", "Human emotions are fascinating.", "Logic error in act 3."
        ],
        "Laufey": [
            "So romantic...", "Like the movies.", "Beautiful harmony.", "Jazz hands!", "Made me want to sing."
        ],
        "Parkilimer": [
            "Hello everybody!", "This was crazy!", "I would play this if it was a game.",
            "Intense!", "Big brain moments here."
        ]
    }

    # Default fallback just in case, but all users are covered above
    generic_comments = ["Great movie!", "Cool effects.", "Interesting plot.", "Would watch again.", "Five stars!"]

    return random.choice(comments_map.get(username, generic_comments))


def init_db():
    with app.app_context():
        # 1. Reset Database
        print("Dropping old database tables...")
        db.drop_all()
        print("Creating new tables...")
        db.create_all()

        # 2. Create Users
        print("Creating Users...")
        users_objs = []
        for u_data in USERS_DATA:
            user = User(
                username=u_data["username"],
                password=u_data["username"],  # Password same as username
                image_link=u_data["image"],
                date_account_created=datetime.utcnow() - timedelta(days=random.randint(1, 365))
            )
            db.session.add(user)
            users_objs.append(user)

        db.session.commit()

        # 3. Create Movies
        print("Creating Movies...")
        movies_objs = []
        for m_data in MOVIES_DATA:
            # Convert string date to object
            r_date = datetime.strptime(m_data["release_date"], '%Y-%m-%d').date()
            movie = Movie(
                title=m_data["title"],
                description=m_data["description"],
                release_date=r_date,
                rental_price=m_data["rental_price"],
                purchase_price=m_data["purchase_price"],
                image_link=m_data["image_link"]
            )
            db.session.add(movie)
            movies_objs.append(movie)

        db.session.commit()

        # 4. Generate Content (Ratings, Comments, Transactions)
        print("Generating Ratings, Comments, and Transactions...")

        # Reload objects to ensure IDs are bound
        all_users = User.query.all()
        all_movies = Movie.query.all()

        for user in all_users:

            # Each user interacts with EVERY movie (15 movies * 15 users = 225 ratings/comments)
            for movie in all_movies:
                # Create Rating
                rating = Rating(
                    user_id=user.id,
                    movie_id=movie.id,
                    rating_score=random.randint(3, 5),  # Generally positive reviews
                    date_posted=datetime.utcnow() - timedelta(days=random.randint(0, 30))
                )
                db.session.add(rating)

                # Create Comment
                # Pass USERNAME directly to the helper function
                comment_text = get_comment_text(user.username, movie.title)

                comment = Comment(
                    user_id=user.id,
                    movie_id=movie.id,
                    comment_content=comment_text,
                    date_created=datetime.utcnow() - timedelta(days=random.randint(0, 30))
                )
                db.session.add(comment)

            # Create 1 or 2 Transactions per user (ensuring > 15 total transactions)
            # Pick 1 random movie to 'own' or 'rent'
            target_movie = random.choice(all_movies)
            trans_type = random.choice(['rent', 'buy'])
            transaction = Transaction(
                user_id=user.id,
                movie_id=target_movie.id,
                transaction_type=trans_type,
                date_start=datetime.utcnow()
            )
            db.session.add(transaction)

        db.session.commit()
        print("Database populated successfully!")
        print(f"Users: {len(all_users)}")
        print(f"Movies: {len(all_movies)}")
        print(f"Ratings/Comments: {len(all_users) * len(all_movies)} (Target: 225)")


if __name__ == "__main__":
    init_db()