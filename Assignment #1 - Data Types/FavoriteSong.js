/**
 * Homework #1 - Data Types
 *
 * The favorite song object can be utilized to showcase your favorite song
 *
 */

/**
 *
 * @param {string} title Song Title
 * @param {string} artist Song Artist
 * @param {string} genre Song Genre
 * @param {number} duration Song Duration in Seconds
 * @param {string} published Date in MM D, YYYY Format
 * @param {boolean} explicit Whether or not the song is explicit
 * @param {array} featuredArtists Array of additional artists showcased in the song
 */
function FavoriteSong(title, artist, genre, duration, published, isExplicit, featuredArtists) {
    this.title = title;
    this.artist = artist;
    this.genre = genre;
    this.duration = duration;
    this.published = published;
    this.isExplicit = isExplicit;
    this.featuredArtists = featuredArtists;

    this.discussSong = () => {
        console.log("My favorite song is by: " + this.artist + " and " + this.features() + ". The song is in the " + this.genre + " genre.");
        console.log("The song is called '" + this.title + "' and was originally published on " + this.published + ". It lasts " + this.duration + " seconds.");
        console.log(this.explicit())
    }

    this.features = () => {
        return (this.featuredArtists.length > 0 ? "features the following artists: " + this.featuredArtists.join(", and ") : "has no featured artists");
    }

    this.explicit = () => {
        return (this.isExplicit ? "This song is explicit, so you should not let children listen to it." : "This song is not explicit, so let everyone listen!");
    }
}

let numb = new FavoriteSong("Numb", "August Alsina", "Alternative R&B", 252, "December 2, 2013", true, ["B.o.B.", "Yo Gotti"]);
numb.discussSong();