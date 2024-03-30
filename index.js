// const express = require('express');
import fetch from "node-fetch";
import express from "express";

const app = express();

const baseUrl = "https://kisskh.co";

// JSON parsing middleware
app.use(express.json());


app.get("/", (req, res) => {
    res.send(`
      <h1>KissKH API</h1>
      <p>Popular Anime: <a href="/api/popular">/api/popular</a></p>
      <p>Latest Anime: <a href="/api/latest">/api/latest</a></p>
      <p>Anime Detail: <a href="/api/detail/{id}">/api/detail/{id}</a></p>
      <p>Episode List: <a href="/api/episodes/{id}">/api/episodes/{id}</a></p>
      <p>Video List: <a href="/api/videos/{id}">/api/videos/{id}</a></p>
    `);
  });
  
// Popular Anime
app.get("/api/:word", async (req, res) => {
  const page = req.query.page || 1;
  const type = req.query.type || 0;
  const sub = req.query.sub || 0;
  const country = req.query.country || 0;
  const status = req.query.status || 0;
  const order =
    req.query.order || req.params.word == "popular"
      ? 1
      : req.params.word == "latest"
      ? 2
      : 3;
  const url = `${baseUrl}/api/DramaList/List?page=${page}&type=${type}&sub=${sub}&country=${country}&status=${status}&order=${order}&pageSize=40`;
  const response = await fetch(url);
  const data = await response.json();
  res.json(data);
});

// Anime Details
app.get("/api/detail/:id", async (req, res) => {
  const id = req.params.id;
  const url = `${baseUrl}/api/DramaList/Drama/${id}?isq=false`;
  const response = await fetch(url);
  const data = await response.json();
  res.json(data);
});

// Episode List
app.get("/api/episodes/:id", async (req, res) => {
  const id = req.params.id;
  const url = `${baseUrl}/api/DramaList/Drama/${id}?isq=false`;
  const response = await fetch(url);
  const data = await response.json();
  const episodes = data.episodes.map((episode) => {
    return {
      id: episode.id,
      episode_number: episode.number,
      name: episode.name,
      url: `${baseUrl}/api/DramaList/Episode/${episode.id}.png?err=false&ts=&time=`,
    };
  });
  res.json(episodes);
});

// Video List
app.get("/api/videos/:id", async (req, res) => {
  const id = req.params.id;
  const url = `${baseUrl}/api/DramaList/Episode/${id}.png?err=false&ts=&time=`;
  const response = await fetch(url);
  const data = await response.json();
  const videos = data.Video.map((video) => {
    return {
      url: video,
      referer: "https://kisskh.me/",
      origin: "https://kisskh.me/",
    };
  });
  res.json(videos);
});

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
