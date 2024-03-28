require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const path = require('path');
const SpotifyWebApi = require('spotify-web-api-node');
const app = express();

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(__dirname + '/public'));

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
});

spotifyApi
  .clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body['access_token']))
  .catch(error => console.log('Something went wrong when retrieving an access token', error));


// pages view

app.get('/', (req,res) => {
    res.render('index', {title: "homepage", bgPage: "homePage"})
})

app.get('/artistSearch', (req, res) => {
    const artistQuery = req.query.q;

    spotifyApi.searchArtists(artistQuery)
            .then(data => {
                console.log('The received data from the API: ', data.body.artists.items[0]);
                res.render('artistSearch', {artists: data.body.artists.items, title: "search", bgPage: "search-results"});
            })
    .catch(err => console.log(err));
});

app.get('/albums/:id' ,(req,res) => {
    const artistId = req.params.id

    spotifyApi.getArtistAlbums(artistId)
        .then((data) => {
            res.render('albums', {artistAlbums: data.body.items, title: "albums", bgPage: "albums-artist"})
        })
    .catch(err => console.log(err));
})

app.get('/tracks/:id', (req,res) => {
    const artistTracks = req.params.id

    spotifyApi.getAlbumTracks(artistTracks)
        .then(data => {
            console.log(data.body.items)
            res.render('tracks', {artistPreviewTracks: data.body.items, title: "traks", bgPage: "artistTraks"})
        })
    .catch(err => console.log(err))
})

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));