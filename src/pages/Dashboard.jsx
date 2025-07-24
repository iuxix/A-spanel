import React, { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged, updateProfile, signOut } from "firebase/auth";
import { db } from "../firebase";
import {
  collection, addDoc, onSnapshot, doc, query, where, serverTimestamp
} from "firebase/firestore";
import {
  FaWallet, FaUser, FaChartLine, FaMoneyCheckAlt, FaEllipsisV, FaCogs,
  FaUserCircle, FaHistory, FaWhatsapp, FaMoon, FaSun, FaPowerOff
} from "react-icons/fa";
import AddFundsModal from "./components/AddFundsModal.jsx"; // <-- IMPORTING THE NEW COMPONENT

const categories = [
    { value: "special-offers", label: "⭐ Special Offers & Deals" },
    { value: "ig-followers-guaranteed", label: "💎 Instagram Followers [Guaranteed]" },
    { value: "ig-followers-cheap", label: "➡ Instagram Followers [No-Guarantee]" },
    { value: "ig-likes", label: "❤️ Instagram Likes" },
    { value: "ig-views-reels", label: "👁️‍🗨️ Instagram Views / Reels" },
    { value: "ig-engagement", label: "💬 Instagram Comments / Engagement" },
    { value: "threads-services", label: "✍️ Threads Services (New!)" },
    { value: "telegram-members", label: "✈️ Telegram Members" },
    { value: "telegram-engagement", label: "✈️ Telegram Views & Reactions" },
    { value: "youtube-views", label: "🔴 YouTube Views" },
    { value: "youtube-engagement", label: "📈 YouTube Likes, Subs & Comments" },
    { value: "facebook-services", label: "👍 Facebook Page & Post Services" },
    { value: "tiktok-services", label: "🎵 TikTok Services" },
    { value: "twitter-x-services", label: "✖️ Twitter (X) Services" },
    { value: "other-platforms", label: "🌐 Other Platforms (Spotify, Discord, etc.)" },
];

