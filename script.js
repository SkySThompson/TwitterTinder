let users = [];
const apiLimit = 17; // Free API limit

// Theme Toggle Functionality
const themeToggle = document.getElementById('themeToggle');
const body = document.body;

themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
});

document.getElementById('userForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const usernameInput = document.getElementById('username');
    const username = usernameInput.value.trim();
    if (username && !users.includes(username)) {
        users.push(username);
        updateUserList();
        document.getElementById('analyzeBtn').disabled = users.length < 2;
    } else if (users.includes(username)) {
        alert('This user is already added.');
    }
    usernameInput.value = '';
});

document.getElementById('analyzeBtn').addEventListener('click', analyzeVibes);

document.getElementById('resetBtn').addEventListener('click', resetData);

function updateUserList() {
    const userList = document.getElementById('userList');
    userList.innerHTML = '';
    users.forEach((user, index) => {
        const li = document.createElement('li');
        li.textContent = user;
        const removeBtn = document.createElement('button');
        removeBtn.textContent = 'Remove';
        removeBtn.addEventListener('click', () => {
            users.splice(index, 1);
            updateUserList();
            document.getElementById('analyzeBtn').disabled = users.length < 2;
        });
        li.appendChild(removeBtn);
        userList.appendChild(li);
    });
}

async function analyzeVibes() {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '<p>Analyzing...</p>';

    try {
        const themes = {};
        const userTweets = {};

        for (const user of users) {
            const tweets = await fetchUserTweets(user);
            userTweets[user] = tweets;

            const keywords = extractKeywords(tweets);

            keywords.forEach((keyword) => {
                if (!themes[keyword]) themes[keyword] = [];
                themes[keyword].push(user);
            });
        }

        displayResults(themes, userTweets);
    } catch (error) {
        resultsDiv.innerHTML = `<p>Error: ${error.message}</p>`;
    }
}

async function fetchUserTweets(username) {
    return new Promise((resolve) =>
        setTimeout(() => resolve([
            `${username}'s favorite game is Minecraft.`,
            `${username} loves coding in Python.`,
            `${username} recently visited the mountains.`,
        ]), 500)
    );
}

function extractKeywords(tweets) {
    const words = tweets.join(' ').toLowerCase().split(/\W+/);
    const commonWords = ['the', 'is', 'in', 'and', 'of', 'to', 'a', 'loves', 'recently', 'favorite'];
    return words.filter((word) => word.length > 3 && !commonWords.includes(word));
}

function displayResults(themes, userTweets) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '<h3>Shared Themes:</h3>';
    const ul = document.createElement('ul');

    Object.entries(themes).forEach(([keyword, users]) => {
        if (users.length > 1) {
            const li = document.createElement('li');
            li.textContent = `${keyword}: Shared by ${users.join(', ')}`;
            ul.appendChild(li);
        }
    });

    resultsDiv.appendChild(ul);

    const userTweetsDiv = document.createElement('div');
    userTweetsDiv.innerHTML = '<h3>User Tweets:</h3>';

    users.forEach((user) => {
        const userDiv = document.createElement('div');
        const userTitle = document.createElement('h4');
        userTitle.textContent = `${user}'s Tweets:`;

        const userTweetsList = document.createElement('ul');
        userTweets[user].forEach((tweet) => {
            const tweetLi = document.createElement('li');
            tweetLi.textContent = tweet;
            userTweetsList.appendChild(tweetLi);
        });

        userDiv.appendChild(userTitle);
        userDiv.appendChild(userTweetsList);
        userTweetsDiv.appendChild(userDiv);
    });

    resultsDiv.appendChild(userTweetsDiv);
}

function resetData() {
    users = [];
    updateUserList();
    document.getElementById('results').innerHTML = '';
    document.getElementById('analyzeBtn').disabled = true;
}
