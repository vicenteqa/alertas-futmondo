const axios = require('axios');
const env = require('../env/env.json');

const body = {
    header: {
        token: env.futmondo_token,
        userid: env.futmondo_user_id,
    },
    query: { championshipId: env.futmondo_championship_id, from: '' },
    answer: {},
};

const baseUrl = 'https://api.futmondo.com/2';
async function post(endpoint) {
    return axios
        .post(baseUrl + endpoint, body)
        .then((response) => response)
        .catch((error) => console.log(error));
}

async function getSortedAndFilteredNews() {
    const newsEndpointResponse = await post('/locker/news');
    const currentNews = newsEndpointResponse.data.answer.news;
    const sortedCurrentNews = await sortByLastSentDate(currentNews);
    return skipDeletedMessages(sortedCurrentNews);
}

exports.getLastMessageFromNews = async function () {
    const news = await getSortedAndFilteredNews();
    return news[0].txt;
};

async function sortByLastSentDate(newsToSort) {
    return newsToSort.sort(function (x, y) {
        const xDate = new Date(x.created);
        const yDate = new Date(y.created);
        return yDate - xDate;
    });
}

async function skipDeletedMessages(news) {
    return news.filter((newItem) => newItem.txt.includes('borrado') === false);
}