const services = {
    "special-offers": [
        { id: "9999", title: "Instagram Followers [🔥 High Quality | 100k/Day] (Price: ₹66.0/1k)", badge: "SALE", badgeColor: "#f44336", desc: "Speed: 100k/Day\nDrop: 1-5%\nRefill: 30 Days", avgtime: "1 hour", min: 500, max: 5000000, price: 66.0 },
        { id: "8888", title: "Instagram Likes [⚡ Instant Delivery | Real] (Price: ₹14.4/1k)", badge: "⚡FAST", badgeColor: "#ffc107", desc: "Quality: Real Likes\nSpeed: Super Fast\nStart: Instant", avgtime: "5 minutes", min: 100, max: 100000, price: 14.4 },
        { id: "7777", title: "YouTube Views [High Retention | Monetizable] (Price: ₹176.0/1k)", badge: "YT DEAL", badgeColor: "#e53935", desc: "Retention: 60-80%\nSpeed: 10k/Day\nMonetizable", avgtime: "6 hours", min: 1000, max: 1000000, price: 176.0 },
        { id: "6666", title: "Telegram Members [✈️ Non Drop | Real Looking] (Price: ₹112.0/1k)", badge: "TELEGRAM DEAL", badgeColor: "#1e88e5", desc: "Quality: Real-looking profiles\nSpeed: 20k/Day", avgtime: "1 hour", min: 500, max: 100000, price: 112.0 },
        { id: "5555", title: "TikTok Views [Super Fast | Viral Boost] (Price: ₹1.20/1k)", badge: "TIKTOK DEAL", badgeColor: "#25F4EE", desc: "Speed: 1M/Day\nStart: Instant\nHelps to go viral!", avgtime: "5 minutes", min: 1000, max: 10000000, price: 1.20 },
        { id: "4444", title: "Instagram Story Views (Price: ₹0.64/1k)", badge: "STORY DEAL", badgeColor: "#00bcd4", desc: "Service: Story Views\nNote: Link must be to your profile", avgtime: "30 minutes", min: 100, max: 50000, price: 0.64 },
        { id: "3333", title: "Instagram Reel Views [Cheapest & Superfast] (Price: ₹0.06/1k)", badge: "REEL DEAL", badgeColor: "#03a9f4", desc: "Speed: 500k/Day\nWorks on all links", avgtime: "10 minutes", min: 100, max: 10000000, price: 0.06 }
    ],
    "ig-followers-guaranteed": [
        { id: "10571", title: "Instagram Followers [Old Accounts | 365 Days Refill] (Price: ₹72.9/1k)", badge: "STABLE", badgeColor: "#4caf50", desc: "Quality: Old Accounts With Posts\nRefill: 365 Days Guarantee ♻️", avgtime: "3 hours", min: 100, max: 1000000, price: 72.9 },
        { id: "11569", title: "Instagram Followers [Old Accounts w/ 15 Posts | Stable] (Price: ₹66.07/1k)", badge: "HQ", badgeColor: "#673ab7", desc: "Quality: 100% Old Accounts With 15 Posts\nRefill: 365 Days Guarantee ♻️\nSpeed: 40k/Day", avgtime: "2 hours", min: 100, max: 2000000, price: 66.07 },
        { id: "11571", title: "Instagram Followers [Good Service | 365 Days Refill] (Price: ₹50.45/1k)", badge: "RELIABLE", badgeColor: "#00bcd4", desc: "Quality: 100% Old Accounts With 8 Posts\nDrop: 0-5% | 50k/Day", avgtime: "4 hours", min: 500, max: 50000, price: 50.45 },
        { id: "1001", title: "Instagram Followers [👑 Premium Quality | Lifetime Refill] (Price: ₹89.4/1k)", badge: "PREMIUM", badgeColor: "#e91e63", desc: "Quality: Top Tier Accounts\nRefill: Lifetime Guarantee ♻️", avgtime: "2 hours", min: 100, max: 1000000, price: 89.4 },
        { id: "1003", title: "Instagram Followers [🇮🇳 Indian Accounts | 30 Days Refill] (Price: ₹108.0/1k)", badge: "INDIAN", badgeColor: "#ff9800", desc: "Quality: Indian Profiles\nRefill: 30 Days Guarantee", avgtime: "4 hours", min: 500, max: 50000, price: 108.0 },
        { id: "1004", title: "Instagram Followers [👩 Female | Real Looking] (Price: ₹120.0/1k)", badge: "FEMALE", badgeColor: "#E91E63", desc: "Quality: Female-looking profiles\nRefill: 30 Days", avgtime: "6 hours", min: 100, max: 20000, price: 120.0 },
        { id: "1005", title: "Instagram Followers [Organic Drip Feed | Slow] (Price: ₹76.8/1k)", badge: "DRIP", badgeColor: "#3F51B5", desc: "Speed: 100-500/Day (Organic Look)\nRefill: 60 Days", avgtime: "1-2 days", min: 100, max: 10000, price: 76.8 }
    ],
    "ig-followers-cheap": [
        { id: "11570", title: "Instagram Followers [Indian Organic | No-Refill] (Price: ₹51.0/1k)", badge: "NO-REFILL", badgeColor: "#9e9e9e", desc: "Quality: Indian Organic Accounts With Story & Bio\nDrop: Can be high\nRefill: No Guarantee ❌", avgtime: "30 minutes", min: 1000, max: 10000000, price: 51.0 },
        { id: "11582", title: "Instagram Followers [ULTRA FAST | No-Refill] (Price: ₹43.89/1k)", badge: "⚡FAST", badgeColor: "#ff5722", desc: "Quality: Mixed/Bot Accounts\nSpeed: 300k/500k Day\nRefill: No Guarantee ❌", avgtime: "15 minutes", min: 1000, max: 20000000, price: 43.89 },
        { id: "2001", title: "Instagram Followers [Cheapest Bot Service] (Price: ₹21.0/1k)", badge: "BOT", badgeColor: "#607d8b", desc: "Quality: Bot Accounts\nRefill: No Guarantee ❌\nFor numbers only", avgtime: "10 minutes", min: 1000, max: 50000000, price: 21.0 },
        { id: "2002", title: "Instagram Followers [Mixed Quality | 1M/Day] (Price: ₹33.6/1k)", badge: "MIXED", badgeColor: "#795548", desc: "Quality: Mixed Bot/Real-looking\nSpeed: 1M/Day\nRefill: No Guarantee ❌", avgtime: "20 minutes", min: 500, max: 10000000, price: 33.6 },
        { id: "2003", title: "Instagram Followers [Arabic Profiles | No-Refill] (Price: ₹54.0/1k)", badge: "ARABIC", badgeColor: "#009688", desc: "Quality: Arabic-looking profiles\nRefill: No Guarantee ❌", avgtime: "1 hour", min: 100, max: 50000, price: 54.0 },
        { id: "2004", title: "Instagram Followers [Turkish Profiles | No-Refill] (Price: ₹54.0/1k)", badge: "TURKISH", badgeColor: "#009688", desc: "Quality: Turkish-looking profiles\nRefill: No Guarantee ❌", avgtime: "1 hour", min: 100, max: 50000, price: 54.0 },
        { id: "2005", title: "Instagram Followers [Brazilian Profiles | No-Refill] (Price: ₹57.0/1k)", badge: "BRAZIL", badgeColor: "#4caf50", desc: "Quality: Brazilian-looking profiles\nRefill: No Guarantee ❌", avgtime: "1 hour", min: 100, max: 50000, price: 57.0 }
    ],
    "ig-likes": [
        { id: "701", title: "Instagram Power Likes [⚡ 10K/Hour | Super Active] (Price: ₹53.6/1k)", badge: "POWER", badgeColor: "#e91e63", desc: "Quality: Likes from 5k-100k follower accounts\nStart: 0-10 Mins\nRefill: 30 Days", avgtime: "6 minutes", min: 20, max: 70000, price: 53.6 },
        { id: "1152", title: "Instagram Likes [❤️ Real Likes | Auto-Refill] (Price: ₹14.42/1k)", badge: "REAL", badgeColor: "#f44336", desc: "Quality: Real users + Reach + Impressions\nRefill: 30 Days Auto-Refill\nSpeed: 5K/Hour", avgtime: "10 minutes", min: 10, max: 300000, price: 14.42 },
        { id: "3002", title: "Instagram Likes [⚡ Super Fast | Mixed Quality] (Price: ₹9.6/1k)", badge: "FAST", badgeColor: "#ff9800", desc: "Quality: Mixed\nSpeed: Instant Start", avgtime: "5 minutes", min: 100, max: 200000, price: 9.6 },
        { id: "3003", title: "Instagram Likes [🇮🇳 Indian Likes] (Price: ₹22.4/1k)", badge: "INDIAN", badgeColor: "#4caf50", desc: "Quality: Indian users\nStart: 0-15 Mins", avgtime: "15 minutes", min: 50, max: 50000, price: 22.4 },
        { id: "3004", title: "Instagram Likes [Saves Included] (Price: ₹17.6/1k)", badge: "LIKES+SAVES", badgeColor: "#2196f3", desc: "Likes and Saves together to boost your post.", avgtime: "10 minutes", min: 100, max: 100000, price: 17.6 },
        { id: "3005", title: "Instagram Likes [Drip Feed | Slow & Steady] (Price: ₹22.4/1k)", badge: "DRIP", badgeColor: "#3f51b5", desc: "Deliver likes slowly over time for an organic look.", avgtime: "1 hour", min: 100, max: 20000, price: 22.4 },
        { id: "3006", title: "Instagram Reel Likes (Price: ₹12.0/1k)", badge: "REEL LIKES", badgeColor: "#00acc1", desc: "Likes specifically for your Instagram Reels.", avgtime: "10 minutes", min: 100, max: 100000, price: 12.0 }
    ],
    "ig-views-reels": [
        { id: "11572", title: "Instagram Reel Views [Emergency Working Update] (Price: ₹0.08/1k)", badge: "REELS", badgeColor: "#2196f3", desc: "Service: Reel Views\nStart: Instant\nSpeed: 10M/Day", avgtime: "15 minutes", min: 100, max: 10000000, price: 0.08 },
        { id: "11566", title: "Instagram Reel Views [Cheapest & Superfast] (Price: ₹0.06/1k)", badge: "⚡FAST", badgeColor: "#03a9f4", desc: "Speed: 500k/Day\nWorks on all links", avgtime: "10 minutes", min: 100, max: 10000000, price: 0.06 },
        { id: "4002", title: "Instagram Story Views (Price: ₹0.64/1k)", badge: "STORY", badgeColor: "#00bcd4", desc: "Service: Story Views\nNote: Link must be to your profile", avgtime: "30 minutes", min: 100, max: 50000, price: 0.64 },
        { id: "4003", title: "Instagram IGTV Views (Price: ₹0.80/1k)", badge: "IGTV", badgeColor: "#00acc1", desc: "Service: IGTV Video Views\nStart: Instant", avgtime: "20 minutes", min: 100, max: 10000000, price: 0.80 },
        { id: "4004", title: "Instagram Live Video Views [30 Mins] (Price: ₹96.0/1k)", badge: "LIVE", badgeColor: "#f44336", desc: "Concurrent viewers for your live stream for 30 minutes.", avgtime: "0-5 minutes", min: 100, max: 10000, price: 96.0 },
        { id: "4005", title: "Instagram Reel Views + Impressions (Price: ₹0.96/1k)", badge: "VIEWS+", badgeColor: "#009688", desc: "Views with added Reach and Impressions stats.", avgtime: "20 minutes", min: 100, max: 5000000, price: 0.96 },
        { id: "4006", title: "Instagram Profile Visits (Price: ₹1.6/1k)", badge: "VISITS", badgeColor: "#795548", desc: "Sends visits to your profile page.", avgtime: "30 minutes", min: 100, max: 100000, price: 1.6 }
    ],
    "ig-engagement": [
        { id: "7001", title: "Instagram Comments [💬 Custom | You provide] (Price: ₹192.0/1k)", badge: "CUSTOM", badgeColor: "#8e44ad", desc: "You provide the list of comments.\nQuality: Real-looking profiles.", avgtime: "1 hour", min: 10, max: 10000, price: 192.0 },
        { id: "7002", title: "Instagram Comments [✅ English | Random Positive] (Price: ₹128.0/1k)", badge: "RANDOM", badgeColor: "#9b59b6", desc: "Comments will be random and positive, related to your post.", avgtime: "1 hour", min: 10, max: 10000, price: 128.0 },
        { id: "7003", title: "Instagram Saves [Must-have for Algorithm] (Price: ₹32.0/1k)", badge: "SAVES", badgeColor: "#2ecc71", desc: "Boosts your post in the algorithm.\nStart: Instant", avgtime: "20 minutes", min: 100, max: 500000, price: 32.0 },
        { id: "7004", title: "Instagram Mentions [User Followers] (Price: ₹96.0/1k)", badge: "MENTIONS", badgeColor: "#3498db", desc: "Mention users who follow a specific account (e.g., your competitor).", avgtime: "2-4 hours", min: 1000, max: 1000000, price: 96.0 },
        { id: "7005", title: "Instagram Poll Votes (Price: ₹64.0/1k)", badge: "POLL", badgeColor: "#e67e22", desc: "Get votes on your story polls.", avgtime: "30 minutes", min: 100, max: 100000, price: 64.0 },
        { id: "7006", title: "Instagram Auto-Likes [30 Days Subscription] (Price: ₹1600.0/sub)", badge: "AUTO", badgeColor: "#c0392b", desc: "Automatically get likes on your future posts for 30 days.", avgtime: "Subscription", min: 1, max: 1, price: 1600.0 },
        { id: "7007", title: "Instagram DMs [Send to Target Audience] (Price: ₹320.0/1k)", badge: "DMs", badgeColor: "#1abc9c", desc: "Send a custom message to followers of a target account.", avgtime: "24 hours", min: 1000, max: 10000, price: 320.0 }
    ],
    "threads-services": [
        { id: "12001", title: "Threads Followers (Price: ₹128.0/1k)", badge: "FOLLOWERS", badgeColor: "#141414", desc: "Get followers on your new Threads profile.", avgtime: "2 hours", min: 100, max: 50000, price: 128.0 },
        { id: "12002", title: "Threads Likes (Price: ₹64.0/1k)", badge: "LIKES", badgeColor: "#333333", desc: "Likes for your Threads posts.", avgtime: "30 minutes", min: 100, max: 20000, price: 64.0 },
        { id: "12003", title: "Threads Reposts (Price: ₹96.0/1k)", badge: "REPOSTS", badgeColor: "#555555", desc: "Get your threads reposted by other users.", avgtime: "1 hour", min: 100, max: 10000, price: 96.0 },
        { id: "12004", title: "Threads Comments [Random Positive] (Price: ₹160.0/1k)", badge: "COMMENTS", badgeColor: "#777777", desc: "Random positive comments on your threads.", avgtime: "2 hours", min: 20, max: 1000, price: 160.0 },
        { id: "12005", title: "Threads Profile Clicks (Price: ₹32.0/1k)", badge: "CLICKS", badgeColor: "#999999", desc: "Drives traffic to your Threads profile.", avgtime: "1 hour", min: 100, max: 50000, price: 32.0 },
        { id: "12006", title: "Threads Views (Price: ₹1.6/1k)", badge: "VIEWS", badgeColor: "#1e1e1e", desc: "Views for your Threads videos.", avgtime: "15 minutes", min: 1000, max: 1000000, price: 1.6 },
        { id: "12007", title: "Threads All-in-One [Follows, Likes, Reposts] (Price: ₹256.0/1k)", badge: "PACK", badgeColor: "#000000", desc: "A package of followers, likes, and reposts.", avgtime: "3 hours", min: 100, max: 10000, price: 256.0 }
    ],
    "telegram-members": [
        { id: "8001", title: "Telegram Channel Members [✈️ Non Drop | Real Looking] (Price: ₹120.0/1k)", badge: "NON-DROP", badgeColor: "#3498db", desc: "Quality: Real-looking profiles\nSpeed: 20k/Day", avgtime: "1 hour", min: 500, max: 100000, price: 120.0 },
        { id: "8004", title: "Telegram Channel Members [🇮🇳 Indian] (Price: ₹160.0/1k)", badge: "INDIAN", badgeColor: "#f1c40f", desc: "Adds Indian members to your channel.", avgtime: "3 hours", min: 200, max: 20000, price: 160.0 },
        { id: "8101", title: "Telegram Group Members [Fast & Cheap] (Price: ₹96.0/1k)", badge: "GROUP", badgeColor: "#2ecc71", desc: "Members specifically for groups (not channels).", avgtime: "1 hour", min: 500, max: 100000, price: 96.0 },
        { id: "8102", title: "Telegram Members [Crypto/NFT Audience] (Price: ₹240.0/1k)", badge: "CRYPTO", badgeColor: "#e67e22", desc: "Adds members interested in Crypto and NFTs.", avgtime: "6 hours", min: 500, max: 25000, price: 240.0 },
        { id: "8103", title: "Telegram Members [👩 Female Profiles] (Price: ₹200.0/1k)", badge: "FEMALE", badgeColor: "#e91e63", desc: "Adds female-looking profiles to your channel/group.", avgtime: "4 hours", min: 200, max: 10000, price: 200.0 },
        { id: "8104", title: "Telegram Members [Slow Drip Feed] (Price: ₹144.0/1k)", badge: "DRIP", badgeColor: "#9b59b6", desc: "Adds members slowly over several days for an organic look.", avgtime: "1-3 days", min: 100, max: 10000, price: 144.0 },
        { id: "8105", title: "Telegram Members [VIP High Quality] (Price: ₹280.0/1k)", badge: "VIP", badgeColor: "#c0392b", desc: "Highest quality members with profile pictures and activity.", avgtime: "6 hours", min: 100, max: 5000, price: 280.0 }
    ],
    "telegram-engagement": [
        { id: "8002", title: "Telegram Post Views [Last 10 Posts] (Price: ₹6.4/1k)", badge: "VIEWS", badgeColor: "#5dade2", desc: "Views on your last 10 posts instantly.\nSpeed: Ultra Fast", avgtime: "5 minutes", min: 1000, max: 500000, price: 6.4 },
        { id: "8007", title: "Telegram Last Post Views (Price: ₹0.32/1k)", badge: "LAST POST", badgeColor: "#1abc9c", desc: "Get views only on your most recent post.", avgtime: "5 minutes", min: 100, max: 1000000, price: 0.32 },
        { id: "8003", title: "Telegram Reactions [Random Positive] (Price: ₹9.6/1k)", badge: "REACTIONS", badgeColor: "#e74c3c", desc: "Adds random positive reactions (👍, 🔥, ❤️, etc.) to your post.", avgtime: "15 minutes", min: 100, max: 100000, price: 9.6 },
        { id: "8201", title: "Telegram Reactions [Custom | e.g. ❤️] (Price: ₹12.0/1k)", badge: "CUSTOM", badgeColor: "#f39c12", desc: "You choose the specific emoji for the reaction.", avgtime: "20 minutes", min: 100, max: 100000, price: 12.0 },
        { id: "8005", title: "Telegram Auto Views [30 Days] (Price: ₹1920.0/sub)", badge: "AUTO", badgeColor: "#9b59b6", desc: "Automatically get views on all new posts for 30 days.", avgtime: "Subscription", min: 1, max: 1, price: 1920.0 },
        { id: "8006", title: "Telegram Poll Votes (Price: ₹64.0/1k)", badge: "POLL", badgeColor: "#34495e", desc: "Get votes on your Telegram polls.", avgtime: "1 hour", min: 100, max: 50000, price: 64.0 },
        { id: "8202", title: "Telegram Comments/Replies (Price: ₹400.0/1k)", badge: "COMMENTS", badgeColor: "#2c3e50", desc: "Get comments or replies in your discussion group.", avgtime: "2 hours", min: 10, max: 1000, price: 400.0 }
    ],
    "youtube-views": [
        { id: "5002", title: "YouTube Views [High Retention] (Price: ₹200.0/1k)", badge: "HQ VIEWS", badgeColor: "#d32f2f", desc: "Retention: 60-80%\nSpeed: 10k/Day\nMonetizable", avgtime: "6 hours", min: 1000, max: 1000000, price: 200.0 },
        { id: "5101", title: "YouTube Views [⚡ Super Fast | Normal Retention] (Price: ₹96.0/1k)", badge: "FAST VIEWS", badgeColor: "#e64a19", desc: "Retention: 1-5 Mins\nSpeed: 100k/Day\nGood for ranking", avgtime: "1 hour", min: 1000, max: 5000000, price: 96.0 },
        { id: "5102", title: "YouTube Views [🇮🇳 Indian Audience] (Price: ₹224.0/1k)", badge: "INDIAN", badgeColor: "#f57c00", desc: "Get views from an Indian audience.", avgtime: "12 hours", min: 1000, max: 100000, price: 224.0 },
        { id: "5103", title: "YouTube Live Stream Views [30 Mins] (Price: ₹128.0/1k)", badge: "LIVE", badgeColor: "#c2185b", desc: "Concurrent viewers for your live stream for 30 minutes.", avgtime: "0-10 minutes", min: 100, max: 5000, price: 128.0 },
        { id: "5104", title: "YouTube Shorts Views (Price: ₹64.0/1k)", badge: "SHORTS", badgeColor: "#ff3d00", desc: "Views specifically for your YouTube Shorts.", avgtime: "30 minutes", min: 1000, max: 2000000, price: 64.0 },
        { id: "5105", title: "YouTube Adwords Views [Targeted] (Price: ₹640.0/1k)", badge: "ADWORDS", badgeColor: "#afb42b", desc: "Real views via Google Ads. 100% genuine.", avgtime: "24-48 hours", min: 5000, max: 100000, price: 640.0 },
        { id: "5106", title: "YouTube Views [Slow & Steady | Organic] (Price: ₹192.0/1k)", badge: "DRIP", badgeColor: "#7b1fa2", desc: "Views delivered slowly over several days for a natural look.", avgtime: "1-3 days", min: 1000, max: 50000, price: 192.0 }
    ],
    "youtube-engagement": [
        { id: "5001", title: "YouTube Subscribers [🔴 Non-Drop | Real] (Price: ₹768.0/1k)", badge: "YT-SUBS", badgeColor: "#e53935", desc: "Quality: Real Subscribers\nRefill: Lifetime Guarantee", avgtime: "24 hours", min: 100, max: 10000, price: 768.0 },
        { id: "5003", title: "YouTube Watch Hours [🕒 4000 Hours Pack] (Price: ₹1152.0/pack)", badge: "WATCH TIME", badgeColor: "#c62828", desc: "Requirement: 1 Hour+ long video.\nHelps in monetization.", avgtime: "3-7 Days", min: 1, max: 1, price: 1152.0 },
        { id: "5201", title: "YouTube Likes (Price: ₹160.0/1k)", badge: "LIKES", badgeColor: "#ff1744", desc: "Likes for your YouTube videos.", avgtime: "1 hour", min: 100, max: 10000, price: 160.0 },
        { id: "5202", title: "YouTube Comments [Random Positive] (Price: ₹640.0/1k)", badge: "COMMENTS", badgeColor: "#d50000", desc: "Random positive comments in English.", avgtime: "3 hours", min: 10, max: 1000, price: 640.0 },
        { id: "5203", title: "YouTube Dislikes (Price: ₹160.0/1k)", badge: "DISLIKES", badgeColor: "#a0a0a0", desc: "Dislikes for a specific YouTube video.", avgtime: "1 hour", min: 100, max: 10000, price: 160.0 },
        { id: "5204", title: "YouTube Shares [Social Media] (Price: ₹320.0/1k)", badge: "SHARES", badgeColor: "#7b1fa2", desc: "Shares your video on various social media platforms.", avgtime: "24 hours", min: 100, max: 5000, price: 320.0 },
        { id: "5205", title: "YouTube Favourites (Price: ₹128.0/1k)", badge: "FAVOURITES", badgeColor: "#5e35b1", desc: "Adds your video to users' favourite lists.", avgtime: "6 hours", min: 100, max: 10000, price: 128.0 }
    ],
    "facebook-services": [
        { id: "6001", title: "Facebook Page Likes [👍 HQ Profiles] (Price: ₹192.0/1k)", badge: "PAGE LIKES", badgeColor: "#3b5998", desc: "Get likes on your Facebook page.\nQuality: High Quality Profiles", avgtime: "12 hours", min: 100, max: 50000, price: 192.0 },
        { id: "6007", title: "Facebook Profile Followers (Price: ₹160.0/1k)", badge: "FOLLOWERS", badgeColor: "#1a77f2", desc: "Followers for your personal Facebook profile.", avgtime: "6 hours", min: 100, max: 10000, price: 160.0 },
        { id: "6002", title: "Facebook Post Likes [⚡ Instant] (Price: ₹96.0/1k)", badge: "POST LIKES", badgeColor: "#4267B2", desc: "Get likes on your photos, videos, or posts.\nSpeed: Instant", avgtime: "30 minutes", min: 100, max: 20000, price: 96.0 },
        { id: "6003", title: "Facebook Video Views (Price: ₹64.0/1k)", badge: "VIEWS", badgeColor: "#1877F2", desc: "Views for your Facebook videos.", avgtime: "1 hour", min: 1000, max: 1000000, price: 64.0 },
        { id: "6004", title: "Facebook Group Members (Price: ₹224.0/1k)", badge: "MEMBERS", badgeColor: "#8a3ab9", desc: "Add members to your Facebook group.", avgtime: "24 hours", min: 200, max: 20000, price: 224.0 },
        { id: "6005", title: "Facebook Comments [Random] (Price: ₹160.0/1k)", badge: "COMMENTS", badgeColor: "#365899", desc: "Random positive comments on your posts.", avgtime: "2 hours", min: 20, max: 1000, price: 160.0 },
        { id: "6006", title: "Facebook Event Attendees (Price: ₹256.0/1k)", badge: "EVENT", badgeColor: "#f7b928", desc: "Get 'Interested' or 'Going' for your Facebook events.", avgtime: "6 hours", min: 100, max: 5000, price: 256.0 }
    ],
    "tiktok-services": [
        { id: "9001", title: "TikTok Views (Price: ₹1.2/1k)", badge: "VIEWS", badgeColor: "#25F4EE", desc: "Speed: 1M/Day\nStart: Instant", avgtime: "5 minutes", min: 1000, max: 10000000, price: 1.2 },
        { id: "9002", title: "TikTok Followers (Price: ₹192.0/1k)", badge: "FOLLOWERS", badgeColor: "#FF2C55", desc: "High-quality followers for your TikTok profile.", avgtime: "3 hours", min: 100, max: 100000, price: 192.0 },
        { id: "9003", title: "TikTok Likes (Price: ₹128.0/1k)", badge: "LIKES", badgeColor: "#FE2C55", desc: "Likes for your TikTok videos.", avgtime: "1 hour", min: 100, max: 50000, price: 128.0 },
        { id: "9004", title: "TikTok Shares (Price: ₹32.0/1k)", badge: "SHARES", badgeColor: "#000000", desc: "Shares for your videos to boost reach.", avgtime: "2 hours", min: 100, max: 100000, price: 32.0 },
        { id: "9005", title: "TikTok Comments [Random] (Price: ₹320.0/1k)", badge: "COMMENTS", badgeColor: "#25F4EE", desc: "Random positive comments.", avgtime: "3 hours", min: 20, max: 1000, price: 320.0 },
        { id: "9006", title: "TikTok Live Stream Views [30 Mins] (Price: ₹256.0/1k)", badge: "LIVE", badgeColor: "#ff2c55", desc: "Concurrent live stream viewers for 30 minutes.", avgtime: "0-5 minutes", min: 100, max: 5000, price: 256.0 },
        { id: "9007", title: "TikTok Saves (Price: ₹64.0/1k)", badge: "SAVES", badgeColor: "#000000", desc: "Adds your video to users' favourite lists.", avgtime: "1 hour", min: 100, max: 50000, price: 64.0 }
    ],
    "twitter-x-services": [
        { id: "10001", title: "Twitter (X) Followers (Price: ₹224.0/1k)", badge: "X-FOLLOW", badgeColor: "#1DA1F2", desc: "Followers for your Twitter (X) profile.", avgtime: "6 hours", min: 100, max: 20000, price: 224.0 },
        { id: "10002", title: "Twitter (X) Likes (Price: ₹160.0/1k)", badge: "X-LIKES", badgeColor: "#1a91da", desc: "Likes for your tweets.", avgtime: "1 hour", min: 100, max: 10000, price: 160.0 },
        { id: "10008", title: "Twitter (X) Retweets (Price: ₹200.0/1k)", badge: "X-RT", badgeColor: "#178fe6", desc: "Retweets for your posts.", avgtime: "1 hour", min: 100, max: 10000, price: 200.0 },
        { id: "10009", title: "Twitter (X) Video Views (Price: ₹80.0/1k)", badge: "X-VIEWS", badgeColor: "#147ab8", desc: "Views for your videos on X.", avgtime: "30 minutes", min: 1000, max: 500000, price: 80.0 },
        { id: "10010", title: "Twitter (X) Poll Votes (Price: ₹120.0/1k)", badge: "X-POLL", badgeColor: "#2795e9", desc: "Votes for your Twitter polls.", avgtime: "2 hours", min: 100, max: 20000, price: 120.0 },
        { id: "10011", title: "Twitter (X) Comments (Price: ₹400.0/1k)", badge: "X-COMMENTS", badgeColor: "#105c9e", desc: "Random positive comments on your tweets.", avgtime: "4 hours", min: 20, max: 1000, price: 400.0 },
        { id: "10012", title: "Twitter (X) Impressions (Price: ₹40.0/1k)", badge: "X-IMPRESS", badgeColor: "#0c3b62", desc: "Impressions to boost your tweet's visibility.", avgtime: "1 hour", min: 1000, max: 1000000, price: 40.0 }
    ],
    "other-platforms": [
        { id: "10003", title: "Spotify Playlist Followers (Price: ₹192.0/1k)", badge: "SPOTIFY", badgeColor: "#1DB954", desc: "Followers for your Spotify playlist.", avgtime: "24 hours", min: 100, max: 50000, price: 192.0 },
        { id: "10004", title: "Spotify Track Plays [USA] (Price: ₹96.0/1k)", badge: "PLAYS", badgeColor: "#1ed760", desc: "Plays for your track on Spotify from USA audience.", avgtime: "12 hours", min: 1000, max: 1000000, price: 96.0 },
        { id: "10005", title: "Discord Members [Online] (Price: ₹960.0/1k)", badge: "DISCORD", badgeColor: "#5865F2", desc: "Members that appear online for your Discord server.", avgtime: "6-12 hours", min: 100, max: 5000, price: 960.0 },
        { id: "10007", title: "SoundCloud Plays (Price: ₹32.0/1k)", badge: "SOUNDCLOUD", badgeColor: "#ff5500", desc: "Plays for your track on SoundCloud.", avgtime: "3 hours", min: 1000, max: 500000, price: 32.0 },
        { id: "11001", title: "LinkedIn Company Followers (Price: ₹800.0/1k)", badge: "LINKEDIN", badgeColor: "#0A66C2", desc: "Followers for your LinkedIn Company Page.", avgtime: "24-48 hours", min: 100, max: 10000, price: 800.0 },
        { id: "11002", title: "Pinterest Followers (Price: ₹320.0/1k)", badge: "PINTEREST", badgeColor: "#E60023", desc: "Followers for your Pinterest profile.", avgtime: "12 hours", min: 100, max: 10000, price: 320.0 },
        { id: "10006", "title": "Website Traffic [Worldwide] (Price: ₹64.0/1k)", "badge": "TRAFFIC", "badgeColor": "#ff6f00", "desc": "Get 1,000 visitors to your website from worldwide sources.", "avgtime": "24 hours", "min": 1000, "max": 1000000, "price": 64.0 },
    ]
};

const primaryColor = "#1b365d";
const secondaryColor = "#2474df";
const accentColor = "#36c2ff";
const menuBg = "#f3f8fb";
const menuBgDark = "#1a355d";
const menuTextColor = "#193357";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [balance, setBalance] = useState(0);
  const [theme, setTheme] = useState("dark");
  const [cat, setCat] = useState(categories[0].value);
  const [svc, setSvc] = useState(null);
  const [qty, setQty] = useState("");
  const [charge, setCharge] = useState("0.00");
  const [link, setLink] = useState("");
  const [orderMsg, setOrderMsg] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const [showFunds, setShowFunds] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showOrders, setShowOrders] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [orders, setOrders] = useState([]);
  const [payments, setPayments] = useState([]);
  const [history, setHistory] = useState([]);
  const [search, setSearch] = useState("");
  const [loadingFundsSubmit, setLoadingFundsSubmit] = useState(false);

  useEffect(() => {
    const auth = getAuth();
    const unsub = onAuthStateChanged(auth, usr => {
      setUser(usr);
      if (usr) {
        onSnapshot(doc(db, "users", usr.uid), snap => {
          setBalance(snap.exists() && snap.data().balance ? snap.data().balance : 0);
        });
        onSnapshot(query(collection(db, "orders"), where("user", "==", usr.uid)), snap => {
          setOrders(snap.docs.map(d => ({ id: d.id, ...d.data() })).sort((a,b) => b.timestamp - a.timestamp));
        });
        onSnapshot(query(collection(db, "payments"), where("user", "==", usr.uid)), snap => {
          setPayments(snap.docs.map(d => ({ id: d.id, ...d.data() })).sort((a,b) => b.created?.toMillis?.() - a.created?.toMillis?.()));
        });
        onSnapshot(query(collection(db, "userHistory"), where("user", "==", usr.uid)), snap => {
          setHistory(snap.docs.map(d => ({ id: d.id, ...d.data() })).sort((a,b) => b.timestamp - a.timestamp));
        });
      }
    });
    return unsub;
  }, []);

  useEffect(() => {
    if (!svc || !qty) {
      setCharge("0.00");
      return;
    }
    const q = parseInt(qty, 10);
    if (isNaN(q) || q < (svc.min || 1) || q > svc.max) setCharge("0.00");
    else setCharge(((svc.price * q) / 1000).toFixed(2));
  }, [svc, qty]);

  const filteredServices = (services[cat] || []).filter(s =>
    search.length < 2 || s.title.toLowerCase().includes(search.toLowerCase())
  );

  async function submitOrder(e) {
    e.preventDefault();
    setOrderMsg("");
    if (!svc || !qty || !link) return setOrderMsg("❌ Fill every field.");
    const q = parseInt(qty, 10);
    if (isNaN(q) || q < svc.min || q > svc.max) return setOrderMsg(`❌ Quantity must be between ${svc.min} and ${svc.max}.`);
    if (parseFloat(charge) > parseFloat(balance)) return setOrderMsg("❌ Insufficient balance. Please add funds.");
    if (!user) return setOrderMsg("❌ Please log in to place order.");
    await addDoc(collection(db, "orders"), {
      user: user.uid,
      service_id: svc.id,
      link,
      qty: q,
      charge: parseFloat(charge),
      timestamp: Date.now(),
      status: "pending",
      cat,
      serviceTitle: svc.title
    });
    await addDoc(collection(db, "userHistory"), {
      user: user.uid,
      type: "order",
      description: `Placed order: ${svc.title} ×${q}`,
      timestamp: Date.now()
    });
    setOrderMsg("✅ Order placed successfully! Track under My Orders.");
    setSvc(null);
    setLink("");
    setQty("");
    setCharge("0.00");
  }

  async function handleProfileSave(newName, newMail, newPass, setInfoMsg) {
    try {
      if (newName) await updateProfile(getAuth().currentUser, { displayName: newName });
      if (newMail) await getAuth().currentUser.updateEmail(newMail);
      if (newPass) await getAuth().currentUser.updatePassword(newPass);
      await addDoc(collection(db, "userHistory"), {
        user: user.uid,
        type: "profile",
        description: "Updated profile info",
        timestamp: Date.now()
      });
      setInfoMsg("✅ Profile updated successfully!");
    } catch (err) {
      setInfoMsg("❌ " + err.message);
    }
  }

  function handleLogout() {
    signOut(getAuth()).then(() => { window.location = "/"; });
  }

  async function handleAddFundsSubmit(amount, setMsg, resetInput) {
    setMsg("");
    if (!amount || Number(amount) < 30) return setMsg("❌ Enter at least ₹30.");
    setLoadingFundsSubmit(true);
    try {
      await addDoc(collection(db, "payments"), {
        user: user.uid,
        username: user.displayName || user.email || "Unknown",
        amount: Number(amount),
        status: "pending",
        created: serverTimestamp()
      });
      await addDoc(collection(db, "userHistory"), {
        user: user.uid,
        type: "payment_request",
        description: `Requested fund ₹${amount}`,
        timestamp: Date.now()
      });
      setMsg("✅ Fund request sent! Awaiting admin approval.");
      resetInput();
    } catch {
      setMsg("❌ Submission failed. Please try again.");
    }
    setLoadingFundsSubmit(false);
  }

  return (
    <div style={{
      minHeight: "100vh",
      paddingBottom: 70,
      background: theme === "dark" ? primaryColor : "#f9fbfe",
      color: theme === "dark" ? "#f5faff" : "#22334c",
      fontFamily: "Poppins, sans-serif",
      position: "relative"
    }}>
      <nav style={{
        background: theme === "dark" ? secondaryColor : "#fff",
        borderBottom: `2px solid ${accentColor}`,
        boxShadow: "0 1px 12px #1a255a0c",
        padding: "16px 0"
      }}>
        <div style={{
          maxWidth: 650,
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between"
        }}>
          <div style={{
            color: accentColor,
            fontWeight: 900,
            fontSize: "1.45em",
            display: "flex",
            alignItems: "center",
            gap: 14
          }}>
            <img src="/logo.png" alt="Logo" style={{ height: 38, borderRadius: 22, background: "transparent" }} />
            LucixFire Panel
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <button
              title="Toggle Theme"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              style={{
                color: theme === "dark" ? "#ffd700" : "#2474df",
                fontSize: "1.3em",
                background: "none",
                border: "none",
                cursor: "pointer",
                userSelect: "none"
              }}
            >
              {theme === "dark" ? <FaSun /> : <FaMoon />}
            </button>
            <img src="/logo.png" alt="User Avatar" style={{ height: 32, width: 32, borderRadius: "50%" }} />
            <div style={{ position: "relative" }}>
              <button
                aria-label="Menu"
                title="Menu"
                onClick={() => setShowMenu((m) => !m)}
                style={{
                  background: theme === "dark" ? menuBgDark : menuBg,
                  border: "1px solid #aecbeb",
                  color: theme === "dark" ? "#fff" : menuTextColor,
                  fontSize: "1.6em",
                  padding: "6px 14px",
                  borderRadius: 20,
                  cursor: "pointer",
                  outline: showMenu ? `2px solid ${accentColor}` : "none",
                  userSelect: "none"
                }}
                type="button"
              >
                <FaEllipsisV />
              </button>
              {showMenu && (
                <div
                  style={{
                    background: theme === "dark" ? menuBgDark : menuBg,
                    borderRadius: 16,
                    position: "absolute",
                    top: 40,
                    right: 0,
                    zIndex: 20,
                    minWidth: 190,
                    boxShadow: "0 6px 26px #2474df23",
                    color: theme === "dark" ? "#fff" : menuTextColor,
                    fontWeight: "700"
                  }}
                >
                  <DropdownItem theme={theme} icon={<FaUserCircle />} label="Profile" onClick={() => { setShowMenu(false); setShowProfile(true); }} />
                  <DropdownItem theme={theme} icon={<FaWallet />} label="Add Funds" onClick={() => { setShowMenu(false); setShowFunds(true); }} />
                  <DropdownItem theme={theme} icon={<FaHistory />} label="My Orders" onClick={() => { setShowMenu(false); setShowOrders(true); }} />
                  <DropdownItem theme={theme} icon={<FaHistory />} label="History" onClick={() => { setShowMenu(false); setShowHistory(true); }} />
                  <DropdownItem theme={theme} icon={<FaCogs />} label="Settings" onClick={() => { setShowMenu(false); setShowSettings(true); }} />
                  <DropdownItem theme={theme} icon={<FaPowerOff />} color="#d32f3e" label="Logout" onClick={() => { setShowMenu(false); handleLogout(); }} />
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <section style={{
        maxWidth: 1080,
        margin: "28px auto 22px",
        display: "flex",
        gap: 18,
        overflowX: "auto",
        padding: "0 15px"
      }}>
        <StatCard theme={theme} icon={<FaUser />} label="Username" value={user?.displayName || user?.email || "Guest"} />
        <StatCard theme={theme} icon={<FaWallet />} label="Balance" value={`₹${balance.toFixed(2)} INR`} />
        <StatCard theme={theme} icon={<FaChartLine />} label="Total Orders" value={orders.length} />
        <StatCard theme={theme} icon={<FaMoneyCheckAlt />} label="Spent Balance" value={`₹0.00`} />
      </section>

      <section style={{
        maxWidth: 720,
        margin: "0 auto 32px",
        padding: "0 14px",
        textAlign: "center",
        fontWeight: 600,
        fontSize: "1.09em",
        color: secondaryColor,
        userSelect: "none"
      }}>
        🌟 LucixFire Panel: Manage your SMM boosts effortlessly — fast, easy, reliable! 🚀✨
      </section>

      <form
        onSubmit={submitOrder}
        style={{
          maxWidth: 460,
          margin: "0 auto 28px",
          background: theme === "dark" ? "#183971" : "#f5f8fb",
          borderRadius: 20,
          padding: "25px 16px",
          boxShadow: theme === "dark" ? "0 7px 24px #29499335" : "0 4px 18px #19417c13",
          color: theme === "dark" ? "#e8f5ff" : primaryColor,
          userSelect: "none"
        }}
        noValidate
      >
        <div style={{ display: "flex", gap: 14, marginBottom: 15 }}>
          <button type="button" style={tabBtn(true, theme)}>🛒 New Order</button>
          <button type="button" style={tabBtn(false, theme)} onClick={() => setShowFunds(true)}>💵 Add Funds</button>
        </div>
        <input type="search" placeholder="Search Services..." value={search} onChange={e => setSearch(e.target.value)} style={searchInput(theme)} autoComplete="off" />
        <label style={smallLbl}>Category</label>
        <select value={cat} onChange={e => { setCat(e.target.value); setSvc(null); setQty(""); setLink(""); }} style={selectBox(theme)}>
          {categories.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
        </select>
        <label style={smallLbl}>Services</label>
        <select
          value={svc?.id || ""}
          onChange={e => {
            const found = (services[cat] || []).find(x => x.id === e.target.value);
            setSvc(found || null);
            setCharge("0.00");
            setQty("");
            setLink("");
          }}
          style={selectBox(theme)}>
          <option value="">Select Service</option>
          {filteredServices.map(s => (
            <option key={s.id} value={s.id}>
              {s.badge ? `[${s.badge}] ` : ""}{s.title}
            </option>
          ))}
        </select>
        {svc && (<>
          <div style={descCard(theme)}>
            <b style={{ color: accentColor, fontSize: ".98em" }}>
              {svc.badge && (<span style={{ background: svc.badgeColor, borderRadius: 7, color: "#fff", padding: "2px 9px", marginRight: 8, fontWeight: 700 }}>{svc.badge}</span>)}{svc.title}
            </b>
            <pre style={{ marginTop: 7, color: "#7abef5", fontSize: ".95em", whiteSpace: "pre-wrap" }}>{svc.desc}</pre>
          </div>
          <div style={descCard(theme)}><b>Average Time</b><br />{svc.avgtime}</div>
          <div style={{ marginBottom: 7, fontWeight: 700, fontSize: ".97em", color: "#6e9ba5" }}>
            Min: {svc.min} - Max: {svc.max}
          </div>
        </>)}
        <label style={smallLbl}>Link</label>
        <input type="url" placeholder="Paste link" value={link} onChange={e => setLink(e.target.value)} style={inputBox(theme)} disabled={!svc} required={!!svc} />
        <label style={smallLbl}>Quantity</label>
        <input type="number" min={svc?.min || ""} max={svc?.max || ""} value={qty} onChange={e => setQty(e.target.value.replace(/^0+/, ""))} style={inputBox(theme)} disabled={!svc} required={!!svc} />
        <div style={descCard(theme)}><b>Charge</b><br />₹{charge}</div>
        {orderMsg && (<div style={{ fontWeight: 700, marginTop: 14, textAlign: "center", color: orderMsg.startsWith("✅") ? "#3ad97b" : "#f65d5d" }}>{orderMsg}</div>)}
        <button type="submit" disabled={!svc || !qty || !link || charge === "0.00"} style={{
          marginTop: 17, width: "100%", background: `linear-gradient(90deg, ${accentColor}, ${secondaryColor})`,
          color: "#fff", fontWeight: 900, fontSize: "1.12em", padding: "14px 0", borderRadius: 15, border: "none",
          cursor: (!svc || !qty || !link || charge === "0.00") ? "not-allowed" : "pointer", userSelect: "none"
        }}>
          <FaWhatsapp style={{ fontSize: "1.21em" }} /> Place Order
        </button>
      </form>

      {showFunds && <AddFundsModal user={user} theme={theme} onClose={() => setShowFunds(false)} loading={loadingFundsSubmit} onSubmit={handleAddFundsSubmit} />}
      {showProfile && <ProfileModal user={user} onClose={() => setShowProfile(false)} />}
      {showOrders && <OrdersModal orders={orders} onClose={() => setShowOrders(false)} />}
      {showHistory && <HistoryModal orders={orders} payments={payments} history={history} onClose={() => setShowHistory(false)} />}
      {showSettings && <SettingsModal user={user} onSave={handleProfileSave} onClose={() => setShowSettings(false)} />}

      <footer style={{
        textAlign: "center", padding: "16px 0 6px", fontSize: "0.98em", color: "#7baad3", borderTop: `1px solid ${accentColor}`,
        background: "transparent", position: "fixed", left: 0, bottom: 0, width: "100%", zIndex: 80, userSelect: "none"
      }}>
        © {new Date().getFullYear()} LucixFire Panel. All rights reserved.
      </footer>
    </div>
  );
}

function OrdersModal({ orders, onClose }) {
  return (
    <Modal title="My Orders" onClose={onClose}>
      {orders.length === 0 ? (
        <p style={{ color: "#919ab2", fontStyle: "italic", textAlign: "center", margin: 24 }}>No orders placed yet.</p>
      ) : (
        <div style={{ maxHeight: "60vh", overflowY: "auto", paddingRight: 6 }}>
          {orders.map(o => (
            <div key={o.id} style={historyItemStyle}>
              <div><b>Order ID:</b> {o.id}</div>
              <div><b>Service:</b> {o.serviceTitle || o.service_id}</div>
              <div><b>Qty:</b> {o.qty}</div>
              <div><b>Link:</b> <a href={o.link} style={{ color: accentColor }} target="_blank" rel="noreferrer">{o.link}</a></div>
              <div><b>Price:</b> ₹{o.charge.toFixed(2)}</div>
              <div><b>Status:</b> <span style={{ color: statusColor(o.status), fontWeight: 700 }}>{o.status}</span></div>
            </div>
          ))}
        </div>
      )}
    </Modal>
  );
}

function HistoryModal({ orders, payments, history, onClose }) {
  return (
    <Modal title="History" onClose={onClose}>
      <section style={{ marginBottom: 18 }}>
        <h4>Orders</h4>
        {orders.length === 0 ? <p style={{ color: "#999", fontStyle: "italic" }}>No orders yet.</p> :
          orders.map(o => (
            <div key={o.id} style={historyItemStyle}>
              <b>{o.serviceTitle || o.service_id}</b> - Qty: {o.qty} - ₹{o.charge.toFixed(2)} - Status: <span style={{ fontWeight: "bold", color: statusColor(o.status) }}>{o.status}</span>
            </div>
          ))
        }
      </section>
      <section style={{ marginBottom: 18 }}>
        <h4>Fund Requests</h4>
        {payments.length === 0 ? <p style={{ color: "#999", fontStyle: "italic" }}>No fund requests.</p> :
          payments.map(p => (
            <div key={p.id} style={historyItemStyle}>
              Requested: ₹{p.amount.toFixed(2)} - Status: <span style={{ fontWeight: "bold", color: statusColor(p.status || 'pending') }}>{p.status || 'pending'}</span>
            </div>
          ))
        }
      </section>
      <section>
        <h4>Other Actions</h4>
        {history.length === 0 ? <p style={{ color: "#999", fontStyle: "italic" }}>No other actions yet.</p> :
          history.filter(h => h.type !== "order" && h.type !== "payment_request").map(h => (
            <div key={h.id} style={historyItemStyle}>
              {h.description} <small style={{ color: "#555" }}>({new Date(h.timestamp).toLocaleString()})</small>
            </div>
          ))
        }
        <p style={{ fontSize: "0.85em", fontStyle: "italic", marginTop: 12, color: "#888" }}>
          Note: History is stored temporarily and cleared automatically after 24 hours.
        </p>
      </section>
    </Modal>
  );
}

function ProfileModal({ user, onClose }) {
  return (
    <Modal title="Profile" onClose={onClose}>
      <div style={{ textAlign: "center", padding: 14 }}>
        <img src="/logo.png" alt="User Avatar" style={{ height: 62, width: 62, borderRadius: 19, marginBottom: 10 }} />
        <div style={{ fontWeight: 800, fontSize: "1.1em", color: secondaryColor }}>
          {user?.displayName || user?.email || "Guest"}
        </div>
        <div style={{ color: accentColor, fontWeight: 600 }}>LuciXFire User</div>
      </div>
    </Modal>
  );
}

function SettingsModal({ user, onSave, onClose }) {
  const [name, setName] = useState(user?.displayName || "");
  const [mail, setMail] = useState(user?.email || "");
  const [pass, setPass] = useState("");
  const [info, setInfo] = useState("");
  const textColor = "#2360af";

  return (
    <Modal title="Settings" onClose={onClose}>
      <form onSubmit={e => { e.preventDefault(); onSave(name, mail, pass, setInfo); }}>
        <div style={{ marginBottom: 13 }}>
          <label style={{ fontWeight: 700, color: textColor }}>Username</label>
          <input style={{ ...inputBox("light"), color: textColor, fontWeight: 700 }} value={name} onChange={e => setName(e.target.value)} autoComplete="username" />
        </div>
        <div style={{ marginBottom: 13 }}>
          <label style={{ fontWeight: 700, color: textColor }}>Email</label>
          <input style={{ ...inputBox("light"), color: textColor, fontWeight: 700 }} value={mail} onChange={e => setMail(e.target.value)} autoComplete="email" />
        </div>
        <div style={{ marginBottom: 20 }}>
          <label style={{ fontWeight: 700, color: textColor }}>Password</label>
          <input style={{ ...inputBox("light"), color: textColor, fontWeight: 700 }} type="password" value={pass} onChange={e => setPass(e.target.value)} autoComplete="new-password" />
        </div>
        <button style={{
          width: "100%",
          padding: "14px 0",
          fontWeight: 900,
          borderRadius: 14,
          border: "none",
          background: `linear-gradient(90deg, ${accentColor}, ${secondaryColor})`,
          color: "#fff",
          fontSize: "1.13em",
          cursor: "pointer"
        }}>
          Change Info
        </button>
        {info && <div style={{ marginTop: 12, fontWeight: 700, color: info.startsWith("✅") ? "#2e7d32" : "#d32f2f" }}>{info}</div>}
      </form>
    </Modal>
  );
}

function Modal({ title, children, onClose }) {
  return (
    <div style={{
      position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", zIndex: 160,
      background: "rgba(32,50,74,0.18)", display: "flex", alignItems: "center", justifyContent: "center"
    }}>
      <div style={{
        background: "#fff", borderRadius: 18, width: 370, maxWidth: "97vw", maxHeight: "88vh", overflowY: "auto",
        boxShadow: "0 10px 36px #24deff45", padding: "29px 16px 17px", position: "relative"
      }}>
        <button type="button" onClick={onClose} style={{
          position: "absolute", right: 17, top: 9, border: "none", fontSize: "2em", background: "none", color: "#217dbb", cursor: "pointer"
        }}>&times;</button>
        <div style={{ fontWeight: 900, fontSize: "1.12em", marginBottom: 13, color: "#237ecb" }}>{title}</div>
        {children}
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, theme }) {
  return (
    <div style={{
      flex: "0 0 170px",
      background: theme === "dark" ? "#21406c" : "#e8f3fa",
      borderRadius: 13,
      minWidth: 150,
      boxShadow: "0 2px 8px #1786ed13",
      padding: "18px 13px",
      color: theme === "dark" ? "#e9faff" : secondaryColor,
      userSelect: "none"
    }}>
      <span style={{
        background: theme === "dark" ? "#24436c" : "#d7f1ff",
        borderRadius: 7,
        padding: "7px 10px",
        fontSize: "1.2em",
        marginBottom: 7,
        display: "inline-block",
        color: accentColor
      }}>{icon}</span>
      <span style={{ fontWeight: 700, fontSize: ".99em", display: "block" }}>{label}</span>
      <span style={{ fontWeight: 800, fontSize: "1.13em", marginTop: 4, display: "block" }}>{value}</span>
    </div>
  );
}

function DropdownItem({ theme, icon, label, onClick, color }) {
  return (
    <div
      tabIndex={0}
      onClick={onClick}
      onKeyDown={e => { if (e.key === "Enter") onClick(); }}
      style={{
        padding: "13px 21px",
        display: "flex",
        alignItems: "center",
        gap: 11,
        cursor: "pointer",
        color: color || (theme === "dark" ? "#fff" : secondaryColor),
        fontWeight: 700,
        fontSize: "1.04em",
        userSelect: "none",
        transition: "background 0.19s, color 0.19s",
        outline: "none"
      }}
      onMouseOver={e => e.currentTarget.style.backgroundColor = theme === "dark" ? "#183671" : "#e5f6fe"}
      onMouseOut={e => e.currentTarget.style.backgroundColor = "transparent"}
    >
      {icon} {label}
    </div>
  );
}

const tabBtn = (active, theme) => ({
  flex: 1,
  background: active ? accentColor : "transparent",
  color: active ? primaryColor : accentColor,
  border: active ? "none" : `2px solid ${accentColor}`,
  padding: "13px 0",
  borderRadius: 12,
  fontWeight: 900,
  fontSize: "1.13em",
  cursor: "default",
  boxShadow: active ? `0 2px 10px #36e4fd85` : "none"
});
const selectBox = theme => ({
  width: "100%",
  borderRadius: 10,
  padding: "12px 11px",
  fontWeight: 700,
  background: theme === "dark" ? "#21345f" : "#f9fcfe",
  fontSize: "1.01em",
  color: theme === "dark" ? "#f2ffff" : secondaryColor,
  border: `1.5px solid ${accentColor}`,
  marginBottom: 9
});
const inputBox = theme => ({
  width: "100%",
  borderRadius: 9,
  padding: "13px 10px",
  fontWeight: 700,
  fontSize: "1.01em",
  background: theme === "dark" ? "#254676" : "#f8fafb",
  color: theme === "dark" ? "#f7fff7" : "#222",
  border: "1.5px solid #b5ebfa",
  marginBottom: 9
});
const smallLbl = { fontWeight: 700, color: accentColor, marginBottom: 6, display: "block", fontSize: "1em" };
const descCard = theme => ({
  background: theme === "dark" ? "#285090" : "#e6f5fd",
  color: theme === "dark" ? "#d5f0ff" : secondaryColor,
  borderRadius: 11, padding: "10px 10px", fontWeight: 600, fontSize: ".98em", marginBottom: 7
});
const searchInput = theme => ({
  width: "100%",
  borderRadius: 10,
  padding: "13px 11px",
  fontWeight: 700,
  fontSize: "1.03em",
  color: accentColor,
  background: theme === "dark" ? "#232e4b" : "#e3f1fa",
  border: `1.5px solid ${accentColor}`,
  marginBottom: 13
});
function statusColor(status) {
  if (!status) return "#666";
  if (status === "pending") return "#f0ad4e";
  if (status === "completed" || status === "accepted") return "#43a047";
  if (status === "rejected") return "#d32f2f";
  return "#333";
}
const historyItemStyle = {
  padding: "8px 12px",
  backgroundColor: "#e8f0f9",
  borderRadius: 10,
  marginBottom: 8,
  fontSize: "0.95em",
  color: "#1a3a6f"
};
